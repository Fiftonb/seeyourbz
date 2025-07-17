'use client'

import { Badge } from '@/components/ui/badge'
import { type PeachBlossomResult } from '@/lib/peach-blossom-fortune'
import { HeartIcon, StarIcon, SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface PeachBlossomResultProps {
  result: PeachBlossomResult | null
  userName?: string
}

export function PeachBlossomResultComponent({ result, userName }: PeachBlossomResultProps) {
  if (!result) return null

  const getTypeColor = (type: PeachBlossomResult['type']) => {
    switch (type) {
      case 'inside': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'outside': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'mixed': return 'bg-pink-100 text-pink-800 border-pink-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStrengthColor = (strength: PeachBlossomResult['strength']) => {
    switch (strength) {
      case 'strong': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'weak': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStrengthStars = (strength: PeachBlossomResult['strength']) => {
    switch (strength) {
      case 'strong': return 5
      case 'medium': return 3
      case 'weak': return 1
      default: return 0
    }
  }

  const stars = getStrengthStars(result.strength)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-8">
      {/* 标题区域 */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <HeartSolidIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {userName ? `${userName}的桃花运势` : '您的桃花运势'}
        </h2>
        <div className="flex items-center justify-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`w-6 h-6 ${
                i < stars 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 八字信息 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DocumentTextIcon className="w-5 h-5 text-pink-500" />
          您的八字信息
        </h3>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-purple-100">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-xs text-gray-500">年柱</div>
              <div className="bg-white rounded-md p-3 shadow-sm border">
                <div className="text-lg font-bold text-purple-700">{result.eightChar.yearPillar}</div>
                <div className="text-xs text-gray-600">{result.eightChar.year}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">月柱</div>
              <div className="bg-white rounded-md p-3 shadow-sm border">
                <div className="text-lg font-bold text-blue-700">{result.eightChar.monthPillar}</div>
                <div className="text-xs text-gray-600">{result.eightChar.month}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">日柱</div>
              <div className="bg-white rounded-md p-3 shadow-sm border">
                <div className="text-lg font-bold text-pink-700">{result.eightChar.dayPillar}</div>
                <div className="text-xs text-gray-600">{result.eightChar.day}</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500">时柱</div>
              <div className="bg-white rounded-md p-3 shadow-sm border">
                <div className="text-lg font-bold text-green-700">{result.eightChar.hourPillar}</div>
                <div className="text-xs text-gray-600">{result.eightChar.hour}</div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              八字是中国传统命理学的基础，由出生年月日时的天干地支组成，用于分析个人命运特征
            </p>
          </div>
        </div>
      </div>

      {/* 核心结果 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">桃花类型</div>
          <Badge className={`${getTypeColor(result.type)} px-4 py-2 text-sm font-medium`}>
            {result.type === 'inside' && '墙内桃花'}
            {result.type === 'outside' && '墙外桃花'}
            {result.type === 'mixed' && '内外桃花'}
            {result.type === 'none' && '无桃花'}
          </Badge>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-2">桃花强度</div>
          <Badge className={`${getStrengthColor(result.strength)} px-4 py-2 text-sm font-medium`}>
            {result.strength === 'strong' && '桃花旺盛'}
            {result.strength === 'medium' && '桃花适中'}
            {result.strength === 'weak' && '桃花较弱'}
          </Badge>
        </div>
      </div>

      {/* 桃花位置详情 */}
      {result.positions && result.positions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-pink-500" />
            桃花位置详情
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.positions.map((position, index) => (
              <div key={index} className="bg-pink-50 rounded-lg p-4 border border-pink-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-pink-800">
                    {position.pillarName}
                  </span>
                  <Badge className="bg-pink-200 text-pink-800 text-xs">
                    {position.pillar === 'year' && '年柱'}
                    {position.pillar === 'month' && '月柱'}
                    {position.pillar === 'day' && '日柱'}
                    {position.pillar === 'hour' && '时柱'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-medium">{position.branch}</span> 见 
                  <span className="font-medium text-pink-600"> {position.peachBlossomBranch}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {position.meaning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 详细分析 */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HeartIcon className="w-5 h-5 text-pink-500" />
          运势分析
        </h3>
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <p className="text-gray-700 leading-relaxed">{result.analysis}</p>
        </div>
      </div>
    </div>
  )
} 