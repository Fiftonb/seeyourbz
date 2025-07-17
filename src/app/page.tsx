import { SolarDay } from 'tyme4ts'
import { CalendarDemo } from '@/components/CalendarDemo'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { getSimpleConstellationFortune, scoreToStars, getScoreColor, type ConstellationType } from '@/lib/constellation-fortune'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  const today = SolarDay.fromYmd(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  const lunarDay = today.getLunarDay()
  const constellation = today.getConstellation()
  const term = today.getTerm()
  
  // 获取星座运势信息
  const constellationFortune = getSimpleConstellationFortune(constellation.getName() as ConstellationType)

  return (
    <div className="space-y-8">
      {/* 欢迎标题区域 */}
      <div className="text-center space-y-4">
        <Heading level={1} className="text-4xl font-bold text-gray-900 dark:text-white">
          欢迎来到 今夕何时
        </Heading>
        <Text className="text-xl text-gray-600 dark:text-gray-400">
          一个学习传统文化的工具站
        </Text>
      </div>

      <Divider />

      {/* 今日信息概览 */}
      <div className="space-y-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          今日信息
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 公历信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3} className="text-lg font-semibold">
                公历
              </Heading>
              <Badge color="blue">今日</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">日期</Text>
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                  {today.toString()}
                </Text>
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">星期</Text>
                <Badge color="green">
                  {today.getWeek().getName()}
                </Badge>
              </div>
              {term && (
                <div>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">节气</Text>
                  <Badge color="yellow">
                    {term.getName()}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* 农历信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3} className="text-lg font-semibold">
                农历
              </Heading>
              <Badge color="red">传统</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">农历日期</Text>
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  {lunarDay.toString()}
                </Text>
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">干支纪日</Text>
                <Badge color="orange">
                  {lunarDay.getSixtyCycleDay().toString()}
                </Badge>
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">年份</Text>
                <Text className="text-lg font-medium text-gray-900 dark:text-white">
                  {lunarDay.getYear().toString()}
                </Text>
              </div>
            </div>
          </div>

          {/* 星座信息 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <Heading level={3} className="text-lg font-semibold">
                星座
              </Heading>
              <Badge color="purple">运势</Badge>
            </div>
            <div className="space-y-3">
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">当前星座</Text>
                <div className="flex items-center space-x-2">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                    {constellation.toString()}
                  </Text>
                  <Text className={`text-lg font-medium ${getScoreColor(constellationFortune.score)}`}>
                    {scoreToStars(constellationFortune.score)}
                  </Text>
                </div>
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">今日运势</Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {constellationFortune.description}
                </Text>
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">运势建议</Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {constellationFortune.suggestion}
                </Text>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">幸运色</Text>
                    <Badge color="zinc" className="text-xs">
                      {constellationFortune.luckyColor}
                    </Badge>
                  </div>
                  <div>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">运势评分</Text>
                    <Text className={`text-sm font-semibold ${getScoreColor(constellationFortune.score)}`}>
                      {constellationFortune.score}/5
                    </Text>
                  </div>
                </div>
                <Link href="/constellation">
                  <Button outline className="text-xs py-1 px-2">
                    查看详情
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* 日历演示区域 - 优化布局 */}
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white">
            日历信息
          </Heading>
          <Text className="text-lg text-gray-600 dark:text-gray-400">
            探索对应日期的详细信息
          </Text>
        </div>
        
        {/* 日历演示组件 */}
        <div className="max-w-4xl mx-auto">
          <CalendarDemo />
        </div>
        
        {/* 功能说明 */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              功能特色
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge color="blue" className="text-xs">公历</Badge>
                  <Text className="text-sm">精准的公历日期计算</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge color="red" className="text-xs">农历</Badge>
                  <Text className="text-sm">传统农历日期转换</Text>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge color="green" className="text-xs">节气</Badge>
                  <Text className="text-sm">二十四节气查询</Text>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge color="purple" className="text-xs">星座</Badge>
                  <Text className="text-sm">星座信息显示</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 