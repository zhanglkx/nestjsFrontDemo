/**
 * 用户管理状态
 */

import { create } from 'zustand';
import type { User, UserListParams, UserListResponse, CreateUserDTO, UpdateUserDTO } from '@/types';
import { getUserList, createUser, updateUser, deleteUser } from '@/api';

interface UserState {
  // 状态
  users: User[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;

  // Actions
  fetchUsers: (params?: UserListParams) => Promise<void>;
  addUser: (data: CreateUserDTO) => Promise<void>;
  editUser: (data: UpdateUserDTO) => Promise<void>;
  removeUser: (id: number) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  // 初始状态
  users: [],
  total: 0,
  loading: false,
  currentPage: 1,
  pageSize: 10,

  // 获取用户列表
  fetchUsers: async (params?: UserListParams) => {
    try {
      set({ loading: true });
      const { currentPage, pageSize } = get();
      const response: UserListResponse = await getUserList({
        page: currentPage,
        pageSize,
        ...params,
      });

      set({
        users: response.list,
        total: response.total,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  // 添加用户
  addUser: async (data: CreateUserDTO) => {
    await createUser(data);
    // 刷新列表
    await get().fetchUsers();
  },

  // 编辑用户
  editUser: async (data: UpdateUserDTO) => {
    await updateUser(data);
    // 刷新列表
    await get().fetchUsers();
  },

  // 删除用户
  removeUser: async (id: number) => {
    await deleteUser(id);
    // 刷新列表
    await get().fetchUsers();
  },

  // 设置当前页码
  setPage: (page: number) => {
    set({ currentPage: page });
  },

  // 设置每页大小
  setPageSize: (pageSize: number) => {
    set({ pageSize, currentPage: 1 });
  },
}));
