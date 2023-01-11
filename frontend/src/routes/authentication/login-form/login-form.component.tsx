import React, { FC, Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';

import Button from '../../../components/button/button.component';
import FormInput from '../../../components/input/input.component';

import './login-form.styles.css';

const LoginForm: FC = () => {
  return (
    <Fragment>
      <Outlet />
      <div className="join-container">
        <header className="join-header">
          <h1>
            <i className="fa fa-sign-in"></i> <span>Sign In</span>
          </h1>
        </header>
        <main className="join-main">
          <form action="../chat">
            <FormInput
              labelFor="username"
              label="Username"
              inputType="text"
              inputName="username"
              inputId="username"
              inputPlaceholder="Enter a username..."
            />
            <FormInput
              labelFor="password"
              label="Password"
              inputType="password"
              inputName="password"
              inputId="password"
              inputPlaceholder="Enter a Password..."
            />

            <Button type={'submit'} className={'btn'} value={'Sign In'} />
          </form>
        </main>
      </div>
      <CopyrightSection />
    </Fragment>
  );
};

export default LoginForm;
