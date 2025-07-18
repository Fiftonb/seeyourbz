import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

// 标记此路由为动态路由
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { type, inputData, resultData } = await request.json()

    // 验证提交类型
    const allowedTypes = ['peach-blossom', 'destiny']
    if (!allowedTypes.includes(type)) {
      return NextResponse.json(
        { error: '不支持的提交类型' },
        { status: 400 }
      )
    }

    // 获取用户IP地址
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : 
                     request.headers.get('x-real-ip') || 
                     request.ip || 
                     'unknown'

    // 获取用户代理信息
    const userAgent = request.headers.get('user-agent') || undefined

    // 获取当前登录用户（如果有）
    let userId = null
    try {
      const session = await getSession()
      if (session?.user?.id) {
        userId = session.user.id
      }
    } catch (error) {
      // 用户未登录，继续处理
    }

    // 记录提交信息
    const submission = await prisma.userSubmission.create({
      data: {
        type,
        ipAddress,
        userAgent,
        inputData: JSON.stringify(inputData),
        resultData: resultData ? JSON.stringify(resultData) : null,
        userId
      }
    })

    return NextResponse.json({
      success: true,
      submissionId: submission.id
    })

  } catch (error) {
    console.error('记录用户提交失败:', error)
    return NextResponse.json(
      { error: '记录失败' },
      { status: 500 }
    )
  }
} 