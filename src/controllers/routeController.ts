import { Request, Response } from 'express';
import { getRoute } from '../services/routeService';

export const getRouteHandler = async (req: Request, res: Response) => {
  try {
    const { origin, destination } = req.query as { origin: string, destination: string };
    const route = await getRoute(origin, destination);
    res.json({ route });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};