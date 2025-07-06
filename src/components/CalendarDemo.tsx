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
import { CalendarIcon, StarIcon, SunIcon, ClockIcon } from '@heroicons/react/16/solid'
import { LunarDatePicker } from '@/components/ui/lunar-date-picker'
export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [useLunarCalendar, setUseLunarCalendar] = useState(false)
  
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
            日历信息
          </Heading>
        </div>
        <div className="flex items-center space-x-2">
          <ClockIcon className="size-4 text-gray-500" />
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            实时更新
          </Text>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between mb-4">
            <Text className="text-sm font-medium">
              日期选择模式：
            </Text>
            <div className="flex items-center space-x-2">
              <div className="flex rounded-md overflow-hidden">
                <Button 
                  onClick={() => setUseLunarCalendar(false)}
                  className={`px-4 py-1.5 transition-all duration-300 ${!useLunarCalendar 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                >
                  公历
                </Button>
                <Button 
                  onClick={() => setUseLunarCalendar(true)}
                  className={`px-4 py-1.5 transition-all duration-300 ${useLunarCalendar 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                >
                  农历
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                {useLunarCalendar ? (
                  <CalendarIcon className="size-4 text-red-500" />
                ) : (
                  <SunIcon className="size-4 text-orange-500" />
                )}
                <span>
                  {useLunarCalendar ? '农历模式' : '公历模式'}
                </span>
              </div>
              <Badge color={useLunarCalendar ? 'red' : 'blue'} className="transition-colors duration-300">
                {useLunarCalendar ? '传统' : '现代'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              {useLunarCalendar ? (
                /* 农历日期选择器 */
                <div className="space-y-3">
                  <LunarDatePicker 
                    value={selectedDate} 
                    onChange={setSelectedDate}
                    className="w-full"
                  />
                </div>
              ) : (
                /* 公历日期选择器 */
                <div className="flex items-center space-x-3">
                  <div className="flex-1">
                    <div 
                      className="relative cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById('date-input') as HTMLInputElement;
                        if (input) {
                          if (input.showPicker) {
                            input.showPicker();
                          } else {
                            input.focus();
                          }
                        }
                      }}
                    >
                      {/* Styled presentation layer */}
                      <div 
                        className="w-full border-2 focus-within:border-blue-500 dark:focus-within:border-blue-400 rounded-lg shadow-sm transition-all duration-300 pl-3 pr-10 py-2.5 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 flex items-center min-h-[2.5rem]"
                      >
                        <span className="flex-1">
                          {selectedDate.toLocaleDateString('zh-CN', { 
                            year: 'numeric', 
                            month: '2-digit', 
                            day: '2-digit' 
                          }).replace(/\//g, '/')}
                        </span>
                      </div>
                      {/* Hidden but functional input */}
                      <input
                        id="date-input"
                        type="date"
                        value={selectedDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedDate(new Date(e.target.value));
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        aria-label="选择日期"
                      />
                      <div 
                        className="absolute inset-y-0 right-3 flex items-center pointer-events-none"
                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                      >
                        <CalendarIcon className="size-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {useLunarCalendar ? '直接选择农历日期，自动转换为对应的公历日期' : '点击日期框选择公历日期'}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 根据选择的模式调整显示顺序 */}
        {useLunarCalendar ? (
          <>
            {/* 农历信息（主要） */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border-2 border-red-300 dark:border-red-700 relative transition-all duration-500">
              <div className="absolute top-2 right-2">
                <Badge color="red">主要</Badge>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <CalendarIcon className="size-5 text-red-600" />
                <Heading level={3} className="!text-lg">
                  农历信息
                </Heading>
              </div>
              
              <DescriptionList>
                <DescriptionTerm>农历日期</DescriptionTerm>
                <DescriptionDetails>
                  <Text className="font-medium text-lg">{lunarDay.toString()}</Text>
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
            
            {/* 公历信息（次要） */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800 opacity-80 transition-all duration-500">
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
          </>
        ) : (
          <>
            {/* 公历信息（主要） */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-lg border-2 border-orange-300 dark:border-orange-700 relative transition-all duration-500">
              <div className="absolute top-2 right-2">
                <Badge color="blue">主要</Badge>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <SunIcon className="size-5 text-orange-600" />
                <Heading level={3} className="!text-lg">
                  公历信息
                </Heading>
              </div>
              
              <DescriptionList>
                <DescriptionTerm>日期</DescriptionTerm>
                <DescriptionDetails>
                  <Text className="font-medium text-lg">{solarDay.toString()}</Text>
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
            
            {/* 农历信息（次要） */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 opacity-80 transition-all duration-500">
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
          </>
        )}
      </div>
    </div>
  )
} 