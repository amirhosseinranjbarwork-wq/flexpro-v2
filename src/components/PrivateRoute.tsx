import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteProps {
  signedIn: boolean;
  fallback: string;
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ signedIn, fallback, children }) => {
  if (!signedIn) return <Navigate to={fallback} replace />;
  return children ? <>{children}</> : <Outlet />;
};

export default PrivateRoute;

