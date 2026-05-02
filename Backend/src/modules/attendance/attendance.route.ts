// src/modules/attendance/attendance.route.ts
import { Router } from 'express';
import {
  markAttendance,
  markFutureAttendance,
  markUserAttendance,
  getUserAttendance,
  getAttendanceByDate,
  getAttendanceStats,
  bulkMarkAttendance,
} from './attendance.controller';
import { protect, admin, teacherOrAdmin } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  markAttendanceSchema,
  markFutureAttendanceSchema,
  getAttendanceByDateRangeSchema,
} from './attendance.validation';

const router = Router();

// Student routes
router.post('/mark', protect, validate(markAttendanceSchema), markAttendance);
router.post(
  '/mark-future',
  protect,
  validate(markFutureAttendanceSchema),
  markFutureAttendance,
);
router.get('/my-attendance', protect, getUserAttendance);

// Admin/Teacher routes
router.post('/mark-user', protect, teacherOrAdmin, markUserAttendance);
router.post('/bulk-mark', protect, teacherOrAdmin, bulkMarkAttendance);
router.get('/by-date/:date', protect, teacherOrAdmin, getAttendanceByDate);
router.get(
  '/stats',
  protect,
  teacherOrAdmin,
  validate(getAttendanceByDateRangeSchema),
  getAttendanceStats,
);

export default router;
