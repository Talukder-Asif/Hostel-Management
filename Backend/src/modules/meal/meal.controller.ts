// src/modules/meal/meal.controller.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { MealService } from './meal.service';
import { AuthRequest } from '../../types';

const mealService = new MealService();

export const createMeal = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const meal = await mealService.createMeal(req.body, req.user!._id);
    res.status(201).json(meal);
  },
);

export const getMealByDate = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { date } = req.params;
    const meal = await mealService.getMealByDate(new Date(date));
    res.json(meal);
  },
);

export const getMealsByDateRange = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;
    const meals = await mealService.getMealsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string),
    );
    res.json(meals);
  },
);

export const updateMeal = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { date } = req.params;
    const meal = await mealService.updateMeal(new Date(date), req.body);
    res.json(meal);
  },
);

export const addStudentToMeal = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { date } = req.params;
    const { userId } = req.body;
    const meal = await mealService.addStudentToMeal(
      new Date(date),
      userId,
      req.user!._id,
    );
    res.json(meal);
  },
);

export const removeStudentFromMeal = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { date } = req.params;
    const { userId } = req.body;
    const meal = await mealService.removeStudentFromMeal(
      new Date(date),
      userId,
      req.user!._id,
    );
    res.json(meal);
  },
);

export const getStudentMeals = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;
    const meals = await mealService.getStudentMeals(
      req.user!._id,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
    );
    res.json(meals);
  },
);
