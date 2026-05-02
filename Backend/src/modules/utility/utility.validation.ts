// src/modules/utility/utility.validation.ts
import { z } from 'zod';

export const createUtilityBillSchema = z.object({
  body: z.object({
    month: z.number().min(1).max(12),
    year: z.number().min(2024),
    bills: z.array(
      z.object({
        billType: z.enum(['gas', 'electricity', 'water', 'wifi', 'other']),
        billName: z.string().min(1, 'Bill name is required'),
        totalAmount: z.number().min(0),
        description: z.string().optional(),
        billDate: z.string().or(z.date()),
      }),
    ),
  }),
});

export const markPaymentSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
  }),
});
