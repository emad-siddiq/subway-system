import { Request, Response } from 'express';
import { getRoute } from '../services/routeService';

export const getRouteHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const origin = req.query.origin as string | undefined;
    const destination = req.query.destination as string | undefined;

    if (!origin || !destination) {
      res.status(400).json({ error: 'Origin and destination are required' });
      return;
    }

    const route = await getRoute(origin, destination);

    if (route.length === 0) {
      res.status(404).json({ error: 'No route found' });
    } else {
      res.json({ route });
    }
  } catch (error: unknown) {
    console.error('Error finding route:', error);
    
    if (error instanceof Error) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};