/**
 * 用户类型定义
 */

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: number; // 0: 禁用, 1: 正常
  roleId?: number;
  roleName?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UserListParams {
  page?: number;
  pageSize?: number;
  username?: string;
  email?: string;
  status?: number;
}

export interface UserListResponse {
  list: User[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateUserDTO {
  username: string;
  password: string;
  email: string;
  phone?: string;
  roleId?: number;
  status?: number;
}

export interface UpdateUserDTO {
  id: number;
  username?: string;
  email?: string;
  phone?: string;
  roleId?: number;
  status?: number;
}
