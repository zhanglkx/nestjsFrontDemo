/**
 * 路由权限守卫组件
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { checkAuth } = useAuthStore();
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    // 未登录，跳转到登录页
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
