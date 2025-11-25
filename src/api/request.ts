/**
 * Axios 请求封装
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';
import { getToken, removeToken } from '@/utils/token';
import { API_CODE } from '@/constants';
import type { ApiResponse } from '@/types';

// 创建 axios 实例
const request: AxiosInstance = axios.create({
  baseURL: '/api', // 通过 Vite 代理转发到后端
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 自动添加 token
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;

    // 如果返回的是二进制数据（文件下载等），直接返回
    if (response.config.responseType === 'blob') {
      return response;
    }

    // 统一处理业务错误码
    if (data.code !== API_CODE.SUCCESS) {
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }

    return response;
  },
  (error: AxiosError<ApiResponse>) => {
    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case API_CODE.UNAUTHORIZED:
          message.error('登录已过期，请重新登录');
          removeToken();
          // 跳转到登录页
          window.location.href = '/login';
          break;
        case API_CODE.FORBIDDEN:
          message.error('没有权限访问该资源');
          break;
        case API_CODE.NOT_FOUND:
          message.error('请求的资源不存在');
          break;
        case API_CODE.SERVER_ERROR:
          message.error(data?.message || '服务器错误，请稍后重试');
          break;
        default:
          message.error(data?.message || '请求失败');
      }
    } else if (error.request) {
      message.error('网络错误，请检查网络连接');
    } else {
      message.error('请求配置错误');
    }

    return Promise.reject(error);
  }
);

/**
 * GET 请求
 */
export function get<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request.get<ApiResponse<T>>(url, config).then((res) => res.data.data);
}

/**
 * POST 请求
 */
export function post<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return request.post<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
}

/**
 * PUT 请求
 */
export function put<T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  return request.put<ApiResponse<T>>(url, data, config).then((res) => res.data.data);
}

/**
 * DELETE 请求
 */
export function del<T = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return request.delete<ApiResponse<T>>(url, config).then((res) => res.data.data);
}

export default request;
