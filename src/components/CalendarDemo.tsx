'use client'

import { useState } from 'react'
import { SolarDay } from 'tyme4ts'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { DescriptionList, DescriptionDetails, DescriptionTerm } from '@/components/ui/description-list'
import { Fieldset } from '@/components/ui/fieldset'
import { CalendarIcon, StarIcon, SunIcon, ArrowPathIcon, ClockIcon } from '@heroicons/react/16/solid'
export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const solarDay = SolarDay.fromYmd(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    selectedDate.getDate()
  )

  const lunarDay = solarDay.getLunarDay()
  const sixtyCycleDay = lunarDay.getSixtyCycleDay()
  const constellation = solarDay.getConstellation()
  const term = solarDay.getTerm()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="size-6 text-blue-600" />
          <Heading level={2} className="!text-xl">
            日历演示
          </Heading>
          <Badge color="blue">
            tyme4ts 支持
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="size-4 text-gray-500" />
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            实时更新
          </Text>
        </div>
      </div>
      
      <Fieldset className="mb-6">
        <Text className="text-sm font-medium mb-2">
          选择日期：
        </Text>
        <div className="flex items-center space-x-3">
          <Input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="max-w-xs"
          />
          <Button plain onClick={() => setSelectedDate(new Date())} title="重置为今天">
            <ArrowPathIcon className="size-4" />
          </Button>
        </div>
      </Fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-2 mb-4">
            <SunIcon className="size-5 text-orange-600" />
            <Heading level={3} className="!text-lg">
              公历信息
            </Heading>
          </div>
          
          <DescriptionList>
            <DescriptionTerm>日期</DescriptionTerm>
            <DescriptionDetails>
              <Text className="font-medium">{solarDay.toString()}</Text>
            </DescriptionDetails>
            
            <DescriptionTerm>星期</DescriptionTerm>
            <DescriptionDetails>
              <Badge color="blue">
                {solarDay.getWeek().getName()}
              </Badge>
            </DescriptionDetails>
            
            <DescriptionTerm>节气</DescriptionTerm>
            <DescriptionDetails>
              {term ? (
                <Badge color="green">{term.getName()}</Badge>
              ) : (
                <Text className="text-gray-500">无</Text>
              )}
            </DescriptionDetails>
            
            <DescriptionTerm>星座</DescriptionTerm>
            <DescriptionDetails>
              <div className="flex items-center space-x-1">
                <StarIcon className="size-4 text-yellow-600" />
                <Badge color="purple">{constellation.toString()}</Badge>
              </div>
            </DescriptionDetails>
          </DescriptionList>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 mb-4">
            <CalendarIcon className="size-5 text-red-600" />
            <Heading level={3} className="!text-lg">
              农历信息
            </Heading>
          </div>
          
          <DescriptionList>
            <DescriptionTerm>农历日期</DescriptionTerm>
            <DescriptionDetails>
              <Text className="font-medium">{lunarDay.toString()}</Text>
            </DescriptionDetails>
            
            <DescriptionTerm>干支纪日</DescriptionTerm>
            <DescriptionDetails>
              <Badge color="orange">{sixtyCycleDay.toString()}</Badge>
            </DescriptionDetails>
            
            <DescriptionTerm>农历年份</DescriptionTerm>
            <DescriptionDetails>
              <Text>{lunarDay.getYear().toString()}</Text>
            </DescriptionDetails>
            
            <DescriptionTerm>农历月份</DescriptionTerm>
            <DescriptionDetails>
              <Badge color="red">{lunarDay.getMonth().toString()}</Badge>
            </DescriptionDetails>
          </DescriptionList>
        </div>
      </div>
    </div>
  )
} 