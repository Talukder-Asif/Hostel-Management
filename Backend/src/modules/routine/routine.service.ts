// src/modules/routine/routine.service.ts
import MonthlyRoutine from './routine.model';
import Meal from '../meal/meal.model';
import { IMonthlyRoutine } from '../../types';

export class RoutineService {
  async generateMonthlyRoutine(month: number, year: number, createdBy: string) {
    // Check if routine already exists
    const existingRoutine = await MonthlyRoutine.findOne({ month, year });
    if (existingRoutine) {
      throw new Error('Monthly routine already exists for this month');
    }

    // Get all meals for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const meals = await Meal.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate('students.user', 'name email role roomNo');

    if (meals.length === 0) {
      throw new Error('No meals found for this month');
    }

    // Generate routine from meals
    const routine = meals.map((meal) => ({
      date: meal.date,
      morning: {
        foodName: meal.meals.find((m) => m.time === 'morning')?.foodName || '',
        students: meal.students.filter((s) => s.isPresent).map((s) => s.user),
      },
      evening: {
        foodName: meal.meals.find((m) => m.time === 'evening')?.foodName || '',
        students: meal.students.filter((s) => s.isPresent).map((s) => s.user),
      },
      night: {
        foodName: meal.meals.find((m) => m.time === 'night')?.foodName || '',
        students: meal.students.filter((s) => s.isPresent).map((s) => s.user),
      },
    }));

    const monthlyRoutine = await MonthlyRoutine.create({
      month,
      year,
      routine,
      createdBy,
    });

    return monthlyRoutine.populate([
      {
        path: 'routine.morning.students',
        select: 'name email roomNo blockNo',
      },
      {
        path: 'routine.evening.students',
        select: 'name email roomNo blockNo',
      },
      {
        path: 'routine.night.students',
        select: 'name email roomNo blockNo',
      },
      { path: 'createdBy', select: 'name email' },
    ]);
  }

  async getMonthlyRoutine(month: number, year: number) {
    const routine = await MonthlyRoutine.findOne({ month, year }).populate([
      {
        path: 'routine.morning.students',
        select: 'name email roomNo blockNo',
      },
      {
        path: 'routine.evening.students',
        select: 'name email roomNo blockNo',
      },
      {
        path: 'routine.night.students',
        select: 'name email roomNo blockNo',
      },
      { path: 'createdBy', select: 'name email' },
    ]);

    if (!routine) {
      throw new Error('Monthly routine not found');
    }

    return routine;
  }

  async getUserMonthlyRoutine(month: number, year: number, userId: string) {
    const routine = await MonthlyRoutine.findOne({ month, year }).populate([
      { path: 'createdBy', select: 'name email' },
    ]);

    if (!routine) {
      throw new Error('Monthly routine not found');
    }

    // Filter routine to show only user's meals
    const userRoutine = {
      ...routine.toObject(),
      routine: routine.routine.map((day) => ({
        date: day.date,
        morning: {
          foodName: day.morning.foodName,
          isUserIncluded: day.morning.students.some(
            (s: any) => s.toString() === userId,
          ),
        },
        evening: {
          foodName: day.evening.foodName,
          isUserIncluded: day.evening.students.some(
            (s: any) => s.toString() === userId,
          ),
        },
        night: {
          foodName: day.night.foodName,
          isUserIncluded: day.night.students.some(
            (s: any) => s.toString() === userId,
          ),
        },
      })),
    };

    return userRoutine;
  }
}
