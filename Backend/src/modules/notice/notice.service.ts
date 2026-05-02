// src/modules/notice/notice.service.ts
import Notice from './notice.model';
import { INotice } from '../../types';

export class NoticeService {
  async createNotice(noticeData: Partial<INotice>, createdBy: string) {
    const notice = await Notice.create({
      ...noticeData,
      createdBy,
    });

    return notice.populate('createdBy', 'name email');
  }

  async getAllNotices() {
    const notices = await Notice.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    return notices;
  }

  async getNoticeById(id: string) {
    const notice = await Notice.findById(id).populate(
      'createdBy',
      'name email',
    );

    if (!notice) {
      throw new Error('Notice not found');
    }

    return notice;
  }

  async updateNotice(id: string, updateData: Partial<INotice>) {
    const notice = await Notice.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    if (!notice) {
      throw new Error('Notice not found');
    }

    return notice;
  }

  async deleteNotice(id: string) {
    const notice = await Notice.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!notice) {
      throw new Error('Notice not found');
    }

    return notice;
  }

  async getNoticesByCategory(category: string) {
    const notices = await Notice.find({
      category,
      isActive: true,
    })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return notices;
  }
}
