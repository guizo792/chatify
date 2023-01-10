import { ButtonHTMLAttributes, FC } from 'react';

const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return <button {...props}>{props.value}</button>;
};

export default Button;
