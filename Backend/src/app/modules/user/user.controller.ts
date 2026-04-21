import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: 'User created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const userCollection = {
  createUser,
};
