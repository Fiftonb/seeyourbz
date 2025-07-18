import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
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

    const { newEmail, currentPassword } = await request.json()

    // 验证输入
    if (!newEmail || !currentPassword) {
      return NextResponse.json(
        { error: '新邮箱和当前密码都是必填的' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      return NextResponse.json(
        { error: '邮箱格式不正确' },
        { status: 400 }
      )
    }

    // 获取用户当前信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      )
    }

    // 验证当前密码
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '当前密码不正确' },
        { status: 400 }
      )
    }

    // 检查新邮箱是否与当前邮箱相同
    if (newEmail.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json(
        { error: '新邮箱不能与当前邮箱相同' },
        { status: 400 }
      )
    }

    // 检查新邮箱是否已被其他用户使用
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被其他用户使用' },
        { status: 400 }
      )
    }

    // 更新邮箱
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { email: newEmail.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: '邮箱修改成功',
      user: updatedUser
    })

  } catch (error) {
    console.error('修改邮箱错误:', error)
    return NextResponse.json(
      { error: '修改邮箱失败' },
      { status: 500 }
    )
  }
} 