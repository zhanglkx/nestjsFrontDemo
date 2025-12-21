'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import styles from './header.module.css'

interface HeaderProps {
  title?: string
  isSidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function Header({ 
  title = '仪表盘', 
  isSidebarCollapsed, 
  onToggleSidebar 
}: HeaderProps) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  // 模拟通知数据
  const notifications = [
    { id: 1, title: '新用户注册', message: '用户 张三 刚刚注册了账户', time: '2分钟前', unread: true },
    { id: 2, title: '系统更新', message: '系统将在今晚进行维护更新', time: '1小时前', unread: true },
    { id: 3, title: '数据备份完成', message: '今日数据备份已成功完成', time: '3小时前', unread: false }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <header className={styles.header}>
      {/* 左侧区域 */}
      <div className={styles.left}>
        <button
          className={styles.menuToggle}
          onClick={onToggleSidebar}
          title={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <span className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <h1 className={styles.title}>{title}</h1>
      </div>

      {/* 右侧区域 */}
      <div className={styles.right}>
        {/* 搜索框 */}
        <div className={styles.search}>
          <input
            type="text"
            placeholder="搜索..."
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        {/* 通知 */}
        <div className={styles.notification}>
          <button
            className={styles.notificationButton}
            onClick={() => setShowNotifications(!showNotifications)}
            title="通知"
          >
            <span className={styles.notificationIcon}>🔔</span>
            {unreadCount > 0 && (
              <span className={styles.notificationBadge}>{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <h3>通知</h3>
                <button className={styles.markAllRead}>全部标记为已读</button>
              </div>
              <div className={styles.notificationList}>
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`${styles.notificationItem} ${
                      notification.unread ? styles.unread : ''
                    }`}
                  >
                    <div className={styles.notificationContent}>
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <span className={styles.notificationTime}>
                        {notification.time}
                      </span>
                    </div>
                    {notification.unread && (
                      <div className={styles.unreadDot}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.notificationFooter}>
                <button className={styles.viewAll}>查看全部通知</button>
              </div>
            </div>
          )}
        </div>

        {/* 用户菜单 */}
        <div className={styles.userMenu}>
          <button
            className={styles.userButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}>
              {user?.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <span>{user?.username?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.username}</span>
              <span className={styles.userRole}>{user?.role}</span>
            </div>
            <span className={styles.dropdownIcon}>▼</span>
          </button>

          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userDropdownHeader}>
                <div className={styles.userAvatarLarge}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span>{user?.username?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className={styles.userDetails}>
                  <h3>{user?.username}</h3>
                  <p>{user?.email}</p>
                </div>
              </div>
              
              <div className={styles.userDropdownMenu}>
                <button className={styles.menuItem}>
                  <span className={styles.menuIcon}>👤</span>
                  个人资料
                </button>
                <button className={styles.menuItem}>
                  <span className={styles.menuIcon}>⚙️</span>
                  账户设置
                </button>
                <button className={styles.menuItem}>
                  <span className={styles.menuIcon}>🌙</span>
                  主题设置
                </button>
                <hr className={styles.divider} />
                <button className={styles.menuItem} onClick={handleLogout}>
                  <span className={styles.menuIcon}>🚪</span>
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 点击外部关闭下拉菜单 */}
      {(showUserMenu || showNotifications) && (
        <div
          className={styles.overlay}
          onClick={() => {
            setShowUserMenu(false)
            setShowNotifications(false)
          }}
        />
      )}
    </header>
  )
}
