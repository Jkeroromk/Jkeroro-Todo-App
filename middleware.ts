import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查用户是否已经登录
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // 如果用户访问 /app 路径但未登录，重定向到登录页面
  if (pathname.startsWith("/app") && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // 如果用户已登录并访问登录页面，重定向到应用页面
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/app", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/login"],
}

