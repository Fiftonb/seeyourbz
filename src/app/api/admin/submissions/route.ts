import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

// 标记此路由为动态路由
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getSession()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    // 检查用户是否为管理员
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true }
    })

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: '无权限访问' },
        { status: 403 }
      )
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const type = searchParams.get('type') // 筛选类型
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {}
    if (type) {
      where.type = type
    }
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate)
      }
    }

    // 获取提交记录
    const [submissions, total] = await Promise.all([
      prisma.userSubmission.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.userSubmission.count({ where })
    ])

    // 处理数据，解析JSON字段
    const processedSubmissions = submissions.map(submission => ({
      ...submission,
      inputData: JSON.parse(submission.inputData),
      resultData: submission.resultData ? JSON.parse(submission.resultData) : null
    }))

    return NextResponse.json({
      submissions: processedSubmissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('获取提交记录失败:', error)
    return NextResponse.json(
      { error: '获取失败' },
      { status: 500 }
    )
  }
} 