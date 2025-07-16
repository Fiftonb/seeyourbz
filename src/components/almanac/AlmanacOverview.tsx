'use client'

import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { getAlmanacActivityDescriptions } from '@/lib/tyme'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  CalendarIcon, 
  SparklesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/16/solid'

interface AlmanacOverviewProps {
  almanacInfo: any
  isToday: boolean
}

export function AlmanacOverview({ almanacInfo, isToday }: AlmanacOverviewProps) {
  const showDescriptions = true
  
  const { 
    solarDate, 
    lunarDate, 
    weekDay, 
    recommends, 
    avoids,
    nineStar,
    phase,
    festival,
    season,
    clash,
    evil,
    pengzu
  } = almanacInfo

  const descriptions = getAlmanacActivityDescriptions()

  // 显示的宜忌数量
  const maxDisplay = 4

  return (
    <div className="max-w-6xl mx-auto">
      {/* 日期信息横幅 */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6 shadow-lg mb-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center gap-2 mb-2">
            <CalendarIcon className="size-6" />
            <Badge color="zinc" className="text-red-600 bg-white">
              {isToday ? '今日黄历' : '历史查询'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <Text className="text-red-100 text-sm mb-1">公历</Text>
              <Heading level={2} className="text-2xl font-bold text-white">
                {solarDate}
              </Heading>
              <Text className="text-red-100 text-sm">
                {weekDay}
              </Text>
            </div>
            
            <div>
              <Text className="text-red-100 text-sm mb-1">农历</Text>
              <Heading level={2} className="text-xl font-bold text-white">
                {lunarDate}
              </Heading>
              <div className="flex justify-center gap-2 mt-1">
                <Badge color="yellow" className="text-xs">
                  {season}
                </Badge>
                {festival && (
                  <Badge color="pink" className="text-xs">
                    {festival}
                  </Badge>
                )}
              </div>
            </div>
            
            <div>
              <Text className="text-red-100 text-sm mb-1">九星</Text>
              <Heading level={2} className="text-xl font-bold text-white">
                {nineStar}
              </Heading>
              <Text className="text-red-100 text-sm">
                {phase}
              </Text>
            </div>
          </div>
        </div>
      </div>



      {/* 冲煞信息 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <ExclamationTriangleIcon className="size-5 text-orange-600" />
          <Heading level={3} className="text-lg font-semibold text-orange-600">
            冲煞信息
          </Heading>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Text className="text-sm text-orange-600 dark:text-orange-400 mb-1">冲</Text>
            <Badge color="orange" className="text-sm">
              {clash}
            </Badge>
          </div>
          
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Text className="text-sm text-red-600 dark:text-red-400 mb-1">煞</Text>
            <Badge color="red" className="text-sm">
              {evil}
            </Badge>
          </div>
          
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Text className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">彭祖百忌</Text>
            <Text className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
              {pengzu}
            </Text>
          </div>
        </div>
      </div>

      {/* 宜忌概览 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 宜 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="size-6 text-green-600" />
              <Heading level={3} className="text-lg font-semibold text-green-600">
                宜
              </Heading>
            </div>
            <Badge color="green">
              {recommends.length} 项
            </Badge>
          </div>
          
          <div className="space-y-3">
            {recommends.length > 0 ? (
              <>
                <div className="space-y-2">
                  {recommends.slice(0, maxDisplay).map((item: string, index: number) => (
                    <div key={index} className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <Text className="font-medium text-green-700 dark:text-green-300">
                            {item}
                          </Text>
                          {showDescriptions && descriptions[item] && (
                            <Text className="text-sm text-green-600 dark:text-green-400 mt-1">
                              {descriptions[item]}
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {recommends.length > maxDisplay && (
                  <div className="text-center">
                    <Badge color="green" className="text-xs">
                      还有 {recommends.length - maxDisplay} 项宜事
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <SparklesIcon className="size-8 text-gray-400 mx-auto mb-2" />
                <Text className="text-gray-500 dark:text-gray-400">
                  今日无特别宜事
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* 忌 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <XCircleIcon className="size-6 text-red-600" />
              <Heading level={3} className="text-lg font-semibold text-red-600">
                忌
              </Heading>
            </div>
            <Badge color="red">
              {avoids.length} 项
            </Badge>
          </div>
          
          <div className="space-y-3">
            {avoids.length > 0 ? (
              <>
                <div className="space-y-2">
                  {avoids.slice(0, maxDisplay).map((item: string, index: number) => (
                    <div key={index} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <Text className="font-medium text-red-700 dark:text-red-300">
                            {item}
                          </Text>
                          {showDescriptions && descriptions[item] && (
                            <Text className="text-sm text-red-600 dark:text-red-400 mt-1">
                              {descriptions[item]}
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {avoids.length > maxDisplay && (
                  <div className="text-center">
                    <Badge color="red" className="text-xs">
                      还有 {avoids.length - maxDisplay} 项忌事
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <SparklesIcon className="size-8 text-gray-400 mx-auto mb-2" />
                <Text className="text-gray-500 dark:text-gray-400">
                  今日无特别忌事
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 