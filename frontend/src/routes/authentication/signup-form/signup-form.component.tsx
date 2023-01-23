import React, {
  ChangeEvent,
  FC,
  FormEvent,
  Fragment,
  useContext,
  useState,
} from 'react';
import { Outlet } from 'react-router-dom';
import CopyrightSection from 'src/components/copyrights-section/copyrights-section.component';

import 'font-awesome/css/font-awesome.min.css';

import Button from '../../../components/button/button.component';
import FormInput from '../../../components/input/input.component';

import '../login-form/login-form.styles.css';
import AuthContext from 'src/context/authContext';

const defaultFormFields = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

interface AuthError extends Error {
  code: number;
}

const SignUpForm: FC = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { name, email, password, passwordConfirm } = formFields;

  const { signUpUser } = useContext(AuthContext);

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const signUpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await signUpUser(name, email, password, passwordConfirm);
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
          alert('an error occured');
          console.log('user sign in failed', error);
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
            <span>😄</span>
            <span> Welcome to Chatify</span>
          </h1>
        </header>
        <main className="join-main">
          <form onSubmit={signUpSubmit}>
            <FormInput
              onChange={handleChange}
              labelFor="name"
              label="Username"
              inputType="text"
              inputName="name"
              inputId="name"
              inputPlaceholder="Enter a username..."
              value={name}
            />
            <FormInput
              onChange={handleChange}
              labelFor="email"
              label="Email"
              inputType="text"
              inputName="email"
              inputId="email"
              inputPlaceholder="Enter email..."
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
            <FormInput
              onChange={handleChange}
              labelFor="passwordConfirm"
              label="Confirm Password"
              inputType="password"
              inputName="passwordConfirm"
              inputId="passwordConfirm"
              inputPlaceholder="Confirm password..."
              value={passwordConfirm}
            />

            <Button type={'submit'} className={'btn'} value={'Sign Up'} />
          </form>
        </main>
      </div>
      <CopyrightSection />
    </Fragment>
  );
};

export default SignUpForm;
