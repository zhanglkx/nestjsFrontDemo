/**
 * 认证相关 API
 */

import { post } from './request';
import type { LoginParams, LoginResponse } from '@/types';

/**
 * 用户登录
 */
export function login(params: LoginParams) {
  return post<LoginResponse>('/auth/login', params);
}

/**
 * 用户登出
 */
export function logout() {
  return post('/auth/logout');
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return post('/users/me');
}
