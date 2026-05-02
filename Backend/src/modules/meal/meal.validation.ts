// src/modules/meal/meal.validation.ts
import { z } from 'zod';

export const createMealSchema = z.object({
  body: z.object({
    date: z.string().or(z.date()),
    meals: z.array(
      z.object({
        foodName: z.string().min(1, 'Food name is required'),
        time: z.enum(['morning', 'evening', 'night']),
      }),
    ),
  }),
});

export const updateMealSchema = z.object({
  body: z.object({
    meals: z
      .array(
        z.object({
          foodName: z.string().min(1, 'Food name is required'),
          time: z.enum(['morning', 'evening', 'night']),
        }),
      )
      .optional(),
  }),
});

export const addStudentToMealSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});

export const removeStudentFromMealSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});
