import axios from 'axios';
import { showAlert } from 'src/utils/alert';

axios.defaults.withCredentials = true;

const API_URL = process.env.REACT_APP_API_URL;

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
  } catch (err: any) {
    return err.response.data;
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
  } catch (err: any) {
    return err.response.data;
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: API_URL + 'logout',
    });

    if (res.data.status === 'success') {
      localStorage.removeItem('user');
      return res.data;
    }
  } catch (err) {
    showAlert('Error logging out! Try again.', 'error');
  }
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user') || '');
};
