/**
 * 路由入口
 */

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

// 创建路由实例
const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}

export { router };
