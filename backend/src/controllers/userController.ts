import { NextFunction, Request, Response } from 'express';
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj: any, ...filteringArgs: string[]) => {
  const newObj: any = {};
  Object.keys(obj).forEach((el) => {
    if (filteringArgs.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find();

  // Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Throw error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for updating passwords. Please use /updateMyPassword',
          400
        )
      );
    }

    // 2) Update user document

    // Filter unwanted fields
    const filteredBody = filterObj(req.body, 'name', 'email');

    // Use findByIdAndUpdate to avoid validating required fields ( e.g: passwordConfirm)
    const UpdatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: UpdatedUser,
      },
    });
  }
);

exports.deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
