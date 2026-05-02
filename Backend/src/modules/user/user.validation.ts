// src/modules/user/user.validation.ts
import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['student', 'teacher', 'admin']).optional(),
    isManager: z.boolean().optional(),
    isActive: z.boolean().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    contact: z.string().optional(),
    fatherContact: z.string().optional(),
    image: z.string().optional(),
    roomNo: z.string().optional(),
    blockNo: z.string().optional(),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    role: z.enum(['student', 'teacher', 'admin']).optional(),
    isManager: z.boolean().optional(),
    isActive: z.boolean().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    contact: z.string().optional(),
    fatherContact: z.string().optional(),
    image: z.string().optional(),
    roomNo: z.string().optional(),
    blockNo: z.string().optional(),
  }),
});
