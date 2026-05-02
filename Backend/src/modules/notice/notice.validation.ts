// src/modules/notice/notice.validation.ts
import { z } from 'zod';

export const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.enum(['general', 'urgent', 'event', 'maintenance']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
  }),
});

export const updateNoticeSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').optional(),
    content: z.string().min(1, 'Content is required').optional(),
    category: z.enum(['general', 'urgent', 'event', 'maintenance']).optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    isActive: z.boolean().optional(),
  }),
});
