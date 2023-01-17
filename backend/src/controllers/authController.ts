import { NextFunction, Request, Response } from 'express';

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  }
);
