import { query } from '../db';
import { Station, Card, Ride } from '../models';

export async function enterStation(cardNumber: string, stationName: string): Promise<number> {
  try {
    await query('BEGIN');

    const cardResult = await query<Card>('SELECT id, balance FROM cards WHERE number = $1', [cardNumber]);
    if (cardResult.rows.length === 0) {
      throw new Error('Card not found');
    }
    const card = cardResult.rows[0];

    const stationResult = await query<Station>('SELECT id FROM stations WHERE name = $1', [stationName]);
    if (stationResult.rows.length === 0) {
      throw new Error('Station not found');
    }
    const station = stationResult.rows[0];

    await query<Ride>(
      'INSERT INTO rides (card_id, entry_station_id, entry_time) VALUES ($1, $2, NOW()) RETURNING *',
      [card.id, station.id]
    );

    await query('COMMIT');
    return parseFloat(card.balance);
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}

export async function exitStation(cardNumber: string, stationName: string): Promise<number> {
  try {
    await query('BEGIN');

    const cardResult = await query<Card>('SELECT id, balance FROM cards WHERE number = $1', [cardNumber]);
    if (cardResult.rows.length === 0) {
      throw new Error('Card not found');
    }
    const card = cardResult.rows[0];

    const stationResult = await query<Station>('SELECT id FROM stations WHERE name = $1', [stationName]);
    if (stationResult.rows.length === 0) {
      throw new Error('Station not found');
    }
    const station = stationResult.rows[0];

    const rideResult = await query<Ride>(
      'SELECT id, entry_station_id FROM rides WHERE card_id = $1 AND exit_station_id IS NULL ORDER BY entry_time DESC LIMIT 1',
      [card.id]
    );
    if (rideResult.rows.length === 0) {
      throw new Error('No open ride found');
    }
    const ride = rideResult.rows[0];

    // Calculate fare (simplified version)
    const fare = 2.75;  // In a real system, this would be calculated based on the ride

    if (parseFloat(card.balance) < fare) {
      throw new Error('Insufficient balance');
    }

    await query<Ride>(
      'UPDATE rides SET exit_station_id = $1, exit_time = NOW(), fare = $2 WHERE id = $3 RETURNING *',
      [station.id, fare, ride.id]
    );

    const updatedBalance = parseFloat(card.balance) - fare;
    await query<Card>(
      'UPDATE cards SET balance = $1 WHERE id = $2 RETURNING *',
      [updatedBalance.toFixed(2), card.id]
    );

    await query('COMMIT');
    return updatedBalance;
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}