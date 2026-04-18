import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useI18n } from '../i18n/I18nContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('teacher' | 'student')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useAppContext();
  const { t } = useI18n();
  const location = useLocation();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">{t('common.loading')}</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    if (currentUser.role === 'teacher') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/student-portal" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
