// src/modules/meal/meal.service.ts
import Meal from './meal.model';
import Attendance from '../attendance/attendance.model';
import User from '../user/user.model';
import { IMeal } from '../../types';

export class MealService {
  async createMeal(mealData: Partial<IMeal>, createdBy: string) {
    const mealDate = new Date(mealData.date!);
    mealDate.setHours(0, 0, 0, 0);

    // Check if meal already exists for this date
    const existingMeal = await Meal.findOne({ date: mealDate });
    if (existingMeal) {
      throw new Error('Meal already exists for this date');
    }

    // Get all active users who are present (not marked absent)
    const activeUsers = await User.find({ isActive: true });
    const presentUsers = [];

    for (const user of activeUsers) {
      const attendance = await Attendance.findOne({
        user: user._id,
        date: mealDate,
      });

      // If no attendance record or present, add to meal
      if (!attendance || attendance.isPresent) {
        presentUsers.push({
          user: user._id,
          addedBy: createdBy,
          isPresent: true,
        });
      }
    }

    const meal = await Meal.create({
      date: mealDate,
      meals: mealData.meals,
      students: presentUsers,
      createdBy,
    });

    return meal.populate([
      { path: 'students.user', select: 'name email role roomNo' },
      { path: 'createdBy', select: 'name email' },
    ]);
  }

  async getMealByDate(date: Date) {
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    const meal = await Meal.findOne({ date: mealDate })
      .populate('students.user', 'name email role roomNo blockNo')
      .populate('createdBy', 'name email');

    if (!meal) {
      throw new Error('No meal found for this date');
    }

    return meal;
  }

  async getMealsByDateRange(startDate: Date, endDate: Date) {
    const meals = await Meal.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .populate('students.user', 'name email role roomNo')
      .populate('createdBy', 'name email')
      .sort({ date: 1 });

    return meals;
  }

  async updateMeal(date: Date, updateData: Partial<IMeal>) {
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    const meal = await Meal.findOneAndUpdate(
      { date: mealDate },
      { $set: updateData },
      { new: true, runValidators: true },
    ).populate([
      { path: 'students.user', select: 'name email role roomNo' },
      { path: 'createdBy', select: 'name email' },
    ]);

    if (!meal) {
      throw new Error('Meal not found');
    }

    return meal;
  }

  async addStudentToMeal(date: Date, userId: string, addedBy: string) {
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    const meal = await Meal.findOne({ date: mealDate });
    if (!meal) {
      throw new Error('No meal found for this date');
    }

    // Check if student is absent
    const attendance = await Attendance.findOne({
      user: userId,
      date: mealDate,
    });

    if (attendance && !attendance.isPresent) {
      throw new Error('Student is marked absent for this date');
    }

    // Check if student already in meal
    const studentExists = meal.students.find(
      (s) => s.user.toString() === userId,
    );

    if (studentExists) {
      throw new Error('Student already added to meal');
    }

    meal.students.push({
      user: userId,
      addedBy: addedBy,
      isPresent: true,
    } as any);

    await meal.save();

    return meal.populate([
      { path: 'students.user', select: 'name email role roomNo' },
    ]);
  }

  async removeStudentFromMeal(date: Date, userId: string, removedBy: string) {
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    // Get user to check permissions
    const user = await User.findById(removedBy);

    const meal = await Meal.findOne({ date: mealDate });
    if (!meal) {
      throw new Error('No meal found for this date');
    }

    // Students can only remove themselves
    if (user?.role === 'student' && userId !== removedBy) {
      throw new Error('You can only remove yourself from meal');
    }

    const studentIndex = meal.students.findIndex(
      (s) => s.user.toString() === userId,
    );

    if (studentIndex === -1) {
      throw new Error('Student not found in meal');
    }

    meal.students.splice(studentIndex, 1);
    await meal.save();

    return meal.populate([
      { path: 'students.user', select: 'name email role roomNo' },
    ]);
  }

  async getStudentMeals(userId: string, startDate?: Date, endDate?: Date) {
    const query: any = {
      'students.user': userId,
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const meals = await Meal.find(query)
      .populate('students.user', 'name email role roomNo')
      .sort({ date: 1 });

    return meals;
  }
}
