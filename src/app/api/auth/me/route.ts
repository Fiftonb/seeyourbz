import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: session.user
    })

  } catch (error) {
    console.error('获取用户信息错误:', error)
    return NextResponse.json(
      { error: '获取用户信息失败' },
      { status: 500 }
    )
  }
} 