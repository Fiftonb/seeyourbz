import { CalendarDemo } from '@/components/CalendarDemo'
import { TodayInfo } from '@/components/TodayInfo'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* 欢迎标题区域 */}
      <div className="text-center space-y-4">
        <Heading level={1} className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          欢迎来到 今夕何时
        </Heading>
        <Text className="text-base sm:text-xl text-gray-600 dark:text-gray-400">
          一个学习传统文化的工具站
        </Text>
      </div>

      <Divider />

      {/* 今日信息 */}
      <div className="space-y-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          今日信息
        </Heading>
        
        <TodayInfo />
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