import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from 'src/services/authServices';

const AuthContext = createContext({
  user: null,
  loginUser: (email: string, password: string) => {},
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
  const loginUser = async (email: string, password: string) => {
    let res = await login(email, password);
    if (res.status === 'success') {
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      navigate('../chat');
    } else {
      console.log(res);
    }
  };

  return (
    <>
      <AuthContext.Provider value={{ user, loginUser }}>
        {props.children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
