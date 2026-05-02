// src/middleware/auth.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../modules/user/user.model';
import { AuthRequest, JwtPayload } from '../types';

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'default_secret',
        ) as JwtPayload;

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }

        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  },
);

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

export const teacherOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as teacher or admin');
  }
};

export const manager = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && (req.user.isManager || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as manager');
  }
};

export const canModifyMeal = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (
    req.user &&
    (req.user.role === 'admin' ||
      req.user.role === 'teacher' ||
      req.user.isManager)
  ) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized to modify meal');
  }
};
