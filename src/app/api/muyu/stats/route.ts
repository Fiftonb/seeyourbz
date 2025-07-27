import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const STATS_FILE_PATH = path.join(process.cwd(), 'data', 'muyu-stats.json')

interface MuyuGlobalStats {
  totalTaps: number
  lastUpdated: string
  dailyStats: Record<string, number>
}

// 确保数据目录存在
function ensureDataDirectory() {
  const dataDir = path.dirname(STATS_FILE_PATH)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// 读取统计数据
function readStats(): MuyuGlobalStats {
  ensureDataDirectory()
  
  if (!fs.existsSync(STATS_FILE_PATH)) {
    const initialStats: MuyuGlobalStats = {
      totalTaps: 0,
      lastUpdated: new Date().toISOString(),
      dailyStats: {}
    }
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(initialStats, null, 2))
    return initialStats
  }

  try {
    const data = fs.readFileSync(STATS_FILE_PATH, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('读取统计文件失败:', error)
    return {
      totalTaps: 0,
      lastUpdated: new Date().toISOString(),
      dailyStats: {}
    }
  }
}

// 写入统计数据
function writeStats(stats: MuyuGlobalStats) {
  ensureDataDirectory()
  
  try {
    fs.writeFileSync(STATS_FILE_PATH, JSON.stringify(stats, null, 2))
  } catch (error) {
    console.error('写入统计文件失败:', error)
  }
}

// GET - 获取统计数据
export async function GET() {
  try {
    const stats = readStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}

// POST - 更新统计数据
export async function POST(request: NextRequest) {
  try {
    const { increment } = await request.json()
    
    if (typeof increment !== 'number' || increment <= 0) {
      return NextResponse.json(
        { error: '无效的参数' },
        { status: 400 }
      )
    }

    const stats = readStats()
    const today = new Date().toDateString()
    
    // 累加全局统计（所有用户的敲击总数）
    stats.totalTaps += increment
    stats.lastUpdated = new Date().toISOString()
    
    // 累加今日统计
    if (!stats.dailyStats[today]) {
      stats.dailyStats[today] = 0
    }
    stats.dailyStats[today] += increment

    // 保持最近30天的数据
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    Object.keys(stats.dailyStats).forEach(date => {
      if (new Date(date) < thirtyDaysAgo) {
        delete stats.dailyStats[date]
      }
    })

    writeStats(stats)

    return NextResponse.json({
      success: true,
      stats: stats
    })
  } catch (error) {
    console.error('更新统计数据失败:', error)
    return NextResponse.json(
      { error: '更新统计数据失败' },
      { status: 500 }
    )
  }
} 