import Cookies from "js-cookie";
import { User, LoginRequest, LoginResponse } from "@/types/admin";

// 简单的密钥 - 在生产环境中应该使用环境变量和真正的JWT
const AUTH_SECRET = process.env.JWT_SECRET || "your-secret-key-here";
const TOKEN_COOKIE_NAME = "admin_token";
const USER_COOKIE_NAME = "admin_user";

// 模拟用户数据 - 在实际项目中应该从数据库获取
const MOCK_USERS = [
  {
    id: "1",
    username: "admin",
    password: "admin123", // 在实际项目中应该是加密的密码
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
    role: "admin" as const,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
  {
    id: "2",
    username: "manager",
    password: "manager123",
    email: "manager@example.com",
    avatar: "/avatars/manager.jpg",
    role: "manager" as const,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  },
];

/**
 * 生成客户端兼容的 Token
 * 注意：这是一个简化的实现，生产环境应该使用真正的JWT和服务器端验证
 */
export function generateToken(user: Omit<User, "password">): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000), // 签发时间
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7天后过期
  };
  
  // 使用 base64 编码（生产环境应该使用真正的签名）
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = btoa(AUTH_SECRET + encodedPayload).slice(0, 32); // 简单签名
  
  return `${encodedPayload}.${signature}`;
}

/**
 * 验证客户端 Token
 * 注意：这是一个简化的实现，生产环境应该使用真正的JWT和服务器端验证
 */
export function verifyToken(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    
    const [encodedPayload, signature] = parts;
    
    // 验证签名
    const expectedSignature = btoa(AUTH_SECRET + encodedPayload).slice(0, 32);
    if (signature !== expectedSignature) return null;
    
    // 解码 payload
    const payload = JSON.parse(atob(encodedPayload));
    
    // 检查是否过期
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    
    return payload;
  } catch (error) {
    console.error('Token 验证失败:', error);
    return null;
  }
}

/**
 * 用户登录
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = MOCK_USERS.find((u) => u.username === credentials.username && u.password === credentials.password);

  if (!user) {
    return {
      success: false,
      message: "用户名或密码错误",
    };
  }

  // 生成token
  const { password, ...userWithoutPassword } = user;
  const token = generateToken(userWithoutPassword);

  // 更新最后登录时间
  user.lastLogin = new Date().toISOString();

  return {
    success: true,
    token,
    user: userWithoutPassword,
    message: "登录成功",
  };
}

/**
 * 保存认证信息到Cookie
 */
export function saveAuthToCookie(token: string, user: User): void {
  // 设置Cookie，7天过期
  const cookieOptions = {
    expires: 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  Cookies.set(TOKEN_COOKIE_NAME, token, cookieOptions);
  Cookies.set(USER_COOKIE_NAME, JSON.stringify(user), cookieOptions);
}

/**
 * 从Cookie获取认证信息
 */
export function getAuthFromCookie(): { token: string | null; user: User | null } {
  const token = Cookies.get(TOKEN_COOKIE_NAME) || null;
  const userStr = Cookies.get(USER_COOKIE_NAME);

  let user: User | null = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (error) {
      console.error("解析用户信息失败:", error);
    }
  }

  return { token, user };
}

/**
 * 清除认证信息
 */
export function clearAuth(): void {
  Cookies.remove(TOKEN_COOKIE_NAME);
  Cookies.remove(USER_COOKIE_NAME);
}

/**
 * 检查用户是否已认证
 */
export function isAuthenticated(): boolean {
  const { token } = getAuthFromCookie();
  if (!token) return false;

  const decoded = verifyToken(token);
  return decoded !== null;
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser(): User | null {
  const { user, token } = getAuthFromCookie();

  if (!user || !token) return null;

  // 验证token是否有效
  const decoded = verifyToken(token);
  if (!decoded) {
    clearAuth();
    return null;
  }

  return user;
}

/**
 * 刷新Token（可选实现）
 */
export async function refreshToken(): Promise<string | null> {
  const { token } = getAuthFromCookie();
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  // 生成新的token
  const newToken = generateToken(decoded);

  // 更新Cookie中的token
  const { user } = getAuthFromCookie();
  if (user) {
    saveAuthToCookie(newToken, user);
  }

  return newToken;
}
