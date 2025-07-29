import { Liuyao } from '@/components/liuyao/liuyao'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Divider } from '@/components/ui/divider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LiuyaoPage() {
  return (
    <div className="min-h-screen space-y-8">
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
                <span className="text-gray-700 dark:text-gray-300">心中默念要占卜的问题</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">2</span>
                <span className="text-gray-700 dark:text-gray-300">连续点击6次"投掷铜钱"</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">3</span>
                <span className="text-gray-700 dark:text-gray-300">点击"解卦"查看结果</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="w-5 h-5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">4</span>
                <span className="text-gray-700 dark:text-gray-300">根据卦象解读指引做决策</span>
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
              六爻卜卦起源于周朝，是《易经》占卜体系的重要组成部分。通过六个爻位的阴阳变化，反映天地万物的运行规律，为决策提供智慧指导。
            </Text>
            <Text className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              历代文人学者如孔子、朱熹等都对易经有深入研究，使其成为中华文化的瑰宝。
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
                <span className="text-gray-700 dark:text-gray-300">保持内心虔诚，专注于要占卜的问题</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">同一问题不宜重复占卜</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">结果仅供参考，关键在于自身努力</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">⚠️</span>
                <span className="text-gray-700 dark:text-gray-300">遵循"五不测"原则，理性对待</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 添加底部说明区域 */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="py-6">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              ☯️ 易经智慧，指引人生
            </h3>
            <Text className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              六爻卜卦不是迷信，而是古人对宇宙规律的深度思考。它通过符号化的语言，帮助我们理解事物的发展趋势，
              为人生重大决策提供参考。但最终的选择和努力，还是要靠我们自己。
            </Text>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
              <span>🌟 传承千年智慧</span>
              <span>🎯 指导人生方向</span>
              <span>💫 启发内在觉知</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 