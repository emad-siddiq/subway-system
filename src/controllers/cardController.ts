import { Request, Response } from 'express';
import { pool } from '../db';

export const createOrUpdateCardHandler = async (req: Request, res: Response): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { number, amount } = req.body;
    const result = await client.query(
      `INSERT INTO cards (number, balance) 
       VALUES ($1, $2) 
       ON CONFLICT (number) 
       DO UPDATE SET balance = cards.balance + $2
       RETURNING *`,
      [number, amount]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating/updating card:', error);
    
    if (error instanceof Error && 'code' in error && error.code === '23505') {
      res.status(400).json({ error: 'Card number already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  } finally {
    client.release();
  }
};