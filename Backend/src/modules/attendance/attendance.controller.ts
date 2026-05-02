// src/modules/attendance/attendance.controller.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AttendanceService } from './attendance.service';
import { AuthRequest } from '../../types';

const attendanceService = new AttendanceService();

export const markAttendance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { date, isPresent, remark } = req.body;
    const attendance = await attendanceService.markAttendance(
      req.user!._id,
      req.user!._id,
      date,
      isPresent,
      remark,
    );
    res.status(201).json(attendance);
  },
);

export const markFutureAttendance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { date, isPresent, remark } = req.body;
    const attendance = await attendanceService.markFutureAttendance(
      req.user!._id,
      req.user!._id,
      date,
      isPresent,
      remark,
    );
    res.status(201).json(attendance);
  },
);

export const markUserAttendance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId, date, isPresent, remark } = req.body;
    const attendance = await attendanceService.markAttendance(
      userId,
      req.user!._id,
      date,
      isPresent,
      remark,
    );
    res.status(201).json(attendance);
  },
);

export const getUserAttendance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;
    const attendance = await attendanceService.getUserAttendance(
      req.user!._id,
      startDate ? new Date(startDate as string) : undefined,
      endDate ? new Date(endDate as string) : undefined,
    );
    res.json(attendance);
  },
);

export const getAttendanceByDate = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { date } = req.params;
    const attendance = await attendanceService.getAttendanceByDate(
      new Date(date),
    );
    res.json(attendance);
  },
);

export const getAttendanceStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { startDate, endDate } = req.query;
    const stats = await attendanceService.getAttendanceStats(
      new Date(startDate as string),
      new Date(endDate as string),
    );
    res.json(stats);
  },
);

export const bulkMarkAttendance = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { users, date, isPresent } = req.body;
    const result = await attendanceService.bulkMarkAttendance(
      users,
      req.user!._id,
      date,
      isPresent,
    );
    res.json(result);
  },
);
