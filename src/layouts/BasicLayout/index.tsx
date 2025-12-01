/**
 * 基础布局组件
 */

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ProLayout, PageContainer } from '@ant-design/pro-components';
import {
  UserOutlined,
  DashboardOutlined,
  SafetyOutlined,
  MenuOutlined,
  FileOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import type { MenuDataItem } from '@ant-design/pro-components';
import { useAuthStore } from '@/store';
import styles from './index.module.css';

export default function BasicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [pathname, setPathname] = useState(location.pathname);

  // 菜单配置
  const menuData: MenuDataItem[] = [
    {
      path: '/dashboard',
      name: '工作台',
      icon: <DashboardOutlined />,
    },
    {
      path: '/users',
      name: '用户管理',
      icon: <UserOutlined />,
    },
    {
      path: '/roles',
      name: '角色管理',
      icon: <SafetyOutlined />,
    },
    {
      path: '/menus',
      name: '菜单管理',
      icon: <MenuOutlined />,
    },
    {
      path: '/feat-list',
      name: '功能列表',
      icon: <FileOutlined />,
    },
  ];

  // 退出登录
  const handleLogout = async () => {
    try {
      await logout();
      message.success('退出成功');
      navigate('/login');
    } catch {
      message.error('退出失败');
    }
  };

  // 用户下拉菜单
  const avatarMenu = {
    items: [
      {
        key: 'profile',
        icon: <UserOutlined />,
        label: '个人中心',
      },
      {
        type: 'divider' as const,
      },
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: '退出登录',
        onClick: handleLogout,
      },
    ],
  };

  return (
    <div className={styles.layout}>
      <ProLayout
        title="后台管理系统"
        logo={false}
        layout="mix"
        contentWidth="Fluid"
        fixedHeader
        fixSiderbar
        location={{
          pathname,
        }}
        menu={{
          request: async () => menuData,
        }}
        avatarProps={{
          src: user?.avatar || undefined,
          title: user?.username || '管理员',
          size: 'small',
          render: (_props, dom) => (
            <Dropdown menu={avatarMenu} placement="bottomRight">
              {dom}
            </Dropdown>
          ),
        }}
        onMenuHeaderClick={() => navigate('/dashboard')}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              setPathname(item.path || '/');
              navigate(item.path || '/');
            }}
          >
            {dom}
          </div>
        )}
      >
        <PageContainer>
          <Outlet />
        </PageContainer>
      </ProLayout>
    </div>
  );
}
