'use client'

import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { 
  SparklesIcon,
  StarIcon,
  EyeIcon,
  ShieldCheckIcon,
  BoltIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  MapPinIcon
} from '@heroicons/react/16/solid'

interface AlmanacCardsProps {
  almanacInfo: any
}

export function AlmanacCards({ almanacInfo }: AlmanacCardsProps) {
  const {
    goodGods,
    badGods,
    duty,
    nineStar,
    star28,
    fetus,
    clash,
    evil,
    pengzu,
    phase,
    season
  } = almanacInfo

  // 卡片数据配置
  const cards = [
    {
      title: '吉神宜趋',
      icon: <SparklesIcon className="size-8 text-blue-500" />,
      color: 'blue',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      content: goodGods.length > 0 ? goodGods : ['今日无吉神'],
      description: '当日有利的神煞，宜按其方位行事'
    },
    {
      title: '凶神宜忌',
      icon: <ExclamationTriangleIcon className="size-8 text-red-500" />,
      color: 'red',
      bgColor: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      content: badGods.length > 0 ? badGods : ['今日无凶神'],
      description: '当日不利的神煞，应避免相关活动'
    },
    {
      title: '值神建除',
      icon: <ShieldCheckIcon className="size-8 text-purple-500" />,
      color: 'purple',
      bgColor: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      content: [duty],
      description: '当日的值神，主管一日吉凶'
    },
    {
      title: '九星当值',
      icon: <StarIcon className="size-8 text-yellow-500" />,
      color: 'yellow',
      bgColor: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      content: [nineStar],
      description: '九星轮值，影响当日运势'
    },
    {
      title: '二十八宿',
      icon: <EyeIcon className="size-8 text-indigo-500" />,
      color: 'indigo',
      bgColor: 'from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      content: [star28],
      description: '二十八星宿当值，主管天象变化'
    },
    {
      title: '胎神方位',
      icon: <HomeIcon className="size-8 text-pink-500" />,
      color: 'pink',
      bgColor: 'from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      borderColor: 'border-pink-200 dark:border-pink-800',
      content: [fetus],
      description: '胎神所在方位，孕妇应避免动土'
    },
    {
      title: '冲煞信息',
      icon: <BoltIcon className="size-8 text-orange-500" />,
      color: 'orange',
      bgColor: 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      content: [clash, evil],
      description: '相冲生肖和煞向，需特别注意'
    },
    {
      title: '彭祖百忌',
      icon: <MapPinIcon className="size-8 text-green-500" />,
      color: 'green',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      content: pengzu.split(' '),
      description: '彭祖百忌，古人认为违背则有祸'
    }
  ]

  return (
    <div className="space-y-6">
      {/* 基本信息概览 */}
      <div className="text-center space-y-4">
        <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white">
          黄历信息详览
        </Heading>
        <div className="flex justify-center gap-4">
          <Badge color="blue" className="text-sm">
            <SparklesIcon className="size-4 mr-1" />
            {season}
          </Badge>
          <Badge color="purple" className="text-sm">
            <StarIcon className="size-4 mr-1" />
            {phase}
          </Badge>
        </div>
      </div>

      {/* 信息卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.bgColor} rounded-lg p-6 border ${card.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          >
            {/* 卡片头部 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {card.icon}
                <Heading level={3} className="text-lg font-semibold">
                  {card.title}
                </Heading>
              </div>
              <Badge color={card.color as any} className="text-xs">
                {card.content.length}
              </Badge>
            </div>

            {/* 卡片内容 */}
            <div className="space-y-3">
              <div className="min-h-[100px] flex flex-col justify-center">
                                 {card.content.map((item: string, itemIndex: number) => (
                  <div key={itemIndex} className="mb-2 last:mb-0">
                    <Badge 
                      color={card.color as any} 
                      className="text-sm font-medium block text-center w-full py-2"
                    >
                      {item}
                    </Badge>
                  </div>
                ))}
              </div>

              {/* 卡片描述 */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {card.description}
                </Text>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 详细说明区域 */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900/50 dark:to-blue-900/20 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <Heading level={3} className="text-lg font-semibold mb-4 text-center">
          黄历信息说明
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <SparklesIcon className="size-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="font-medium">吉神宜趋</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  当日有利的神煞，按其指引行事可获吉祥
                </Text>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="size-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="font-medium">凶神宜忌</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  当日不利的神煞，应避免在其方位进行重要活动
                </Text>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ShieldCheckIcon className="size-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="font-medium">值神建除</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  建除十二神轮值，主管当日的吉凶宜忌
                </Text>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <StarIcon className="size-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="font-medium">九星二十八宿</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  天象星宿的轮值，影响当日的运势变化
                </Text>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <HomeIcon className="size-5 text-pink-500 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="font-medium">胎神方位</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  胎神所在的方位，孕妇应避免在此方位动土装修
                </Text>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <BoltIcon className="size-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="font-medium">冲煞信息</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  相冲的生肖和煞的方向，需要特别注意避让
                </Text>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPinIcon className="size-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <Text className="font-medium">彭祖百忌</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  古代彭祖总结的禁忌，避免在特定时日做某些事情
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 