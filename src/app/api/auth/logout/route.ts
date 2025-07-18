import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 标记此路由为动态路由
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    // 清除session cookie
    cookies().set('session', '', { 
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https'),
      sameSite: 'strict'
    })

    return NextResponse.json({
      message: '退出登录成功'
    })

  } catch (error) {
    console.error('退出登录错误:', error)
    return NextResponse.json(
      { error: '退出登录失败' },
      { status: 500 }
    )
  }
} 