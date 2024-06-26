const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

import { NextFunction } from 'express';
import helper from '../utils/helper';

export interface IUser extends helper.Document {
  _id: helper.id;
  password: string | undefined;
  passwordConfirm: string | undefined;
  isModified: Function;
  passwordChangedAt: Date;
  isNew: Function;
  find: Function;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },
      message: 'The passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// Hash passwords before save or create new user
userSchema.pre('save', async function (this: IUser, next: NextFunction) {
  // If password is not modified don't run anything
  if (!this.isModified('password')) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 10);

  // Delete passwordConfirm
  // We need the passConfirm just for validating password
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (this: IUser, next: NextFunction) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

userSchema.pre(/^find/, function (this: IUser, next: NextFunction) {
  // This points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Creating an instance method that checks password correcteness for each instance of usermodel
userSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  this: IUser,
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedAtTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedAtTimestamp;
  }

  // Not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log(resetToken, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
