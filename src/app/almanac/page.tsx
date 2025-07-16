'use client'

import { useState, useEffect } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { getTodayAlmanac, getAlmanacInfo } from '@/lib/tyme'
import { CalendarIcon, ClockIcon, SparklesIcon, SunIcon } from '@heroicons/react/16/solid'
import { AlmanacOverview } from '@/components/almanac/AlmanacOverview'
import { AlmanacCalendar } from '@/components/almanac/AlmanacCalendar'
import { AlmanacDetails } from '@/components/almanac/AlmanacDetails'
import { HourTaboo } from '@/components/almanac/HourTaboo'
import { AlmanacCards } from '@/components/almanac/AlmanacCards'

export default function AlmanacPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [almanacInfo, setAlmanacInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'hours'>('overview')

  // 初始化和日期变化时获取黄历信息
  useEffect(() => {
    const loadAlmanacInfo = async () => {
      setIsLoading(true)
      try {
        const info = getAlmanacInfo(selectedDate)
        setAlmanacInfo(info)
      } catch (error) {
        console.error('获取黄历信息失败:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAlmanacInfo()
  }, [selectedDate])

  // 回到今天
  const goToToday = () => {
    setSelectedDate(new Date())
  }

  // 是否是今天
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className="space-y-8">
      {/* 标题区域 */}
      <div className="text-center space-y-4">
        <Heading level={1} className="text-4xl font-bold text-gray-900 dark:text-white">
          传统黄历
        </Heading>
        <Text className="text-xl text-gray-600 dark:text-gray-400">
          查看宜忌事项，选择吉日良时
        </Text>
        <div className="flex justify-center gap-3 items-center">
          <Button
            outline
            onClick={goToToday}
            disabled={isToday(selectedDate)}
            className="text-sm px-4 py-2 transition-all duration-300 transform hover:scale-105"
          >
            <SunIcon className="size-4 mr-1" />
            回到今天
          </Button>
          <Badge color={isToday(selectedDate) ? "green" : "blue"}>
            <CalendarIcon className="size-4 mr-1" />
            {isToday(selectedDate) ? "今日黄历" : "自选查询"}
          </Badge>
        </div>
      </div>

      <Divider />

      {/* 今日概览或加载状态 */}
      {isLoading ? (
        <div className="text-center space-y-4">
          <div className="animate-spin mx-auto">
            <SparklesIcon className="size-8 text-amber-500" />
          </div>
          <Text className="text-gray-600 dark:text-gray-400">
            正在加载黄历信息...
          </Text>
        </div>
      ) : almanacInfo ? (
        <AlmanacOverview almanacInfo={almanacInfo} isToday={isToday(selectedDate)} />
      ) : null}

      <Divider />

      {/* 日期选择器 */}
      <div className="max-w-4xl mx-auto">
        <AlmanacCalendar 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      <Divider />

      {/* 功能切换标签 */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-1">
            <Button
              plain
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600'
              }`}
            >
              <CalendarIcon className="size-4 mr-2" />
              概览信息
            </Button>
            <Button
              plain
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'details'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600'
              }`}
            >
              <SparklesIcon className="size-4 mr-2" />
              详细信息
            </Button>
            <Button
              plain
              onClick={() => setActiveTab('hours')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'hours'
                  ? 'bg-white dark:bg-gray-700 shadow-md text-gray-900 dark:text-white'
                  : 'bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600'
              }`}
            >
              <ClockIcon className="size-4 mr-2" />
              时辰宜忌
            </Button>
          </div>
        </div>

        {/* 内容区域 */}
        {!isLoading && almanacInfo && (
          <div className="animate-fade-in">
            {activeTab === 'overview' && (
              <AlmanacCards almanacInfo={almanacInfo} />
            )}
            {activeTab === 'details' && (
              <AlmanacDetails almanacInfo={almanacInfo} />
            )}
            {activeTab === 'hours' && (
              <HourTaboo selectedDate={selectedDate} />
            )}
          </div>
        )}
      </div>

      {/* 功能说明 */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            黄历功能说明
          </Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge color="green" className="text-xs">宜</Badge>
                <Text className="text-sm">适宜进行的活动事项</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Badge color="red" className="text-xs">忌</Badge>
                <Text className="text-sm">不宜进行的活动事项</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Badge color="blue" className="text-xs">神煞</Badge>
                <Text className="text-sm">当日吉神凶煞信息</Text>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge color="purple" className="text-xs">时辰</Badge>
                <Text className="text-sm">十二时辰宜忌详情</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Badge color="orange" className="text-xs">胎神</Badge>
                <Text className="text-sm">当日胎神方位信息</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Badge color="yellow" className="text-xs">冲煞</Badge>
                <Text className="text-sm">相冲生肖和煞向</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 