import axios from 'axios';

axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:5000/api/v1/users/';

export const signUp = async (
  name: string,
  email: string,
  password: string,
  passwordConfirm: string
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: API_URL + 'signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    return res.data;
  } catch (err) {
    console.log('There was an error!!!', err);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const res = await axios({
      method: 'POST',
      url: API_URL + 'login',
      data: {
        email,
        password,
      },
    });

    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  return axios.post(API_URL + 'signout').then((response) => {
    return response.data;
  });
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '');
};
