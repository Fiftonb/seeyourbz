'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Switch } from '@/components/ui/switch'
import { Select } from '@/components/ui/select'
import { MuyuWood, MuyuWoodRef } from './MuyuWood'
import { MuyuStats } from '@/components/muyu/MuyuStats'
import { 
  PlayIcon, 
  PauseIcon, 
  MusicalNoteIcon,
  NoSymbolIcon,
  Cog8ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface MuyuData {
  totalCount: number
  todayCount: number
  lastTapDate: string
  sessionCount: number
}

const bgMusicOptions = [
  { value: 'buddhist', label: '大悲咒' },
  { value: 'temple', label: '云水禅心' },
  { value: 'nature', label: '水清月现' },
  { value: 'meditation', label: '六字大明咒' }
]

const autoSpeedOptions = [
  { value: 1200, label: '缓慢 (1.2秒)' },
  { value: 1000, label: '适中 (1秒)' },
  { value: 800, label: '较快 (0.8秒)' }
]

export function MuyuContainer() {
  const [tapCount, setTapCount] = useState(0)
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [autoSpeed, setAutoSpeed] = useState(800) // 默认选择较快 (0.8秒)
  const [selectedMusic, setSelectedMusic] = useState('buddhist')
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [isOnline, setIsOnline] = useState(true) // 添加在线状态，默认为true
  const [pendingTaps, setPendingTaps] = useState(0) // 添加待同步状态
  const [muyuData, setMuyuData] = useState<MuyuData>({
    totalCount: 0,
    todayCount: 0,
    lastTapDate: '',
    sessionCount: 0
  })

  const autoIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)
  const lastTapTime = useRef<number>(0)
  const audioPoolRef = useRef<HTMLAudioElement[]>([])
  const currentPoolIndex = useRef<number>(0)
  const muyuWoodRef = useRef<MuyuWoodRef>(null)
  
  // 批量提交相关状态
  const pendingTapsRef = useRef<number>(0) // 待提交的敲击次数
  const isOnlineRef = useRef<boolean>(true) // 默认为true，在useEffect中更新
  const MAX_BATCH_SIZE = 50 // 最大批量大小

  // 初始化网络状态（仅在客户端）
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialOnlineStatus = navigator.onLine
      setIsOnline(initialOnlineStatus)
      isOnlineRef.current = initialOnlineStatus
    }
  }, [])

  // 初始化音效池
  useEffect(() => {
    // 创建5个音效实例以避免重叠（增加容量）
    const audioPool = []
    for (let i = 0; i < 5; i++) {
      const audio = new Audio('/audio/muyu-tap.mp3')
      audio.preload = 'auto'
      audio.volume = 1.0 // 敲击声音调大，比背景音乐突出
      audioPool.push(audio)
    }
    audioPoolRef.current = audioPool
    audioRef.current = audioPool[0] // 兼容原有代码
  }, [])

  // 初始化背景音乐音量
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.volume = 0.8 // 背景音乐音量调低，让敲击声更突出
    }
  }, [])

  // 加载本地数据
  useEffect(() => {
    const savedData = localStorage.getItem('muyu-data')
    if (savedData) {
      const data = JSON.parse(savedData) as MuyuData
      const today = new Date().toDateString()
      
      // 如果是新的一天，重置今日计数
      if (data.lastTapDate !== today) {
        data.todayCount = 0
        data.sessionCount = 0
      }
      
      setMuyuData(data)
      // 本次修行总是从0开始
      setTapCount(0)
    }
  }, [])

  // 批量提交待处理的敲击数据
  const submitPendingTaps = useCallback(async () => {
    if (pendingTapsRef.current <= 0 || !isOnlineRef.current) {
      return
    }
    
    const tapsToSubmit = pendingTapsRef.current
    pendingTapsRef.current = 0 // 先重置，避免重复提交
    setPendingTaps(0) // 同步更新state
    
    try {
      await fetch('/api/muyu/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: tapsToSubmit })
      })
      console.log(`批量提交 ${tapsToSubmit} 次敲击成功`)
    } catch (error) {
      console.error('批量提交失败:', error)
      // 提交失败时，将数据重新加回待提交队列
      pendingTapsRef.current += tapsToSubmit
      setPendingTaps(pendingTapsRef.current) // 同步更新state
    }
  }, [])

  // 添加敲击到批量队列
  const addTapToBatch = useCallback(() => {
    pendingTapsRef.current += 1
    setPendingTaps(pendingTapsRef.current) // 同步更新state
    
    // 如果达到最大批量大小，立即提交
    if (pendingTapsRef.current >= MAX_BATCH_SIZE) {
      submitPendingTaps()
      return
    }
  }, [submitPendingTaps])
  
  // 保存到服务器（改为添加到批量队列）
  const saveToServer = useCallback(async (increment: number) => {
    addTapToBatch()
  }, [addTapToBatch])

  // 优化本地存储 - 使用防抖机制
  const localStorageTimerRef = useRef<NodeJS.Timeout | null>(null)
  const saveToLocalStorage = useCallback((data: MuyuData) => {
    // 清除之前的定时器
    if (localStorageTimerRef.current) {
      clearTimeout(localStorageTimerRef.current)
    }
    
    // 延迟保存，避免频繁写入
    localStorageTimerRef.current = setTimeout(() => {
      localStorage.setItem('muyu-data', JSON.stringify(data))
    }, 500) // 500ms 防抖
  }, [])

  // 播放音效（使用音效池）
  const playTapSound = useCallback(() => {
    if (audioPoolRef.current.length > 0) {
      const audio = audioPoolRef.current[currentPoolIndex.current]
      // 重置播放位置并立即播放
      audio.currentTime = 0
      const playPromise = audio.play()
      if (playPromise) {
        playPromise.catch(console.error)
      }
      currentPoolIndex.current = (currentPoolIndex.current + 1) % audioPoolRef.current.length
    }
  }, [])

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => {
      isOnlineRef.current = true
      setIsOnline(true)
      // 网络恢复时立即提交待处理的数据
      if (pendingTapsRef.current > 0) {
        submitPendingTaps()
      }
    }
    
    const handleOffline = () => {
      isOnlineRef.current = false
      setIsOnline(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [submitPendingTaps])

  // 敲击木鱼（优化音效同步）
  const handleTap = useCallback((isManual: boolean = true) => {
    const now = Date.now()
    
    // 手动敲击时添加节流（最小间隔300ms）
    if (isManual && now - lastTapTime.current < 300) {
      return
    }
    
    // 自动模式也需要最小间隔检查，防止过快敲击
    if (!isManual && now - lastTapTime.current < 100) {
      return
    }
    
    lastTapTime.current = now
    
    // 立即播放音效，确保与动画同步
    playTapSound()
    
    // 每次点击都直接触发动画，确保光圈效果不会被跳过
    if (muyuWoodRef.current) {
      muyuWoodRef.current.triggerAnimation()
    }
    
    const today = new Date().toDateString()
    
    // 更新本次修行计数
    setTapCount(prev => prev + 1)
    
    // 更新数据统计（优化为批量更新）
    setMuyuData(prevData => {
      // 如果是新的一天，今日计数从1开始，否则累加1
      const newTodayCount = prevData.lastTapDate === today ? prevData.todayCount + 1 : 1
      const newTotalCount = prevData.totalCount + 1

      const newData: MuyuData = {
        totalCount: newTotalCount,
        todayCount: newTodayCount,
        lastTapDate: today,
        sessionCount: 0 // sessionCount不保存到localStorage，每次会话重新开始
      }

      // 使用防抖机制保存到本地存储
      saveToLocalStorage(newData)

      return newData
    })

    // 添加到批量提交队列，避免阻塞
    setTimeout(() => saveToServer(1), 0)
  }, [playTapSound, saveToServer, saveToLocalStorage])



  // 自动模式切换（优化）
  const toggleAutoMode = useCallback(() => {
    if (isAutoMode) {
      // 关闭自动模式
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
        autoIntervalRef.current = null
      }
      setIsAutoMode(false)
    } else {
      // 开启自动模式
      // 确保间隔时间不小于800ms，给动画留足时间
      const safeInterval = Math.max(autoSpeed, 800)
      autoIntervalRef.current = setInterval(() => {
        handleTap(false) // 自动模式不使用节流
      }, safeInterval)
      setIsAutoMode(true)
    }
  }, [isAutoMode, handleTap, autoSpeed])

  // 自动速度变化时重新设置定时器
  useEffect(() => {
    if (isAutoMode && autoIntervalRef.current) {
      // 清除旧的定时器
      clearInterval(autoIntervalRef.current)
      // 设置新的定时器
      const safeInterval = Math.max(autoSpeed, 800)
      autoIntervalRef.current = setInterval(() => {
        handleTap(false)
      }, safeInterval)
    }
  }, [autoSpeed, isAutoMode, handleTap])

  // 音乐播放控制
  const toggleMusic = () => {
    if (isMusicPlaying) {
      bgMusicRef.current?.pause()
    } else {
      if (bgMusicRef.current) {
        bgMusicRef.current.play().catch(console.error)
      }
    }
    setIsMusicPlaying(!isMusicPlaying)
  }

  // 音乐选择变化
  const handleMusicChange = (value: string) => {
    setSelectedMusic(value)
    setIsMusicPlaying(false)
    
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.src = `/audio/muyu-bg-${value}.mp3`
      bgMusicRef.current.volume = 0.8 // 背景音乐音量调低，让敲击声更突出
    }
  }

  // 自动模式速度变化
  const handleSpeedChange = useCallback((value: string) => {
    const speed = parseInt(value)
    setAutoSpeed(speed)
    
    // 如果当前是自动模式，重新设置interval
    if (isAutoMode && autoIntervalRef.current) {
      clearInterval(autoIntervalRef.current)
      autoIntervalRef.current = setInterval(() => {
        handleTap(false) // 自动模式不使用节流
      }, speed)
    }
  }, [isAutoMode, handleTap])

  // 初始化背景音乐
  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.src = `/audio/muyu-bg-${selectedMusic}.mp3`
    }
  }, [])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current)
      }
    }
  }, [])

  // 组件卸载时清理所有定时器
  useEffect(() => {
    return () => {
      if (pendingTapsRef.current > 0 && isOnlineRef.current) {
        // 使用 sendBeacon API 进行最后的数据提交
        navigator.sendBeacon('/api/muyu/stats', JSON.stringify({ 
          increment: pendingTapsRef.current 
        }))
      }
      
      if (localStorageTimerRef.current) {
        clearTimeout(localStorageTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative px-4">
      {/* 音频元素 */}
      <audio ref={audioRef} preload="auto">
        <source src="/audio/muyu-tap.mp3" type="audio/mpeg" />
      </audio>
      <audio 
        ref={bgMusicRef} 
        loop 
        preload="auto"
        onPlay={() => setIsMusicPlaying(true)}
        onPause={() => setIsMusicPlaying(false)}
        onEnded={() => setIsMusicPlaying(false)}
      >
        <source src={`/audio/muyu-bg-${selectedMusic}.mp3`} type="audio/mpeg" />
      </audio>

      {/* 顶部标题区域 */}
      <motion.div 
        className="absolute top-8 left-0 right-0 text-center z-20 px-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-light text-amber-100 dark:text-amber-100 text-amber-900 mb-3 tracking-wide">
          沉浸式敲木鱼
        </h1>
        <p className="text-amber-200/80 dark:text-amber-200/80 text-amber-800 text-base md:text-lg tracking-wider font-medium">
          静心修身，功德无量
        </p>
        
        {/* 自动模式指示器 */}
        {isAutoMode && (
          <motion.div
            className="mt-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-green-600/30 dark:bg-green-600/30 bg-green-50/80 backdrop-blur-md rounded-lg px-6 py-3 border border-green-400/40 dark:border-green-400/40 border-green-600/60 inline-block">
              <p className="text-base text-green-200/90 dark:text-green-200/90 text-green-900 tracking-wide font-medium">
                自动修行中
              </p>
              <div className="flex items-center justify-center mt-1">
                <div className="w-2 h-2 bg-green-400 dark:bg-green-400 bg-green-600 rounded-full animate-pulse mr-2"></div>
                <p className="text-sm text-green-300/80 dark:text-green-300/80 text-green-800 tracking-wider font-medium">
                  功德持续累积
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 浮动控制按钮 */}
      <motion.button
        className="fixed top-20 right-6 z-30 w-12 h-12 bg-black/20 dark:bg-black/20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-amber-200/80 dark:text-amber-200/80 text-amber-800 hover:text-amber-100 dark:hover:text-amber-100 hover:text-amber-900 hover:bg-black/30 dark:hover:bg-black/30 hover:bg-white/40 transition-all duration-300"
        onClick={() => setShowControls(!showControls)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {showControls ? (
          <XMarkIcon className="w-6 h-6" />
        ) : (
          <Cog8ToothIcon className="w-6 h-6" />
        )}
      </motion.button>

      {/* 浮动控制面板 */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            className="fixed top-32 right-6 z-20 w-80 max-w-[calc(100vw-3rem)]"
            initial={{ opacity: 0, x: 100, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/30 dark:bg-black/30 bg-white/40 backdrop-blur-lg rounded-2xl p-6 border border-amber-400/20 dark:border-amber-400/20 border-amber-600/30">
              <div className="space-y-8">
                {/* 敲击模式控制 */}
                <div className="space-y-4">
                  <h3 className="text-amber-100 dark:text-amber-100 text-amber-900 font-medium text-base tracking-wide">敲击模式</h3>
                  <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-4">
                    <span className="text-amber-200/80 dark:text-amber-200/80 text-amber-900 text-sm font-medium">手动</span>
                    <Switch
                      checked={isAutoMode}
                      onChange={toggleAutoMode}
                    />
                    <span className="text-amber-200/80 dark:text-amber-200/80 text-amber-900 text-sm font-medium">自动</span>
                  </div>
                  </div>
                  {isAutoMode && (
                    <Select
                      value={autoSpeed.toString()}
                      onChange={(e) => handleSpeedChange(e.target.value)}
                      className="w-full [&>select]:border-2 [&>select]:focus-within:border-amber-500 [&>select]:dark:focus-within:border-amber-400 [&>select]:rounded-lg [&>select]:shadow-sm [&>select]:transition-all [&>select]:duration-300 [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-amber-100 [&>select]:dark:text-amber-100 [&>select]:bg-black/30 [&>select]:dark:bg-black/30 [&>select]:border-amber-400/40 [&>select]:dark:border-amber-400/40 [&>select]:hover:border-amber-400/60 [&>select]:dark:hover:border-amber-400/60 [&>select]:min-h-[2.5rem] [&>select]:backdrop-blur-md [&>span]:before:hidden [&>span]:after:hidden"
                    >
                      {autoSpeedOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-black/80 dark:bg-black/80 text-amber-100 dark:text-amber-100">
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>

                {/* 背景音乐控制 */}
                <div className="space-y-4">
                  <h3 className="text-amber-100 dark:text-amber-100 text-amber-900 font-medium text-base tracking-wide">背景音乐</h3>
                  <Select
                    value={selectedMusic}
                    onChange={(e) => handleMusicChange(e.target.value)}
                    className="w-full [&>select]:border-2 [&>select]:focus-within:border-amber-500 [&>select]:dark:focus-within:border-amber-400 [&>select]:rounded-lg [&>select]:shadow-sm [&>select]:transition-all [&>select]:duration-300 [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-amber-100 [&>select]:dark:text-amber-100 [&>select]:bg-black/30 [&>select]:dark:bg-black/30 [&>select]:border-amber-400/40 [&>select]:dark:border-amber-400/40 [&>select]:hover:border-amber-400/60 [&>select]:dark:hover:border-amber-400/60 [&>select]:min-h-[2.5rem] [&>select]:backdrop-blur-md [&>span]:before:hidden [&>span]:after:hidden"
                  >
                                          {bgMusicOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-black/80 dark:bg-black/80 text-amber-100 dark:text-amber-100">
                          {option.label}
                        </option>
                      ))}
                  </Select>
                  <Button
                    onClick={toggleMusic}
                    className="w-full bg-amber-600/20 dark:bg-amber-600/20 bg-amber-200/30 hover:bg-amber-600/30 dark:hover:bg-amber-600/30 hover:bg-amber-300/40 border-amber-400/30 dark:border-amber-400/30 border-amber-600/40 text-amber-100 dark:text-amber-100 text-amber-900 font-medium"
                  >
                    <div className="flex items-center justify-center">
                      {isMusicPlaying ? (
                        <>
                          <PauseIcon className="w-4 h-4 mr-2" />
                          暂停音乐
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-4 h-4 mr-2" />
                          播放音乐
                        </>
                      )}
                    </div>
                  </Button>
                </div>

                {/* 数据同步状态 */}
                {(!isOnline || pendingTaps > 0) && (
                  <div className="bg-black/20 dark:bg-black/20 bg-amber-50/80 backdrop-blur-sm rounded-lg p-3 border border-amber-400/20 dark:border-amber-400/20 border-amber-600/30">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        <span className="text-amber-200/90 dark:text-amber-200/90 text-amber-800">
                          {isOnline ? '已连接' : '离线状态'}
                        </span>
                      </div>
                      {pendingTaps > 0 && (
                        <span className="text-amber-300/70 dark:text-amber-300/70 text-amber-700 text-xs">
                          待同步: {pendingTaps}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* 功德统计 */}
                <div className="space-y-4">
                  <h3 className="text-amber-100 dark:text-amber-100 text-amber-900 font-medium text-base tracking-wide">功德统计</h3>
                  <MuyuStats data={muyuData} sessionCount={tapCount} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 木鱼主体 */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <MuyuWood 
          ref={muyuWoodRef}
          onTap={handleTap} 
          isAutoMode={isAutoMode}
          tapCount={tapCount}
        />
      </motion.div>

      {/* 功德显示区域 */}
      <motion.div 
        className="text-center px-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        {tapCount > 0 && (
          <motion.div
            key={tapCount}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="text-3xl md:text-4xl font-light text-amber-100 dark:text-amber-100 text-amber-900 mb-2 tracking-wider">
              功德 +{tapCount}
            </div>
          </motion.div>
        )}
        
        <div className="space-y-3">
          <p className="text-amber-200/90 dark:text-amber-200/90 text-amber-800 text-base md:text-lg font-medium tracking-wide">
            {tapCount > 0 ? '阿弥陀佛，功德无量' : '点击木鱼，开始修行'}
          </p>
          {tapCount > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-amber-300/70 dark:text-amber-300/70 text-amber-700 font-medium tracking-wide"
            >
              今日已修行 {muyuData.todayCount} 次
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* 装饰性莲花效果 */}
      {tapCount > 0 && (
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 2] }}
          transition={{ duration: 2, ease: "easeOut" }}
          key={tapCount}
        >
          <div className="text-amber-300/40 text-4xl">🪷</div>
        </motion.div>
      )}
    </div>
  )
} 