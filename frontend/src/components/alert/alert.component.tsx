const Alert = (msg: string) => {
  return <div className={'alert alert--${type}'}>{msg}</div>;
};

export default Alert;
