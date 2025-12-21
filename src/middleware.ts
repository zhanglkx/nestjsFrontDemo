import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

// 需要认证的路径
const protectedPaths = ["/dashboard"];

// 认证页面路径
const authPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("admin_token")?.value;

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // 检查是否是认证页面
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));

  // 如果访问受保护的路径
  if (isProtectedPath) {
    // 没有token，重定向到登录页
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 验证token
    const decoded = verifyToken(token);
    if (!decoded) {
      // token无效，重定向到登录页
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);

      // 清除无效的cookie
      response.cookies.delete("admin_token");
      response.cookies.delete("admin_user");

      return response;
    }
  }

  // 如果已登录用户访问登录页，重定向到dashboard
  if (isAuthPath && token) {
    const decoded = verifyToken(token);
    if (decoded) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public文件夹中的文件
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
