import { Shengjiao } from '@/components/shengjiao/shengjiao'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Divider } from '@/components/ui/divider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShengjiaoPage() {
  return (
    <div className="min-h-screen space-y-8">
      <div className="text-center">
        <Heading level={1} className="mb-2">
          掷圣杯(圣筊)
        </Heading>
        <Text className="text-gray-600 dark:text-gray-400">
          传统民间占卜方式，通过掷筊杯求得神明指示，询问是否可行
        </Text>
      </div>
      
      <Divider />
      
      <div className="flex justify-center">
        <Shengjiao />
      </div>

      {/* 添加使用说明区域 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              使用步骤
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">1</span>
                <span className="text-gray-700 dark:text-gray-300">输入您要请示神明的问题</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                <span className="text-gray-700 dark:text-gray-300">点击"掷筊"按钮</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                <span className="text-gray-700 dark:text-gray-300">查看结果并解读神明指示</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                <span className="text-gray-700 dark:text-gray-300">如需再次请示，可重新掷筊</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">📚</span>
              历史渊源
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              圣筊是中国传统民间信仰中常用的占卜方式，特别在台湾和福建地区的庙宇中广泛使用。通过掷两块弧形的木块或竹块来解读神明的旨意。
            </Text>
            <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              圣筊占卜历史悠久，是民间与神明沟通的重要方式，被视为神明对信众请求的直接回应。
            </Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">💡</span>
              注意事项
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">掷筊时保持虔诚心态，专注于所求之事</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">问题应明确具体，避免模糊不清</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">结果仅供参考，重大决策需综合考虑</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">尊重神明，不可频繁重复相同问题</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 添加底部说明区域 */}
      <Card className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-900/20 dark:to-amber-900/20 border-red-200 dark:border-red-800">
        <CardContent className="py-6">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              🙏 虔诚求问，明心见性
            </h3>
            <Text className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              圣筊作为民间信仰的一部分，承载着人们对未知的敬畏和对神明的信任。
              在现代社会，它不仅是一种占卜方式，更是一种文化传承和精神寄托。
              无论结果如何，都应保持平常心，理性对待。
            </Text>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
              <span>🌟 传统文化瑰宝</span>
              <span>🎯 神明指引方向</span>
              <span>💫 心诚则灵</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}