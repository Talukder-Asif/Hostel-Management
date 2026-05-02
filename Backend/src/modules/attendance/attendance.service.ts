// src/modules/attendance/attendance.service.ts
import Attendance from './attendance.model';
import Meal from '../meal/meal.model';
import { IAttendance, AuthRequest } from '../../types';
import mongoose from 'mongoose';

export class AttendanceService {
  async markAttendance(
    userId: string,
    markedBy: string,
    date: Date,
    isPresent: boolean,
    remark?: string,
  ) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: attendanceDate,
    });

    if (existingAttendance) {
      existingAttendance.isPresent = isPresent;
      existingAttendance.markedBy = markedBy as any;
      if (remark) existingAttendance.remark = remark;
      await existingAttendance.save();

      // If user is absent, remove from all meals for that day
      if (!isPresent) {
        await this.removeUserFromMeals(userId, attendanceDate);
      }

      return existingAttendance;
    }

    const attendance = await Attendance.create({
      user: userId,
      date: attendanceDate,
      isPresent,
      markedBy,
      remark,
    });

    // If user is absent, remove from all meals for that day
    if (!isPresent) {
      await this.removeUserFromMeals(userId, attendanceDate);
    }

    return attendance;
  }

  async markFutureAttendance(
    userId: string,
    markedBy: string,
    date: Date,
    isPresent: boolean,
    remark?: string,
  ) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check the 12-hour rule
    const now = new Date();
    const hoursDiff =
      (attendanceDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 12) {
      throw new Error('Must mark attendance at least 12 hours before the date');
    }

    const attendance = await Attendance.findOneAndUpdate(
      { user: userId, date: attendanceDate },
      {
        isPresent,
        markedBy: markedBy as any,
        remark,
      },
      { upsert: true, new: true },
    );

    // If marking as absent for future date, schedule meal removal
    if (!isPresent) {
      // We can implement a cron job or scheduler here
      // For now, we'll just create the attendance record
      console.log(
        `User ${userId} will be absent on ${attendanceDate}, meals will be removed`,
      );
    }

    return attendance;
  }

  async getUserAttendance(userId: string, startDate?: Date, endDate?: Date) {
    const query: any = { user: userId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('user', 'name email role roomNo')
      .populate('markedBy', 'name email');

    return attendance;
  }

  async getAttendanceByDate(date: Date) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.find({ date: attendanceDate })
      .populate('user', 'name email role roomNo blockNo')
      .populate('markedBy', 'name email');

    return attendance;
  }

  async getAttendanceStats(startDate: Date, endDate: Date) {
    const stats = await Attendance.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: '$user',
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: { $cond: ['$isPresent', 1, 0] },
          },
          absentDays: {
            $sum: { $cond: ['$isPresent', 0, 1] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          'user.name': 1,
          'user.email': 1,
          'user.role': 1,
          'user.roomNo': 1,
          totalDays: 1,
          presentDays: 1,
          absentDays: 1,
          attendancePercentage: {
            $multiply: [{ $divide: ['$presentDays', '$totalDays'] }, 100],
          },
        },
      },
    ]);

    return stats;
  }

  private async removeUserFromMeals(userId: string, date: Date) {
    const mealDate = new Date(date);
    mealDate.setHours(0, 0, 0, 0);

    // Remove user from all meals for that date
    await Meal.updateMany(
      { date: mealDate },
      { $pull: { students: { user: userId } } },
    );
  }

  async bulkMarkAttendance(
    users: string[],
    markedBy: string,
    date: Date,
    isPresent: boolean,
  ) {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const operations = users.map((userId) => ({
      updateOne: {
        filter: { user: userId, date: attendanceDate },
        update: {
          user: userId,
          date: attendanceDate,
          isPresent,
          markedBy: markedBy as any,
        },
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(operations);

    // If marking as absent, remove users from meals
    if (!isPresent) {
      await Meal.updateMany(
        { date: attendanceDate },
        { $pull: { students: { user: { $in: users } } } },
      );
    }

    return result;
  }
}
