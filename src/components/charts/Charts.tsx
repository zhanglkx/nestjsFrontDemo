'use client'

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartConfig } from '@/types/admin'
import styles from './charts.module.css'

interface ChartsProps {
  charts: ChartConfig[]
}

export default function Charts({ charts }: ChartsProps) {
  const renderChart = (config: ChartConfig) => {
    const commonProps = {
      data: config.data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    switch (config.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey={config.xKey} 
                stroke="var(--text-muted)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--text-muted)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={config.yKey} 
                stroke={config.color}
                strokeWidth={2}
                dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: config.color, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis 
                dataKey={config.xKey} 
                stroke="var(--text-muted)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--text-muted)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Bar 
                dataKey={config.yKey} 
                fill={config.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )
      
      default:
        return <div>不支持的图表类型</div>
    }
  }

  return (
    <div className={styles.container}>
      {charts.map((chart, index) => (
        <div key={index} className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <h3 className={styles.chartTitle}>{chart.title}</h3>
            <div className={styles.chartActions}>
              <button className={styles.actionButton} title="刷新数据">
                🔄
              </button>
              <button className={styles.actionButton} title="导出数据">
                📊
              </button>
              <button className={styles.actionButton} title="更多选项">
                ⋯
              </button>
            </div>
          </div>
          
          <div className={styles.chartContent}>
            {renderChart(chart)}
          </div>
          
          <div className={styles.chartFooter}>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div 
                  className={styles.legendColor}
                  style={{ backgroundColor: chart.color }}
                ></div>
                <span className={styles.legendLabel}>数据趋势</span>
              </div>
            </div>
            <div className={styles.chartMeta}>
              <span className={styles.metaText}>
                最近7天数据
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
