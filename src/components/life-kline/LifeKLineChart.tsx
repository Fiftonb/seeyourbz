'use client'

import React, { useState } from 'react'
import {
  ComposedChart,
  Bar,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Cell
} from 'recharts'
import { KLinePoint } from '@/lib/life-kline/types'

interface LifeKLineChartProps {
  data: KLinePoint[]
}

// 自定义Tooltip组件
const CustomTooltip = ({ active, payload, colorTheme }: any) => {
  const tooltipColors = getColors(colorTheme || 'greenUp')
  if (active && payload && payload.length) {
    const data = payload[0].payload as KLinePoint
    const isUp = data.close >= data.open
    const upBgClass = colorTheme === 'redUp' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'
    const upTextClass = colorTheme === 'redUp' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
    const downBgClass = colorTheme === 'redUp' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
    const downTextClass = colorTheme === 'redUp' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
    return (
      <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-5 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 w-[320px] md:w-[400px]">
        {/* Header */}
        <div className="flex justify-between items-start mb-3 border-b border-gray-100 dark:border-gray-700 pb-2">
          <div>
            <p className="text-xl font-bold text-gray-800 dark:text-white">
              {data.year} {data.ganZhi}年 <span className="text-base text-gray-500 dark:text-gray-400">({data.age}岁)</span>
            </p>
            <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              大运：{data.daYun || '未知'}
            </p>
          </div>
          <div className={`text-base font-bold px-2 py-1 rounded ${isUp ? `${upBgClass} ${upTextClass}` : `${downBgClass} ${downTextClass}`}`}>
            {isUp ? '吉 ▲' : '凶 ▼'}
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4 bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
          <div className="text-center">
            <span className="block scale-90">开盘</span>
            <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{data.open}</span>
          </div>
          <div className="text-center">
            <span className="block scale-90">收盘</span>
            <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{data.close}</span>
          </div>
          <div className="text-center">
            <span className="block scale-90">最高</span>
            <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{data.high}</span>
          </div>
          <div className="text-center">
            <span className="block scale-90">最低</span>
            <span className="font-mono text-gray-700 dark:text-gray-300 font-bold">{data.low}</span>
          </div>
        </div>

        {/* Detailed Reason */}
        <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed text-justify max-h-[200px] overflow-y-auto">
          {data.reason}
        </div>
      </div>
    )
  }
  return null
}

// K线蜡烛形状组件
const CandleShape = (props: any) => {
  const { x, y, width, height, payload, colors } = props

  const isUp = payload.close >= payload.open
  // 根据颜色主题选择颜色
  const color = isUp ? (colors?.upColor || '#10b981') : (colors?.downColor || '#ef4444')

  // 计算实体的上下边界值
  const bodyMax = Math.max(payload.open, payload.close)
  const bodyMin = Math.min(payload.open, payload.close)
  const bodyDiff = bodyMax - bodyMin

  let highY = y
  let lowY = y + height

  // 基于实体位置推算影线位置
  // y 对应 bodyMax（实体顶部），y + height 对应 bodyMin（实体底部）
  if (bodyDiff > 0 && height > 0) {
    // 有实体高度时，通过实体计算每单位对应的像素数
    const pixelsPerUnit = height / bodyDiff
    highY = y - (payload.high - bodyMax) * pixelsPerUnit
    lowY = (y + height) + (bodyMin - payload.low) * pixelsPerUnit
  } else {
    // Doji（十字星）情况：实体为0，需要用固定domain来计算
    // 假设 Y 轴 domain 是 [0, 200]，图表高度约 500px
    // 这里用一个估算的 pixelsPerUnit
    const estimatedChartHeight = 500
    const estimatedPixelsPerUnit = estimatedChartHeight / 200
    highY = y - (payload.high - bodyMax) * estimatedPixelsPerUnit
    lowY = y + (bodyMin - payload.low) * estimatedPixelsPerUnit
  }

  // Calculate center of the band
  const center = x + width / 2

  // Fixed thin width for the candle body
  const candleWidth = Math.min(6, width * 0.8)
  const candleX = center - candleWidth / 2

  // Enforce minimum body height (visual fix for dojis)
  // Note: changing 'height' here only affects visual rect, not shadow calculations
  const renderHeight = Math.max(1, height)

  return (
    <g>
      {/* 影线 - 放在实体上方确保可见 */}
      <line
        x1={center}
        y1={highY}
        x2={center}
        y2={lowY}
        stroke={color}
        strokeWidth={1.5}
      />
      {/* K线实体 */}
      <rect
        x={candleX}
        y={y}
        width={candleWidth}
        height={renderHeight}
        fill={color}
        stroke={color}
        strokeWidth={0}
      />
    </g>
  )
}

