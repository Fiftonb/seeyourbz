import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { PlusIcon } from '@heroicons/react/16/solid'

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading level={1}>
          日历
        </Heading>
        <Button color="blue">
          <PlusIcon />
          新建事件
        </Button>
      </div>
      
      <Divider />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <Heading level={2} className="!text-xl">
            日历功能
          </Heading>
          <Badge color="yellow">
            开发中
          </Badge>
        </div>
        
        <Text className="mb-6">
          这里将显示完整的日历功能，包括：
        </Text>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Badge color="green">✓</Badge>
            <Text>基础日历显示</Text>
          </div>
          <div className="flex items-center space-x-2">
            <Badge color="yellow">○</Badge>
            <Text>事件管理</Text>
          </div>
          <div className="flex items-center space-x-2">
            <Badge color="yellow">○</Badge>
            <Text>农历节日显示</Text>
          </div>
          <div className="flex items-center space-x-2">
            <Badge color="yellow">○</Badge>
            <Text>提醒功能</Text>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Heading level={3} className="mb-4">
            快速操作
          </Heading>
          <div className="space-y-2">
            <Button outline className="w-full justify-start">
              查看今日事件
            </Button>
            <Button outline className="w-full justify-start">
              查看本周事件
            </Button>
            <Button outline className="w-full justify-start">
              查看本月事件
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <Heading level={3} className="mb-4">
            日历视图
          </Heading>
          <div className="space-y-2">
            <Button plain className="w-full justify-start">
              月视图
            </Button>
            <Button plain className="w-full justify-start">
              周视图
            </Button>
            <Button plain className="w-full justify-start">
              日视图
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 