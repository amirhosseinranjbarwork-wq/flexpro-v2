import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  signedIn: boolean;
  redirectTo: string;
  children?: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ signedIn, redirectTo, children }) => {
  if (signedIn) return <Navigate to={redirectTo} replace />;
  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;

