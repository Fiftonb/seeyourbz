import { NextRequest, NextResponse } from 'next/server'
import { LifeKLineRequest, BAZI_SYSTEM_INSTRUCTION } from '@/lib/life-kline/types'

// 判断天干阴阳
const getStemPolarity = (pillar: string): 'YANG' | 'YIN' => {
  if (!pillar) return 'YANG'
  const firstChar = pillar.trim().charAt(0)
  const yangStems = ['甲', '丙', '戊', '庚', '壬']
  const yinStems = ['乙', '丁', '己', '辛', '癸']

  if (yangStems.includes(firstChar)) return 'YANG'
  if (yinStems.includes(firstChar)) return 'YIN'
  return 'YANG'
}

export async function POST(request: NextRequest) {
  try {
    const body: LifeKLineRequest = await request.json()

    const {
      apiKey,
      apiBaseUrl,
      modelName,
      gender,
      birthYear,
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      startAge,
      firstDaYun,
      name
    } = body

    // 验证必填字段
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json({
        success: false,
        error: '请填写有效的 API Key'
      }, { status: 400 })
    }

    if (!apiBaseUrl || !apiBaseUrl.trim()) {
      return NextResponse.json({
        success: false,
        error: '请填写有效的 API Base URL'
      }, { status: 400 })
    }

    // 清理URL
    const cleanBaseUrl = apiBaseUrl.replace(/\/+$/, '')
    const targetModel = modelName && modelName.trim() ? modelName.trim() : 'gpt-4o'

    // 计算大运顺逆
    const genderStr = gender === 'MAN' ? '男 (乾造)' : '女 (坤造)'

    // --- 核心逻辑优化：生成确定性的时间轴上下文 ---

    // 1. 生成六十甲子表
    const HEAVEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    const EARTH_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    const SIXTY_CYCLE: string[] = []
    for (let i = 0; i < 60; i++) {
      SIXTY_CYCLE.push(HEAVEN_STEMS[i % 10] + EARTH_BRANCHES[i % 12])
    }

    // 2. 找到出生年干支索引
    const startYearIndex = SIXTY_CYCLE.indexOf(yearPillar)
    if (startYearIndex === -1) {
      throw new Error(`无效的年柱: ${yearPillar}`)
    }

    // 3. 构建简化的时间轴说明（避免过长的prompt）
    const decadeFortunes = body.decadeFortunes || []

    // 简单的查找大运函数
    const findDaYun = (age: number): string => {
      if (age < startAge) return "童限 (Waiting)"
      const fortune = decadeFortunes.find(d => age >= d.startAge && age <= d.endAge)
      return fortune ? fortune.ganZhi : (decadeFortunes[decadeFortunes.length - 1]?.ganZhi || "晚年")
    }

    // 生成示例数据（前10年 + 后10年，让AI理解规律）
    let timelineExamples = "【流年与大运对照示例】\n"
    timelineExamples += "以下是前10年和后10年的示例，请按此规律生成完整的1-100岁数据：\n\n"
    timelineExamples += "| 虚岁 | 公历 | 流年干支 | 大运 |\n"
    timelineExamples += "|---|---|---|---|\n"

    for (let age = 1; age <= 10; age++) {
      const currentYear = birthYear + (age - 1)
      const cycleIndex = (startYearIndex + (age - 1)) % 60
      const ganZhi = SIXTY_CYCLE[cycleIndex]
      const daYun = findDaYun(age)
      timelineExamples += `| ${age} | ${currentYear} | ${ganZhi} | ${daYun} |\n`
    }

    timelineExamples += "| ... | ... | ... | ... |\n"

    for (let age = 91; age <= 100; age++) {
      const currentYear = birthYear + (age - 1)
      const cycleIndex = (startYearIndex + (age - 1)) % 60
      const ganZhi = SIXTY_CYCLE[cycleIndex]
      const daYun = findDaYun(age)
      timelineExamples += `| ${age} | ${currentYear} | ${ganZhi} | ${daYun} |\n`
    }

    // 添加大运完整列表
    let dayunList = "\n【大运列表】\n"
    decadeFortunes.forEach(d => {
      dayunList += `- ${d.startAge}-${d.endAge}岁: ${d.ganZhi}\n`
    })

    // 添加流年计算规则
    const timelineContext = timelineExamples + dayunList + `
【流年计算规则】
出生年柱: ${yearPillar}
流年按六十甲子顺序推进：${SIXTY_CYCLE.slice(0, 10).join('、')}...（循环）
**重要**: 请严格按照六十甲子顺序生成1-100岁的流年干支，不要自己推算！`

    // 构建用户提示词
    const userPrompt = `
      请分析以下八字命盘，并生成 100 岁的人生 K 线图数据。

      【基本信息】
      性别：${genderStr}
      姓名：${name || "未提供"}
      出生年份：${birthYear}年
      
      【八字四柱】
      年柱：${yearPillar}
      月柱：${monthPillar}
      日柱：${dayPillar}
      时柱：${hourPillar}
      
      ${timelineContext}
      
      【生成任务】
      1. 分析命局五行喜忌、格局层次
      2. 针对 1-100 岁每一年，根据流年干支、大运的吉凶（参考刑冲合害、神煞等），给出 0-100 的运势评分
      3. 严格按照 JSON Schema 生成数据，包含 analysis 和 chartPoints 两个顶级字段
      4. chartPoints 必须包含完整的100个年份数据点
      
      【重要：JSON格式要求】
      返回的JSON必须完全遵循以下格式（字段名不得更改）：
      {
        "analysis": {
          "summary": "命理总评文字",
          "summaryScore": 数字0-10,
          "industry": "事业分析文字",
          "industryScore": 数字0-10,
          "wealth": "财运分析文字",
          "wealthScore": 数字0-10,
          "marriage": "婚姻分析文字",
          "marriageScore": 数字0-10,
          "health": "健康分析文字",
          "healthScore": 数字0-10,
          "family": "六亲分析文字",
          "familyScore": 数字0-10
        },
        "chartPoints": [
          {
            "age": 数字,
            "year": 数字,
            "ganZhi": "干支字符串",
            "daYun": "大运字符串",
            "score": 数字0-100,
            "open": 数字0-100,
            "close": 数字0-100,
            "high": 数字0-100,
            "low": 数字0-100,
            "reason": "详批文字30字左右"
          }
          // ... 共100个数据点
        ]
      }
      
      请直接返回JSON，不要包含其他解释。`

    // 使用流式响应
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 发送开始信号
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'start', message: '开始连接AI...' })}\n\n`))

          // 调用AI API（使用流式模式）
          const response = await fetch(`${cleanBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: targetModel,
              messages: [
                { role: 'system', content: BAZI_SYSTEM_INSTRUCTION },
                { role: 'user', content: userPrompt }
              ],
              response_format: { type: 'json_object' },
              temperature: 0.7,
              stream: true
            })
          })

          if (!response.ok) {
            const errText = await response.text()
            console.error('AI API Error:', errText)
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: `AI API 请求失败: ${response.status}` })}\n\n`))
            controller.close()
            return
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'progress', message: 'AI正在分析命理...' })}\n\n`))

          // 读取流式响应
          const reader = response.body?.getReader()
          if (!reader) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: '无法读取AI响应流' })}\n\n`))
            controller.close()
            return
          }

          const decoder = new TextDecoder()
          let fullContent = ''
          let chunkCount = 0

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  const content = parsed.choices?.[0]?.delta?.content || ''
                  if (content) {
                    fullContent += content
                    chunkCount++

                    // 每个chunk都发送实时内容
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                      type: 'stream',
                      content: content,
                      totalChars: fullContent.length
                    })}\n\n`))
                  }
                } catch (e) {
                  // 忽略解析错误的chunk
                }
              }
            }
          }

          if (!fullContent) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'AI 模型未返回任何内容' })}\n\n`))
            controller.close()
            return
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'progress', message: '正在解析数据...' })}\n\n`))

          // 解析JSON响应
          let data
          try {
            data = JSON.parse(fullContent)
          } catch (parseError) {
            console.error('JSON Parse Error:', parseError)
            console.error('Raw content:', fullContent.substring(0, 500))
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'AI 返回的数据格式不正确，无法解析' })}\n\n`))
            controller.close()
            return
          }

          // 验证数据完整性 - 兼容多种返回格式
          let chartPoints: any[] | null = null
          let analysisData = data

          // 情况1: AI 直接返回数组 [{age:1,...}, {age:2,...}, ...]
          if (Array.isArray(data)) {
            console.log('AI 返回了数组格式，直接使用作为 chartPoints')
            chartPoints = data
            analysisData = {} // 没有分析数据
          } else {
            // 情况2: 标准对象格式 - 兼容多种字段名
            chartPoints = data.chartPoints || data.chart_points || data.timeline || data.points || data.kline || data.klineData || data.k_line_data || data.data || data.life_trend || data.life_k_line_data

            // 如果分析数据嵌套在 analysis 对象里
            if (data.analysis && typeof data.analysis === 'object') {
              analysisData = { ...data, ...data.analysis }
            }
          }

          if (!chartPoints || !Array.isArray(chartPoints) || chartPoints.length === 0) {
            // 打印详细错误信息便于诊断
            console.error('=== AI 返回格式错误 ===')
            console.error('数据类型:', Array.isArray(data) ? '数组' : typeof data)
            console.error('顶级字段:', Array.isArray(data) ? '数组格式' : Object.keys(data).join(', '))
            console.error('完整数据结构:', JSON.stringify(data, null, 2).substring(0, 2000))
            console.error('chartPoints 值:', chartPoints)

            const availableKeys = Array.isArray(data) ? '数组格式' : Object.keys(data).join(', ')
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({
              type: 'error',
              error: `AI返回的数据格式不正确。期望字段: "chartPoints" (数组)，实际返回: [${availableKeys}]。请检查模型是否支持JSON模式输出。`
            })}\n\n`))
            controller.close()
            return
          }

          // 验证数据点数量
          console.log(`✓ 成功解析 chartPoints，包含 ${chartPoints.length} 个数据点`)
          if (chartPoints.length < 10) {
            console.warn('⚠ chartPoints 数据点过少:', chartPoints.length)
          }

          // 统计AI返回的K线完整性
          const klineCompleteCount = chartPoints.filter((p: any) =>
            typeof p.open === 'number' &&
            typeof p.close === 'number' &&
            typeof p.high === 'number' &&
            typeof p.low === 'number'
          ).length
          const reasonCompleteCount = chartPoints.filter((p: any) => p.reason && p.reason.trim()).length

          console.log(`  ├─ 包含完整K线数据: ${klineCompleteCount}/${chartPoints.length} (${Math.round(klineCompleteCount / chartPoints.length * 100)}%)`)
          console.log(`  └─ 包含流年详批: ${reasonCompleteCount}/${chartPoints.length} (${Math.round(reasonCompleteCount / chartPoints.length * 100)}%)`)

          // 处理数据点 - 智能混合模式
          let lastClose = 50 // 初始值，用于第一年

          const processedChartPoints = chartPoints.map((point: any, index: number) => {
            const score = point.score ?? 50
            const reason = point.reason || point.comment || point.description || point.detail || point.summary || point.explanation || ''

            // 检查AI是否返回了完整的K线数据
            const hasCompleteKLineData =
              typeof point.open === 'number' &&
              typeof point.close === 'number' &&
              typeof point.high === 'number' &&
              typeof point.low === 'number'

            let open, close, high, low

            if (hasCompleteKLineData) {
              // 情况1: AI返回了完整K线数据，直接使用
              open = Math.min(100, Math.max(0, point.open))
              close = Math.min(100, Math.max(0, point.close))
              high = Math.min(100, Math.max(0, point.high))
              low = Math.max(0, Math.min(100, point.low))

              // 更新 lastClose 供下一年使用
              lastClose = close
            } else {
              // 情况2: AI没有返回完整K线数据，用算法生成
              // 第一年的 Open 基于 Score 稍作波动
              // 后续年份的 Open 严格等于上一年的 Close
              open = index === 0 ? Math.max(0, score - 2 + Math.floor(Math.random() * 5)) : lastClose
              close = score

              // 确保 Open 和 Close 都在 0-100 范围内
              open = Math.min(100, Math.max(0, open))
              close = Math.min(100, Math.max(0, close))

              // 构建实体范围
              const bodyMin = Math.min(open, close)
              const bodyMax = Math.max(open, close)

              // 生成影线 (High/Low)
              // High 至少要比实体最高点高一点点 (1-5分)
              // Low 至少要比实体最低点低一点点 (1-5分)
              high = Math.min(100, bodyMax + 1 + Math.floor(Math.random() * 5))
              low = Math.max(0, bodyMin - 1 - Math.floor(Math.random() * 5))

              // 更新 lastClose 供下一次迭代使用
              lastClose = close
            }

            return {
              age: point.age ?? index + 1,
              year: point.year ?? (birthYear + index),
              daYun: point.daYun || point.da_yun || '童限',
              ganZhi: point.ganZhi || point.gan_zhi || '',
              open,
              close,
              high,
              low,
              score,
              reason
            }
          })

          const result = {
            chartData: processedChartPoints,
            analysis: {
              bazi: analysisData.bazi || analysisData.bazi_info?.columns ? Object.values(analysisData.bazi_info.columns) : [yearPillar, monthPillar, dayPillar, hourPillar],
              summary: analysisData.summary || analysisData.verdict || analysisData.overall || analysisData.conclusion || '暂无摘要',
              summaryScore: analysisData.summaryScore || 8,
              industry: analysisData.industry || analysisData.career || analysisData.five_elements_analysis || '暂无事业分析',
              industryScore: analysisData.industryScore || 7,
              wealth: analysisData.wealth || analysisData.money || analysisData.useful_gods || '暂无财运分析',
              wealthScore: analysisData.wealthScore || 8,
              marriage: analysisData.marriage || analysisData.love || '暂无婚姻分析',
              marriageScore: analysisData.marriageScore || 6,
              health: analysisData.health || '暂无健康分析',
              healthScore: analysisData.healthScore || 6,
              family: analysisData.family || '暂无六亲分析',
              familyScore: analysisData.familyScore || 6,
            }
          }

          // 发送最终结果
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'complete', data: result })}\n\n`))
          controller.close()

        } catch (error) {
          console.error('Stream Error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : '服务器内部错误'
          })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })

  } catch (error) {
    console.error('Life K-Line API Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '服务器内部错误'
    }, { status: 500 })
  }
}
