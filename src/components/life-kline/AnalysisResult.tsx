'use client'

import React from 'react'
import { AnalysisData } from '@/lib/life-kline/types'
import { Badge } from '@/components/ui/badge'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import {
  BriefcaseIcon,
  CurrencyYenIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface AnalysisResultProps {
  analysis: AnalysisData
}

// 评分颜色辅助函数
const getScoreColor = (score: number) => {
  if (score >= 8) return 'green'
  if (score >= 6) return 'blue'
  if (score >= 4) return 'yellow'
  return 'red'
}

// 评分描述
const getScoreText = (score: number) => {
  if (score >= 9) return '极佳'
  if (score >= 8) return '优秀'
  if (score >= 7) return '良好'
  if (score >= 6) return '中上'
  if (score >= 5) return '中等'
  if (score >= 4) return '中下'
  if (score >= 3) return '较差'
  return '需注意'
}

// 进度条组件
function ScoreBar({ score, maxScore = 10 }: { score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100
  const color = getScoreColor(score)

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700/50 rounded-full h-2.5 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClasses[color]} bg-gradient-to-r from-transparent to-white/20`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-2 min-w-[80px]">
        <span className="text-lg font-bold text-gray-800 dark:text-white tabular-nums">{score}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">/ {maxScore}</span>
      </div>
    </div>
  )
}

export default function AnalysisResult({ analysis }: AnalysisResultProps) {
  const dimensions = [
    { key: 'summary', title: '综合运势', content: analysis.summary, score: analysis.summaryScore, Icon: SparklesIcon, color: 'text-purple-500' },
    { key: 'industry', title: '事业运势', content: analysis.industry, score: analysis.industryScore, Icon: BriefcaseIcon, color: 'text-blue-500' },
    { key: 'wealth', title: '财运分析', content: analysis.wealth, score: analysis.wealthScore, Icon: CurrencyYenIcon, color: 'text-yellow-500' },
    { key: 'marriage', title: '婚姻感情', content: analysis.marriage, score: analysis.marriageScore, Icon: HeartIcon, color: 'text-pink-500' },
    { key: 'health', title: '健康运势', content: analysis.health, score: analysis.healthScore, Icon: ShieldCheckIcon, color: 'text-green-500' },
    { key: 'family', title: '六亲家庭', content: analysis.family, score: analysis.familyScore, Icon: UserGroupIcon, color: 'text-indigo-500' },
  ]

  // 计算总体平均分
  const avgScore = (
    analysis.summaryScore +
    analysis.industryScore +
    analysis.wealthScore +
    analysis.marriageScore +
    analysis.healthScore +
    analysis.familyScore
  ) / 6

  return (
    <div className="space-y-8">
      {/* 八字四柱展示 */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/30 dark:via-gray-900/50 dark:to-purple-950/30 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              八字四柱
            </Heading>
            <Badge color="indigo">命盘基础</Badge>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {['年柱', '月柱', '日柱', '时柱'].map((label, index) => (
              <div key={label} className="text-center group">
                <Text className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wider">{label}</Text>
                <div className={`
                  text-xl md:text-2xl font-bold p-3 rounded-xl transition-all duration-300
                  ${index === 2
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 ring-1 ring-red-100 dark:ring-red-900/50 shadow-sm'
                    : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-100 ring-1 ring-gray-100 dark:ring-gray-700'}
                  group-hover:shadow-md group-hover:-translate-y-0.5
                `}>
                  {analysis.bazi[index] || '未知'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 总体评分概览 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-amber-500" />
            命理评分总览
          </Heading>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">平均分</span>
            <Badge color={getScoreColor(avgScore)} className="text-lg px-3 py-1 font-bold">
              {avgScore.toFixed(1)} - {getScoreText(avgScore)}
            </Badge>
          </div>
        </div>

        {/* 评分雷达图替代 - 使用条形图 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((dim) => (
            <div key={dim.key} className="bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm ${dim.color}`}>
                  <dim.Icon className="w-5 h-5" />
                </div>
                <Text className="font-medium text-gray-900 dark:text-white">{dim.title}</Text>
                <Badge color={getScoreColor(dim.score)} className="ml-auto text-xs">
                  {getScoreText(dim.score)}
                </Badge>
              </div>
              <ScoreBar score={dim.score} />
            </div>
          ))}
        </div>
      </div>

      {/* 各维度详细分析 */}
      <div className="space-y-6">
        <Heading level={3} className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
          详细命理分析
        </Heading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dimensions.map((dim) => (
            <div
              key={dim.key}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 group-hover:bg-white dark:group-hover:bg-gray-800 shadow-sm transition-colors ${dim.color}`}>
                    <dim.Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <Heading level={4} className="font-semibold text-gray-900 dark:text-white">
                      {dim.title}
                    </Heading>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      评分：{dim.score}/10
                    </Text>
                  </div>
                </div>
                <Badge color={getScoreColor(dim.score)} className="text-sm px-3 py-1">
                  {getScoreText(dim.score)}
                </Badge>
              </div>

              <div className="mb-5">
                <ScoreBar score={dim.score} />
              </div>

              <div className="bg-gray-50/50 dark:bg-gray-900/30 rounded-xl p-4">
                <Text className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify text-sm">
                  {dim.content || '暂无分析内容'}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 注意事项 */}
      <div className="bg-amber-50 dark:bg-amber-900/10 rounded-2xl p-6 border border-amber-100 dark:border-amber-900/30">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full flex-shrink-0">
            <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <Heading level={4} className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
              温馨提示
            </Heading>
            <Text className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
              本分析结果基于传统命理学原理，结合AI模型生成，仅供参考与娱乐。
              命运掌握在自己手中，积极进取、勤奋努力才是改变命运的根本之道。
              请勿过分迷信，理性看待命理分析结果。
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
