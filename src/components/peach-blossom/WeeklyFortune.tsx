'use client'

import { Badge } from '@/components/ui/badge'
import { type WeeklyPeachBlossomFortune } from '@/lib/peach-blossom-fortune'
import { 
  CalendarDaysIcon, 
  StarIcon, 
  SparklesIcon, 
  ExclamationTriangleIcon,
  SwatchIcon 
} from '@heroicons/react/24/outline'

interface WeeklyFortuneProps {
  fortune: WeeklyPeachBlossomFortune | null
  userName?: string
}

export function WeeklyFortune({ fortune, userName }: WeeklyFortuneProps) {
  if (!fortune) return null

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-red-500'
    if (score >= 3) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 4) return 'bg-red-100 border-red-200'
    if (score >= 3) return 'bg-yellow-100 border-yellow-200'
    return 'bg-green-100 border-green-200'
  }

  const renderStars = (score: number) => {
    const filledStars = Math.floor(score)
    return [...Array(5)].map((_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < filledStars 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-8">
      {/* 标题区域 */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarDaysIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {userName ? `${userName}本周桃花运指数` : '本周桃花运指数'}
        </h2>
        <p className="text-gray-600">{fortune.week}</p>
      </div>

      {/* 总体评分 */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-lg border-2 ${getScoreBg(fortune.overallScore)}`}>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{fortune.overallScore}</div>
            <div className="text-sm text-gray-600">总体评分</div>
          </div>
          <div className="flex items-center gap-1">
            {renderStars(fortune.overallScore)}
          </div>
        </div>
      </div>

      {/* 详细分析评分 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-sm text-gray-600 mb-1">八字分析</div>
          <div className={`text-xl font-bold ${getScoreColor(fortune.analysis.eightCharScore)}`}>
            {fortune.analysis.eightCharScore}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {renderStars(fortune.analysis.eightCharScore)}
          </div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
          <div className="text-sm text-gray-600 mb-1">星座运势</div>
          <div className={`text-xl font-bold ${getScoreColor(fortune.analysis.constellationScore)}`}>
            {fortune.analysis.constellationScore}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {renderStars(fortune.analysis.constellationScore)}
          </div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
          <div className="text-sm text-gray-600 mb-1">生肖运势</div>
          <div className={`text-xl font-bold ${getScoreColor(fortune.analysis.zodiacScore)}`}>
            {fortune.analysis.zodiacScore}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {renderStars(fortune.analysis.zodiacScore)}
          </div>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
          <div className="text-sm text-gray-600 mb-1">流年运势</div>
          <div className={`text-xl font-bold ${getScoreColor(fortune.analysis.flowYearScore)}`}>
            {fortune.analysis.flowYearScore}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {renderStars(fortune.analysis.flowYearScore)}
          </div>
        </div>
      </div>

      {/* 建议 */}
      {fortune.suggestions && fortune.suggestions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-purple-500" />
            本周建议
          </h3>
          <div className="space-y-3">
            {fortune.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 flex-1">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 吉凶日期和幸运色彩 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 吉日 */}
        {fortune.luckyDays && fortune.luckyDays.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <StarIcon className="w-4 h-4 text-green-500" />
              桃花吉日
            </h4>
            <div className="space-y-2">
              {fortune.luckyDays.map((day, index) => (
                <Badge key={index} className="bg-green-100 text-green-800 border-green-200 mr-2 mb-2">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 忌日 */}
        {fortune.avoidDays && fortune.avoidDays.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
              需要注意
            </h4>
            <div className="space-y-2">
              {fortune.avoidDays.map((day, index) => (
                <Badge key={index} className="bg-red-100 text-red-800 border-red-200 mr-2 mb-2">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 幸运颜色 */}
        {fortune.luckyColors && fortune.luckyColors.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <SwatchIcon className="w-4 h-4 text-pink-500" />
              幸运色彩
            </h4>
            <div className="space-y-2">
              {fortune.luckyColors.map((color, index) => (
                <Badge key={index} className="bg-pink-100 text-pink-800 border-pink-200 mr-2 mb-2">
                  {color}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 