import { Router } from 'express';
import { createTrainLineHandler } from '../controllers/trainLineController';

const router = Router();

router.post('/train-line', createTrainLineHandler);

export default router;