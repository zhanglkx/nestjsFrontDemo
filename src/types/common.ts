/**
 * 通用类型定义
 */

export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PageParams {
  page?: number;
  pageSize?: number;
}

export interface PageResponse<T = unknown> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
