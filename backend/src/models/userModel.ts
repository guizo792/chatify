const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

import { NextFunction } from 'express';
import helper from '../utils/helper';

export interface IUser extends helper.Document {
  password: string;
  passwordConfirm: string | undefined;
  isModified: Function;
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
});

// Hash passwords before save or create new user
userSchema.pre('save', async function (this: IUser, next: NextFunction) {
  // If password is not modified don't run anything
  if (!this.isModified('password')) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 10);

  // Delete passwordConfirm
  // We need the passConfirm just for validationg password
  this.passwordConfirm = undefined;
  next();
});

// Creating an instance method that checks password correcteness for each instance of usermodel
userSchema.methods.isPasswordCorrect = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
