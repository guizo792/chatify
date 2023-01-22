import React, { FC, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';

import 'font-awesome/css/font-awesome.min.css';

import Button from '../../../components/button/button.component';
import FormInput from '../../../components/input/input.component';

import '../login-form/login-form.styles.css';

const SignUpForm: FC = () => {
  return (
    <Fragment>
      <Outlet />
      <div className="join-container">
        <header className="join-header">
          <h1>
            <span>😄</span>
            <span> Welcome to Chatify</span>
          </h1>
        </header>
        <main className="join-main">
          <form action="chat">
            <FormInput
              onChange={(e) => {
                e.preventDefault();
              }}
              labelFor="username"
              label="Username"
              inputType="text"
              inputName="username"
              inputId="username"
              inputPlaceholder="Enter a username..."
              value={''}
            />
            <FormInput
              onChange={(e) => {
                e.preventDefault();
              }}
              labelFor="email"
              label="Email"
              inputType="text"
              inputName="email"
              inputId="email"
              inputPlaceholder="Enter email..."
              value={''}
            />
            <FormInput
              onChange={(e) => {
                e.preventDefault();
              }}
              labelFor="password"
              label="Password"
              inputType="password"
              inputName="password"
              inputId="password"
              inputPlaceholder="Enter a Password..."
              value={''}
            />
            <FormInput
              onChange={(e) => {
                e.preventDefault();
              }}
              labelFor="passwordConfirm"
              label="Confirm Password"
              inputType="password"
              inputName="passwordConfirm"
              inputId="passwordConfirm"
              inputPlaceholder="Confirm password..."
              value={''}
            />

            <Button type={'submit'} className={'btn'} value={'Sign In'} />
          </form>
        </main>
      </div>
      <CopyrightSection />
    </Fragment>
  );
};

export default SignUpForm;
