import { Request, Response } from 'express';
import { createOrUpdateCard } from '../services/cardService';

export const createOrUpdateCardHandler = async (req: Request, res: Response) => {
  try {
    const { number, amount } = req.body;
    const card = await createOrUpdateCard(number, amount);
    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};