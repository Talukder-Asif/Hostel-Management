/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RequestHandler } from 'express';

const NotFound: RequestHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API not found - ${req.originalUrl}`,
    error: ' ',
  });
};

export default NotFound;
