import { pool } from '../db';
import { TrainLine } from '../models/TrainLine';

export const createTrainLine = async (name: string, stations: string[], fare?: number): Promise<TrainLine> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const trainLineResult = await client.query(
      'INSERT INTO train_lines (name, fare) VALUES ($1, $2) RETURNING id',
      [name, fare]
    );
    const trainLineId = trainLineResult.rows[0].id;

    for (let i = 0; i < stations.length; i++) {
      const stationResult = await client.query(
        'INSERT INTO stations (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [stations[i]]
      );
      const stationId = stationResult.rows[0].id;

      await client.query(
        'INSERT INTO train_line_stations (train_line_id, station_id, order_index) VALUES ($1, $2, $3)',
        [trainLineId, stationId, i]
      );
    }

    await client.query('COMMIT');

    return { id: trainLineId, name, fare, stations };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};