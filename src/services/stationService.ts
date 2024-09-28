import { pool } from '../db';

export const enterStation = async (cardNumber: string, stationName: string): Promise<number> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cardResult = await client.query('SELECT * FROM cards WHERE number = $1', [cardNumber]);
    if (cardResult.rows.length === 0) {
      throw new Error('Card not found');
    }

    const card = cardResult.rows[0];
    const stationResult = await client.query('SELECT * FROM stations WHERE name = $1', [stationName]);
    if (stationResult.rows.length === 0) {
      throw new Error('Station not found');
    }

    const station = stationResult.rows[0];

    await client.query(
      'INSERT INTO rides (card_id, entry_station_id, entry_time) VALUES ($1, $2, NOW())',
      [card.id, station.id]
    );

    await client.query('COMMIT');
    return card.balance;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const exitStation = async (cardNumber: string, stationName: string): Promise<number> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const cardResult = await client.query('SELECT * FROM cards WHERE number = $1', [cardNumber]);
    if (cardResult.rows.length === 0) {
      throw new Error('Card not found');
    }

    const card = cardResult.rows[0];
    const stationResult = await client.query('SELECT * FROM stations WHERE name = $1', [stationName]);
    if (stationResult.rows.length === 0) {
      throw new Error('Station not found');
    }

    const station = stationResult.rows[0];

    const rideResult = await client.query(
      'SELECT * FROM rides WHERE card_id = $1 AND exit_station_id IS NULL ORDER BY entry_time DESC LIMIT 1',
      [card.id]
    );

    if (rideResult.rows.length === 0) {
      throw new Error('No open ride found');
    }

    const ride = rideResult.rows[0];

    const fare = 2.75; 
    
    if (card.balance < fare) {
      throw new Error('Insufficient balance');
    }

    await client.query(
      'UPDATE rides SET exit_station_id = $1, exit_time = NOW(), fare = $2 WHERE id = $3',
      [station.id, fare, ride.id]
    );

    await client.query(
      'UPDATE cards SET balance = balance - $1 WHERE id = $2',
      [fare, card.id]
    );

    const updatedCardResult = await client.query('SELECT * FROM cards WHERE id = $1', [card.id]);
    const updatedCard = updatedCardResult.rows[0];

    await client.query('COMMIT');
    return updatedCard.balance;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};