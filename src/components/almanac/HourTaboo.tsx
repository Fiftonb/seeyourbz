'use client'

import { useState, useEffect } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getHourTabooInfo } from '@/lib/tyme'
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon
} from '@heroicons/react/16/solid'

interface HourTabooProps {
  selectedDate: Date
}

export function HourTaboo({ selectedDate }: HourTabooProps) {
  const [hourTaboos, setHourTaboos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedHour, setExpandedHour] = useState<number | null>(null)
  const [currentHour, setCurrentHour] = useState<number>(0)

  // 获取时辰宜忌信息
  useEffect(() => {
    const loadHourTaboos = async () => {
      setIsLoading(true)
      try {
        const taboos = getHourTabooInfo(selectedDate)
        setHourTaboos(taboos)
        
        // 获取当前时辰
        const now = new Date()
        const hour = now.getHours()
        const hourIndex = Math.floor(hour / 2)
        setCurrentHour(hourIndex)
      } catch (error) {
        console.error('获取时辰宜忌失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHourTaboos()
  }, [selectedDate])

  // 获取时辰图标
  const getHourIcon = (index: number) => {
    // 根据时辰返回不同图标
    if (index >= 2 && index <= 8) { // 寅时到申时 (5:00-19:00)
      return <SunIcon className="size-5 text-yellow-500" />
    } else {
      return <MoonIcon className="size-5 text-blue-500" />
    }
  }

  // 获取时辰描述颜色
  const getHourColor = (index: number) => {
    if (index === currentHour) {
      return 'blue' // 当前时辰
    } else if (index >= 2 && index <= 8) {
      return 'yellow' // 白天
    } else {
      return 'indigo' // 夜晚
    }
  }

  // 是否是当前时辰
  const isCurrentHour = (index: number) => {
    const now = new Date()
    const todayStr = now.toDateString()
    const selectedStr = selectedDate.toDateString()
    
    if (todayStr !== selectedStr) return false
    
    const hour = now.getHours()
    const hourIndex = Math.floor(hour / 2)
    return index === hourIndex
  }

  if (isLoading) {
    return (
      <div className="text-center space-y-4">
        <div className="animate-spin mx-auto">
          <SparklesIcon className="size-8 text-amber-500" />
        </div>
        <Text className="text-gray-600 dark:text-gray-400">
          正在加载时辰宜忌信息...
        </Text>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 标题说明 */}
      <div className="text-center space-y-4">
        <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white">
          十二时辰宜忌
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          一天十二个时辰，每个时辰都有不同的宜忌事项
        </Text>
        
        {/* 时辰总览 */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {hourTaboos.map((taboo, index) => (
              <Button
                key={index}
                onClick={() => setExpandedHour(expandedHour === index ? null : index)}
                className={`p-2 text-xs transition-all duration-300 rounded-lg ${
                  isCurrentHour(index)
                    ? 'bg-red-500 text-white hover:bg-red-600 ring-2 ring-red-300'
                    : expandedHour === index
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  {getHourIcon(index)}
                  <span className="font-medium">{taboo.hourName}</span>
                  {isCurrentHour(index) && (
                    <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
              </Button>
            ))}
          </div>
          
          <div className="mt-3 text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              点击时辰查看详细宜忌 · 红色为当前时辰
            </Text>
          </div>
        </div>
      </div>

      {/* 时辰详情 */}
      {expandedHour !== null && hourTaboos[expandedHour] && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-fade-in">
          <div className="space-y-6">
            {/* 时辰标题 */}
            <div className="text-center space-y-3">
              <div className="flex justify-center items-center gap-3">
                {getHourIcon(expandedHour)}
                <Heading level={3} className="text-xl font-bold">
                  {hourTaboos[expandedHour].hourName}时
                </Heading>
                {isCurrentHour(expandedHour) && (
                  <Badge color="red" className="animate-pulse">
                    当前时辰
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-center gap-4 text-center">
                <div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">时间范围</Text>
                  <Badge color={getHourColor(expandedHour)} className="text-sm">
                    {hourTaboos[expandedHour].hourRange}
                  </Badge>
                </div>
                <div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">干支时辰</Text>
                  <Badge color="purple" className="text-sm">
                    {hourTaboos[expandedHour].hour}
                  </Badge>
                </div>
              </div>
              
              <Text className="text-gray-600 dark:text-gray-400">
                {hourTaboos[expandedHour].description}
              </Text>
            </div>

            {/* 宜忌内容 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 宜事 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="size-6 text-green-600" />
                  <Heading level={4} className="text-lg font-semibold text-green-600">
                    此时宜做
                  </Heading>
                  <Badge color="green">
                    {hourTaboos[expandedHour].recommends.length} 项
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {hourTaboos[expandedHour].recommends.length > 0 ? (
                    hourTaboos[expandedHour].recommends.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <Text className="text-green-700 dark:text-green-300 font-medium">
                          {item}
                        </Text>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <SparklesIcon className="size-8 text-gray-400 mx-auto mb-2" />
                      <Text className="text-gray-500 dark:text-gray-400">
                        此时辰无特别宜事
                      </Text>
                    </div>
                  )}
                </div>
              </div>

              {/* 忌事 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <XCircleIcon className="size-6 text-red-600" />
                  <Heading level={4} className="text-lg font-semibold text-red-600">
                    此时忌做
                  </Heading>
                  <Badge color="red">
                    {hourTaboos[expandedHour].avoids.length} 项
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  {hourTaboos[expandedHour].avoids.length > 0 ? (
                    hourTaboos[expandedHour].avoids.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        <Text className="text-red-700 dark:text-red-300 font-medium">
                          {item}
                        </Text>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <SparklesIcon className="size-8 text-gray-400 mx-auto mb-2" />
                      <Text className="text-gray-500 dark:text-gray-400">
                        此时辰无特别忌事
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全天时辰列表 */}
      <div className="space-y-4">
        <Heading level={3} className="text-lg font-semibold text-center">
          全天时辰概览
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hourTaboos.map((taboo, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                isCurrentHour(index)
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 ring-2 ring-red-300'
                  : expandedHour === index
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
              }`}
              onClick={() => setExpandedHour(expandedHour === index ? null : index)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getHourIcon(index)}
                  <Text className="font-semibold">
                    {taboo.hourName}时
                  </Text>
                  {isCurrentHour(index) && (
                    <Badge color="red" className="text-xs animate-pulse">
                      当前
                    </Badge>
                  )}
                </div>
                <Badge color={getHourColor(index)} className="text-xs">
                  {taboo.hourRange}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <Text className="text-green-600 dark:text-green-400 font-medium">
                    宜: {taboo.recommends.length}项
                  </Text>
                </div>
                <div className="text-center">
                  <Text className="text-red-600 dark:text-red-400 font-medium">
                    忌: {taboo.avoids.length}项
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 