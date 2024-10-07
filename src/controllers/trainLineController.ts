import { Request, Response } from 'express';
import { pool } from '../db';

// Handle's new trainline creation 
//
// Input JSON parameters: 
// name: string
// stations: Array<String>
// fare: string
//
// Output:
// tainline_id
export const createTrainLineHandler = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { name, stations, fare } = req.body;
    
    // Add a the new trainline's name and fare to the train_line table
    const trainLineResult = await client.query(
      'INSERT INTO train_lines (name, fare) VALUES ($1, $2) RETURNING id',
      [name, fare]
    );
    const trainLineId = trainLineResult.rows[0].id;

    // Insert the list of corresponding stations to the stations table
    for (let i = 0; i < stations.length; i++) {
      const stationResult = await client.query(
        'INSERT INTO stations (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [stations[i]]
      );
      const stationId = stationResult.rows[0].id;

      // Associate station with trainline and also note the order it comes in the trainline
      await client.query(
        'INSERT INTO train_line_stations (train_line_id, station_id, order_index) VALUES ($1, $2, $3)',
        [trainLineId, stationId, i]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ id: trainLineId, name, fare, stations });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating train line:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};