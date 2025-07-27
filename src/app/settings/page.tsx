'use client'

import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { Switch } from '@/components/ui/switch'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/lib/theme'
import React, { useState } from 'react'
import { 
  Cog8ToothIcon, 
  BellIcon, 
  EyeIcon, 
  UserIcon,
  MoonIcon,
  SunIcon,
  GlobeAltIcon
} from '@heroicons/react/16/solid'

export default function SettingsPage() {
  const { isDarkMode, setDarkMode } = useTheme()
  // 外观设置
  const [compactMode, setCompactMode] = useState(false)
  // 通知设置
  const [desktopNotify, setDesktopNotify] = useState(false)
  const [emailNotify, setEmailNotify] = useState(false)
  const [eventNotify, setEventNotify] = useState(false)
  // 高级设置
  const [autoBackup, setAutoBackup] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Heading level={1}>
          设置
        </Heading>
        <Button color="blue">
          <Cog8ToothIcon />
          保存设置
        </Button>
      </div>
      
      <Divider />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本设置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <UserIcon className="size-5 text-blue-600" />
            <Heading level={2} className="!text-xl">
              基本设置
            </Heading>
          </div>
          
          <div className="space-y-4">
            <div>
              <Text className="text-sm font-medium mb-2">用户名</Text>
              <Input type="text" placeholder="输入用户名" />
            </div>
            
            <div>
              <Text className="text-sm font-medium mb-2">邮箱</Text>
              <Input type="email" placeholder="输入邮箱地址" />
            </div>
            
            <div>
              <Text className="text-sm font-medium mb-2">语言</Text>
              <Select>
                <option value="zh">中文</option>
                <option value="en">English</option>
              </Select>
            </div>
          </div>
        </div>
        
        {/* 外观设置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <EyeIcon className="size-5 text-purple-600" />
            <Heading level={2} className="!text-xl">
              外观设置
            </Heading>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium">深色模式</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  切换到深色主题
                </Text>
              </div>
              <Switch checked={isDarkMode} onChange={setDarkMode} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium">紧凑模式</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  更紧凑的界面布局
                </Text>
              </div>
              <Switch checked={compactMode} onChange={setCompactMode} />
            </div>
            
            <div>
              <Text className="text-sm font-medium mb-2">主题色</Text>
              <div className="flex space-x-2">
                <Badge color="blue">蓝色</Badge>
                <Badge color="green">绿色</Badge>
                <Badge color="purple">紫色</Badge>
                <Badge color="red">红色</Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* 通知设置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BellIcon className="size-5 text-green-600" />
            <Heading level={2} className="!text-xl">
              通知设置
            </Heading>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium">桌面通知</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  允许桌面通知
                </Text>
              </div>
              <Switch checked={desktopNotify} onChange={setDesktopNotify} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium">邮件通知</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  接收邮件通知
                </Text>
              </div>
              <Switch checked={emailNotify} onChange={setEmailNotify} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium">事件提醒</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  日历事件提醒
                </Text>
              </div>
              <Switch checked={eventNotify} onChange={setEventNotify} />
            </div>
          </div>
        </div>
        
        {/* 高级设置 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-2 mb-4">
            <GlobeAltIcon className="size-5 text-orange-600" />
            <Heading level={2} className="!text-xl">
              高级设置
            </Heading>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium">自动备份</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  自动备份数据
                </Text>
              </div>
              <Switch checked={autoBackup} onChange={setAutoBackup} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Text className="font-medium">数据同步</Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  跨设备同步数据
                </Text>
              </div>
              <Switch />
            </div>
            
            <div>
              <Text className="text-sm font-medium mb-2">数据存储</Text>
              <Select>
                <option value="local">本地存储</option>
                <option value="cloud">云端存储</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
      
      <Divider />
      
      <div className="flex justify-center space-x-4">
        <Button color="blue">
          保存设置
        </Button>
        <Button outline>
          重置设置
        </Button>
        <Button color="red">
          清除数据
        </Button>
      </div>
    </div>
  )
} 