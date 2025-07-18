import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

// 标记此路由为动态路由
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  try {
    // 验证用户登录状态
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    const { name } = await request.json()

    // 验证输入
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '用户名不能为空' },
        { status: 400 }
      )
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: '用户名长度不能超过50个字符' },
        { status: 400 }
      )
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: '个人资料更新成功',
      user: updatedUser
    })

  } catch (error) {
    console.error('更新个人资料错误:', error)
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    )
  }
} 