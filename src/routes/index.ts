import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '../middleware/validateRequest';
import { createTrainLineHandler } from '../controllers/trainLineController';
import { getRouteHandler } from '../controllers/routeController';
import { createOrUpdateCardHandler } from '../controllers/cardController';
import { enterStationHandler, exitStationHandler } from '../controllers/stationController';

const router = Router();

// Train Line route
const createTrainLineSchema = Joi.object({
  name: Joi.string().required(),
  stations: Joi.array().items(Joi.string()).min(2).required(),
  fare: Joi.number().positive().optional()
});

router.post('/train-line', validateRequest(createTrainLineSchema), createTrainLineHandler);

// Route route
const getRouteSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required()
});

router.get('/route', (req, res, next) => {
  const { error } = getRouteSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ error: error.details.map(detail => detail.message).join(', ') });
  }
  next();
}, getRouteHandler);

// Card route
const createOrUpdateCardSchema = Joi.object({
  number: Joi.string().required(),
  amount: Joi.number().positive().required()
});

router.post('/card', validateRequest(createOrUpdateCardSchema), createOrUpdateCardHandler);

// Station entry/exit routes
const stationEntryExitSchema = Joi.object({
  card_number: Joi.string().required()
});

router.post('/station/:station/enter', validateRequest(stationEntryExitSchema), enterStationHandler);
router.post('/station/:station/exit', validateRequest(stationEntryExitSchema), exitStationHandler);

export default router;