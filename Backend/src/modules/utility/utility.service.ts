// src/modules/utility/utility.service.ts
import UtilityBill from './utility.model';
import User from '../user/user.model';
import { IUtilityBill, IBillItem } from '../../types';

export class UtilityBillService {
  async createUtilityBill(
    month: number,
    year: number,
    bills: IBillItem[],
    createdBy: string,
  ) {
    // Check if bill already exists for this month
    const existingBill = await UtilityBill.findOne({ month, year });
    if (existingBill) {
      throw new Error('Utility bill already exists for this month and year');
    }

    // Get total active users
    const activeUsers = await User.find({ isActive: true });
    const totalActiveUsers = activeUsers.length;

    if (totalActiveUsers === 0) {
      throw new Error('No active users found');
    }

    // Calculate total bills and per person amount
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const perPersonAmount = totalAmount / totalActiveUsers;

    const utilityBill = await UtilityBill.create({
      month,
      year,
      bills,
      totalActiveUsers,
      perPersonAmount,
      createdBy,
      paidBy: activeUsers.map((user) => ({
        user: user._id,
        amount: perPersonAmount,
        isPaid: false,
      })),
    });

    return utilityBill.populate([
      { path: 'paidBy.user', select: 'name email role roomNo blockNo' },
      { path: 'createdBy', select: 'name email' },
    ]);
  }

  async getAllUtilityBills() {
    const bills = await UtilityBill.find({})
      .populate('createdBy', 'name email')
      .populate('paidBy.user', 'name email role roomNo blockNo')
      .sort({ year: -1, month: -1 });

    return bills;
  }

  async getUtilityBillByMonth(month: number, year: number) {
    const bill = await UtilityBill.findOne({ month, year })
      .populate('createdBy', 'name email')
      .populate('paidBy.user', 'name email role roomNo blockNo');

    if (!bill) {
      throw new Error('Utility bill not found for this month');
    }

    return bill;
  }

  async markPayment(billId: string, userId: string) {
    const bill = await UtilityBill.findById(billId);

    if (!bill) {
      throw new Error('Utility bill not found');
    }

    const paidEntry = bill.paidBy.find((p) => p.user.toString() === userId);

    if (!paidEntry) {
      throw new Error('User not found in bill');
    }

    if (paidEntry.isPaid) {
      throw new Error('Payment already marked');
    }

    paidEntry.isPaid = true;
    paidEntry.paidAt = new Date();
    await bill.save();

    return bill.populate([
      { path: 'paidBy.user', select: 'name email role roomNo blockNo' },
      { path: 'createdBy', select: 'name email' },
    ]);
  }

  async getUserBills(userId: string) {
    const bills = await UtilityBill.find({
      'paidBy.user': userId,
    })
      .populate('createdBy', 'name email')
      .populate('paidBy.user', 'name email role roomNo')
      .sort({ year: -1, month: -1 });

    return bills;
  }

  async getPaymentStats() {
    const stats = await UtilityBill.aggregate([
      { $unwind: '$paidBy' },
      {
        $group: {
          _id: {
            month: '$month',
            year: '$year',
          },
          totalAmount: { $first: '$perPersonAmount' },
          totalUsers: { $first: '$totalActiveUsers' },
          paidUsers: {
            $sum: { $cond: ['$paidBy.isPaid', 1, 0] },
          },
          unpaidUsers: {
            $sum: { $cond: ['$paidBy.isPaid', 0, 1] },
          },
          collectedAmount: {
            $sum: {
              $cond: ['$paidBy.isPaid', '$paidBy.amount', 0],
            },
          },
        },
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 },
      },
    ]);

    return stats;
  }
}
