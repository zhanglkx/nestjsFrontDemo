# 后台管理系统

基于 React + TypeScript + Vite + Ant Design 6.0 构建的现代化后台管理系统。

## 技术栈

- **框架**: React 19
- **构建工具**: Vite 7
- **UI 组件库**: Ant Design 6.0 + Ant Design Pro Components
- **路由**: React Router v7
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **样式方案**: CSS Modules
- **日期处理**: Day.js
- **编程语言**: TypeScript

## 项目结构

```
src/
├── api/                # 网络请求模块
│   ├── index.ts       # API 导出入口
│   ├── request.ts     # Axios 封装（请求/响应拦截器）
│   ├── auth.ts        # 认证相关接口
│   ├── user.ts        # 用户管理接口
│   ├── role.ts        # 角色管理接口
│   └── menu.ts        # 菜单管理接口
├── store/              # Zustand 状态管理
│   ├── index.ts       # Store 导出入口
│   ├── auth.ts        # 认证状态
│   └── user.ts        # 用户状态
├── utils/              # 工具函数
│   ├── index.ts       # 工具函数导出入口
│   ├── token.ts       # Token 管理
│   ├── storage.ts     # 本地存储封装
│   └── format.ts      # 数据格式化
├── types/              # TypeScript 类型定义
│   ├── index.ts       # 类型导出入口
│   ├── user.ts        # 用户类型
│   ├── role.ts        # 角色类型
│   ├── menu.ts        # 菜单类型
│   ├── auth.ts        # 认证类型
│   └── common.ts      # 通用类型
├── constants/          # 常量定义
│   └── index.ts       # 全局常量
├── components/         # 公共组件
│   ├── AuthGuard/     # 路由权限守卫
│   └── PermissionButton/ # 按钮权限控制
├── hooks/              # 自定义 Hooks
│   ├── index.ts       # Hooks 导出入口
│   └── usePermission.ts # 权限判断 Hook
├── layouts/            # 布局组件
│   └── BasicLayout/   # 基础布局（ProLayout）
├── pages/              # 页面组件
│   ├── Login/         # 登录页
│   ├── Dashboard/     # 首页仪表板
│   ├── User/          # 用户管理
│   ├── Role/          # 角色管理
│   └── Menu/          # 菜单管理
└── router/             # 路由配置
    ├── index.tsx      # 路由入口
    └── routes.tsx     # 路由配置
```

## 核心功能

### 1. 认证系统
- ✅ 登录/登出
- ✅ Token 管理（自动刷新、过期处理）
- ✅ 路由守卫（未登录跳转登录页）
- ✅ 用户信息持久化

### 2. 用户管理
- ✅ 用户列表（分页、搜索、筛选）
- ✅ 新增/编辑/删除用户
- ✅ 用户状态管理
- ✅ 角色分配

### 3. 角色管理
- ✅ 角色列表
- ✅ 角色 CRUD 操作
- ✅ 角色状态管理
- ✅ 权限配置（可扩展）

### 4. 菜单管理
- ✅ 树形菜单展示
- ✅ 菜单 CRUD 操作
- ✅ 菜单类型（目录/菜单/按钮）
- ✅ 菜单排序
- ✅ 权限标识

### 5. 权限控制
- ✅ 路由级权限（AuthGuard 组件）
- ✅ 按钮级权限（usePermission Hook）
- ✅ 动态路由（根据权限加载）

## 开发指南

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

项目将在 `http://localhost:4000` 启动。

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## 核心模块说明

### 网络请求模块

使用 Axios 封装，提供统一的请求/响应处理：

- 自动添加 Token 到请求头
- 统一错误处理和提示
- Token 过期自动跳转登录
- 支持请求拦截和响应拦截

```typescript
import { get, post, put, del } from '@/api';

// GET 请求
const data = await get('/users');

// POST 请求
const result = await post('/users', { name: 'John' });
```

### 状态管理

使用 Zustand 进行全局状态管理，支持持久化：

```typescript
import { useAuthStore } from '@/store';

function Component() {
  const { user, login, logout } = useAuthStore();
  // ...
}
```

### 权限控制

#### 路由级权限

```tsx
import AuthGuard from '@/components/AuthGuard';

<AuthGuard>
  <YourComponent />
</AuthGuard>
```

#### 按钮级权限

```typescript
import { usePermission } from '@/hooks';

function Component() {
  const { hasPermission } = usePermission();
  
  return (
    <>
      {hasPermission('user:create') && (
        <Button>创建用户</Button>
      )}
    </>
  );
}
```

或使用 PermissionButton 组件：

```tsx
import PermissionButton from '@/components/PermissionButton';

<PermissionButton permission="user:create">
  <Button>创建用户</Button>
</PermissionButton>
```

## 路径别名配置

项目配置了路径别名 `@` 指向 `src` 目录：

```typescript
import { useAuthStore } from '@/store';
import { User } from '@/types';
import { formatDateTime } from '@/utils';
```

## API 代理配置

开发环境下，`/api` 前缀的请求会自动代理到后端服务器（默认 `http://localhost:3000`）。

配置位置：`vite.config.ts`

```typescript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
  },
}
```

## 样式方案

项目使用 CSS Modules，每个组件都有对应的 `.module.css` 文件：

```tsx
import styles from './index.module.css';

function Component() {
  return <div className={styles.container}>Content</div>;
}
```

## 环境要求

- Node.js >= 18
- pnpm >= 8（推荐使用 pnpm）

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 注意事项

1. **测试账号**：登录页提示 `admin / 123456`，实际需要对接后端 API
2. **API 适配**：当前 API 接口是示例，需要根据实际后端接口进行调整
3. **权限系统**：权限判断逻辑需要根据实际业务进行完善
4. **ProComponents 兼容性**：当前 Pro Components 可能对 Ant Design 6.0 存在部分兼容性问题，如遇问题可降级到 Ant Design 5.x

## License

MIT
