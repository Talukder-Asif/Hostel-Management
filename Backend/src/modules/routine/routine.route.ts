// src/modules/routine/routine.route.ts
import { Router } from 'express';
import {
  generateMonthlyRoutine,
  getMonthlyRoutine,
  getUserMonthlyRoutine,
} from './routine.controller';
import { protect, admin } from '../../middleware/auth';

const router = Router();

router.post('/generate', protect, admin, generateMonthlyRoutine);
router.get('/:month/:year', protect, getMonthlyRoutine);
router.get('/my-routine/:month/:year', protect, getUserMonthlyRoutine);

export default router;
