import React, {
  ChangeEvent,
  FC,
  FormEvent,
  Fragment,
  useState,
  useContext,
} from 'react';
import { Outlet } from 'react-router-dom';
import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';
// import { get } from 'react-cookies';

import Button from '../../../components/button/button.component';
import FormInput from '../../../components/input/input.component';

import AuthContext from '../../../context/authContext';

import './login-form.styles.css';

const defaultFormFields = {
  email: '',
  password: '',
};

interface AuthError extends Error {
  code: number;
}

const LoginForm: FC = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;

  const { loginUser } = useContext(AuthContext);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const loginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await loginUser(email, password);
      resetFormFields();
    } catch (error) {
      switch ((error as AuthError).code) {
        // case AuthErrorCodes.INVALID_PASSWORD:
        //   alert('incorrect password for email');
        //   break;
        // case AuthErrorCodes.NULL_USER:
        //   alert('no user associated with this email');
        //   break;
        default:
          // console.log(error);
          console.log('💥💥💥💥' + error);
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

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
          <form action="../chat" onSubmit={loginSubmit}>
            <FormInput
              onChange={handleChange}
              labelFor="email"
              label="Email"
              inputType="email"
              inputName="email"
              inputId="email"
              inputPlaceholder="Enter a username..."
              value={email}
            />
            <FormInput
              onChange={handleChange}
              labelFor="password"
              label="Password"
              inputType="password"
              inputName="password"
              inputId="password"
              inputPlaceholder="Enter a Password..."
              value={password}
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
