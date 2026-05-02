// src/modules/utility/utility.route.ts
import { Router } from 'express';
import {
  createUtilityBill,
  getAllUtilityBills,
  getUtilityBillByMonth,
  markPayment,
  getUserBills,
  getPaymentStats,
} from './utility.controller';
import { protect, admin } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createUtilityBillSchema,
  markPaymentSchema,
} from './utility.validation';

const router = Router();

// Protected routes
router.get('/my-bills', protect, getUserBills);

// Admin only routes
router.post(
  '/',
  protect,
  admin,
  validate(createUtilityBillSchema),
  createUtilityBill,
);
router.get('/', protect, admin, getAllUtilityBills);
router.get('/stats', protect, admin, getPaymentStats);
router.get('/:month/:year', protect, admin, getUtilityBillByMonth);
router.put(
  '/:id/pay',
  protect,
  admin,
  validate(markPaymentSchema),
  markPayment,
);

export default router;
