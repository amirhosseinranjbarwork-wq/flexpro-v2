import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  signedIn: boolean;
  fallback: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ signedIn, fallback, children }) => {
  if (!signedIn) return <Navigate to={fallback} replace />;
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

