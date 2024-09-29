import { Request, Response } from 'express';
import { pool } from '../db';

export const enterStationHandler = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { station } = req.params;
    const { card_number } = req.body;

    const cardResult = await client.query('SELECT id, balance FROM cards WHERE number = $1', [card_number]);
    if (cardResult.rows.length === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    const card = cardResult.rows[0];

    const stationResult = await client.query('SELECT id FROM stations WHERE name = $1', [station]);
    if (stationResult.rows.length === 0) {
      res.status(404).json({ error: 'Station not found' });
      return;
    }
    const stationId = stationResult.rows[0].id;

    await client.query(
      'INSERT INTO rides (card_id, entry_station_id, entry_time) VALUES ($1, $2, NOW())',
      [card.id, stationId]
    );

    await client.query('COMMIT');
    res.json({ balance: parseFloat(card.balance) });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error entering station:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

export const exitStationHandler = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { station } = req.params;
    const { card_number } = req.body;

    const cardResult = await client.query('SELECT id, balance FROM cards WHERE number = $1', [card_number]);
    if (cardResult.rows.length === 0) {
      res.status(404).json({ error: 'Card not found' });
      return;
    }
    const card = cardResult.rows[0];

    const stationResult = await client.query('SELECT id FROM stations WHERE name = $1', [station]);
    if (stationResult.rows.length === 0) {
      res.status(404).json({ error: 'Station not found' });
      return;
    }
    const stationId = stationResult.rows[0].id;

    const rideResult = await client.query(
      'SELECT id, entry_station_id FROM rides WHERE card_id = $1 AND exit_station_id IS NULL ORDER BY entry_time DESC LIMIT 1',
      [card.id]
    );
    if (rideResult.rows.length === 0) {
      res.status(400).json({ error: 'No open ride found' });
      return;
    }
    const ride = rideResult.rows[0];

    const fare = 2.75;  // Simplified fare calculation

    if (parseFloat(card.balance) < fare) {
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    await client.query(
      'UPDATE rides SET exit_station_id = $1, exit_time = NOW(), fare = $2 WHERE id = $3',
      [stationId, fare, ride.id]
    );

    const newBalance = parseFloat(card.balance) - fare;
    await client.query(
      'UPDATE cards SET balance = $1 WHERE id = $2',
      [newBalance, card.id]
    );

    await client.query('COMMIT');
    res.json({ balance: newBalance });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error exiting station:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};