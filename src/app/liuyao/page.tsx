import { Liuyao } from '@/components/liuyao/liuyao'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Divider } from '@/components/ui/divider'

export default function LiuyaoPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Heading level={1} className="mb-2">
          六爻卜卦
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          传统易经占卜，通过投掷铜钱形成六爻卦象，解读人生吉凶
        </Text>
      </div>
      
      <Divider />
      
      <div className="flex justify-center">
        <Liuyao />
      </div>
    </div>
  )
} 