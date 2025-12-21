'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/hooks/useAuth'
import { DashboardData } from '@/types/admin'
import { getDashboardData } from '@/lib/mockData'
import Sidebar from '@/components/sidebar/Sidebar'
import Header from '@/components/header/Header'
import StatsCards from '@/components/stats/StatsCards'
import Charts from '@/components/charts/Charts'
import RecentActivities from '@/components/activities/RecentActivities'
import QuickActions from '@/components/actions/QuickActions'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // 加载Dashboard数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const data = await getDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('加载Dashboard数据失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // 切换侧边栏状态
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthGuard fallback={
      <div className={styles.authFallback}>
        <p>请先登录...</p>
      </div>
    }>
      <div className={styles.dashboardLayout}>
        {/* 侧边栏 */}
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />

        {/* 主内容区域 */}
        <div className={`${styles.mainContent} ${isSidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
          {/* 头部 */}
          <Header 
            title="仪表盘"
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={toggleSidebar}
          />

          {/* 内容区域 */}
          <main className={styles.content}>
            <div className={styles.container}>
              {/* 欢迎区域 */}
              <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>欢迎回来！</h1>
                <p className={styles.welcomeSubtitle}>
                  这里是您的管理控制台，您可以查看系统概况和执行各种管理操作。
                </p>
              </div>

              {/* 统计卡片 */}
              {dashboardData?.stats && (
                <StatsCards stats={dashboardData.stats} />
              )}

              {/* 图表和活动的网格布局 */}
              <div className={styles.gridLayout}>
                {/* 图表区域 */}
                <div className={styles.chartsSection}>
                  {dashboardData?.charts && (
                    <Charts charts={dashboardData.charts} />
                  )}
                </div>

                {/* 右侧栏 */}
                <div className={styles.sidebar}>
                  {/* 最近活动 */}
                  {dashboardData?.activities && (
                    <div className={styles.activitiesSection}>
                      <RecentActivities activities={dashboardData.activities} />
                    </div>
                  )}
                </div>
              </div>

              {/* 快捷操作 */}
              {dashboardData?.quickActions && (
                <div className={styles.actionsSection}>
                  <QuickActions actions={dashboardData.quickActions} />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
