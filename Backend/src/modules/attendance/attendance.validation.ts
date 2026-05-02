// src/modules/attendance/attendance.validation.ts
import { z } from 'zod';

export const markAttendanceSchema = z.object({
  body: z.object({
    date: z.string().or(z.date()),
    isPresent: z.boolean(),
    remark: z.string().optional(),
  }),
});

export const markFutureAttendanceSchema = z.object({
  body: z.object({
    date: z
      .string()
      .or(z.date())
      .refine((val) => {
        const date = new Date(val);
        const now = new Date();
        const hoursDiff = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursDiff >= 12;
      }, 'Must be at least 12 hours before the date'),
    isPresent: z.boolean(),
    remark: z.string().optional(),
  }),
});

export const getAttendanceByDateRangeSchema = z.object({
  query: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }),
});
