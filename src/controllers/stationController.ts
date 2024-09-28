import { Request, Response } from 'express';
import { enterStation, exitStation } from '../services/stationService';

export const enterStationHandler = async (req: Request, res: Response) => {
  try {
    const { station } = req.params;
    const { card_number } = req.body;
    const balance = await enterStation(card_number, station);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exitStationHandler = async (req: Request, res: Response) => {
  try {
    const { station } = req.params;
    const { card_number } = req.body;
    const balance = await exitStation(card_number, station);
    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};