'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { LunarDatePicker } from '@/components/ui/lunar-date-picker'
import { getCompleteEightCharInfo } from '@/lib/tyme'
import { CalendarIcon, SparklesIcon, ChartBarIcon, KeyIcon } from '@heroicons/react/16/solid'
import LifeKLineChart from '@/components/life-kline/LifeKLineChart'
import AnalysisResult from '@/components/life-kline/AnalysisResult'
import { LifeKLineResult } from '@/lib/life-kline/types'

export default function LifeKLinePage() {
  // 表单状态
  const [dateType, setDateType] = useState<'solar' | 'lunar'>('lunar')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 9, 15))
  const [timeInput, setTimeInput] = useState<string>('03:30')
  const [gender, setGender] = useState<'MAN' | 'WOMAN'>('MAN')

  // API配置状态
  const [apiKey, setApiKey] = useState<string>('')
  const [apiBaseUrl, setApiBaseUrl] = useState<string>('https://myai.naiai.net/v1')
  const [modelName, setModelName] = useState<string>('gemini-2.5-flash-lite')

  // 结果状态
  const [result, setResult] = useState<LifeKLineResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [streamStatus, setStreamStatus] = useState<string>('准备中...')
  const [streamContent, setStreamContent] = useState<string>('')  // 实时显示AI返回内容

  useEffect(() => {
    setIsMounted(true)
    // 从 localStorage 读取保存的 API Key
    const savedApiKey = localStorage.getItem('life-kline-api-key')
    if (savedApiKey) {
      setApiKey(savedApiKey)
    }
  }, [])

  // 保存 API Key 到 localStorage
  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    if (value.trim()) {
      localStorage.setItem('life-kline-api-key', value)
    } else {
      localStorage.removeItem('life-kline-api-key')
    }
  }

  // 使用示例数据
  const handleUseExample = () => {
    setDateType('lunar')
    setSelectedDate(new Date(2000, 9, 15))
    setTimeInput('03:30')
    setGender('MAN')
  }

  // 生成背景粒子配置
  const particles = useMemo(() => {
    if (!isLoading) return []
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2
    }))
  }, [isLoading])

  // 处理生成
  const handleGenerate = useCallback(async () => {
    // 验证API配置
    if (!apiKey.trim()) {
      setError('请填写 API Key')
      return
    }
    if (!apiBaseUrl.trim()) {
      setError('请填写 API Base URL')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)
    setStreamContent('')  // 清空之前的流内容

    try {
      // 构建完整的出生时间
      const [hours, minutes] = timeInput.split(':').map(Number)
      const birthTime = new Date(selectedDate)
      birthTime.setHours(hours, minutes, 0, 0)

      // 获取八字信息
      const eightCharInfo = getCompleteEightCharInfo(birthTime, gender)

      // 获取第一步大运
      const firstDaYun = eightCharInfo.decadeFortuneList[0]?.sixtyCycle || ''
      const startAge = eightCharInfo.childLimit.yearCount + 1 // 起运年龄（虚岁）

      // 调用API（流式）
      setStreamStatus('正在连接AI服务...')
      const response = await fetch('/api/life-kline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gender,
          birthYear: birthTime.getFullYear(),
          yearPillar: eightCharInfo.eightChar.year,
          monthPillar: eightCharInfo.eightChar.month,
          dayPillar: eightCharInfo.eightChar.day,
          hourPillar: eightCharInfo.eightChar.hour,
          startAge,
          firstDaYun,
          decadeFortunes: eightCharInfo.decadeFortuneList.map(d => ({
            startAge: d.startAge,
            endAge: d.endAge,
            ganZhi: d.sixtyCycle
          })),
          modelName,
          apiBaseUrl,
          apiKey
        })
      })

      if (!response.ok) {
        throw new Error(`请求失败: ${response.status}`)
      }

      // 读取SSE流
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法读取响应流')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'start' || data.type === 'progress') {
                setStreamStatus(data.message)
              } else if (data.type === 'stream') {
                // 实时追加AI返回的内容
                setStreamContent(prev => prev + data.content)
                setStreamStatus(`正在生成... (${data.totalChars} 字符)`)
              } else if (data.type === 'complete') {
                setResult(data.data)
                setStreamStatus('完成!')
              } else if (data.type === 'error') {
                throw new Error(data.error)
              }
            } catch (e) {
              if (e instanceof SyntaxError) continue
              throw e
            }
          }
        }
      }
    } catch (err) {
      console.error('生成失败:', err)
      setError(err instanceof Error ? err.message : '生成失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate, timeInput, gender, apiKey, apiBaseUrl, modelName])

  // 重新生成
  const handleReset = () => {
    setResult(null)
    setError(null)
  }

  if (!isMounted) {
    return (
      <div className="space-y-8 relative">
        <div className="text-center space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto max-w-md animate-pulse"></div>
          <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded mx-auto max-w-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* 加载遮罩 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
            ))}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative">
            {/* 顶部状态栏 */}
            <div className="flex items-center gap-4 mb-4 flex-shrink-0">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-600 rounded-full opacity-20"></div>
                <div className="absolute inset-0 border-4 border-transparent border-t-green-500 border-r-green-300 rounded-full animate-spin"></div>
                <ChartBarIcon className="absolute inset-0 m-auto size-5 text-indigo-500 animate-pulse" />
              </div>
              <div className="flex-1">
                <Heading level={3} className="text-lg font-bold text-gray-900 dark:text-white">
                  正在生成人生K线图
                </Heading>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  {streamStatus}
                </Text>
              </div>
            </div>

            {/* AI 实时返回内容区域 */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  AI 实时输出
                </Text>
              </div>
              <div className="flex-1 bg-gray-900 dark:bg-black rounded-lg p-4 overflow-auto font-mono text-xs text-green-400 leading-relaxed">
                <pre className="whitespace-pre-wrap break-all">
                  {streamContent || '等待AI响应...'}
                </pre>
              </div>
            </div>

            {/* 底部提示 */}
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <Text className="text-xs text-amber-600 dark:text-amber-400 text-center">
                流式传输中，请保持网络连接 | 内容实时更新
              </Text>
            </div>
          </div>
        </div>
      )}

      {/* 如果有结果，显示结果页面 */}
      {result ? (
        <div className="space-y-8">
          {/* 标题和返回按钮 */}
          <div className="flex items-center justify-between">
            <Heading level={1} className="text-3xl font-bold text-gray-900 dark:text-white">
              命盘分析报告
            </Heading>
            <Button onClick={handleReset} className="text-indigo-600 hover:text-indigo-800">
              ← 重新排盘
            </Button>
          </div>

          <Divider />

          {/* K线图 */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
              <Heading level={2} className="text-xl font-bold text-gray-800 dark:text-white">
                百岁流年走势图 (100年)
              </Heading>
            </div>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              <span className="text-green-600 font-bold">绿色K线</span> 代表运势上涨（吉），
              <span className="text-red-600 font-bold">红色K线</span> 代表运势下跌（凶）。
              (点击K线查看流年详批)
            </Text>
            <LifeKLineChart data={result.chartData} />
          </section>

          <Divider />

          {/* 命理分析报告 */}
          <section>
            <AnalysisResult analysis={result.analysis} />
          </section>
        </div>
      ) : (
        <>
          {/* 标题区域 */}
          <div className="text-center space-y-4">
            <Heading level={1} className="text-4xl font-bold text-gray-900 dark:text-white">
              人生K线图
            </Heading>
            <Text className="text-xl text-gray-600 dark:text-gray-400">
              将您的百岁人生运势绘制成类似股票K线的可视化图表
            </Text>
            <div className="flex justify-center gap-3 items-center flex-wrap">
              <Button
                plain
                onClick={handleUseExample}
                className="text-sm px-4 py-2 transition-all duration-300 transform hover:scale-105"
              >
                使用示例数据
              </Button>
              <Badge color="indigo">
                <SparklesIcon className="size-4 mr-1" />
                AI驱动分析
              </Badge>
            </div>
          </div>

          <Divider />

          {/* 错误提示 */}
          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* 输入表单 */}
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 出生信息 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <Heading level={3} className="text-lg font-semibold">
                  出生信息
                </Heading>
                <Badge color="blue">
                  <CalendarIcon className="size-4 mr-1" />
                  基本信息
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 日期类型 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    日期类型
                  </Text>
                  <div className="flex rounded-md overflow-hidden">
                    <Button
                      onClick={() => setDateType('lunar')}
                      className={`px-4 py-1.5 ${dateType === 'lunar'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      农历
                    </Button>
                    <Button
                      onClick={() => setDateType('solar')}
                      className={`px-4 py-1.5 ${dateType === 'solar'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      公历
                    </Button>
                  </div>
                </div>

                {/* 性别 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    性别
                  </Text>
                  <div className="flex rounded-md overflow-hidden">
                    <Button
                      onClick={() => setGender('MAN')}
                      className={`px-4 py-1.5 ${gender === 'MAN'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      男
                    </Button>
                    <Button
                      onClick={() => setGender('WOMAN')}
                      className={`px-4 py-1.5 ${gender === 'WOMAN'
                        ? 'bg-pink-600 text-white hover:bg-pink-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'}`}
                    >
                      女
                    </Button>
                  </div>
                </div>

                {/* 日期选择 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    {dateType === 'lunar' ? '农历日期' : '公历日期'}
                  </Text>
                  {dateType === 'lunar' ? (
                    <LunarDatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="w-full"
                    />
                  )}
                </div>

                {/* 时间输入 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    出生时间
                  </Text>
                  <Input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* API配置 */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <Heading level={3} className="text-lg font-semibold">
                  AI模型配置
                </Heading>
                <Badge color="amber">
                  <KeyIcon className="size-4 mr-1" />
                  必填
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800 mb-4">
                  <Text className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>提示：</strong>本功能需要使用AI大模型进行命理分析。请填写兼容OpenAI格式的API配置。
                    推荐使用 GPT-4o、Gemini 2.5 Pro 或 Claude 3.5 Sonnet 等模型。
                  </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      模型名称
                    </Text>
                    <Input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      placeholder="gpt-4o"
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      API Base URL
                    </Text>
                    <Input
                      type="text"
                      value={apiBaseUrl}
                      onChange={(e) => setApiBaseUrl(e.target.value)}
                      placeholder="https://api.openai.com/v1"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    API Key
                  </Text>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder="sk-..."
                    className="w-full"
                  />
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    您的API Key仅用于本次请求，不会被保存
                  </Text>
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <div className="text-center">
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !apiKey.trim()}
                className="bg-gradient-to-r from-green-600 to-indigo-600 hover:from-green-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="size-5" />
                  {isLoading ? '生成中...' : '生成人生K线图'}
                </div>
              </Button>
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                生成过程需要3-5分钟，请耐心等待
              </Text>
            </div>
          </div>

          {/* 功能说明 */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
              <Heading level={3} className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                功能说明
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>百岁流年走势图：1-100岁运势可视化</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>大运周期标注：每十年大运清晰展示</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>流年详批：点击任意年份查看详细分析</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>多维度分析：事业、财运、婚姻、健康、家庭</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-700">
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  ⚠️ 本功能仅供娱乐与文化研究，请勿迷信。命理分析结果由AI模型生成，仅供参考。
                </Text>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
