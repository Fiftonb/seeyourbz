'use client'

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface MuyuWoodProps {
  onTap: (isManual: boolean) => void
  isAutoMode?: boolean
  tapCount?: number
}

export interface MuyuWoodRef {
  triggerAnimation: () => void
}

// 木鱼颜色选项
const muyuColors = [
  { value: 'red', label: '红木', image: '/muyu/muyutou_red.png' },
  { value: 'yellow', label: '黄木', image: '/muyu/muyutou_yellow.png' },
  { value: 'white', label: '白木', image: '/muyu/muyutou_white.png' },
  { value: 'silver', label: '银木', image: '/muyu/muyutou_sliver.png' }
]

export const MuyuWood = forwardRef<MuyuWoodRef, MuyuWoodProps>(({ onTap, isAutoMode, tapCount }, ref) => {
  const [isPressed, setIsPressed] = useState(false)
  const [showRipple, setShowRipple] = useState(false)
  const [selectedColor, setSelectedColor] = useState('red') // 默认使用红木
  const animationTimeoutRef = useRef<NodeJS.Timeout[]>([])

  // 暴露动画触发函数给父组件
  useImperativeHandle(ref, () => ({
    triggerAnimation: () => {
      triggerAnimationInternal()
    }
  }), [])

  // 统一的动画触发函数
  const triggerAnimationInternal = () => {
    // 清除之前可能存在的动画定时器
    animationTimeoutRef.current.forEach(timer => clearTimeout(timer))
    animationTimeoutRef.current = []

    // 立即重置状态，确保每次都能触发新的动画
    setIsPressed(false)
    setShowRipple(false)
    
    // 使用 requestAnimationFrame 确保状态重置后再触发新动画
    requestAnimationFrame(() => {
      setIsPressed(true)
      setShowRipple(true)
      
      const timer1 = setTimeout(() => setIsPressed(false), 150)
      const timer2 = setTimeout(() => setShowRipple(false), 600)
      
      animationTimeoutRef.current = [timer1, timer2]
    })
  }

  // 点击动画效果
  const handleClick = () => {
    if (isAutoMode) return
    
    // 只调用onTap，动画由父组件统一控制
    onTap(true) // 手动点击
  }

  // 自动模式的视觉反馈现在由父组件统一控制，无需重复触发

  // 清理定时器
  useEffect(() => {
    return () => {
      animationTimeoutRef.current.forEach(timer => clearTimeout(timer))
    }
  }, [])

  // 获取当前选择的木鱼图片
  const currentMuyu = muyuColors.find(color => color.value === selectedColor)

  return (
    <div className="relative">
      {/* 木鱼颜色选择器 */}
      <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-2 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-amber-400/20">
          {muyuColors.map((color) => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`
                w-8 h-8 rounded-full border-2 transition-all duration-300 relative overflow-hidden
                ${selectedColor === color.value 
                  ? 'border-amber-400 scale-110 shadow-lg' 
                  : 'border-amber-600/40 hover:border-amber-500/60 hover:scale-105'
                }
              `}
              title={color.label}
            >
              <img 
                src={color.image} 
                alt={color.label}
                className="w-full h-full object-cover"
              />
              {selectedColor === color.value && (
                <div className="absolute inset-0 bg-amber-400/20 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 木鱼底座光环 */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-gradient-to-r from-transparent via-amber-700/20 to-transparent rounded-full blur-md"></div>
      
      {/* 木鱼主体 */}
      <motion.div
        className={`
          relative w-48 h-32 cursor-pointer select-none
          ${isAutoMode ? 'cursor-default' : 'cursor-pointer'}
        `}
        onClick={handleClick}
        animate={{
          scale: isPressed ? 0.92 : 1,
          y: isPressed ? 4 : 0,
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut"
        }}
        whileHover={{
          scale: isAutoMode ? 1 : 1.05,
        }}
      >
        {/* 外部光晕 */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-transparent to-amber-800/30 blur-xl scale-110 rounded-full"></div>
        
        {/* 木鱼图片 */}
        <div className={`
          relative w-full h-full flex items-center justify-center
          ${isPressed ? 'drop-shadow-lg' : 'drop-shadow-2xl'}
          transition-all duration-150
        `}>
          <img 
            src={currentMuyu?.image} 
            alt={`${currentMuyu?.label}木鱼`}
            className="w-full h-full object-contain filter drop-shadow-2xl"
            style={{
              filter: `drop-shadow(0 10px 30px rgba(0,0,0,0.3)) ${isPressed ? 'brightness(1.1)' : 'brightness(1)'}`
            }}
          />
          
          {/* 敲击高光效果 */}
          {isPressed && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-full blur-sm"></div>
          )}
        </div>

        {/* 敲击波纹效果 */}
        {showRipple && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full border-2 border-yellow-200/80"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 15, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </motion.div>

      {/* 木槌 */}
      <motion.div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: isPressed ? 12 : 0,
          rotate: isPressed ? -8 : 0,
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut"
        }}
      >
        <img 
          src="/muyu/gunzi.png" 
          alt="木槌"
          className="w-8 h-20 object-contain filter drop-shadow-lg"
        />
      </motion.div>

      {/* 功德粒子效果 */}
      {showRipple && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-600 rounded-full"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 1,
                scale: 1
              }}
              animate={{ 
                x: Math.cos(i * 45 * Math.PI / 180) * 60,
                y: Math.sin(i * 45 * Math.PI / 180) * 60,
                opacity: 0,
                scale: 0.3
              }}
              transition={{ 
                duration: 1.2,
                ease: "easeOut",
                delay: 0.1
              }}
            />
          ))}
          {/* 额外的光点效果 */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`extra-${i}`}
              className="absolute w-0.5 h-0.5 bg-amber-400 rounded-full"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 0.8,
                scale: 1
              }}
              animate={{ 
                x: Math.cos(i * 30 * Math.PI / 180) * (80 + Math.random() * 20),
                y: Math.sin(i * 30 * Math.PI / 180) * (80 + Math.random() * 20),
                opacity: 0,
                scale: 0.2
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut",
                delay: 0.2 + Math.random() * 0.3
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}) 