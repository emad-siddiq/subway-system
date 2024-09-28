import { pool } from '../db';
import { Card } from '../models/Card';

export const createOrUpdateCard = async (number: string, amount: number): Promise<Card> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO cards (number, balance) 
       VALUES ($1, $2) 
       ON CONFLICT (number) 
       DO UPDATE SET balance = cards.balance + $2
       RETURNING *`,
      [number, amount]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};