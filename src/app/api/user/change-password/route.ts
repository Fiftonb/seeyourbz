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

    const { currentPassword, newPassword, confirmPassword } = await request.json()

    // 验证输入
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: '新密码和确认密码不匹配' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: '新密码长度至少为6位' },
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

    // 检查新密码是否与当前密码相同
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      return NextResponse.json(
        { error: '新密码不能与当前密码相同' },
        { status: 400 }
      )
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // 更新密码
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({
      message: '密码修改成功'
    })

  } catch (error) {
    console.error('修改密码错误:', error)
    return NextResponse.json(
      { error: '修改密码失败' },
      { status: 500 }
    )
  }
} 