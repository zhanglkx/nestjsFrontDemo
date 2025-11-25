/**
 * 数据格式化工具函数
 */

import dayjs from 'dayjs';

/**
 * 格式化日期时间
 */
export function formatDateTime(
  date: string | Date,
  format: string = 'YYYY-MM-DD HH:mm:ss'
): string {
  if (!date) return '-';
  return dayjs(date).format(format);
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date): string {
  return formatDateTime(date, 'YYYY-MM-DD');
}

/**
 * 格式化时间
 */
export function formatTime(date: string | Date): string {
  return formatDateTime(date, 'HH:mm:ss');
}

/**
 * 格式化金额
 */
export function formatMoney(amount: number, decimals: number = 2): string {
  if (amount === null || amount === undefined) return '0.00';
  return amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * 手机号脱敏
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 邮箱脱敏
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }
  return `${name.slice(0, 2)}***@${domain}`;
}
