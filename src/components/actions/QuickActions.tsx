'use client'

import Link from 'next/link'
import { QuickAction } from '@/types/admin'
import styles from './quick-actions.module.css'

interface QuickActionsProps {
  actions: QuickAction[]
}

export default function QuickActions({ actions }: QuickActionsProps) {
  const handleActionClick = (action: QuickAction) => {
    if (action.onClick) {
      action.onClick()
    }
  }

  const renderAction = (action: QuickAction) => {
    const content = (
      <>
        <div className={`${styles.actionIcon} ${styles[action.color]}`}>
          {action.icon}
        </div>
        <div className={styles.actionContent}>
          <h4 className={styles.actionTitle}>{action.title}</h4>
          <p className={styles.actionDescription}>{action.description}</p>
        </div>
        <div className={styles.actionArrow}>→</div>
      </>
    )

    if (action.href) {
      return (
        <Link
          key={action.id}
          href={action.href}
          className={styles.actionItem}
        >
          {content}
        </Link>
      )
    }

    return (
      <button
        key={action.id}
        className={styles.actionItem}
        onClick={() => handleActionClick(action)}
      >
        {content}
      </button>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>快捷操作</h3>
        <span className={styles.subtitle}>常用功能快速访问</span>
      </div>
      
      <div className={styles.actionGrid}>
        {actions.map(action => renderAction(action))}
      </div>
      
      {actions.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⚡</div>
          <p className={styles.emptyText}>暂无快捷操作</p>
        </div>
      )}
    </div>
  )
}
