const { promisify } = require('util');
const jwt = require('jsonwebtoken');
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../models/userModel';

const User = require('../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');
import helper from '../utils/helper';
const sendEmail = require('../utils/email');

const signToken = (id: helper.id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // Signing the token
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

exports.login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password are provided
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists & password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isPasswordCorrect(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything is OK, send token to client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

exports.protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token & check it's provided
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // console.log(token);
    if (!token) {
      return next(
        new AppError('You are not logged in, Please log in to get access', 401)
      );
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user exist
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belongiing to this token no longer exist.', 401)
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again', 401)
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
  }
);

exports.forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError('No user with this email address!', 404));
    }

    // 2) Generate the random token
    const resetToken = user.createPasswordResetToken();
    // const x = await sendEmail();
    // console.log(x);
    await user.save({ validateBeforeSave: false });

    // 3) Send it in user's email
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}, \nIf you didn't forget your password, please ignore this email`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your pass reset token (ONLY VALID TO 10min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'There was an error sending the email! try again later',
          500
        )
      );
    }
  }
);

exports.resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
