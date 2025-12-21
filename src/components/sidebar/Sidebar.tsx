'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItem } from '@/types/admin'
import styles from './sidebar.module.css'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

// 菜单数据
const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: '仪表盘',
    icon: '📊',
    href: '/dashboard'
  },
  {
    id: 'users',
    title: '用户管理',
    icon: '👥',
    children: [
      { id: 'user-list', title: '用户列表', icon: '📋', href: '/dashboard/users' },
      { id: 'user-roles', title: '角色管理', icon: '🔐', href: '/dashboard/users/roles' }
    ]
  },
  {
    id: 'content',
    title: '内容管理',
    icon: '📝',
    children: [
      { id: 'articles', title: '文章管理', icon: '📄', href: '/dashboard/articles' },
      { id: 'categories', title: '分类管理', icon: '🏷️', href: '/dashboard/categories' }
    ]
  },
  {
    id: 'analytics',
    title: '数据分析',
    icon: '📈',
    href: '/dashboard/analytics'
  },
  {
    id: 'settings',
    title: '系统设置',
    icon: '⚙️',
    children: [
      { id: 'general', title: '基本设置', icon: '🔧', href: '/dashboard/settings/general' },
      { id: 'security', title: '安全设置', icon: '🛡️', href: '/dashboard/settings/security' }
    ]
  }
]

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['users'])
  const pathname = usePathname()

  // 切换子菜单展开状态
  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  // 检查菜单项是否激活
  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href || pathname.startsWith(href + '/')
  }

  // 渲染菜单项
  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.id)
    const active = isActive(item.href)

    if (hasChildren) {
      return (
        <div key={item.id} className={styles.menuGroup}>
          <button
            className={`${styles.menuItem} ${styles.menuParent} ${level > 0 ? styles.subItem : ''}`}
            onClick={() => toggleExpanded(item.id)}
          >
            <span className={styles.menuIcon}>{item.icon}</span>
            {!isCollapsed && (
              <>
                <span className={styles.menuTitle}>{item.title}</span>
                <span className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}>
                  ▼
                </span>
              </>
            )}
          </button>
          
          {!isCollapsed && isExpanded && (
            <div className={styles.subMenu}>
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.id}
        href={item.href || '#'}
        className={`${styles.menuItem} ${active ? styles.active : ''} ${level > 0 ? styles.subItem : ''}`}
      >
        <span className={styles.menuIcon}>{item.icon}</span>
        {!isCollapsed && (
          <span className={styles.menuTitle}>{item.title}</span>
        )}
        {item.badge && !isCollapsed && (
          <span className={styles.badge}>{item.badge}</span>
        )}
      </Link>
    )
  }

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* 侧边栏头部 */}
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🔐</span>
          {!isCollapsed && (
            <span className={styles.logoText}>管理系统</span>
          )}
        </div>
        <button
          className={styles.toggleButton}
          onClick={onToggle}
          title={isCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* 导航菜单 */}
      <nav className={styles.nav}>
        <div className={styles.menuList}>
          {menuItems.map(item => renderMenuItem(item))}
        </div>
      </nav>

      {/* 侧边栏底部 */}
      {!isCollapsed && (
        <div className={styles.footer}>
          <div className={styles.version}>
            <span className={styles.versionLabel}>版本</span>
            <span className={styles.versionNumber}>v1.0.0</span>
          </div>
        </div>
      )}
    </aside>
  )
}
