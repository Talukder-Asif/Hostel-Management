// src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthService } from './auth.service';
import { AuthRequest } from '../../types';

const authService = new AuthService();

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userData = await authService.login(email, password);
  res.json(userData);
});

export const changePassword = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(
      req.user!._id,
      currentPassword,
      newPassword,
    );
    res.json(result);
  },
);

export const getUserProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    res.json(req.user);
  },
);
