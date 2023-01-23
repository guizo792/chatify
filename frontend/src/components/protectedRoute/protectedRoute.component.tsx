import { FC, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from 'src/context/authContext';

type ProtectedRouteProps = {
  children: any;
  accessBy: string;
};

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, accessBy }) => {
  const { user } = useContext(AuthContext);

  if (accessBy === 'non-authenticated') {
    if (!user) {
      return children;
    }
  } else if (accessBy === 'authenticated') {
    if (user) {
      return children;
    }
  }
  return <Navigate to="/"></Navigate>;
};
export default ProtectedRoute;
