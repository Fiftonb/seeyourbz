'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Fieldset, Label } from '@/components/ui/fieldset'
import { LunarDatePicker } from '@/components/ui/lunar-date-picker'
import { CalendarDaysIcon, ClockIcon, MapPinIcon, UserIcon } from '@heroicons/react/24/outline'

interface UserInput {
  birthDate: Date
  birthTime: string
  gender: 'male' | 'female'
  name: string
  dateType: 'solar' | 'lunar'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedDate && userInput.birthTime) {
      onSubmit({
        birthDate: selectedDate,
        birthTime: userInput.birthTime,
        gender: userInput.gender,
        name: userInput.name,
        dateType
      })
    }
  }

  const handleInputChange = (field: keyof typeof userInput, value: string) => {
    setUserInput(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">桃花运测算</h2>
          <p className="text-sm text-gray-600">请输入您的出生信息进行桃花运分析</p>
        </div>
      </div>

      <Fieldset>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 姓名输入 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">姓名</Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={userInput.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="请输入您的姓名"
                className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* 日期类型选择 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">日期类型</Label>
            <div className="flex rounded-md overflow-hidden">
              <Button 
                type="button"
                onClick={() => setDateType('lunar')}
                className={`px-4 py-2 transition-all duration-300 ${dateType === 'lunar'
                  ? 'bg-pink-600 text-white hover:bg-pink-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                农历
              </Button>
              <Button 
                type="button"
                onClick={() => setDateType('solar')}
                className={`px-4 py-2 transition-all duration-300 ${dateType === 'solar'
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                公历
              </Button>
            </div>
          </div>

          {/* 出生日期 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {dateType === 'lunar' ? '农历日期' : '公历日期'}
            </Label>
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              {dateType === 'lunar' ? (
                <LunarDatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  className="w-full [&>div>div]:pl-10 [&>div>input]:pl-10"
                />
              ) : (
                <Input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              )}
            </div>
          </div>

          {/* 出生时间 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">出生时间</Label>
            <div className="relative">
              <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="time"
                value={userInput.birthTime}
                onChange={(e) => handleInputChange('birthTime', e.target.value)}
                className="pl-10 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                required
              />
            </div>
          </div>

          {/* 性别选择 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">性别</Label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="male"
                  checked={userInput.gender === 'male'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">男</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="female"
                  checked={userInput.gender === 'female'}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 focus:ring-pink-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">女</span>
              </label>
            </div>
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            disabled={isLoading || !selectedDate || !userInput.birthTime}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                分析中...
              </div>
            ) : (
              '开始测算桃花运'
            )}
          </Button>
        </form>
      </Fieldset>
    </div>
  )
} 