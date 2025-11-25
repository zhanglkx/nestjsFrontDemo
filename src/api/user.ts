/**
 * 用户管理 API
 */

import { get, post, put, del } from './request';
import type {
  User,
  UserListParams,
  UserListResponse,
  CreateUserDTO,
  UpdateUserDTO,
} from '@/types';

/**
 * 获取用户列表
 */
export function getUserList(params?: UserListParams) {
  return get<UserListResponse>('/users', { params });
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: number) {
  return get<User>(`/users/${id}`);
}

/**
 * 创建用户
 */
export function createUser(data: CreateUserDTO) {
  return post<User>('/users', data);
}

/**
 * 更新用户
 */
export function updateUser(data: UpdateUserDTO) {
  return put<User>(`/users/${data.id}`, data);
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return del(`/users/${id}`);
}

/**
 * 批量删除用户
 */
export function batchDeleteUsers(ids: number[]) {
  return del('/users/batch', { data: { ids } });
}
