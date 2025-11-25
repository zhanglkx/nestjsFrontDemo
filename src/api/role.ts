/**
 * 角色管理 API
 */

import { get, post, put, del } from './request';
import type {
  Role,
  RoleListParams,
  RoleListResponse,
  CreateRoleDTO,
  UpdateRoleDTO,
} from '@/types';

/**
 * 获取角色列表
 */
export function getRoleList(params?: RoleListParams) {
  return get<RoleListResponse>('/roles', { params });
}

/**
 * 获取角色详情
 */
export function getRoleDetail(id: number) {
  return get<Role>(`/roles/${id}`);
}

/**
 * 创建角色
 */
export function createRole(data: CreateRoleDTO) {
  return post<Role>('/roles', data);
}

/**
 * 更新角色
 */
export function updateRole(data: UpdateRoleDTO) {
  return put<Role>(`/roles/${data.id}`, data);
}

/**
 * 删除角色
 */
export function deleteRole(id: number) {
  return del(`/roles/${id}`);
}

/**
 * 获取所有角色（不分页，用于下拉选择）
 */
export function getAllRoles() {
  return get<Role[]>('/users/all');
}
