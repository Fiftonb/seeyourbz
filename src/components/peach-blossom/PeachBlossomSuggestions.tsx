'use client'

import { type PeachBlossomResult } from '@/lib/peach-blossom-fortune'
import { SparklesIcon } from '@heroicons/react/24/outline'

interface PeachBlossomSuggestionsProps {
  result: PeachBlossomResult | null
  userName?: string
}

export function PeachBlossomSuggestions({ result, userName }: PeachBlossomSuggestionsProps) {
  if (!result || !result.suggestions || result.suggestions.length === 0) return null

  return (
    <div className="bg-white rounded-xl shadow-lg border border-pink-100 p-8">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {userName ? `为${userName}量身定制的` : '为您量身定制的'}桃花运提升建议
        </h2>
        <p className="text-gray-600 mt-2">
          根据您的八字特点，为您提供专业的桃花运提升指导
        </p>
      </div>

      <div className="space-y-3">
        {result.suggestions.map((suggestion, index) => (
          <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg border border-pink-100">
            <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
              {index + 1}
            </div>
            <p className="text-gray-700 flex-1">{suggestion}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 