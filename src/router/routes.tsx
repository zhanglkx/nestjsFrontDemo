/**
 * 路由配置
 */

import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Spin } from 'antd';
import AuthGuard from '@/components/AuthGuard';
import BasicLayout from '@/layouts/BasicLayout';

// 懒加载组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const UserList = lazy(() => import('@/pages/User'));
const RoleList = lazy(() => import('@/pages/Role'));
const MenuList = lazy(() => import('@/pages/Menu'));

// 加载中的fallback元素
const pageLoadingElement = (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" tip="加载中..." />
  </div>
);

// 懒加载包装函数
function lazyLoad(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={pageLoadingElement}>
      <Component />
    </Suspense>
  );
}

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: lazyLoad(Login),
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <BasicLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: lazyLoad(Dashboard),
      },
      {
        path: 'dashboard',
        element: lazyLoad(Dashboard),
      },
      {
        path: 'users',
        element: lazyLoad(UserList),
      },
      {
        path: 'roles',
        element: lazyLoad(RoleList),
      },
      {
        path: 'menus',
        element: lazyLoad(MenuList),
      },
    ],
  },
  {
    path: '*',
    element: (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <h1>404</h1>
        <p>页面不存在</p>
      </div>
    ),
  },
];
