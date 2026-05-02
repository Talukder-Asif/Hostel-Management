// src/modules/auth/auth.route.ts
import { Router } from 'express';
import { loginUser, changePassword, getUserProfile } from './auth.controller';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { loginSchema, changePasswordSchema } from './auth.validation';

const router = Router();

router.post('/login', validate(loginSchema), loginUser);
router.get('/profile', protect, getUserProfile);
router.put(
  '/change-password',
  protect,
  validate(changePasswordSchema),
  changePassword,
);

export default router;
