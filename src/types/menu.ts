/**
 * 菜单类型定义
 */

export interface Menu {
  id: number;
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
  orderNum?: number;
  type: number; // 0: 目录, 1: 菜单, 2: 按钮
  permission?: string;
  status: number; // 0: 禁用, 1: 正常
  children?: Menu[];
  createdAt: string;
  updatedAt?: string;
}

export interface MenuListParams {
  name?: string;
  status?: number;
}

export interface CreateMenuDTO {
  name: string;
  path: string;
  icon?: string;
  parentId?: number | null;
  orderNum?: number;
  type: number;
  permission?: string;
  status?: number;
}

export interface UpdateMenuDTO {
  id: number;
  name?: string;
  path?: string;
  icon?: string;
  parentId?: number | null;
  orderNum?: number;
  type?: number;
  permission?: string;
  status?: number;
}
