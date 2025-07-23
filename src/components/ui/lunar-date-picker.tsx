'use client'

import { useState, useEffect, useRef } from 'react'
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { getLunarMonthsInYear, createSolarDateFromLunar, isValidLunarDate } from '@/lib/tyme'
import { Input } from '@/components/ui/input'

interface LunarDatePickerProps {
  value: Date
  onChange: (date: Date) => void
  className?: string
}

export function LunarDatePicker({ value, onChange, className }: LunarDatePickerProps) {
  // 从传入的公历日期转换为农历日期
  const [lunarYear, setLunarYear] = useState<number>(2024)
  const [lunarMonth, setLunarMonth] = useState<number>(1)
  const [lunarDay, setLunarDay] = useState<number>(1)
  
  // 年份输入框的临时输入状态
  const [yearInput, setYearInput] = useState<string>('2024')
  
  // 当前年份的月份信息
  const [monthsInYear, setMonthsInYear] = useState<Array<{
    month: number
    isLeap: boolean
    name: string
    days: number
  }>>([])
  
  // 当前月份的天数
  const [daysInMonth, setDaysInMonth] = useState<number>(30)
  
  // 标志位，避免初始化时触发onChange
  const [isInitialized, setIsInitialized] = useState(false)
  
  // 弹出日历的显示状态
  const [isOpen, setIsOpen] = useState(false)
  
  // 组件引用，用于检测外部点击
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 年份输入框引用，用于优化焦点处理
  const yearInputRef = useRef<HTMLInputElement>(null)
  
  // 添加一个标志位，避免在内部点击时触发外部点击逻辑
  const [isInternalClick, setIsInternalClick] = useState(false)
  
  // 初始化农历日期
  useEffect(() => {
    try {
      const { SolarDay } = require('tyme4ts')
      const solarDay = SolarDay.fromYmd(
        value.getFullYear(),
        value.getMonth() + 1,
        value.getDate()
      )
      const lunarDay = solarDay.getLunarDay()
      const lunarMonth = lunarDay.getLunarMonth()
      const lunarYear = lunarMonth.getLunarYear()
      
      setLunarYear(lunarYear.getYear())
      // 使用 getMonthWithLeap() 来正确获取闰月值（闰月为负数）
      setLunarMonth(lunarMonth.isLeap() ? -lunarMonth.getMonth() : lunarMonth.getMonth())
      setLunarDay(lunarDay.getDay())
      setYearInput(lunarYear.getYear().toString())
      setIsInitialized(true)
    } catch (error) {
      console.error('初始化农历日期失败:', error)
      setIsInitialized(true)
    }
  }, [value])
  
  // 更新年份时刷新月份信息
  useEffect(() => {
    const months = getLunarMonthsInYear(lunarYear)
    setMonthsInYear(months)
    
    // 检查当前月份是否存在，如果不存在则重置为第一个月份
    if (months.length > 0) {
      const currentMonth = months.find(m => 
        m.month === Math.abs(lunarMonth) && m.isLeap === (lunarMonth < 0)
      )
      if (!currentMonth) {
        setLunarMonth(months[0].month)
      }
    }
  }, [lunarYear, lunarMonth])
  
  // 更新月份时刷新天数信息
  useEffect(() => {
    const currentMonth = monthsInYear.find(m => 
      m.month === Math.abs(lunarMonth) && m.isLeap === (lunarMonth < 0)
    )
    if (currentMonth) {
      setDaysInMonth(currentMonth.days)
      // 如果当前天数超过了月份天数，重置为月末
      if (lunarDay > currentMonth.days) {
        setLunarDay(currentMonth.days)
      }
    }
  }, [lunarMonth, monthsInYear, lunarDay])
  
  // 农历日期改变时更新公历日期（只在初始化完成后且用户手动更改时触发）
  useEffect(() => {
    if (isInitialized && isValidLunarDate(lunarYear, lunarMonth, lunarDay)) {
      const solarDate = createSolarDateFromLunar(lunarYear, lunarMonth, lunarDay)
      // 检查新的公历日期是否与当前日期不同，避免不必要的更新
      if (solarDate.getTime() !== value.getTime()) {
        onChange(solarDate)
      }
    }
  }, [lunarYear, lunarMonth, lunarDay, isInitialized])

  // 处理外部点击关闭弹出层
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      // 如果是内部点击，不处理
      if (isInternalClick) {
        setIsInternalClick(false)
        return
      }
      
      // 确保组件仍然存在且事件目标有效
      if (!containerRef.current || !event.target) {
        return
      }
      
      // 检查点击是否在组件外部
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // 延迟添加事件监听器，避免立即触发
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true) // 使用捕获阶段
    }, 100) // 增加延迟时间

    return () => {
      clearTimeout(timeoutId)
      document.removeEventListener('mousedown', handleClickOutside, true)
    }
  }, [isOpen, isInternalClick])
  
  // 年份选项已改为输入框，不再需要生成选项列表
  
  // 生成月份选项
  const monthOptions = monthsInYear.map(month => ({
    value: (month.isLeap ? -month.month : month.month).toString(),
    label: month.name
  }))
  
  // 生成日期选项
  const dayOptions = []
  for (let day = 1; day <= daysInMonth; day++) {
    dayOptions.push({
      value: day.toString(),
      label: `${day}日`
    })
  }
  
  // 生成农历日期网格
  const generateCalendarGrid = () => {
    const currentMonth = monthsInYear.find(m => 
      m.month === Math.abs(lunarMonth) && m.isLeap === (lunarMonth < 0)
    )
    
    if (!currentMonth) return []
    
    const days = []
    for (let day = 1; day <= currentMonth.days; day++) {
      days.push({
        day,
        isSelected: day === lunarDay,
        isToday: false // 这里可以添加今天的逻辑
      })
    }
    
    return days
  }

  const calendarDays = generateCalendarGrid()

  // 格式化显示的农历日期
  const formatLunarDate = () => {
    const monthName = monthsInYear.find(m => 
      m.month === Math.abs(lunarMonth) && m.isLeap === (lunarMonth < 0)
    )?.name || '正月'
    return `${lunarYear}年 ${monthName} ${lunarDay}日`
  }

  // 优化的年份验证和更新函数
  const validateAndUpdateYear = (inputValue: string) => {
    const year = parseInt(inputValue)
    const currentYear = new Date().getFullYear()
    const minYear = currentYear - 99
    
    // 只在年份真正发生变化时才更新状态
    if (inputValue === '' || isNaN(year) || year < minYear || year > currentYear) {
      const correctedYear = lunarYear // 使用当前年份而不是重置到今年
      if (yearInput !== correctedYear.toString()) {
        setYearInput(correctedYear.toString())
      }
    } else if (year !== lunarYear) {
      setLunarYear(year)
      setYearInput(year.toString())
    }
  }

  // 处理日期点击
  const handleDayClick = (day: number) => {
    // 标记为内部点击
    setIsInternalClick(true)
    
    // 先失焦年份输入框（如果有焦点的话）
    if (yearInputRef.current && document.activeElement === yearInputRef.current) {
      yearInputRef.current.blur()
    }
    
    // 延迟执行日期更新，确保失焦事件先完成
    setTimeout(() => {
      setLunarDay(day)
      setIsOpen(false)
    }, 50)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 模拟原生日期输入框 */}
      <div 
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* 完全模拟原生input样式 */}
        <div 
          className="w-full border-2 focus-within:border-red-500 dark:focus-within:border-red-400 rounded-lg shadow-sm transition-all duration-300 pl-3 pr-10 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 flex items-center min-h-[2.5rem]"
        >
          <span className="flex-1">
            {formatLunarDate()}
          </span>
        </div>
        {/* 隐藏的原生input，用于保持一致性 */}
        <input
          type="text"
          value={formatLunarDate()}
          readOnly
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="选择农历日期"
        />
        <div 
          className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <CalendarIcon className="size-4 text-gray-400" />
        </div>
      </div>

      {/* 原生风格的弹出日历 */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg overflow-hidden">
          {/* 年月选择器 - 重新设计 */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <Button
              plain
              onClick={() => {
                const newYear = lunarYear - 1
                setLunarYear(newYear)
                setYearInput(newYear.toString())
              }}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            
            <div className="flex items-center space-x-2">
              {/* 年份输入框 */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">年份:</span>
                <div className="relative">
                  <input
                    ref={yearInputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={yearInput}
                    onChange={(e) => {
                      const value = e.target.value
                      // 只允许数字输入，最多4位
                      if (/^\d{0,4}$/.test(value)) {
                        setYearInput(value)
                      }
                    }}
                    onFocus={(e) => {
                      // 获得焦点时自动选中所有文本，让用户可以直接输入覆盖
                      ;(e.target as HTMLInputElement).select()
                    }}
                    onClick={(e) => {
                      // 点击时也选中所有文本，确保用户体验一致
                      ;(e.target as HTMLInputElement).select()
                    }}
                    onBlur={(e) => {
                      validateAndUpdateYear(e.target.value)
                    }}
                    onKeyDown={(e) => {
                      // Enter键确认并失焦
                      if (e.key === 'Enter') {
                        e.currentTarget.blur()
                        return
                      }
                      
                      // 允许删除、方向键等控制键
                      if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                        return
                      }
                      
                      // 只允许数字输入
                      if (!/^\d$/.test(e.key)) {
                        e.preventDefault()
                        return
                      }
                      
                      // 获取当前选中状态
                      const input = e.currentTarget
                      const selectionStart = input.selectionStart || 0
                      const selectionEnd = input.selectionEnd || 0
                      const currentValue = input.value
                      
                      // 计算输入后的新值长度
                      let newValueLength
                      if (selectionStart !== selectionEnd) {
                        // 有文本被选中，计算替换后的长度
                        newValueLength = currentValue.length - (selectionEnd - selectionStart) + 1
                      } else {
                        // 没有选中文本，就是插入
                        newValueLength = currentValue.length + 1
                      }
                      
                      // 限制最大长度为4位
                      if (newValueLength > 4) {
                        e.preventDefault()
                      }
                    }}
                    className="w-16 h-8 px-2 py-1 text-center text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 focus:ring-1 focus:ring-red-500 dark:focus:ring-red-400 transition-all"
                    style={{
                      appearance: 'textfield',
                      WebkitAppearance: 'none',
                      MozAppearance: 'textfield'
                    }}
                    onWheel={(e) => e.preventDefault()}
                    min={new Date().getFullYear() - 99}
                    max={new Date().getFullYear()}
                    placeholder="年份"
                  />
                </div>
              </div>

              {/* 月份选择框 */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">月份:</span>
                <div className="relative">
                  <select
                    value={lunarMonth.toString()}
                    onChange={(e) => setLunarMonth(parseInt(e.target.value))}
                    className="w-20 h-8 px-2 py-1 text-center text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:border-red-500 dark:focus:border-red-400 focus:ring-1 focus:ring-red-500 dark:focus:ring-red-400 transition-all cursor-pointer"
                    style={{ 
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      backgroundImage: 'none'
                    }}
                  >
                    {monthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <Button
              plain
              onClick={() => {
                const newYear = lunarYear + 1
                setLunarYear(newYear)
                setYearInput(newYear.toString())
              }}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>

          {/* 日期网格 - 原生风格 */}
          <div className="p-3">
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day) => (
                <button
                  key={day.day}
                  onClick={() => handleDayClick(day.day)}
                  onMouseDown={(e) => {
                    // 阻止默认的mousedown行为，避免和其他事件冲突
                    e.preventDefault()
                    setIsInternalClick(true)
                  }}
                  className={`
                    w-8 h-8 text-sm flex items-center justify-center rounded transition-colors duration-200
                    ${day.isSelected 
                      ? 'bg-red-500 text-white font-medium' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }
                  `}
                >
                  {day.day}
                </button>
              ))}
            </div>
          </div>

          {/* 底部操作栏 - 原生风格 */}
          <div className="flex justify-between items-center px-3 py-2 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <Button
              plain
              onClick={() => {
                // 重置为今天对应的农历日期
                const today = new Date()
                try {
                  const { SolarDay } = require('tyme4ts')
                  const solarDay = SolarDay.fromYmd(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    today.getDate()
                  )
                  const lunarDay = solarDay.getLunarDay()
                  const lunarMonth = lunarDay.getLunarMonth()
                  const lunarYear = lunarMonth.getLunarYear()
                  
                  setLunarYear(lunarYear.getYear())
                  setLunarMonth(lunarMonth.getMonth())
                  setLunarDay(lunarDay.getDay())
                  setYearInput(lunarYear.getYear().toString())
                  setIsOpen(false)
                } catch (error) {
                  console.error('重置今天失败:', error)
                }
              }}
              className="text-sm text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 px-2 py-1 rounded transition-colors"
            >
              今天
            </Button>
            
            <Button
              plain
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-900/20 px-2 py-1 rounded transition-colors"
            >
              关闭
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 