import { StatCard, ChartData, ChartConfig, Activity, QuickAction, DashboardData } from '@/types/admin'

// 统计卡片数据
export const mockStats: StatCard[] = [
  {
    id: 'users',
    title: '总用户数',
    value: '12,345',
    change: 12.5,
    changeType: 'increase',
    icon: '👥',
    color: 'blue'
  },
  {
    id: 'revenue',
    title: '月收入',
    value: '¥89,432',
    change: 8.2,
    changeType: 'increase',
    icon: '💰',
    color: 'green'
  },
  {
    id: 'orders',
    title: '订单数量',
    value: '2,847',
    change: -3.1,
    changeType: 'decrease',
    icon: '📦',
    color: 'orange'
  },
  {
    id: 'conversion',
    title: '转化率',
    value: '3.24%',
    change: 0.8,
    changeType: 'increase',
    icon: '📈',
    color: 'red'
  }
]

// 图表数据
const generateChartData = (days: number): ChartData[] => {
  const data: ChartData[] = []
  const today = new Date()
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    data.push({
      name: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      value: Math.floor(Math.random() * 1000) + 500,
      date: date.toISOString()
    })
  }
  
  return data
}

export const mockCharts: ChartConfig[] = [
  {
    type: 'line',
    title: '用户增长趋势',
    data: generateChartData(7),
    xKey: 'name',
    yKey: 'value',
    color: '#3b82f6'
  },
  {
    type: 'bar',
    title: '每日订单量',
    data: generateChartData(7),
    xKey: 'name',
    yKey: 'value',
    color: '#10b981'
  }
]

// 活动记录数据
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'login',
    title: '用户登录',
    description: '管理员 admin 登录了系统',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    user: 'admin',
    icon: '🔐'
  },
  {
    id: '2',
    type: 'create',
    title: '创建用户',
    description: '新增用户 "张三" 到系统',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    user: 'admin',
    icon: '👤'
  },
  {
    id: '3',
    type: 'update',
    title: '更新设置',
    description: '修改了系统安全设置',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: 'manager',
    icon: '⚙️'
  },
  {
    id: '4',
    type: 'delete',
    title: '删除文件',
    description: '删除了过期的日志文件',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    user: 'admin',
    icon: '🗑️'
  },
  {
    id: '5',
    type: 'system',
    title: '系统备份',
    description: '自动备份任务执行成功',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    user: 'system',
    icon: '💾'
  },
  {
    id: '6',
    type: 'create',
    title: '发布文章',
    description: '发布了新文章 "产品更新说明"',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    user: 'manager',
    icon: '📝'
  }
]

// 快捷操作数据
export const mockQuickActions: QuickAction[] = [
  {
    id: 'add-user',
    title: '添加用户',
    description: '创建新的系统用户',
    icon: '👤',
    color: 'blue',
    href: '/dashboard/users/new'
  },
  {
    id: 'create-post',
    title: '发布文章',
    description: '创建新的文章内容',
    icon: '📝',
    color: 'green',
    href: '/dashboard/articles/new'
  },
  {
    id: 'view-analytics',
    title: '查看分析',
    description: '查看详细数据分析',
    icon: '📊',
    color: 'orange',
    href: '/dashboard/analytics'
  },
  {
    id: 'system-settings',
    title: '系统设置',
    description: '配置系统参数',
    icon: '⚙️',
    color: 'red',
    href: '/dashboard/settings'
  },
  {
    id: 'backup-data',
    title: '数据备份',
    description: '手动备份系统数据',
    icon: '💾',
    color: 'blue',
    onClick: () => {
      alert('备份功能开发中...')
    }
  },
  {
    id: 'send-notification',
    title: '发送通知',
    description: '向用户发送系统通知',
    icon: '📢',
    color: 'green',
    onClick: () => {
      alert('通知功能开发中...')
    }
  }
]

// 获取Dashboard数据的函数
export function getDashboardData(): Promise<DashboardData> {
  // 模拟API延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: mockStats,
        charts: mockCharts,
        activities: mockActivities,
        quickActions: mockQuickActions
      })
    }, 500)
  })
}

// 格式化时间的工具函数
export function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  }
}

// 格式化数字的工具函数
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}