// Add Custom X-Axis Tick for DaYun (Great Fortune)
const DaYunAxisTick = (props: any) => {
  const { x, y, payload, data, visibleIndices } = props;
  const point = data[payload.index];

  // 只在预计算的可见索引中显示
  if (!visibleIndices || !visibleIndices.includes(payload.index)) return null;

  // 只提取大运的核心部分（干支），去掉括号内容和额外文字
  const daYunLabel = point.daYun ? point.daYun.replace(/\s*\(.*\)\s*/g, '').trim().slice(0, 2) : '';

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={15} dy={0} textAnchor="middle" fill="#6b7280" fontSize={10} className="dark:fill-gray-400">
        {daYunLabel}
      </text>
    </g>
  );
};

// 颜色主题类型
type ColorTheme = 'greenUp' | 'redUp'

// 视图模式类型
type ViewMode = 'kline' | 'curve' | 'both'

// 获取颜色配置
const getColors = (theme: ColorTheme) => {
  if (theme === 'redUp') {
    // 红涨绿跌（中国股市风格）
    return { upColor: '#ef4444', downColor: '#10b981' }
  }
  // 绿涨红跌（默认）
  return { upColor: '#10b981', downColor: '#ef4444' }
}

export default function LifeKLineChart({ data }: LifeKLineChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<KLinePoint | null>(null)
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    // 从 localStorage 读取保存的主题
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kline-color-theme') as ColorTheme) || 'greenUp'
    }
    return 'greenUp'
  })
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    // 从 localStorage 读取保存的视图模式
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('kline-view-mode') as ViewMode) || 'kline'
    }
    return 'kline'
  })

  // 切换颜色主题
  const toggleColorTheme = () => {
    const newTheme = colorTheme === 'greenUp' ? 'redUp' : 'greenUp'
    setColorTheme(newTheme)
    localStorage.setItem('kline-color-theme', newTheme)
  }

  // 切换视图模式
  const cycleViewMode = () => {
    const modes: ViewMode[] = ['kline', 'curve', 'both']
    const currentIndex = modes.indexOf(viewMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setViewMode(nextMode)
    localStorage.setItem('kline-view-mode', nextMode)
  }

  const viewModeLabels = {
    kline: 'K线',
    curve: '曲线',
    both: '叠加'
  }

  const colors = getColors(colorTheme)

  const transformedData = data.map(d => ({
    ...d,
    bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
    midValue: (d.open + d.close) / 2, // 中间值用于曲线
  }))

  // 动态计算 Y 轴范围，让数据更紧凑
  const minLow = Math.min(...data.map(d => d.low))
  const maxHigh = Math.max(...data.map(d => d.high))
  const yMin = Math.max(0, Math.floor(minLow / 20) * 20 - 10) // 向下取整到20的倍数再减10
  const yMax = Math.min(200, Math.ceil(maxHigh / 20) * 20 + 10) // 向上取整到20的倍数再加10

  // 预计算哪些大运标签可以显示（确保间距至少 MIN_GAP 年）
  const MIN_GAP = 8 // 标签之间最小间距（年）
  const visibleDaYunIndices: number[] = []
  let lastVisibleIndex = -MIN_GAP // 初始化为负数，确保第一个能显示
  
  data.forEach((point, index) => {
    const isDaYunStart = index === 0 || point.daYun !== data[index - 1].daYun
    if (isDaYunStart && (index - lastVisibleIndex) >= MIN_GAP) {
      visibleDaYunIndices.push(index)
      lastVisibleIndex = index
    }
  })

  // Identify Da Yun change points to draw reference lines
  const daYunChanges = data.filter((d, i) => {
    if (i === 0) return true
    return d.daYun !== data[i - 1].daYun
  })

  // Handle bar click
  const handleBarClick = (data: any) => {
    if (data && data.age) {
      // Find the original point data to ensure type safety
      const originalPoint = data as KLinePoint
      setSelectedPoint(originalPoint)

      // Optional: Scroll to the table row
      const rowElement = document.getElementById(`kline-row-${originalPoint.age}`)
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[500px] flex items-center justify-center text-gray-400 dark:text-gray-500">
        暂无数据
      </div>
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* 图表头部 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          人生流年大运K线图
        </h3>
        <div className="flex items-center gap-4">
          {/* 颜色图例 */}
          <div className="flex gap-3 text-xs font-medium">
            <span className={`flex items-center px-2 py-1 rounded ${
              colorTheme === 'redUp' 
                ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30' 
                : 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
            }`}>
              <div className={`w-2 h-2 mr-2 rounded-full ${colorTheme === 'redUp' ? 'bg-red-500' : 'bg-green-500'}`}></div> 吉运 (涨)
            </span>
            <span className={`flex items-center px-2 py-1 rounded ${
              colorTheme === 'redUp' 
                ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30' 
                : 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
            }`}>
              <div className={`w-2 h-2 mr-2 rounded-full ${colorTheme === 'redUp' ? 'bg-green-500' : 'bg-red-500'}`}></div> 凶运 (跌)
            </span>
          </div>
          {/* 颜色切换按钮 */}
          <button
            onClick={toggleColorTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
            title="切换K线颜色风格"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            {colorTheme === 'greenUp' ? '绿涨红跌' : '红涨绿跌'}
          </button>
          {/* 视图模式切换按钮 */}
          <button
            onClick={cycleViewMode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors border border-indigo-300 dark:border-indigo-600"
            title="切换视图模式：K线 / 曲线 / 叠加"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            {viewModeLabels[viewMode]}
          </button>
        </div>
      </div>

      {/* K线图 */}
      <div className="w-full h-[500px] md:h-[600px] bg-gray-900 border border-gray-800 rounded-xl shadow-lg relative overflow-hidden">
        {/* Decorative Gradient Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-800/20 to-transparent pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={transformedData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
            {/* Background Grid - Dark theme optimized */}
            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#374151" opacity={0.3} />

            {/* Age Axis */}
            <XAxis
              dataKey="age"
              tick={{ fontSize: 10, fill: '#6b7280' }}
              interval={9}
              axisLine={false}
              tickLine={false}
              dy={5}
              padding={{ left: 5, right: 5 }}
            />

            {/* Hidden Axis for proper alignment of DaYun labels if needed, or just use custom tick on secondary XAxis */}
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={<DaYunAxisTick data={data} visibleIndices={visibleDaYunIndices} />}
              xAxisId="dayun"
              interval={0} // Show all ticks so our custom filter works
              dy={20}
            />

            <YAxis
              domain={[yMin, yMax]}
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              orientation="left"
              width={30}
            />

            <Tooltip
              content={<CustomTooltip colorTheme={colorTheme} />}
              cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }}
            />

            {/* 运势曲线 - 带渐变填充 */}
            {(viewMode === 'curve' || viewMode === 'both') && (
              <>
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="midValue"
                  stroke="transparent"
                  fill="url(#curveGradient)"
                  isAnimationActive={true}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="midValue"
                  stroke="#a78bfa"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                />
              </>
            )}

            {/* K线 */}
            {(viewMode === 'kline' || viewMode === 'both') && (
              <Bar
                dataKey="bodyRange"
                shape={<CandleShape colors={colors} />}
                isAnimationActive={true}
                animationDuration={1500}
                onClick={handleBarClick}
                xAxisId={0}
              />
            )}

          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 核心指标仪表盘 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(() => {
          if (!data.length) return null

          // 计算指标
          const scores = data.map(d => d.score)
          const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)

          const peakPoint = data.reduce((max, p) => p.high > max.high ? p : max, data[0])
          const troughPoint = data.reduce((min, p) => p.low < min.low ? p : min, data[0])

          // 计算波动率 (标准差)
          const variance = scores.reduce((a, b) => a + Math.pow(b - avgScore, 2), 0) / scores.length
          const stdDev = Math.sqrt(variance)

          let volatilityText = "平稳"
          if (stdDev > 15) volatilityText = "大起大落"
          else if (stdDev > 10) volatilityText = "波澜壮阔"
          else if (stdDev > 5) volatilityText = "起伏有致"

          return (
            <>
              {/* 平均分 */}
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-between h-24 shadow-lg">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <div className="p-1 bg-blue-500/10 rounded">
                    <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  平均运势分
                </div>
                <div className="text-3xl font-bold text-white font-mono mt-1">{avgScore}</div>
              </div>

              {/* 人生巅峰 */}
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-between h-24 shadow-lg">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <div className="p-1 bg-green-500/10 rounded">
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  人生巅峰
                </div>
                <div className="text-2xl font-bold text-white font-mono mt-1">{peakPoint.year}年</div>
              </div>

              {/* 人生低谷 */}
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-between h-24 shadow-lg">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <div className="p-1 bg-red-500/10 rounded">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  人生低谷
                </div>
                <div className="text-2xl font-bold text-white font-mono mt-1">{troughPoint.year}年</div>
              </div>

              {/* 波折程度 */}
              <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-between h-24 shadow-lg">
                <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                  <div className="p-1 bg-purple-500/10 rounded">
                    <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  波折程度
                </div>
                <div className="text-2xl font-bold text-white mt-1">{volatilityText}</div>
              </div>
            </>
          )
        })()}
      </div>

      {/* 流年详情列表 - 可选显示 */}
      <details className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden" open={!!selectedPoint}>
        <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 font-semibold text-gray-800 dark:text-white">
          点击展开流年详批列表 {selectedPoint ? `(当前选中: ${selectedPoint.age}岁 ${selectedPoint.year})` : ''}
        </summary>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900/50 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">年龄</th>
                <th className="px-4 py-2 text-left">年份</th>
                <th className="px-4 py-2 text-left">流年</th>
                <th className="px-4 py-2 text-left">大运</th>
                <th className="px-4 py-2 text-left">运势</th>
                <th className="px-4 py-2 text-left">详批</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point, index) => {
                const isUp = point.close >= point.open
                const isSelected = point.age === selectedPoint?.age
                // 根据颜色主题设置样式
                const upBgClass = colorTheme === 'redUp' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-green-100 dark:bg-green-900/50'
                const upTextClass = colorTheme === 'redUp' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'
                const downBgClass = colorTheme === 'redUp' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'
                const downTextClass = colorTheme === 'redUp' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                return (
                  <tr
                    key={index}
                    id={`kline-row-${point.age}`}
                    onClick={() => setSelectedPoint(point)}
                    className={`border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-l-indigo-500' : ''
                      }`}
                  >
                    <td className="px-4 py-2 font-mono">{point.age}岁</td>
                    <td className="px-4 py-2 font-mono">{point.year}</td>
                    <td className="px-4 py-2 font-medium">{point.ganZhi}</td>
                    <td className="px-4 py-2 text-indigo-600 dark:text-indigo-400">{point.daYun}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isUp
                        ? `${upBgClass} ${upTextClass}`
                        : `${downBgClass} ${downTextClass}`
                        }`}>
                        {isUp ? '吉 ▲' : '凶 ▼'} {point.score}分
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400 max-w-xs truncate" title={point.reason}>
                      {point.reason}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
