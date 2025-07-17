'use client'

import { useState } from 'react'
import { SolarDay } from 'tyme4ts'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { 
  generateConstellationFortune, 
  getTodayConstellationFortune,
  scoreToStars, 
  getScoreColor,
  type ConstellationType,
  type ConstellationFortune 
} from '@/lib/constellation-fortune'

// 星座列表
const CONSTELLATIONS: ConstellationType[] = [
  '白羊', '金牛', '双子', '巨蟹', '狮子', '处女',
  '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼'
]

export default function ConstellationPage() {
  // 获取当前星座作为默认值
  const today = SolarDay.fromYmd(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  const currentConstellation = today.getConstellation().getName() as ConstellationType
  
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationType>(currentConstellation)
  const [fortune, setFortune] = useState<ConstellationFortune>(() => 
    getTodayConstellationFortune(currentConstellation)
  )

  // 处理星座选择变化
  const handleConstellationChange = (constellation: ConstellationType) => {
    setSelectedConstellation(constellation)
    setFortune(getTodayConstellationFortune(constellation))
  }

  // 运势卡片组件
  const FortuneCard = ({ 
    title, 
    score, 
    description, 
    suggestion,
    color = 'blue'
  }: {
    title: string
    score: number
    description: string
    suggestion: string
    color?: string
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <Heading level={4} className="text-lg font-semibold">
          {title}
        </Heading>
        <div className="flex items-center space-x-2">
          <Text className={`text-lg font-medium ${getScoreColor(score as any)}`}>
            {scoreToStars(score as any)}
          </Text>
          <Badge color={color as any} className="text-xs">
            {score}/5
          </Badge>
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">运势描述</Text>
          <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {description}
          </Text>
        </div>
        <div>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">建议</Text>
          <Text className="text-sm text-blue-600 dark:text-blue-400 leading-relaxed">
            {suggestion}
          </Text>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <Heading level={1} className="text-4xl font-bold text-gray-900 dark:text-white">
          星座运势详情
        </Heading>
        <Text className="text-xl text-gray-600 dark:text-gray-400">
          查看详细的星座运势分析和建议
        </Text>
      </div>

      {/* 星座选择器 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <Heading level={3} className="text-lg font-semibold">
            选择星座
          </Heading>
          <Badge color="purple">
            {fortune.date}
          </Badge>
        </div>
        
                 <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
           {CONSTELLATIONS.map((constellation) => (
             <Button
               key={constellation}
               plain
               onClick={() => handleConstellationChange(constellation)}
               className={`text-sm px-4 py-2 rounded-lg border transition-all duration-200 ${
                 selectedConstellation === constellation
                   ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 shadow-sm'
                   : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
               }`}
             >
               {constellation}
             </Button>
           ))}
        </div>
      </div>

      {/* 星座总览 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Heading level={2} className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedConstellation}座运势
            </Heading>
            <Text className={`text-2xl font-medium ${getScoreColor(fortune.overall.score)}`}>
              {scoreToStars(fortune.overall.score)}
            </Text>
          </div>
          <div className="text-right">
            <Text className="text-sm text-gray-600 dark:text-gray-400">综合评分</Text>
            <Text className={`text-3xl font-bold ${getScoreColor(fortune.overall.score)}`}>
              {fortune.overall.score}/5
            </Text>
          </div>
        </div>
        
        <Text className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          {fortune.summary}
        </Text>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">幸运物品</Text>
            <Badge color="green" className="text-sm">
              {fortune.luckyItem}
            </Badge>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">避免活动</Text>
            <Badge color="red" className="text-sm">
              {fortune.avoidActivity}
            </Badge>
          </div>
        </div>
      </div>

      {/* 详细运势卡片 */}
      <div className="space-y-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          详细运势分析
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FortuneCard
            title="综合运势"
            score={fortune.overall.score}
            description={fortune.overall.description}
            suggestion={fortune.overall.suggestion}
            color="purple"
          />
          
          <FortuneCard
            title="事业运势"
            score={fortune.career.score}
            description={fortune.career.description}
            suggestion={fortune.career.suggestion}
            color="blue"
          />
          
          <FortuneCard
            title="财运"
            score={fortune.money.score}
            description={fortune.money.description}
            suggestion={fortune.money.suggestion}
            color="green"
          />
          
          <FortuneCard
            title="感情运势"
            score={fortune.love.score}
            description={fortune.love.description}
            suggestion={fortune.love.suggestion}
            color="pink"
          />
          
          <FortuneCard
            title="健康运势"
            score={fortune.health.score}
            description={fortune.health.description}
            suggestion={fortune.health.suggestion}
            color="emerald"
          />
          
          {/* 幸运信息卡片 */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg shadow-md p-6 border border-yellow-200 dark:border-yellow-800">
            <Heading level={4} className="text-lg font-semibold mb-4">
              今日幸运
            </Heading>
            <div className="space-y-3">
              {fortune.overall.luckyColor && (
                <div className="flex items-center justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">幸运颜色</Text>
                  <Badge color="yellow" className="text-sm">
                    {fortune.overall.luckyColor}
                  </Badge>
                </div>
              )}
              {fortune.overall.luckyNumber && (
                <div className="flex items-center justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">幸运数字</Text>
                  <Text className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {fortune.overall.luckyNumber}
                  </Text>
                </div>
              )}
              <div className="flex items-center justify-between">
                <Text className="text-sm text-gray-600 dark:text-gray-400">幸运物品</Text>
                <Badge color="orange" className="text-sm">
                  {fortune.luckyItem}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <Heading level={3} className="text-lg font-semibold mb-4">
          说明
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <Text className="font-medium mb-2">运势评分说明</Text>
            <ul className="space-y-1 list-disc list-inside">
              <li>★★★★★ (5分): 运势极佳，大吉</li>
              <li>★★★★☆ (4分): 运势良好，小吉</li>
              <li>★★★☆☆ (3分): 运势平稳，中等</li>
            </ul>
          </div>
          <div>
            <Text className="font-medium mb-2">使用建议</Text>
            <ul className="space-y-1 list-disc list-inside">
              <li>运势仅供参考，不可过分依赖</li>
              <li>建议结合黄历宜忌综合判断</li>
              <li>保持积极心态，理性对待运势</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 