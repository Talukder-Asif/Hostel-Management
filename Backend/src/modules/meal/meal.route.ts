// src/modules/meal/meal.route.ts
import { Router } from 'express';
import {
  createMeal,
  getMealByDate,
  getMealsByDateRange,
  updateMeal,
  addStudentToMeal,
  removeStudentFromMeal,
  getStudentMeals,
} from './meal.controller';
import { protect, admin, canModifyMeal } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  createMealSchema,
  updateMealSchema,
  addStudentToMealSchema,
  removeStudentFromMealSchema,
} from './meal.validation';

const router = Router();

// Admin & Manager routes
router.post(
  '/',
  protect,
  canModifyMeal,
  validate(createMealSchema),
  createMeal,
);
router.put(
  '/:date',
  protect,
  canModifyMeal,
  validate(updateMealSchema),
  updateMeal,
);

// Student management in meals
router.post(
  '/:date/add-student',
  protect,
  validate(addStudentToMealSchema),
  addStudentToMeal,
);
router.post(
  '/:date/remove-student',
  protect,
  validate(removeStudentFromMealSchema),
  removeStudentFromMeal,
);

// Get routes for all authenticated users
router.get('/my-meals', protect, getStudentMeals);
router.get('/date/:date', protect, getMealByDate);
router.get('/range', protect, getMealsByDateRange);

export default router;
