import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Divider } from '@/components/ui/divider'
import { ShieldCheckIcon } from '@heroicons/react/16/solid'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
            <ShieldCheckIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <Heading className="text-3xl font-bold text-gray-900 dark:text-white">
          隐私政策
        </Heading>
        <Text className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          我们深知隐私对您的重要性，本政策详细说明了我们如何收集、使用和保护您的个人信息
        </Text>
        <Text className="mt-2 text-sm text-gray-500">
          最后更新时间：{new Date().toLocaleDateString('zh-CN')}
        </Text>
      </div>

      {/* 隐私政策内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
        <div className="space-y-8">
          
          {/* 1. 信息收集 */}
          <section>
            <Heading level={2} className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              1. 我们收集的信息
            </Heading>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <Text>我们可能收集以下类型的信息：</Text>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>账户信息：邮箱地址、用户名等注册时提供的信息</li>
                <li>使用数据：您使用我们服务时的操作记录和偏好设置</li>
                <li>设备信息：浏览器类型、IP地址等技术信息</li>
                <li>八字信息：您主动提供的出生日期、时间等命理相关数据</li>
              </ul>
            </div>
          </section>

          <Divider />

          {/* 2. 信息使用 */}
          <section>
            <Heading level={2} className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              2. 信息使用方式
            </Heading>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <Text>我们使用收集的信息用于：</Text>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>提供和改进我们的服务功能</li>
                <li>为您生成个性化的命理分析结果</li>
                <li>维护服务的安全性和稳定性</li>
                <li>发送服务相关的重要通知</li>
              </ul>
            </div>
          </section>

          <Divider />

          {/* 3. 联系我们 */}
          <section>
            <Heading level={2} className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              3. 联系我们
            </Heading>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <Text>
                如果您对本隐私政策有任何疑问，请联系我们：
              </Text>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <Text><strong>邮箱：</strong> privacy@example.com</Text>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}