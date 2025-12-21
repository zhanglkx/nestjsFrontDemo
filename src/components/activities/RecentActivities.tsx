'use client'

import { Activity } from '@/types/admin'
import { formatTimeAgo } from '@/lib/mockData'
import styles from './recent-activities.module.css'

interface RecentActivitiesProps {
  activities: Activity[]
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  const getActivityTypeClass = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return styles.login
      case 'create':
        return styles.create
      case 'update':
        return styles.update
      case 'delete':
        return styles.delete
      case 'system':
        return styles.system
      default:
        return styles.default
    }
  }

  const getActivityTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'login':
        return '#3b82f6'
      case 'create':
        return '#10b981'
      case 'update':
        return '#f59e0b'
      case 'delete':
        return '#ef4444'
      case 'system':
        return '#6b7280'
      default:
        return '#6b7280'
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>最近活动</h3>
        <button className={styles.viewAllButton}>
          查看全部
        </button>
      </div>
      
      <div className={styles.timeline}>
        {activities.map((activity, index) => (
          <div key={activity.id} className={styles.timelineItem}>
            <div className={styles.timelineMarker}>
              <div 
                className={`${styles.markerDot} ${getActivityTypeClass(activity.type)}`}
                style={{ backgroundColor: getActivityTypeColor(activity.type) }}
              >
                <span className={styles.markerIcon}>{activity.icon}</span>
              </div>
              {index < activities.length - 1 && (
                <div className={styles.timelineLine}></div>
              )}
            </div>
            
            <div className={styles.timelineContent}>
              <div className={styles.activityHeader}>
                <h4 className={styles.activityTitle}>{activity.title}</h4>
                <span className={styles.activityTime}>
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
              
              <p className={styles.activityDescription}>
                {activity.description}
              </p>
              
              <div className={styles.activityMeta}>
                <span className={styles.activityUser}>
                  👤 {activity.user}
                </span>
                <span className={`${styles.activityType} ${getActivityTypeClass(activity.type)}`}>
                  {activity.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📝</div>
          <p className={styles.emptyText}>暂无活动记录</p>
        </div>
      )}
    </div>
  )
}
