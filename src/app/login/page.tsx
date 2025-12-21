'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import styles from './login.module.css'

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // 如果已登录，重定向到dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.push(redirect)
    }
  }, [isAuthenticated, router, searchParams])

  // 表单验证
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名'
    }

    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await login(formData)

      if (response.success) {
        const redirect = searchParams.get('redirect') || '/dashboard'
        // 在导航前不清除 isSubmitting，避免组件状态变化导致的 port 断开
        router.push(redirect)
      } else {
        setIsSubmitting(false)
        setErrors({ submit: response.message || '登录失败' })
      }
    } catch (error) {
      setIsSubmitting(false)
      setErrors({ submit: '登录过程中发生错误' })
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>🔐</div>
            <h1 className={styles.title}>后台管理系统</h1>
          </div>
          <p className={styles.subtitle}>请登录您的账户</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              用户名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.username ? styles.inputError : ''}`}
              placeholder="请输入用户名"
              disabled={isSubmitting}
            />
            {errors.username && (
              <span className={styles.error}>{errors.username}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
              placeholder="请输入密码"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className={styles.error}>{errors.password}</span>
            )}
          </div>

          {errors.submit && (
            <div className={styles.submitError}>
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.loading}>
                <span className={styles.spinner}></span>
                登录中...
              </span>
            ) : (
              '登录'
            )}
          </button>
        </form>

        <div className={styles.demo}>
          <p className={styles.demoTitle}>演示账户：</p>
          <div className={styles.demoAccounts}>
            <div className={styles.demoAccount}>
              <strong>管理员：</strong> admin / admin123
            </div>
            <div className={styles.demoAccount}>
              <strong>经理：</strong> manager / manager123
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
