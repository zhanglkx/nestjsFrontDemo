/**
 * 菜单管理 API
 */

import { get, post, put, del } from './request';
import type {
  Menu,
  MenuListParams,
  CreateMenuDTO,
  UpdateMenuDTO,
} from '@/types';

/**
 * 获取菜单列表（树形结构）
 */
export function getMenuList(params?: MenuListParams) {
  return get<Menu[]>('/menus', { params });
}

/**
 * 获取菜单详情
 */
export function getMenuDetail(id: number) {
  return get<Menu>(`/menus/${id}`);
}

/**
 * 创建菜单
 */
export function createMenu(data: CreateMenuDTO) {
  return post<Menu>('/menus', data);
}

/**
 * 更新菜单
 */
export function updateMenu(data: UpdateMenuDTO) {
  return put<Menu>(`/menus/${data.id}`, data);
}

/**
 * 删除菜单
 */
export function deleteMenu(id: number) {
  return del(`/menus/${id}`);
}

/**
 * 获取用户菜单（根据权限）
 */
export function getUserMenus() {
  return get<Menu[]>('/menus/user');
}
