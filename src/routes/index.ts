import { Router } from 'express';
import { createTrainLineHandler } from '../controllers/trainLineController';
import { getRouteHandler } from '../controllers/routeController';

const router = Router();

router.post('/train-line', createTrainLineHandler);
router.get('/route', getRouteHandler);

export default router;