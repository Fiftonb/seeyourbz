import { SolarDay } from 'tyme4ts'
import { CalendarDemo } from '@/components/CalendarDemo'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'

export default function Home() {
  const today = SolarDay.fromYmd(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())
  const lunarDay = today.getLunarDay()
  const constellation = today.getConstellation()
  const term = today.getTerm()

  return (
    <div className="space-y-8">
      {/* 欢迎标题区域 */}
      <div className="text-center space-y-4">
        <Heading level={1} className="text-4xl font-bold text-gray-900 dark:text-white">
          欢迎来到 SeeYourBz
        </Heading>
        <Text className="text-xl text-gray-600 dark:text-gray-400">
          基于 tyme4ts 的强大日历应用
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
                <Text className="text-2xl font-bold text-gray-900 dark:text-white">
                  {constellation.toString()}
                </Text>
              </div>
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400">提示</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  今日运势良好，适合处理重要事务
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Divider />

      {/* 快速导航 */}
      <div className="space-y-6">
        <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
          快速导航
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
            <Heading level={3} className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              日历管理
            </Heading>
            <Text className="text-blue-700 dark:text-blue-300 mb-3">
              查看和管理您的日程安排
            </Text>
            <Badge color="blue">查看详情</Badge>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <Heading level={3} className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              数据统计
            </Heading>
            <Text className="text-green-700 dark:text-green-300 mb-3">
              分析您的时间使用情况
            </Text>
            <Badge color="green">查看报告</Badge>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
            <Heading level={3} className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              应用设置
            </Heading>
            <Text className="text-purple-700 dark:text-purple-300 mb-3">
              个性化您的应用体验
            </Text>
            <Badge color="purple">进入设置</Badge>
          </div>
        </div>
      </div>

      <Divider />

      {/* 日历演示区域 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Heading level={2} className="text-2xl font-semibold text-gray-900 dark:text-white">
            日历演示
          </Heading>
          <Badge color="cyan">tyme4ts 支持</Badge>
        </div>
        
        <CalendarDemo />
      </div>
    </div>
  )
} 