// src/modules/user/user.controller.ts
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UserService } from './user.service';
import generateToken from '../../utils/generateToken';

const userService = new UserService();

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.email, user.role),
    });
  },
);

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.json(user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  res.json({ message: 'User removed' });
});

export const getActiveUsers = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await userService.getActiveUsers();
    res.json(users);
  },
);
