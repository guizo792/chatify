import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login, signUp } from 'src/services/authServices';
import { showAlert } from 'src/utils/alert';

const AuthContext = createContext({
  user: null,
  loginUser: (email: string, password: string) => {},
  signUpUser: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {},
});

export const AuthContextProvider = (props: any) => {
  const [user, setUser] = useState(() => {
    let userProfile: any = localStorage.getItem('user');
    if (userProfile && userProfile !== undefined) {
      return JSON.parse(userProfile);
    }
    return null;
  });
  const navigate = useNavigate();

  // Registring user
  const signUpUser = async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    let res = await signUp(name, email, password, passwordConfirm);
    if (res.status === 'success') {
      showAlert('Signed up successfully...', 'success');
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data);
      window.setTimeout(() => {
        navigate('../chat');
        window.location.reload();
      }, 3000);
    } else {
      showAlert(res.message, 'error');
    }
  };

  // Login user
  const loginUser = async (email: string, password: string) => {
    let res = await login(email, password);
    // console.log(res);
    if (res.status === 'success') {
      console.log(res.data.user);
      // console.log(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data);
      window.setTimeout(() => {
        navigate('../chat');
        window.location.reload();
      }, 1000);
      showAlert('Logged in successfully...', 'success');
    } else {
      showAlert(res.message, 'error');
    }
  };

  return (
    <>
      <AuthContext.Provider value={{ user, loginUser, signUpUser }}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
