/**
 * 权限按钮组件
 * 根据权限显示/隐藏按钮
 */

import { ReactNode } from 'react';
import { usePermission } from '@/hooks/usePermission';

interface PermissionButtonProps {
  permission: string;
  children: ReactNode;
}

export default function PermissionButton({ permission, children }: PermissionButtonProps) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return null;
  }

  return <>{children}</>;
}
