// src/modules/user/user.route.ts
import { Router } from 'express';
import {
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getActiveUsers,
} from './user.controller';
import { protect, admin } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { registerUserSchema, updateUserSchema } from './user.validation';

const router = Router();

router
  .route('/')
  .post(validate(registerUserSchema), registerUser)
  .get(protect, admin, getUsers);

router.get('/active', protect, admin, getActiveUsers);

router
  .route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, validate(updateUserSchema), updateUser)
  .delete(protect, admin, deleteUser);

export default router;
