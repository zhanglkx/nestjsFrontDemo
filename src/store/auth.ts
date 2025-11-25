/**
 * 认证状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginParams } from '@/types';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '@/api';
import { setToken, removeToken, getToken } from '@/utils/token';
import { USER_INFO_KEY } from '@/constants';

interface AuthState {
  // 状态
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  loading: boolean;

  // Actions
  login: (params: LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  fetchUserInfo: () => Promise<void>;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 初始状态
      isAuthenticated: false,
      token: null,
      user: null,
      loading: false,

      // 登录
      login: async (params: LoginParams) => {
        try {
          set({ loading: true });
          const response = await loginApi(params);
          const { access_token: token, user } = response;

          // 保存 token
          setToken(token);

          // 更新状态
          set({
            isAuthenticated: true,
            token,
            user,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      // 登出
      logout: async () => {
        try {
          await logoutApi();
        } catch (error) {
          console.error('Logout API error:', error);
        } finally {
          // 清除 token
          removeToken();

          // 清空状态
          set({
            isAuthenticated: false,
            token: null,
            user: null,
          });
        }
      },

      // 设置用户信息
      setUser: (user: User) => {
        set({ user });
      },

      // 获取用户信息
      fetchUserInfo: async () => {
        try {
          const user = await getCurrentUser();
          set({ user, isAuthenticated: true });
        } catch (error) {
          console.error('Fetch user info error:', error);
          // 获取用户信息失败，清空认证状态
          get().logout();
        }
      },

      // 检查认证状态
      checkAuth: () => {
        const token = getToken();
        const { isAuthenticated } = get();
        return !!token && isAuthenticated;
      },
    }),
    {
      name: USER_INFO_KEY,
      partialPersist: true,
      // 只持久化部分状态
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        user: state.user,
      }),
    }
  )
);
