'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAlmanacActivityDescriptions } from '@/lib/tyme'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  SparklesIcon,
  InformationCircleIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/16/solid'

interface AlmanacDetailsProps {
  almanacInfo: any
}

export function AlmanacDetails({ almanacInfo }: AlmanacDetailsProps) {
  const [showDescriptions, setShowDescriptions] = useState(true)
  const [expandedRecommends, setExpandedRecommends] = useState(false)
  const [expandedAvoids, setExpandedAvoids] = useState(false)
  
  const {
    recommends,
    avoids,
    goodGods,
    badGods,
    duty,
    nineStar,
    star28,
    pengzu,
    clash,
    evil,
    fetus
  } = almanacInfo

  const descriptions = getAlmanacActivityDescriptions()

  // 显示数量控制
  const displayCount = 6

  return (
    <div className="space-y-6">
      {/* 功能控制 */}
      <div className="flex justify-center gap-4">
        <Button
          plain
          onClick={() => setShowDescriptions(!showDescriptions)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            showDescriptions
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
          }`}
        >
          <InformationCircleIcon className="size-4 mr-2" />
          {showDescriptions ? '隐藏说明' : '显示说明'}
        </Button>
      </div>

      {/* 宜忌详情 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 宜 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="size-6 text-green-600" />
              <Heading level={3} className="text-lg font-semibold text-green-600">
                宜事详情
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
                  {(expandedRecommends ? recommends : recommends.slice(0, displayCount)).map((item: string, index: number) => (
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

                {recommends.length > displayCount && (
                  <div className="text-center">
                    <Button
                      plain
                      onClick={() => setExpandedRecommends(!expandedRecommends)}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 px-3 py-2 rounded-lg border border-green-300 dark:border-green-700 transition-colors"
                    >
                      {expandedRecommends ? (
                        <>
                          <EyeSlashIcon className="size-4 mr-1" />
                          收起 ({recommends.length - displayCount} 项)
                        </>
                      ) : (
                        <>
                          <EyeIcon className="size-4 mr-1" />
                          展开 ({recommends.length - displayCount} 项)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <SparklesIcon className="size-12 text-gray-400 mx-auto mb-3" />
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
                忌事详情
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
                  {(expandedAvoids ? avoids : avoids.slice(0, displayCount)).map((item: string, index: number) => (
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

                {avoids.length > displayCount && (
                  <div className="text-center">
                    <Button
                      plain
                      onClick={() => setExpandedAvoids(!expandedAvoids)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg border border-red-300 dark:border-red-700 transition-colors"
                    >
                      {expandedAvoids ? (
                        <>
                          <EyeSlashIcon className="size-4 mr-1" />
                          收起 ({avoids.length - displayCount} 项)
                        </>
                      ) : (
                        <>
                          <EyeIcon className="size-4 mr-1" />
                          展开 ({avoids.length - displayCount} 项)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <SparklesIcon className="size-12 text-gray-400 mx-auto mb-3" />
                <Text className="text-gray-500 dark:text-gray-400">
                  今日无特别忌事
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 神煞信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 吉神宜趋 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Heading level={3} className="text-lg font-semibold text-blue-600">
              吉神宜趋
            </Heading>
            <Badge color="blue">
              {goodGods.length} 个
            </Badge>
          </div>
          
          <div className="space-y-2">
            {goodGods.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {goodGods.map((god: string, index: number) => (
                  <Badge key={index} color="blue" className="text-sm">
                    {god}
                  </Badge>
                ))}
              </div>
            ) : (
              <Text className="text-gray-500 dark:text-gray-400 text-center py-4">
                今日无吉神
              </Text>
            )}
          </div>
        </div>

        {/* 凶神宜忌 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Heading level={3} className="text-lg font-semibold text-orange-600">
              凶神宜忌
            </Heading>
            <Badge color="orange">
              {badGods.length} 个
            </Badge>
          </div>
          
          <div className="space-y-2">
            {badGods.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badGods.map((god: string, index: number) => (
                  <Badge key={index} color="orange" className="text-sm">
                    {god}
                  </Badge>
                ))}
              </div>
            ) : (
              <Text className="text-gray-500 dark:text-gray-400 text-center py-4">
                今日无凶神
              </Text>
            )}
          </div>
        </div>
      </div>

      {/* 其他黄历信息 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">值神</Text>
            <Badge color="purple" className="text-lg">
              {duty}
            </Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">九星</Text>
            <Badge color="indigo" className="text-lg">
              {nineStar}
            </Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">二十八宿</Text>
            <Badge color="violet" className="text-lg">
              {star28}
            </Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">胎神方位</Text>
            <Badge color="pink" className="text-sm">
              {fetus}
            </Badge>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">冲煞</Text>
            <div className="space-y-1">
              <Badge color="yellow" className="text-sm block">
                {clash}
              </Badge>
              <Badge color="orange" className="text-sm block">
                {evil}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">彭祖百忌</Text>
            <Text className="text-sm font-medium text-gray-900 dark:text-white">
              {pengzu}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
} 