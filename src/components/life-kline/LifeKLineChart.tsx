'use client'

import React, { useState } from 'react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label
} from 'recharts'
import { KLinePoint } from '@/lib/life-kline/types'

interface LifeKLineChartProps {
  data: KLinePoint[]
}

// 自定义Tooltip组件
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as KLinePoint
    const isUp = data.close >= data.open
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
          <div className={`text-base font-bold px-2 py-1 rounded ${isUp ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'}`}>
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
  const { x, y, width, height, payload, yAxis } = props

  const isUp = payload.close >= payload.open
  const color = isUp ? '#22c55e' : '#ef4444' // Green Up, Red Down
  const strokeColor = isUp ? '#16a34a' : '#dc2626' // Slightly darker for stroke
  
  let highY = y
  let lowY = y + height

  if (yAxis && typeof yAxis.scale === 'function') {
    try {
      highY = yAxis.scale(payload.high)
      lowY = yAxis.scale(payload.low)
    } catch (e) {
      highY = y
      lowY = y + height
    }
  }

  const center = x + width / 2

  // Enforce minimum body height so flat doji candles are visible
  const renderHeight = height < 1 ? 1 : height

  return (
    <g>
      <line x1={center} y1={highY} x2={center} y2={lowY} stroke={strokeColor} strokeWidth={1.5} />
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={renderHeight} 
        fill={color} 
        stroke={strokeColor}
        strokeWidth={0.5}
      />
    </g>
  )
}

export default function LifeKLineChart({ data }: LifeKLineChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<KLinePoint | null>(null)

  const transformedData = data.map(d => ({
    ...d,
    bodyRange: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
  }))

  // Identify Da Yun change points to draw reference lines
  const daYunChanges = data.filter((d, i) => {
    if (i === 0) return true
    return d.daYun !== data[i-1].daYun
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
        <div className="flex gap-4 text-xs font-medium">
          <span className="flex items-center text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded">
            <div className="w-2 h-2 bg-green-500 mr-2 rounded-full"></div> 吉运 (涨)
          </span>
          <span className="flex items-center text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded">
            <div className="w-2 h-2 bg-red-500 mr-2 rounded-full"></div> 凶运 (跌)
          </span>
        </div>
      </div>
      
      {/* K线图 */}
      <div className="w-full h-[500px] md:h-[600px] bg-white dark:bg-gray-800 p-2 md:p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={transformedData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:opacity-20" />
            
            <XAxis 
              dataKey="age" 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              interval={9} 
              axisLine={{ stroke: '#e5e7eb' }}
              tickLine={false}
              label={{ value: '年龄', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#9ca3af' }} 
            />
            
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              label={{ value: '运势分', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9ca3af' }} 
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} 
            />
            
            {/* Da Yun Reference Lines */}
            {daYunChanges.map((point, index) => (
              <ReferenceLine 
                key={`dayun-${index}`} 
                x={point.age} 
                stroke="#cbd5e1" 
                strokeDasharray="3 3" 
                strokeWidth={1}
              >
                <Label 
                  value={point.daYun} 
                  position="top" 
                  fill="#6366f1" 
                  fontSize={10} 
                  fontWeight="bold"
                  className="hidden md:block"
                />
              </ReferenceLine>
            ))}

            <Bar 
              dataKey="bodyRange" 
              shape={<CandleShape />} 
              isAnimationActive={true}
              animationDuration={1500}
              onClick={handleBarClick}
              cursor="pointer"
            />
            
          </ComposedChart>
        </ResponsiveContainer>
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
                return (
                  <tr 
                    key={index}
                    id={`kline-row-${point.age}`}
                    onClick={() => setSelectedPoint(point)}
                    className={`border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-l-indigo-500' : ''
                    }`}
                  >
                    <td className="px-4 py-2 font-mono">{point.age}岁</td>
                    <td className="px-4 py-2 font-mono">{point.year}</td>
                    <td className="px-4 py-2 font-medium">{point.ganZhi}</td>
                    <td className="px-4 py-2 text-indigo-600 dark:text-indigo-400">{point.daYun}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        isUp 
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400' 
                          : 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400'
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
