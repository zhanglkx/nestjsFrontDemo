/**
 * 权限判断 Hook
 */

import { useAuthStore } from '@/store';

/**
 * 检查用户是否有指定权限
 */
export function usePermission() {
  const { user } = useAuthStore();

  /**
   * 判断是否有某个权限
   * @param permission 权限标识，如 'user:create'
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // 如果是超级管理员，拥有所有权限
    if (user.roleName === '超级管理员' || user.username === 'admin') {
      return true;
    }

    // 这里应该从用户信息中获取权限列表进行判断
    // 示例实现：假设 user 中有 permissions 字段
    // return user.permissions?.includes(permission) || false;

    // 临时实现：默认返回 true（实际项目中应该从后端获取权限列表）
    return true;
  };

  /**
   * 判断是否有任一权限
   * @param permissions 权限标识数组
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  /**
   * 判断是否有所有权限
   * @param permissions 权限标识数组
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
