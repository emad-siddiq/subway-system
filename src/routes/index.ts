import { Router } from 'express';
import { createTrainLineHandler } from '../controllers/trainLineController';
import { getRouteHandler } from '../controllers/routeController';
import { createOrUpdateCardHandler } from '../controllers/cardController';
import { enterStationHandler, exitStationHandler } from '../controllers/stationController';

const router = Router();

router.post('/train-line', createTrainLineHandler);
router.get('/route', getRouteHandler);
router.post('/card', createOrUpdateCardHandler);
router.post('/station/:station/enter', enterStationHandler);
router.post('/station/:station/exit', exitStationHandler);

export default router;