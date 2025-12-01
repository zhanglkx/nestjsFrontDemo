/**
 * 全局常量定义
 */

// Token 存储键
export const TOKEN_KEY = 'admin_token';

// 用户信息存储键
export const USER_INFO_KEY = 'admin_user_info';

// API 响应码
export const API_CODE = {
  SUCCESS: 200,
  CREATED: 201, // 创建成功
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// 用户状态
export const USER_STATUS = {
  DISABLED: 0,
  NORMAL: 1,
};

// 菜单类型
export const MENU_TYPE = {
  DIRECTORY: 0,
  MENU: 1,
  BUTTON: 2,
};

// 分页默认配置
export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
