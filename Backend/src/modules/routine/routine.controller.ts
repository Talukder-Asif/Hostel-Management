// src/modules/routine/routine.controller.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { RoutineService } from './routine.service';
import { AuthRequest } from '../../types';

const routineService = new RoutineService();

export const generateMonthlyRoutine = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { month, year } = req.body;
    const routine = await routineService.generateMonthlyRoutine(
      month,
      year,
      req.user!._id,
    );
    res.status(201).json(routine);
  },
);

export const getMonthlyRoutine = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { month, year } = req.params;
    const routine = await routineService.getMonthlyRoutine(
      parseInt(month),
      parseInt(year),
    );
    res.json(routine);
  },
);

export const getUserMonthlyRoutine = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { month, year } = req.params;
    const routine = await routineService.getUserMonthlyRoutine(
      parseInt(month),
      parseInt(year),
      req.user!._id,
    );
    res.json(routine);
  },
);
