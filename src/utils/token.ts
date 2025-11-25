/**
 * Token 管理工具函数
 */

import { TOKEN_KEY } from '@/constants';
import { getStorage, setStorage, removeStorage } from './storage';

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return getStorage<string>(TOKEN_KEY);
}

/**
 * 设置 Token
 */
export function setToken(token: string): void {
  setStorage(TOKEN_KEY, token);
}

/**
 * 删除 Token
 */
export function removeToken(): void {
  removeStorage(TOKEN_KEY);
}

/**
 * 检查是否有 Token
 */
export function hasToken(): boolean {
  return !!getToken();
}
