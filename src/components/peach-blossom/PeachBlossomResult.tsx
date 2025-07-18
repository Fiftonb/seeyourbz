'use client'

import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { type PeachBlossomResult, type WeeklyPeachBlossomFortune, calculateWeeklyPeachBlossomFortune } from '@/lib/peach-blossom-fortune'
import { HeartIcon, StarIcon, SparklesIcon, DocumentTextIcon, ShareIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { ShareCardContent, downloadShareableImage } from './ShareCard'
import QRCode from 'qrcode'
import { createRoot } from 'react-dom/client'

interface PeachBlossomResultProps {
  result: PeachBlossomResult | null
  userName?: string
  birthDate?: Date
  birthTime?: { hour: number, minute: number }
}

export function PeachBlossomResultComponent({ result, userName, birthDate, birthTime }: PeachBlossomResultProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  
  // 计算本周桃花运指数
  const weeklyFortune = useMemo(() => {
    if (!birthDate || !birthTime) return null
    try {
      return calculateWeeklyPeachBlossomFortune(birthDate, birthTime)
    } catch (error) {
      console.error('计算本周桃花运指数失败:', error)
      return null
    }
  }, [birthDate, birthTime])

  const handleShare = async () => {
    if (!result) return
    setIsDownloading(true)

    // 1. 创建一个临时的DOM节点用于渲染
    const container = document.createElement('div')
    container.className = "absolute -left-[9999px] -top-[9999px]"
    document.body.appendChild(container)

    try {
      // 2. 异步渲染卡片内容到临时节点
      await new Promise<void>((resolve) => {
        const root = createRoot(container)
        root.render(
          <ShareCardForImageGeneration
            result={result}
            weeklyFortune={weeklyFortune || undefined}
            userName={userName}
            onReadyToDownload={(cardElement) => {
              // 4. 渲染完成后，执行下载
              downloadShareableImage(cardElement, userName).finally(() => {
                // 5. 下载后清理
                root.unmount()
                document.body.removeChild(container)
                setIsDownloading(false)
              })
            }}
          />
        )
        // 这是一个小技巧，确保React有时间渲染
        setTimeout(resolve, 100)
      })
    } catch (error) {
      console.error("生成分享图片时出错:", error)
      setIsDownloading(false)
      document.body.removeChild(container) // 确保出错时也清理
    }
  }
  
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

  // 将10分制评分映射到5星制显示
  const getStarsFromScore = (overallScore: number) => {
    // 10分制映射到5星制：0-2分=1星，2-4分=2星，4-6分=3星，6-8分=4星，8-10分=5星
    return Math.max(1, Math.min(5, Math.ceil(overallScore / 2)))
  }

  const stars = result.overallScore ? getStarsFromScore(result.overallScore) : getStrengthStars(result.strength)

  function getStrengthStars(strength: PeachBlossomResult['strength']) {
    switch (strength) {
      case 'strong': return 5
      case 'medium': return 3
      case 'weak': return 1
      default: return 0
    }
  }

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
        <div className="flex items-center justify-center gap-1 mb-2">
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
        <p className="text-xs text-gray-500 text-center mb-4">
          {result.overallScore ? `基于综合评分 ${result.overallScore}/10` : '基于桃花强度评级'}
        </p>
        {/* 分享按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleShare}
            disabled={isDownloading}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                生成中...
              </>
            ) : (
              <>
                <ArrowDownTrayIcon className="w-5 h-5" />
                保存运势图片
              </>
            )}
          </button>
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

      {/* 综合桃花评分 */}
      {result.overallScore && (
        <div className="mb-8">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">详细评分</div>
            <div className="text-2xl font-bold text-pink-600 mb-2">
              {result.overallScore}/10
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(result.overallScore / 10) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500">
              星级显示：{stars}星 (对应 {result.overallScore.toFixed(1)}分)
            </div>
          </div>
        </div>
      )}

      {/* 桃花类型统计 */}
      {result.peachBlossomTypes && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-pink-500" />
            桃花星类型分析
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {Object.entries(result.peachBlossomTypes).map(([type, positions]) => {
              const typeNames: Record<string, string> = {
                xianchi: '咸池桃花',
                redPhoenix: '红鸾桃花',
                heavenlyJoy: '天喜桃花',
                bath: '沐浴桃花',
                redRomance: '红艳桃花'
              }
              
              const typeColors: Record<string, string> = {
                xianchi: 'bg-blue-50 border-blue-200 text-blue-800',
                redPhoenix: 'bg-red-50 border-red-200 text-red-800',
                heavenlyJoy: 'bg-yellow-50 border-yellow-200 text-yellow-800',
                bath: 'bg-green-50 border-green-200 text-green-800',
                redRomance: 'bg-purple-50 border-purple-200 text-purple-800'
              }
              
              const hasType = positions.length > 0
              
              return (
                <div key={type} className={`rounded-lg p-4 border-2 ${hasType ? typeColors[type] : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <div className="text-center">
                    <div className="text-sm font-medium mb-1">
                      {typeNames[type]}
                    </div>
                    <div className="text-lg font-bold">
                      {hasType ? '✓' : '✗'}
                    </div>
                    {hasType && (
                      <div className="text-xs mt-1">
                        {positions.map(p => p.pillarName).join('、')}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 桃花位置详情 */}
      {result.positions && result.positions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-pink-500" />
            桃花位置详情
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.positions.map((position, index) => {
              const typeColors: Record<string, string> = {
                xianchi: 'bg-blue-50 border-blue-200',
                redPhoenix: 'bg-red-50 border-red-200',
                heavenlyJoy: 'bg-yellow-50 border-yellow-200',
                bath: 'bg-green-50 border-green-200',
                redRomance: 'bg-purple-50 border-purple-200'
              }
              
              return (
                <div key={index} className={`rounded-lg p-4 border ${typeColors[position.type] || 'bg-pink-50 border-pink-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">
                      {position.pillarName}
                    </span>
                    <div className="flex gap-1">
                      <Badge className="bg-gray-200 text-gray-800 text-xs">
                        {position.pillar === 'year' && '年柱'}
                        {position.pillar === 'month' && '月柱'}
                        {position.pillar === 'day' && '日柱'}
                        {position.pillar === 'hour' && '时柱'}
                      </Badge>
                      <Badge className="bg-purple-200 text-purple-800 text-xs">
                        {position.typeName}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">{position.branch}</span> 见 
                    <span className="font-medium text-pink-600"> {position.peachBlossomBranch}</span>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    {position.meaning}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      强度: {position.strength?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              )
            })}
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


interface ShareCardGenProps {
  result: PeachBlossomResult;
  weeklyFortune?: WeeklyPeachBlossomFortune;
  userName?: string;
  onReadyToDownload: (element: HTMLDivElement) => void;
}

const ShareCardForImageGeneration: React.FC<ShareCardGenProps> = ({ result, weeklyFortune, userName, onReadyToDownload }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const websiteUrl = window.location.origin
        const qrUrl = await QRCode.toDataURL(websiteUrl, {
          width: 128,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#be185d',
            light: '#ffffff'
          }
        })
        setQrCodeUrl(qrUrl)
      } catch (error) {
        console.error('生成二维码失败:', error)
      }
    }
    generateQRCode()
  }, [])

  useEffect(() => {
    // 当二维码生成后，并且组件已经渲染到DOM中
    if (qrCodeUrl && cardRef.current) {
      // 通过回调通知父组件，DOM已准备好可以截图
      onReadyToDownload(cardRef.current)
    }
  }, [qrCodeUrl, onReadyToDownload])

  return (
    <div ref={cardRef}>
      <ShareCardContent
        result={result}
        weeklyFortune={weeklyFortune}
        userName={userName}
        qrCodeUrl={qrCodeUrl}
      />
    </div>
  )
} 