'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'
import { LunarDatePicker } from '@/components/ui/lunar-date-picker'
import { SolarTimeConfigComponent } from '@/components/ui/solar-time-config'
import { SolarTimeConfig } from '@/lib/tyme'
import { CalendarIcon, ClockIcon, UserIcon, HeartIcon, SparklesIcon } from '@heroicons/react/16/solid'

interface UserInput {
  birthDate: Date
  birthTime: string
  gender: 'male' | 'female'
  name: string
  dateType: 'solar' | 'lunar'
  solarTimeConfig: SolarTimeConfig
}

interface PeachBlossomFormProps {
  onSubmit: (data: UserInput) => void
  isLoading?: boolean
}

export function PeachBlossomForm({ onSubmit, isLoading = false }: PeachBlossomFormProps) {
  const [dateType, setDateType] = useState<'solar' | 'lunar'>('lunar')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 9, 15))
  const [userInput, setUserInput] = useState<{
    birthTime: string
    gender: 'male' | 'female'
    name: string
  }>({
    birthTime: '',
    gender: 'male',
    name: ''
  })
  const [solarTimeConfig, setSolarTimeConfig] = useState<SolarTimeConfig>({
    useSolarTime: false,
    method: 'simple'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && userInput.birthTime) {
      onSubmit({
        birthDate: selectedDate,
        birthTime: userInput.birthTime,
        gender: userInput.gender,
        name: userInput.name,
        dateType,
        solarTimeConfig
      })
    }
  }

  const handleInputChange = (field: keyof typeof userInput, value: string) => {
    setUserInput(prev => ({ ...prev, [field]: value }))
  }

  // 使用示例数据
  const handleUseExample = () => {
    setDateType('lunar')
    setSelectedDate(new Date(2000, 9, 15))
    setUserInput({
      birthTime: '14:30',
      gender: 'female',
      name: '李小红'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 标题区域 */}
      <div className="text-center space-y-4 mb-8">
        <div className="flex justify-center gap-3 items-center">
          <Button
            plain
            onClick={handleUseExample}
            className="text-sm px-4 py-2 transition-all duration-300 transform hover:scale-105"
          >
            使用示例数据
          </Button>
          <Badge color="pink">
            <HeartIcon className="size-4 mr-1" />
            桃花运测算
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 统一的信息输入卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="text-lg font-semibold">
              桃花运测算信息
            </Heading>
            <Badge color="pink">
              <SparklesIcon className="size-4 mr-1" />
              个人信息
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 第一列 */}
            <div className="space-y-4">
              {/* 姓名输入 */}
              <div>
                <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  姓名
                </Text>
                <Input
                  type="text"
                  value={userInput.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入您的姓名"
                  className="w-full [&>input]:border-2 [&>input]:focus-within:border-pink-500 [&>input]:dark:focus-within:border-pink-400 [&>input]:rounded-lg [&>input]:shadow-sm [&>input]:transition-all [&>input]:duration-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:dark:text-white [&>input]:bg-white [&>input]:dark:bg-gray-700/50 [&>input]:border-gray-300 [&>input]:dark:border-gray-600 [&>input]:hover:border-gray-400 [&>input]:dark:hover:border-gray-500 [&>input]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
                />
              </div>

              {/* 性别选择 */}
              <div>
                <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  性别
                </Text>
                <div className="inline-flex rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => handleInputChange('gender', 'male')}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${userInput.gender === 'male'
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    男
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleInputChange('gender', 'female')}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${userInput.gender === 'female'
                      ? 'bg-pink-600 text-white hover:bg-pink-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    女
                  </button>
                </div>
              </div>

              {/* 日期类型选择 */}
              <div>
                <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  日期类型
                </Text>
                <div className="inline-flex rounded-lg overflow-hidden">
                  <button 
                    type="button"
                    onClick={() => setDateType('lunar')}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${dateType === 'lunar'
                      ? 'bg-pink-600 text-white hover:bg-pink-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    农历
                  </button>
                  <button 
                    type="button"
                    onClick={() => setDateType('solar')}
                    className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${dateType === 'solar'
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    公历
                  </button>
                </div>
              </div>
            </div>

            {/* 第二列 */}
            <div className="space-y-4">
              {/* 出生日期 */}
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
                    className="w-full [&>input]:border-2 [&>input]:focus-within:border-pink-500 [&>input]:dark:focus-within:border-pink-400 [&>input]:rounded-lg [&>input]:shadow-sm [&>input]:transition-all [&>input]:duration-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:dark:text-white [&>input]:bg-white [&>input]:dark:bg-gray-700/50 [&>input]:border-gray-300 [&>input]:dark:border-gray-600 [&>input]:hover:border-gray-400 [&>input]:dark:hover:border-gray-500 [&>input]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
                    onClick={(e) => {
                      const input = e.currentTarget as HTMLInputElement;
                      input.focus();
                      input.showPicker?.();
                    }}
                  />
                )}
              </div>

              {/* 出生时间 */}
              <div>
                <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  出生时间
                </Text>
                <Input
                  type="time"
                  value={userInput.birthTime}
                  onChange={(e) => handleInputChange('birthTime', e.target.value)}
                  className="w-full [&>input]:border-2 [&>input]:focus-within:border-pink-500 [&>input]:dark:focus-within:border-pink-400 [&>input]:rounded-lg [&>input]:shadow-sm [&>input]:transition-all [&>input]:duration-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:dark:text-white [&>input]:bg-white [&>input]:dark:bg-gray-700/50 [&>input]:border-gray-300 [&>input]:dark:border-gray-600 [&>input]:hover:border-gray-400 [&>input]:dark:hover:border-gray-500 [&>input]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
                  onClick={(e) => {
                    const input = e.currentTarget as HTMLInputElement;
                    input.focus();
                    input.showPicker?.();
                  }}
                  required
                />
              </div>

              {/* 占位元素以保持布局平衡 */}
              <div></div>
            </div>
          </div>

          {/* 说明文字 */}
          <div className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
            <div className="flex items-start gap-3">
              <SparklesIcon className="size-5 text-pink-600 dark:text-pink-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <Text className="text-sm font-medium text-pink-900 dark:text-pink-100">
                  桃花运分析说明
                </Text>
                <Text className="text-xs text-pink-700 dark:text-pink-300">
                  • 基于传统八字命理学进行分析 • 结合出生时间推算桃花位置 • 预测感情运势和桃花机遇 • 提供专业的情感指导建议
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* 真太阳时配置 */}
        <SolarTimeConfigComponent
          value={solarTimeConfig}
          onChange={setSolarTimeConfig}
          birthTime={(() => {
            if (!userInput.birthTime) return undefined;
            const [hours, minutes] = userInput.birthTime.split(':').map(Number)
            const birthTime = new Date(selectedDate)
            birthTime.setHours(hours, minutes, 0, 0)
            return birthTime
          })()}
          showPreview={true}
        />

        {/* 操作按钮区域 */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-pink-200 dark:border-pink-800">
          <div className="text-center space-y-4">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
              开始测算
            </Heading>
            <button
              type="submit"
              disabled={isLoading || !selectedDate || !userInput.birthTime}
              className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <HeartIcon className="size-4 animate-spin" />
              )}
              {isLoading ? '分析中...' : '开始测算桃花运'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
} 