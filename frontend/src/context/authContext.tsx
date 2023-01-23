import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login, signUp } from 'src/services/authServices';

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
    let user: any = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
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
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('../chat');
    } else {
      console.log(res);
    }
  };

  // Login user
  const loginUser = async (email: string, password: string) => {
    let res = await login(email, password);
    if (res.status === 'success') {
      // console.log(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('../chat');
    } else {
      console.log(res);
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
