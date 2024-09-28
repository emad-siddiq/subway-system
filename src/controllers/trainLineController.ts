import { Request, Response } from 'express';
import { createTrainLine } from '../services/trainLineService';

export const createTrainLineHandler = async (req: Request, res: Response) => {
  try {
    const { name, stations, fare } = req.body;
    const trainLine = await createTrainLine(name, stations, fare);
    res.status(201).json(trainLine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};