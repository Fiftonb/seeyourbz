import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  ChartBarIcon, 
  CalendarIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UserIcon,
  DocumentIcon
} from '@heroicons/react/16/solid'

export default function StatisticsPage() {
  const stats = [
    { label: '总事件数', value: '156', change: '+12%', trend: 'up' },
    { label: '本月事件', value: '24', change: '+8%', trend: 'up' },
    { label: '完成率', value: '87%', change: '-3%', trend: 'down' },
    { label: '平均时长', value: '2.5h', change: '+15%', trend: 'up' },
  ]

  const recentEvents = [
    { id: 1, title: '项目会议', date: '2024-01-15', duration: '2h', type: '会议' },
    { id: 2, title: '代码评审', date: '2024-01-14', duration: '1.5h', type: '开发' },
    { id: 3, title: '客户沟通', date: '2024-01-13', duration: '45min', type: '沟通' },
    { id: 4, title: '设计讨论', date: '2024-01-12', duration: '3h', type: '设计' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading level={1}>
          统计
        </Heading>
        <div className="flex space-x-2">
          <Button outline>
            <DocumentIcon />
            导出报表
          </Button>
          <Button color="blue">
            <ChartBarIcon />
            刷新数据
          </Button>
        </div>
      </div>
      
      <Divider />
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </Text>
                <Heading level={2} className="!text-2xl">
                  {stat.value}
                </Heading>
              </div>
              <div className="flex items-center space-x-1">
                {stat.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="size-4 text-green-600" />
                ) : (
                  <ArrowTrendingDownIcon className="size-4 text-red-600" />
                )}
                <Badge color={stat.trend === 'up' ? 'green' : 'red'}>
                  {stat.change}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 图表区域 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ChartBarIcon className="size-5 text-blue-600" />
            <Heading level={2} className="!text-xl">
              月度趋势
            </Heading>
          </div>
          
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="text-center">
              <ChartBarIcon className="size-12 text-gray-400 mx-auto mb-2" />
              <Text className="text-gray-600 dark:text-gray-400">
                图表区域
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-500">
                这里将显示月度数据趋势图
              </Text>
            </div>
          </div>
        </div>
        
        {/* 时间分布 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <ClockIcon className="size-5 text-purple-600" />
            <Heading level={2} className="!text-xl">
              时间分布
            </Heading>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Text>上午 (9:00-12:00)</Text>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <Text className="text-sm">60%</Text>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Text>下午 (14:00-18:00)</Text>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
                <Text className="text-sm">80%</Text>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Text>晚上 (19:00-22:00)</Text>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <Text className="text-sm">40%</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 最近事件表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="size-5 text-green-600" />
            <Heading level={2} className="!text-xl">
              最近事件
            </Heading>
          </div>
          <Button plain>
            查看全部
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>事件名称</TableHead>
              <TableHead>日期</TableHead>
              <TableHead>时长</TableHead>
              <TableHead>类型</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <Text className="font-medium">{event.title}</Text>
                </TableCell>
                <TableCell>
                  <Text>{event.date}</Text>
                </TableCell>
                <TableCell>
                  <Text>{event.duration}</Text>
                </TableCell>
                <TableCell>
                  <Badge color={
                    event.type === '会议' ? 'blue' :
                    event.type === '开发' ? 'green' :
                    event.type === '沟通' ? 'purple' : 'orange'
                  }>
                    {event.type}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <UserIcon className="size-8 text-blue-600 mx-auto mb-2" />
          <Heading level={3} className="mb-2">
            活跃用户
          </Heading>
          <Text className="text-2xl font-bold text-blue-600">1,234</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            +5% 相比上月
          </Text>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <CalendarIcon className="size-8 text-green-600 mx-auto mb-2" />
          <Heading level={3} className="mb-2">
            总计事件
          </Heading>
          <Text className="text-2xl font-bold text-green-600">5,678</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            +12% 相比上月
          </Text>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <ClockIcon className="size-8 text-purple-600 mx-auto mb-2" />
          <Heading level={3} className="mb-2">
            平均时长
          </Heading>
          <Text className="text-2xl font-bold text-purple-600">2.5h</Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            +8% 相比上月
          </Text>
        </div>
      </div>
    </div>
  )
} 