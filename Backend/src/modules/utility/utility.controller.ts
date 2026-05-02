// src/modules/utility/utility.controller.ts
import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UtilityBillService } from './utility.service';
import { AuthRequest } from '../../types';

const utilityService = new UtilityBillService();

export const createUtilityBill = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { month, year, bills } = req.body;
    const utilityBill = await utilityService.createUtilityBill(
      month,
      year,
      bills,
      req.user!._id,
    );
    res.status(201).json(utilityBill);
  },
);

export const getAllUtilityBills = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const bills = await utilityService.getAllUtilityBills();
    res.json(bills);
  },
);

export const getUtilityBillByMonth = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { month, year } = req.params;
    const bill = await utilityService.getUtilityBillByMonth(
      parseInt(month),
      parseInt(year),
    );
    res.json(bill);
  },
);

export const markPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req.body;
    const bill = await utilityService.markPayment(req.params.id, userId);
    res.json(bill);
  },
);

export const getUserBills = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const bills = await utilityService.getUserBills(req.user!._id);
    res.json(bills);
  },
);

export const getPaymentStats = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const stats = await utilityService.getPaymentStats();
    res.json(stats);
  },
);
