/**
 * 认证类型定义
 */

import { User } from './user';

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}
