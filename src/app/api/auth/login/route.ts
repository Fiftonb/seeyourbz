import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'

// 标记此路由为动态路由
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 401 }
      )
    }

    // 验证密码
    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json(
        { error: '密码错误' },
        { status: 401 }
      )
    }

    // 设置固定的过期时间：7天
    const expiresIn = 7 * 24 * 60 * 60 * 1000
    const expires = new Date(Date.now() + expiresIn)
    
    const session = await encrypt({ 
      user: { id: user.id, email: user.email, name: user.name }, 
      expires 
    })

    // 设置cookie
    cookies().set('session', session, { 
      expires, 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https'),
      sameSite: 'strict'
    })

    return NextResponse.json({
      message: '登录成功',
      user: { id: user.id, email: user.email, name: user.name }
    })

  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: '登录失败' },
      { status: 500 }
    )
  }
} 