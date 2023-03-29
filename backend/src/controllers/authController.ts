const crypto = require('crypto');
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

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  // sign token
  const token = signToken(user._id);

  // send token via cookie
  const tokenExpirationDate =
    process.env.JWT_COOKIE_EXPIRES_IN === undefined
      ? '90'
      : process.env.JWT_COOKIE_EXPIRES_IN;

  type CookieOptions = {
    expires: Date;
    httpOnly?: boolean;
    secure?: boolean;
  };

  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() + parseInt(tokenExpirationDate) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token);

  // Prevent displaying user password in response
  user.password = undefined;

  // send token in response
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      photo: req.body.photo,
    });

    // Creating and Signing the token
    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
  }
);

exports.logout = (req: Request, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get token & check it's provided
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
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
        new AppError('The user belonging to this token no longer exist.', 401)
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
    // console.log(req.user);
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
    const resetURL = `click <a href="${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}">HERE👉🏻</a>`;

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
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Check for user with the hashedToken and not yet expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and user exist, set the password
    if (!user) {
      return next(new AppError('This is token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save(); // We shouldn't turn off validation because we really need it here

    // 3) Update changedAt property for the user
    // This functionnality is impelemented in the userModel

    // 3) Log the user in, send JWT
    createSendToken(user, 200, res);
  }
);

exports.updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user
    // console.log(req.user);
    const user = await User.findOne({ _id: req.user.id }).select('+password');

    // No need for this it's avoided by protecting our route
    // if (!user) {
    //   return next(new AppError('No user found', 404));
    // }

    // 2) Check current password correct
    if (
      !(await user.isPasswordCorrect(req.body.currentPassword, user.password))
    ) {
      return next(new AppError('Incorrect password', 401));
    }

    // 3) If so update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // the passChangedAt will be updated auto

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
  }
);
