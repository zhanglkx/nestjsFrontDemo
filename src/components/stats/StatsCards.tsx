'use client'

import { StatCard } from '@/types/admin'
import styles from './stats-cards.module.css'

interface StatsCardsProps {
  stats: StatCard[]
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const getChangeIcon = (changeType: StatCard['changeType']) => {
    switch (changeType) {
      case 'increase':
        return '↗️'
      case 'decrease':
        return '↘️'
      default:
        return '➡️'
    }
  }

  const getChangeClass = (changeType: StatCard['changeType']) => {
    switch (changeType) {
      case 'increase':
        return styles.increase
      case 'decrease':
        return styles.decrease
      default:
        return styles.neutral
    }
  }

  return (
    <div className={styles.container}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`${styles.card} ${styles[stat.color]}`}
        >
          <div className={styles.header}>
            <div className={styles.icon}>
              {stat.icon}
            </div>
            <div className={styles.change}>
              <span className={getChangeClass(stat.changeType)}>
                {getChangeIcon(stat.changeType)}
                {Math.abs(stat.change)}%
              </span>
            </div>
          </div>
          
          <div className={styles.content}>
            <h3 className={styles.title}>{stat.title}</h3>
            <div className={styles.value}>{stat.value}</div>
          </div>
          
          <div className={styles.footer}>
            <span className={styles.changeText}>
              {stat.changeType === 'increase' ? '较上月增长' : 
               stat.changeType === 'decrease' ? '较上月下降' : '较上月持平'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
