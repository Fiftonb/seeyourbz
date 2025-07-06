import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // 获取当前路径
  const path = request.nextUrl.pathname
  
  // 定义需要保护的路由
  const protectedRoutes = ['/dashboard', '/profile', '/calendar']
  const authRoutes = ['/login', '/register']
  
  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))
  
  // 获取session
  const session = request.cookies.get('session')?.value
  
  // 如果访问受保护的路由但没有session，重定向到登录页
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 如果访问认证路由但已经有session，重定向到首页
  if (isAuthRoute && session) {
    try {
      await decrypt(session)
      return NextResponse.redirect(new URL('/', request.url))
    } catch (error) {
      // session无效，继续到认证页面
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 