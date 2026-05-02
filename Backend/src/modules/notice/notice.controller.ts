// src/modules/notice/notice.controller.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { NoticeService } from './notice.service';
import { AuthRequest } from '../../types';

const noticeService = new NoticeService();

export const createNotice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const notice = await noticeService.createNotice(req.body, req.user!._id);
    res.status(201).json(notice);
  },
);

export const getAllNotices = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const notices = await noticeService.getAllNotices();
    res.json(notices);
  },
);

export const getNoticeById = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const notice = await noticeService.getNoticeById(req.params.id);
    res.json(notice);
  },
);

export const updateNotice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const notice = await noticeService.updateNotice(req.params.id, req.body);
    res.json(notice);
  },
);

export const deleteNotice = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const notice = await noticeService.deleteNotice(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  },
);

export const getNoticesByCategory = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const notices = await noticeService.getNoticesByCategory(
      req.params.category,
    );
    res.json(notices);
  },
);
