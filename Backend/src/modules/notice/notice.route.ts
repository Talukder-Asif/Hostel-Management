// src/modules/notice/notice.route.ts
import { Router } from 'express';
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  getNoticesByCategory,
} from './notice.controller';
import { protect, admin } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { createNoticeSchema, updateNoticeSchema } from './notice.validation';

const router = Router();

// Public routes (authenticated users)
router.get('/', protect, getAllNotices);
router.get('/:id', protect, getNoticeById);
router.get('/category/:category', protect, getNoticesByCategory);

// Admin only routes
router.post('/', protect, admin, validate(createNoticeSchema), createNotice);
router.put('/:id', protect, admin, validate(updateNoticeSchema), updateNotice);
router.delete('/:id', protect, admin, deleteNotice);

export default router;
