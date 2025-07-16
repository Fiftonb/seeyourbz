'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CalendarIcon,
  ArrowPathIcon 
} from '@heroicons/react/16/solid'

interface AlmanacCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export function AlmanacCalendar({ selectedDate, onDateChange }: AlmanacCalendarProps) {
  const [viewType, setViewType] = useState<'calendar' | 'quick'>('calendar')
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1))

  // 获取当前月的日历数据
  const getMonthDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const firstDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // 前一个月的日期（填充）
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i)
      days.push({ date, isCurrentMonth: false })
    }
    
    // 当前月的日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({ date, isCurrentMonth: true })
    }
    
    // 下一个月的日期（填充到42个位置）
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i)
      days.push({ date, isCurrentMonth: false })
    }
    
    return days
  }

  // 切换月份
  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1))
  }

  // 快速跳转到特定日期
  const quickJump = (days: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + days)
    onDateChange(newDate)
  }

  // 判断是否是今天
  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // 判断是否是选中日期
  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const monthDays = getMonthDays()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  return (
    <div className="space-y-6">
      {/* 标题和切换 */}
      <div className="text-center space-y-4">
        <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white">
          选择日期
        </Heading>
        
        {/* 视图切换 */}
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex gap-1">
            <Button
              plain
              onClick={() => setViewType('calendar')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                viewType === 'calendar'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <CalendarIcon className="size-4 mr-2" />
              日历选择
            </Button>
            <Button
              plain
              onClick={() => setViewType('quick')}
              className={`px-4 py-2 rounded-md transition-all duration-300 ${
                viewType === 'quick'
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              }`}
            >
              <ArrowPathIcon className="size-4 mr-2" />
              快速跳转
            </Button>
          </div>
        </div>
      </div>

      {viewType === 'calendar' ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          {/* 月份导航 */}
          <div className="flex items-center justify-between mb-6">
            <Button
              plain
              onClick={() => changeMonth(-1)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <ChevronLeftIcon className="size-5" />
            </Button>
            
            <div className="text-center">
              <Heading level={3} className="text-lg font-semibold">
                {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
              </Heading>
            </div>
            
            <Button
              plain
              onClick={() => changeMonth(1)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <ChevronRightIcon className="size-5" />
            </Button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-2">
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day}
                </Text>
              </div>
            ))}
          </div>

          {/* 日期网格 */}
          <div className="grid grid-cols-7 gap-1">
            {monthDays.map((dayInfo, index) => {
              const { date, isCurrentMonth } = dayInfo
              const today = isToday(date)
              const selected = isSelected(date)
              
              return (
                <Button
                  key={index}
                  plain
                  onClick={() => onDateChange(date)}
                  className={`
                    p-2 h-10 text-sm relative rounded-lg border transition-all duration-200
                    ${selected 
                      ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                      : today 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-700' 
                        : isCurrentMonth
                          ? 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'border-transparent text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400'
                    }
                  `}
                >
                  {date.getDate()}
                  {today && !selected && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></div>
                  )}
                </Button>
              )
            })}
          </div>

          {/* 选中日期显示 */}
          <div className="mt-6 text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              当前选择
            </Text>
            <Badge color="red" className="text-sm">
              {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
            </Badge>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 快速跳转按钮 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <Heading level={3} className="text-lg font-semibold mb-4 text-center">
              快速日期跳转
            </Heading>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                plain
                onClick={() => quickJump(-7)}
                className="p-3 bg-blue-500 text-white hover:bg-blue-600 rounded-lg transition-colors"
              >
                7天前
              </Button>
              <Button
                plain
                onClick={() => quickJump(-3)}
                className="p-3 bg-green-500 text-white hover:bg-green-600 rounded-lg transition-colors"
              >
                3天前
              </Button>
              <Button
                plain
                onClick={() => quickJump(-1)}
                className="p-3 bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg transition-colors"
              >
                昨天
              </Button>
              <Button
                plain
                onClick={() => onDateChange(new Date())}
                className="p-3 bg-red-500 text-white hover:bg-red-600 rounded-lg transition-colors"
              >
                今天
              </Button>
              <Button
                plain
                onClick={() => quickJump(1)}
                className="p-3 bg-purple-500 text-white hover:bg-purple-600 rounded-lg transition-colors"
              >
                明天
              </Button>
              <Button
                plain
                onClick={() => quickJump(3)}
                className="p-3 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg transition-colors"
              >
                3天后
              </Button>
              <Button
                plain
                onClick={() => quickJump(7)}
                className="p-3 bg-pink-500 text-white hover:bg-pink-600 rounded-lg transition-colors"
              >
                7天后
              </Button>
              <Button
                plain
                onClick={() => quickJump(30)}
                className="p-3 bg-orange-500 text-white hover:bg-orange-600 rounded-lg transition-colors"
              >
                30天后
              </Button>
            </div>
          </div>

          {/* 精确日期输入 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <Heading level={3} className="text-lg font-semibold mb-4 text-center">
              精确日期选择
            </Heading>
            
            <div className="max-w-md mx-auto">
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => onDateChange(new Date(e.target.value))}
                className="w-full text-center"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 