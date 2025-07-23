'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Divider } from '@/components/ui/divider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SparklesIcon, ArrowLeftIcon } from '@heroicons/react/16/solid'
import { useRouter } from 'next/navigation'
import { getLunarDetailInfo } from '@/lib/tyme'
import { type ChengGuResult } from '@/lib/jianpi/chengu'

interface JianPiResult {
  rigan?: {
    id: number
    rgz: string | null
    rgxx: string | null
    rgcz: string | null
    rgzfx: string | null
    xgfx: string | null
    aqfx: string | null
    syfx: string | null
    cyfx: string | null
    jkfx: string | null
  }
  yueshi?: Array<{
    id: number
    siceng: string | null
    mingmi: string | null
  }>
  chenggu?: ChengGuResult | null
  searchInfo?: {
    dayStem: string
    hourBranch: string
    monthQuery: string
    dayQuery: string
    hourQuery: string
  }
}

function JianPiContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [result, setResult] = useState<JianPiResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lunarInfo, setLunarInfo] = useState<any>(null)

  useEffect(() => {
    const fetchJianPiResult = async () => {
      try {
        setLoading(true)
        setError(null)

        // 从URL参数中获取八字信息和出生日期
        const eightCharData = searchParams.get('eightChar')
        const birthDateData = searchParams.get('birthDate')
        const birthTimeData = searchParams.get('birthTime')
        const genderData = searchParams.get('gender')
        
        if (!eightCharData) {
          throw new Error('缺少八字信息')
        }

        const eightChar = JSON.parse(decodeURIComponent(eightCharData))
        const birthDate = birthDateData ? decodeURIComponent(birthDateData) : null
        const birthTime = birthTimeData ? decodeURIComponent(birthTimeData) : null
        const gender = genderData ? decodeURIComponent(genderData) : null

        // 获取农历信息用于显示
        if (birthDate) {
          // 解析本地日期字符串，避免时区转换
          const dateParts = birthDate.includes('T') 
            ? new Date(birthDate) // 保持兼容性，如果是完整时间字符串
            : new Date(birthDate + 'T00:00:00') // 如果是日期字符串，添加时间部分确保本地时间
          const lunar = getLunarDetailInfo(dateParts)
          setLunarInfo(lunar)
        }

        const response = await fetch('/api/jianpi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            eightChar,
            birthDate,
            birthTime,
            gender
          }),
        })

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || '获取简批结果失败')
        }

        setResult(data.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '未知错误')
      } finally {
        setLoading(false)
      }
    }

    fetchJianPiResult()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <SparklesIcon className="size-12 text-purple-500 animate-spin mx-auto" />
          <Heading level={2}>正在分析简批命理...</Heading>
          <Text className="text-gray-600 dark:text-gray-400">
            根据您的八字信息获取专业命理分析
          </Text>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <Heading level={2} className="text-red-600 dark:text-red-400">
            获取失败
          </Heading>
          <Text className="text-gray-600 dark:text-gray-400">{error}</Text>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen space-y-8">
      {/* 页面标题 */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            outline
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeftIcon className="size-4" />
            返回
          </Button>
          <Heading level={1} className="text-3xl font-bold">
            简批命理结果
          </Heading>
        </div>
        <Text className="text-xl text-gray-600 dark:text-gray-400">
          基于您的八字信息进行专业命理分析
        </Text>
        {lunarInfo && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <Text className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
              📅 农历信息（月日时命理基于此数据）
            </Text>
            <div className="flex justify-center gap-2 flex-wrap text-sm">
              <Badge color="blue" className="text-xs">
                农历：{lunarInfo.yearName}年 {lunarInfo.monthName} {lunarInfo.dayName}
              </Badge>
              {lunarInfo.isLeapMonth && (
                <Badge color="orange" className="text-xs">
                  闰月
                </Badge>
              )}
            </div>
          </div>
        )}
        {result?.searchInfo && (
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge color="blue">
              日干：{result.searchInfo.dayStem}
            </Badge>
            <Badge color="purple">
              时支：{result.searchInfo.hourBranch}
            </Badge>
            {result.searchInfo.monthQuery && (
              <Badge color="green">
                月：{result.searchInfo.monthQuery}
              </Badge>
            )}
            {result.searchInfo.dayQuery && (
              <Badge color="orange">
                日：{result.searchInfo.dayQuery}
              </Badge>
            )}
            {result.searchInfo.hourQuery && (
              <Badge color="red">
                时：{result.searchInfo.hourQuery}
              </Badge>
            )}
          </div>
        )}
      </div>

      <Divider />

      {/* 结果内容 */}
      <div className="space-y-8">
        {/* 日干论命 */}
        {result?.rigan && (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-3xl">🌟</span>
                日干论命
                <Badge color="blue" className="ml-2">
                  {result.rigan.rgz || '未知'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.rigan.rgxx && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <Heading level={3} className="text-lg mb-3 flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    日干性格
                  </Heading>
                  <Text className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {result.rigan.rgxx}
                  </Text>
                </div>
              )}

              {result.rigan.rgcz && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <Heading level={3} className="text-lg mb-3 flex items-center gap-2">
                    <span className="text-xl">📝</span>
                    日干词组
                  </Heading>
                  <Text className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {result.rigan.rgcz}
                  </Text>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {result.rigan.xgfx && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Heading level={4} className="text-md mb-3 flex items-center gap-2">
                      <span className="text-lg">💭</span>
                      性格分析
                    </Heading>
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: result.rigan.xgfx }}
                    />
                  </div>
                )}

                {result.rigan.aqfx && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Heading level={4} className="text-md mb-3 flex items-center gap-2">
                      <span className="text-lg">💕</span>
                      爱情分析
                    </Heading>
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: result.rigan.aqfx }}
                    />
                  </div>
                )}

                {result.rigan.syfx && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Heading level={4} className="text-md mb-3 flex items-center gap-2">
                      <span className="text-lg">🏢</span>
                      事业分析
                    </Heading>
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: result.rigan.syfx }}
                    />
                  </div>
                )}

                {result.rigan.cyfx && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Heading level={4} className="text-md mb-3 flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      财运分析
                    </Heading>
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: result.rigan.cyfx }}
                    />
                  </div>
                )}

                {result.rigan.jkfx && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Heading level={4} className="text-md mb-3 flex items-center gap-2">
                      <span className="text-lg">🏥</span>
                      健康分析
                    </Heading>
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: result.rigan.jkfx }}
                    />
                  </div>
                )}

                {result.rigan.rgzfx && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 md:col-span-2">
                    <Heading level={4} className="text-md mb-3 flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      日干支分析
                    </Heading>
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
                      dangerouslySetInnerHTML={{ __html: result.rigan.rgzfx }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 月日时命理 */}
        {result?.yueshi && result.yueshi.length > 0 && (
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-3xl">🕐</span>
                月日时命理
                <Badge color="green" className="ml-2">
                  {result.yueshi.length}条记录
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {result.yueshi.map((item, index) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <Heading level={3} className="text-lg mb-4 flex items-center gap-2">
                    <span className="text-xl">🔮</span>
                    {item.siceng || `命理分析 ${index + 1}`}
                  </Heading>
                  {item.mingmi && (
                    <div 
                      className="text-gray-700 dark:text-gray-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.mingmi }}
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* 袁天罡称骨算命 */}
        {result?.chenggu && (
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <span className="text-3xl">⚖️</span>
                袁天罡称骨算命
                <Badge color="amber" className="ml-2">
                  {result.chenggu.totalWeight.toFixed(1)}两
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 称骨详情 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <Heading level={3} className="text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">📏</span>
                  称骨详情
                </Heading>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">年骨重</div>
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                        {result.chenggu.boneWeights.year.weight}两
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {result.chenggu.boneWeights.year.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-3 border border-green-200 dark:border-green-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">月骨重</div>
                      <div className="text-lg font-bold text-green-700 dark:text-green-300">
                        {result.chenggu.boneWeights.month.weight}两
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {result.chenggu.boneWeights.month.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">日骨重</div>
                      <div className="text-lg font-bold text-purple-700 dark:text-purple-300">
                        {result.chenggu.boneWeights.day.weight}两
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {result.chenggu.boneWeights.day.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">时骨重</div>
                      <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
                        {result.chenggu.boneWeights.hour.weight}两
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {result.chenggu.boneWeights.hour.description}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 总重量和等级 */}
                <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                  <div className="text-center">
                    <Heading level={4} className="text-lg mb-2 flex items-center justify-center gap-2">
                      <span className="text-xl">⚖️</span>
                      总称骨重量
                    </Heading>
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                        {result.chenggu.totalWeight.toFixed(1)}两
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {result.chenggu.weightDescription}
                      </div>
                    </div>
                    <Text className="text-gray-600 dark:text-gray-400 text-sm">
                      {result.chenggu.summary}
                    </Text>
                  </div>
                </div>
              </div>

              {/* 称骨歌决 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <Heading level={3} className="text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">📜</span>
                  称骨歌决
                  <Badge color="amber" className="ml-2 text-xs">
                    {result.chenggu.gender === 'male' ? '男命' : '女命'}
                  </Badge>
                </Heading>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg p-6 border border-amber-200 dark:border-amber-800">
                  <Text className="text-gray-700 dark:text-gray-300 leading-relaxed text-center text-lg">
                    {result.chenggu.fortune}
                  </Text>
                </div>
              </div>

              {/* 称骨算命说明 */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <Text className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  <span className="font-medium">说明：</span>
                  袁天罡称骨算命法是唐代著名天文学家袁天罡所创，通过出生年、月、日、时的"骨重"相加，
                  得出总重量，再根据相应的"称骨歌"来判断命运吉凶。此法简便实用，在民间广为流传。
                  骨重越重，一般表示命格越好，但也需结合具体歌决内容来理解。
                </Text>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 底部说明 */}
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="py-6">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
                <span className="text-2xl">☯️</span>
                命理智慧，仅供参考
              </h3>
              <Text className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                简批命理基于传统八字理论，通过分析日干和时辰特征，为您提供性格、事业、感情等方面的参考建议。
                但人生路上，最重要的还是您自己的努力和选择。
              </Text>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 pt-2">
                <span>🌟 传统智慧</span>
                <span>🎯 性格分析</span>
                <span>💫 人生指引</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function DestinyJianPiPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <SparklesIcon className="size-12 text-purple-500 animate-spin mx-auto" />
          <Heading level={2}>加载中...</Heading>
        </div>
      </div>
    }>
      <JianPiContent />
    </Suspense>
  )
} 