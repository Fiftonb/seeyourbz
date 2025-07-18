'use client'

import { useEffect, useRef, useState } from 'react'
import { type PeachBlossomResult, type WeeklyPeachBlossomFortune } from '@/lib/peach-blossom-fortune'
import { ShareIcon, XMarkIcon } from '@heroicons/react/24/outline'
import QRCode from 'qrcode'
import * as htmlToImage from 'html-to-image'

// 将下载逻辑提取为一个可导出的函数
export const downloadShareableImage = async (cardElement: HTMLDivElement, userName?: string) => {
  if (!cardElement) return

  try {
    // 临时添加CSS修复样式以确保渲染一致性
    const tempStyle = document.createElement('style')
    tempStyle.id = 'temp-html-to-image-style'
    tempStyle.textContent = `
      [data-share-card] img {
        display: inline-block !important;
        vertical-align: top !important;
      }
      [data-share-card] * {
        box-sizing: border-box !important;
        line-height: initial !important;
      }
    `
    document.head.appendChild(tempStyle)

    // 等待图片加载完成
    await new Promise<void>(resolve => {
      const images = cardElement.querySelectorAll('img')
      if (!images || images.length === 0) {
        resolve()
        return
      }
      
      let loadedCount = 0
      const checkComplete = () => {
        loadedCount++
        if (loadedCount === images.length) {
          resolve()
        }
      }
      
      images.forEach(img => {
        if (img.complete) {
          checkComplete()
        } else {
          img.onload = checkComplete
          img.onerror = checkComplete
        }
      })
    })

    // 确保DOM完全稳定并强制重排
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 强制重排和重绘
    cardElement.offsetHeight

    // 获取更精确的尺寸
    const rect = cardElement.getBoundingClientRect()
    const actualWidth = cardElement.scrollWidth > 400 ? cardElement.scrollWidth : 400
    // 减少底部空白区域，更精确地计算实际内容高度
    const actualHeight = cardElement.scrollHeight
    
    console.log('捕获尺寸:', { width: actualWidth, height: actualHeight })

    // 字体嵌入
    const fontCSS = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url('${window.location.origin}/fonts/Inter-Regular.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        src: url('${window.location.origin}/fonts/Inter-Medium.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        src: url('${window.location.origin}/fonts/Inter-SemiBold.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        src: url('${window.location.origin}/fonts/Inter-Bold.woff2') format('woff2');
      }
    `
    
    const dataUrl = await htmlToImage.toPng(cardElement, {
      width: actualWidth,
      height: actualHeight,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      quality: 1.0,
      fontEmbedCSS: fontCSS,
      style: {
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }
    })
    
    const link = document.createElement('a')
    link.download = `${userName || '我'}的桃花运势分享.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('下载分享卡片失败:', error)
    alert('下载失败，请重试')
  } finally {
    // 移除临时样式
    const tempStyle = document.getElementById('temp-html-to-image-style')
    if (tempStyle) {
      document.head.removeChild(tempStyle)
    }
  }
}

interface ShareCardContentProps {
  result: PeachBlossomResult
  weeklyFortune?: WeeklyPeachBlossomFortune
  userName?: string
  qrCodeUrl: string
}

// 导出独立的分享卡片内容组件
export function ShareCardContent({ result, weeklyFortune, userName, qrCodeUrl }: ShareCardContentProps) {
  // 将10分制评分映射到5星制显示
  const getStarsFromScore = (overallScore: number) => {
    // 10分制映射到5星制：0-2分=1星，2-4分=2星，4-6分=3星，6-8分=4星，8-10分=5星
    return Math.max(1, Math.min(5, Math.ceil(overallScore / 2)))
  }

  const getStars = (strength: PeachBlossomResult['strength'], overallScore?: number) => {
    // 优先使用综合评分，如果没有则使用强度评级
    if (overallScore !== undefined) {
      return getStarsFromScore(overallScore)
    }
    
    switch (strength) {
      case 'strong': return 5
      case 'medium': return 3
      case 'weak': return 1
      default: return 0
    }
  }

  const getTypeText = (type: PeachBlossomResult['type']) => {
    switch (type) {
      case 'inside': return '墙内桃花'
      case 'outside': return '墙外桃花'
      case 'mixed': return '内外桃花'
      default: return '无桃花'
    }
  }

  const getStrengthText = (strength: PeachBlossomResult['strength']) => {
    switch (strength) {
      case 'strong': return '桃花旺盛'
      case 'medium': return '桃花适中'
      case 'weak': return '桃花较弱'
      default: return '桃花微弱'
    }
  }

  return (
    <div
      data-share-card
      style={{
        background: 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #fef2f2 100%)',
        width: '400px',
        minHeight: 'auto',
        padding: '32px',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: 'initial',
        boxSizing: 'border-box',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 标题区域 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div 
          style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}
        >
          {/* 爱心图标 */}
          <svg 
            style={{ width: '32px', height: '32px', fill: 'white' }}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <h3 
          style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#111827', 
            marginBottom: '8px' 
          }}
        >
          {userName ? `${userName}的桃花运势` : '我的桃花运势'}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <svg 
              key={i} 
              style={{ 
                width: '24px', 
                height: '24px', 
                fill: i < getStars(result.strength, result.overallScore) ? '#fbbf24' : '#d1d5db',
              }}
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ))}
        </div>
        {result.overallScore && (
          <div style={{ fontSize: '10px', color: '#6b7280', textAlign: 'center', marginTop: '4px' }}>
            {getStars(result.strength, result.overallScore)}星级 ({result.overallScore.toFixed(1)}分)
          </div>
        )}
      </div>
      
      {/* 核心诊断 */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid rgba(236, 72, 153, 0.2)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', textAlign: 'center', marginBottom: '16px' }}>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>桃花类型</p>
            <span style={{ 
              background: '#fce7f3', 
              color: '#be185d', 
              padding: '6px 12px', 
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {getTypeText(result.type)}
            </span>
          </div>
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>桃花强度</p>
            <span style={{ 
              background: '#fee2e2', 
              color: '#b91c1c', 
              padding: '6px 12px', 
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {getStrengthText(result.strength)}
            </span>
          </div>
        </div>

        {/* 综合评分 */}
        {result.overallScore && (
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}>综合评分</p>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ec4899' }}>
              {result.overallScore.toFixed(1)}/10
            </div>
          </div>
        )}

        {/* 桃花星类型 */}
        {result.peachBlossomTypes && (
          <div>
            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px', textAlign: 'center' }}>桃花星类型</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
              {Object.entries(result.peachBlossomTypes).map(([type, positions]) => {
                const typeNames: Record<string, string> = {
                  xianchi: '咸池',
                  redPhoenix: '红鸾',
                  heavenlyJoy: '天喜',
                  bath: '沐浴',
                  redRomance: '红艳'
                }
                
                if (positions.length === 0) return null
                
                return (
                  <span
                    key={type}
                    style={{
                      background: '#f3e8ff',
                      color: '#7c3aed',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {typeNames[type]}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* 运势分析 */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', textAlign: 'justify' }}>
          {result.analysis}
        </p>
      </div>

      {/* 每周运势 */}
      {weeklyFortune && (
        <div style={{
          marginTop: 'auto',
          paddingTop: '20px',
          borderTop: '1px dashed rgba(236, 72, 153, 0.3)'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#be185d', marginBottom: '12px', textAlign: 'center' }}>
            本周（{weeklyFortune.week}）桃花运势
          </h4>
          
          {/* 添加总体评分 */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '16px', 
            background: 'rgba(255, 250, 230, 0.7)', 
            padding: '8px', 
            borderRadius: '8px' 
          }}>
            <div style={{ fontSize: '14px', color: '#4b5563', marginBottom: '4px' }}>总体评分</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#d97706' }}>
              {weeklyFortune.overallScore.toFixed(1)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '4px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i} 
                  style={{ 
                    width: '16px', 
                    height: '16px', 
                    fill: i < Math.floor(weeklyFortune.overallScore) ? '#fbbf24' : '#d1d5db',
                  }}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              ))}
            </div>
          </div>
          
          {/* 更新为三列布局，展示更多信息 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            {/* 桃花吉日 */}
            <div style={{
              background: 'rgba(240, 253, 244, 0.6)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #d1fae5'
            }}>
              <p style={{ fontSize: '14px', color: '#047857', fontWeight: '500', marginBottom: '6px', textAlign: 'center' }}>桃花吉日</p>
              <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#065f46', textAlign: 'center' }}>
                {weeklyFortune.luckyDays && weeklyFortune.luckyDays.length > 0 
                  ? weeklyFortune.luckyDays.join('、') 
                  : '暂无'}
              </p>
            </div>
            
            {/* 需要注意 */}
            <div style={{
              background: 'rgba(254, 242, 242, 0.6)',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #fee2e2'
            }}>
              <p style={{ fontSize: '14px', color: '#b91c1c', fontWeight: '500', marginBottom: '6px', textAlign: 'center' }}>需要注意</p>
              <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#991b1b', textAlign: 'center' }}>
                {weeklyFortune.avoidDays && weeklyFortune.avoidDays.length > 0 
                  ? weeklyFortune.avoidDays.join('、') 
                  : '无'}
              </p>
            </div>
          </div>
          
          {/* 幸运色彩 */}
          <div style={{
            background: 'rgba(238, 242, 255, 0.6)',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #dbeafe',
            marginBottom: '16px'
          }}>
            <p style={{ fontSize: '14px', color: '#1e40af', fontWeight: '500', marginBottom: '6px', textAlign: 'center' }}>幸运色彩</p>
            <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#1e3a8a', textAlign: 'center' }}>
              {weeklyFortune.luckyColors && weeklyFortune.luckyColors.length > 0 
                ? weeklyFortune.luckyColors.join('、') 
                : '暂无'}
            </p>
          </div>
          
          {/* 建议 */}
          {weeklyFortune.suggestions?.[0] && (
            <p style={{ 
              fontSize: '14px', 
              color: '#4b5563', 
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              "{weeklyFortune.suggestions[0]}"
            </p>
          )}
        </div>
      )}

      {/* 页脚和二维码 */}
      <div style={{ 
        marginTop: '20px',
        paddingTop: '16px', 
        borderTop: '1px dashed rgba(236, 72, 153, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          <p style={{ fontWeight: 'bold', color: '#be185d' }}>扫码测算你的桃花运</p>
          <p>今夕何时</p>
        </div>
        {qrCodeUrl && (
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            style={{ 
              width: '80px', 
              height: '80px',
              border: '4px solid white',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }} 
          />
        )}
      </div>
    </div>
  )
}


interface ShareCardProps {
  result: PeachBlossomResult
  weeklyFortune?: WeeklyPeachBlossomFortune
  userName?: string
  isVisible: boolean
  onClose: () => void
}

export function ShareCard({ result, weeklyFortune, userName, isVisible, onClose }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  // 生成二维码
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const websiteUrl = window.location.origin
        const qrUrl = await QRCode.toDataURL(websiteUrl, {
          width: 128,
          margin: 2,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#be185d', // 粉色
            light: '#ffffff'
          }
        })
        setQrCodeUrl(qrUrl)
      } catch (error) {
        console.error('生成二维码失败:', error)
      }
    }

    if (isVisible) {
      generateQRCode()
    }
  }, [isVisible])

  // 下载分享卡片 - 现在调用导出的函数
  const downloadShareCard = async () => {
    if (cardRef.current) {
      await downloadShareableImage(cardRef.current, userName)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 操作按钮区域 */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">分享桃花运势</h3>
          <div className="flex gap-2">
            <button
              onClick={downloadShareCard}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <ShareIcon className="w-4 h-4" />
              保存图片
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 分享卡片内容 */}
        <div ref={cardRef}>
          <ShareCardContent 
            result={result}
            weeklyFortune={weeklyFortune}
            userName={userName}
            qrCodeUrl={qrCodeUrl}
          />
        </div>
      </div>
    </div>
  )
} 