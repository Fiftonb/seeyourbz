'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MuyuWoodProps {
  onTap: () => void
  isAutoMode: boolean
  tapCount: number
}

export function MuyuWood({ onTap, isAutoMode, tapCount }: MuyuWoodProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [showRipple, setShowRipple] = useState(false)

  // 点击动画效果
  const handleClick = () => {
    if (isAutoMode) return
    
    setIsPressed(true)
    setShowRipple(true)
    onTap()
    
    setTimeout(() => setIsPressed(false), 150)
    setTimeout(() => setShowRipple(false), 600)
  }

  // 自动模式的视觉反馈
  useEffect(() => {
    if (isAutoMode) {
      setIsPressed(true)
      setShowRipple(true)
      
      const timer1 = setTimeout(() => setIsPressed(false), 150)
      const timer2 = setTimeout(() => setShowRipple(false), 600)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [tapCount, isAutoMode])

  return (
    <div className="relative">
      {/* 木鱼底座光环 */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-8 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent rounded-full blur-md"></div>
      
      {/* 木鱼主体 */}
      <motion.div
        className={`
          relative w-48 h-36 cursor-pointer select-none
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
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/30 via-transparent to-amber-600/30 blur-xl scale-110"></div>
        
        {/* 木鱼外壳 */}
        <div className={`
          relative w-full h-full rounded-full
          bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800
          shadow-2xl border-2 border-amber-400/60
          overflow-hidden
          ${isPressed ? 'shadow-lg border-amber-300/80' : 'shadow-2xl'}
          transition-all duration-150
        `}>
          {/* 内部光晕 */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-300/40 via-transparent to-transparent"></div>
          
          {/* 木纹纹理 */}
          <div className="absolute inset-0 rounded-full opacity-60">
            <div className="absolute top-3 left-6 w-20 h-1.5 bg-amber-400/40 rounded-full transform rotate-12 blur-[0.5px]"></div>
            <div className="absolute top-8 right-8 w-16 h-1.5 bg-amber-400/40 rounded-full transform -rotate-6 blur-[0.5px]"></div>
            <div className="absolute bottom-6 left-10 w-24 h-1.5 bg-amber-400/40 rounded-full transform rotate-3 blur-[0.5px]"></div>
            <div className="absolute bottom-8 right-6 w-12 h-1.5 bg-amber-400/40 rounded-full transform -rotate-12 blur-[0.5px]"></div>
            <div className="absolute top-1/2 left-4 w-8 h-1 bg-amber-300/30 rounded-full transform rotate-45 blur-[0.5px]"></div>
            <div className="absolute top-1/3 right-4 w-10 h-1 bg-amber-300/30 rounded-full transform -rotate-30 blur-[0.5px]"></div>
          </div>

          {/* 主要高光效果 */}
          <div className="absolute top-3 left-6 w-12 h-20 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm"></div>
          <div className="absolute top-6 right-8 w-8 h-12 bg-gradient-to-bl from-white/25 to-transparent rounded-full blur-sm"></div>
          
          {/* 木鱼开口 */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-amber-900/90 rounded-full shadow-inner">
            <div className="absolute inset-0.5 bg-amber-800/80 rounded-full"></div>
          </div>
          
          {/* 中心装饰莲花图案 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 shadow-inner border border-amber-400/60 flex items-center justify-center">
              <div className="text-amber-800/80 text-xs">🪷</div>
            </div>
          </div>
          
          {/* 装饰性圆圈 */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-amber-400/30 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-amber-400/20 rounded-full"></div>
        </div>

        {/* 敲击波纹效果 */}
        {showRipple && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full border-2 border-amber-200/80"
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
        {/* 木槌手柄 */}
        <div className="w-4 h-20 bg-gradient-to-b from-amber-700 to-amber-900 rounded-full shadow-lg relative">
          {/* 手柄纹理 */}
          <div className="absolute top-4 left-0.5 w-3 h-12 bg-gradient-to-b from-amber-600/50 to-amber-800/50 rounded-full"></div>
          
          {/* 木槌头 */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full shadow-md">
            <div className="w-full h-full bg-gradient-to-br from-amber-500/60 to-transparent rounded-full"></div>
          </div>
        </div>
      </motion.div>

      {/* 功德粒子效果 */}
      {showRipple && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full"
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
              className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full"
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
} 