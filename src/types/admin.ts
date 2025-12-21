// 用户信息接口
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'manager'
  createdAt: string
  lastLogin?: string
}

// 登录请求和响应
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: User
  message?: string
}

// Dashboard统计数据
export interface StatCard {
  id: string
  title: string
  value: number | string
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: string
  color: 'blue' | 'green' | 'orange' | 'red'
}

// 图表数据
export interface ChartData {
  name: string
  value: number
  date?: string
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'area'
  title: string
  data: ChartData[]
  xKey: string
  yKey: string
  color: string
}

// 活动记录
export interface Activity {
  id: string
  type: 'login' | 'create' | 'update' | 'delete' | 'system'
  title: string
  description: string
  timestamp: string
  user: string
  icon: string
}

// 快捷操作
export interface QuickAction {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href?: string
  onClick?: () => void
}

// 导航菜单项
export interface MenuItem {
  id: string
  title: string
  icon: string
  href?: string
  children?: MenuItem[]
  badge?: number
}

// API响应通用格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

// Dashboard页面数据
export interface DashboardData {
  stats: StatCard[]
  charts: ChartConfig[]
  activities: Activity[]
  quickActions: QuickAction[]
}
