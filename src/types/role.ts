/**
 * 角色类型定义
 */

export interface Role {
  id: number;
  name: string;
  code: string;
  description?: string;
  status: number; // 0: 禁用, 1: 正常
  permissions?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface RoleListParams {
  page?: number;
  pageSize?: number;
  name?: string;
  code?: string;
  status?: number;
}

export interface RoleListResponse {
  list: Role[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateRoleDTO {
  name: string;
  code: string;
  description?: string;
  status?: number;
  permissions?: string[];
}

export interface UpdateRoleDTO {
  id: number;
  name?: string;
  code?: string;
  description?: string;
  status?: number;
  permissions?: string[];
}
