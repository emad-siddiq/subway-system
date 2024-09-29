import { Router, Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { validateRequest } from '../middleware/validateRequest';
import { createTrainLineHandler } from '../controllers/trainLineController';
import { getRouteHandler } from '../controllers/routeController';
import { createOrUpdateCardHandler } from '../controllers/cardController';
import { enterStationHandler, exitStationHandler } from '../controllers/stationController';

const router = Router();

const createTrainLineSchema = Joi.object({
  name: Joi.string().required(),
  stations: Joi.array().items(Joi.string()).min(2).required(),
  fare: Joi.number().positive().optional()
});

router.post('/train-line', validateRequest(createTrainLineSchema), createTrainLineHandler);

const getRouteSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required()
});

router.get('/route', (req: Request, res: Response, next: NextFunction): void => {
  const { error } = getRouteSchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
  } else {
    next();
  }
}, getRouteHandler);

const createOrUpdateCardSchema = Joi.object({
  number: Joi.string().required(),
  amount: Joi.number().positive().required()
});

router.post('/card', validateRequest(createOrUpdateCardSchema), createOrUpdateCardHandler);

const stationEntryExitSchema = Joi.object({
  card_number: Joi.string().required()
});

router.post('/station/:station/enter', validateRequest(stationEntryExitSchema), (req: Request, res: Response, next: NextFunction): void => {
  const { station } = req.params;
  if (!station) {
    res.status(400).json({ error: 'Station parameter is required' });
  } else {
    next();
  }
}, enterStationHandler);

router.post('/station/:station/exit', validateRequest(stationEntryExitSchema), (req: Request, res: Response, next: NextFunction): void => {
  const { station } = req.params;
  if (!station) {
    res.status(400).json({ error: 'Station parameter is required' });
  } else {
    next();
  }
}, exitStationHandler);

export default router;