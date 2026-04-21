import { NextFunction, Request, Response } from 'express';

export const globalErrorHandler = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _next: NextFunction,
) => {
  console.log('error from app.ts', err);
  res.status(400).json({ success: false, message: err.message, error: err });
};
