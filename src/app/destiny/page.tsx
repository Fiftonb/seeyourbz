'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { LunarDatePicker } from '@/components/ui/lunar-date-picker'
import { getCompleteEightCharInfo } from '@/lib/tyme'
import { CalendarIcon, ClockIcon, SparklesIcon } from '@heroicons/react/16/solid'
import { useRouter } from 'next/navigation'

export default function DestinyPage() {
  // 表单状态
  const [dateType, setDateType] = useState<'solar' | 'lunar'>('lunar')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2000, 9, 15)) // 2000-10-15
  const [timeInput, setTimeInput] = useState<string>('03:30')
  const [gender, setGender] = useState<'MAN' | 'WOMAN'>('MAN')
  const [startAge, setStartAge] = useState<number>(2)
  
  // 初始化路由
  const router = useRouter()
  
  // 计算结果状态 - 添加默认值避免undefined状态
  const [calculationResult, setCalculationResult] = useState<string>('')
  const [structuredResult, setStructuredResult] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  
  // 添加组件挂载状态，确保初始渲染稳定
  const [isMounted, setIsMounted] = useState(false)
  

  
  // 组件挂载后设置状态
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // 添加示例数据
  const handleUseExample = () => {
    setDateType('lunar')
    setSelectedDate(new Date(2000, 9, 15))
    setTimeInput('03:30')
    setGender('MAN')
    setStartAge(2)
  }
  
  // 处理页面滚动禁用
  useEffect(() => {
    // 只在计算状态改变时才操作body样式，避免初始化时的抖动
    if (isCalculating) {
      // 禁用页面滚动
      document.body.style.overflow = 'hidden'
    } else {
      // 只有在之前设置过hidden时才恢复，避免不必要的样式操作
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'unset'
      }
    }
    
    // 清理函数
    return () => {
      // 组件卸载时确保恢复正常状态
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isCalculating])

  // 生成背景粒子配置
  const particles = useMemo(() => {
    if (!isCalculating) return []
    
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2
    }))
  }, [isCalculating])

  // 处理计算
  const handleCalculate = useCallback(async () => {
    setIsCalculating(true)
    setStructuredResult(null) // 清空之前的结果
    
    try {
      // 构建完整的出生时间
      const [hours, minutes] = timeInput.split(':').map(Number)
      const birthTime = new Date(selectedDate)
      birthTime.setHours(hours, minutes, 0, 0)
      
      console.log('出生时间:', birthTime)
      console.log('性别:', gender)
      
      // 获取完整的八字信息
      const eightCharInfo = getCompleteEightCharInfo(birthTime, gender)
      
      console.log('八字信息:', eightCharInfo)
      
      // 生成结构化数据
      const structuredData = formatResult(eightCharInfo)
      
      // 生成文本数据用于复制
      const resultText = generateTextResult(structuredData)
      
      // 添加人工延迟，让用户感受到计算过程（3秒）
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setStructuredResult(structuredData)
      setCalculationResult(resultText)

      // 记录用户提交信息
      try {
        const response = await fetch('/api/submissions/record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'destiny',
            inputData: {
              birthDate: selectedDate.toISOString(),
              birthTime: timeInput,
              gender: gender,
              startAge: startAge,
              dateType: dateType
            },
            resultData: {
              eightCharInfo: structuredData,
              calculationResult: resultText.substring(0, 1000) // 只保存前1000字符避免数据过大
            }
          }),
        })
        
        if (!response.ok) {
          console.warn('记录提交信息失败')
        }
      } catch (recordError) {
        console.warn('记录提交信息时出错:', recordError)
      }
    } catch (error) {
      console.error('计算出错:', error)
      setCalculationResult(`计算出错: ${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setIsCalculating(false)
    }
  }, [selectedDate, timeInput, gender, startAge, dateType])

  // 格式化结果为结构化数据
  const formatResult = (info: any) => {
    console.log('Complete info:', info)
    
    const { eightChar, tenStarAnalysis, elementAnalysis, hideHeavenStemAnalysis, childLimit, decadeFortuneList } = info
    
    // 格式化起运时间为相对时间
    const formatStartTime = (childLimit: any) => {
      const years = childLimit.yearCount || 0
      const months = childLimit.monthCount || 0
      const days = childLimit.dayCount || 0
      return `出生${years}年${months}个月${days}天后起运`
    }
    
    return {
      eightChar: {
        year: eightChar.year,
        month: eightChar.month,
        day: eightChar.day,
        hour: eightChar.hour
      },
      elements: {
        year: elementAnalysis.year,
        month: elementAnalysis.month,
        day: elementAnalysis.day,
        hour: elementAnalysis.hour
      },
      sounds: {
        year: info.soundAnalysis.year.name,
        month: info.soundAnalysis.month.name,
        day: info.soundAnalysis.day.name,
        hour: info.soundAnalysis.hour.name
      },
      tenStars: {
        year: tenStarAnalysis.yearTenStar,
        month: tenStarAnalysis.monthTenStar,
        day: tenStarAnalysis.dayTenStar,
        hour: tenStarAnalysis.hourTenStar
      },
      hideStems: hideHeavenStemAnalysis.map((branch: any, index: number) => {
        const branchNames = ['年支', '月支', '日支', '时支']
        const hideStems = branch.hideStems.map((stem: any) => stem.tenStar)
        return {
          branch: branchNames[index],
          stems: hideStems
        }
      }),
      startTime: formatStartTime(childLimit),
      decadeFortuneList: decadeFortuneList || [],
      selectedDecadeIndex: Math.max(0, startAge - 1)
    }
  }

  // 生成文本结果用于复制
  const generateTextResult = (data: any) => {
    const sections = [
      `八字: ${data.eightChar.year} ${data.eightChar.month} ${data.eightChar.day} ${data.eightChar.hour}`,
      `五行: ${data.elements.year}, ${data.elements.month}, ${data.elements.day}, ${data.elements.hour}`,
      `纳音: ${data.sounds.year}, ${data.sounds.month}, ${data.sounds.day}, ${data.sounds.hour}`,
      `十神干: ${data.tenStars.year}, ${data.tenStars.month}, ${data.tenStars.day}, ${data.tenStars.hour}`,
      
      // 藏干十神
      ...data.hideStems.map((hideStem: any) => {
        const hideStems = hideStem.stems.join(',')
        return `${hideStem.branch}十神: ${hideStems}`
      }),
      
      // 起运信息
      `起运时间: ${data.startTime}`
    ]
    
    // 添加大运信息
    if (data.decadeFortuneList && Array.isArray(data.decadeFortuneList)) {
      sections.push('')
      sections.push('大运信息:')
      for (let i = 0; i < Math.min(10, data.decadeFortuneList.length); i++) {
        const fortune = data.decadeFortuneList[i]
        if (fortune) {
          sections.push(`大运[${i + 1}]: ${fortune.startYear}年 ${fortune.startAge}岁 ${fortune.sixtyCycle}`)
        }
      }
      
      // 根据起始年龄显示对应的流年
      const targetFortuneInfo = data.decadeFortuneList[data.selectedDecadeIndex]
      
      if (targetFortuneInfo) {
        sections.push('')
        sections.push(`第${data.selectedDecadeIndex + 1}次大运的流年:`)
        
        // 计算流年
        const startYear = targetFortuneInfo.startYear
        for (let i = 0; i < 10; i++) {
          const currentYear = startYear + i
          const currentAge = targetFortuneInfo.startAge + i
          
          // 计算干支年
          const ganzhiYear = calculateGanzhiYear(currentYear)
          sections.push(`流年[${i}]: ${currentYear}年 ${currentAge}岁 ${ganzhiYear}`)
        }
      }
    }
    
    return sections.join('\n')
  }

  // 计算干支年的辅助函数
  const calculateGanzhiYear = (year: number) => {
    const tian = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    const di = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    
    const tianIndex = (year - 4) % 10
    const diIndex = (year - 4) % 12
    
    return `${tian[tianIndex]}${di[diIndex]}`
  }

  // 复制结果
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(calculationResult)
      setCopySuccess(true)
      // 2秒后重置状态
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('复制失败:', error)
      // 可以添加错误提示
    }
  }, [calculationResult])

  // 简批命理功能
  const handleJianPi = useCallback(() => {
    if (!structuredResult) return
    
    // 构建查询参数，将八字信息和出生日期传递给简批结果页面
    const params = new URLSearchParams()
    params.set('eightChar', encodeURIComponent(JSON.stringify(structuredResult.eightChar)))
    // 使用本地日期格式而不是UTC时间，避免时区差异
    const localDateString = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`
    params.set('birthDate', encodeURIComponent(localDateString))
    params.set('birthTime', encodeURIComponent(timeInput))
    params.set('gender', encodeURIComponent(gender)) // 添加性别参数
    
    // 跳转到简批命理结果页面
    router.push(`/destiny-jianpi?${params.toString()}` as any)
  }, [structuredResult, selectedDate, timeInput, gender, router])
  
  // 在组件未完全挂载时显示简单的加载状态
  if (!isMounted) {
    return (
      <div className="space-y-8 relative">
        {/* 骨架屏 - 模拟真实布局，避免突然变化 */}
        <div className="text-center space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg mx-auto max-w-md animate-pulse"></div>
          <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded mx-auto max-w-lg animate-pulse"></div>
        </div>
        
        <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 relative">
      {/* 计算加载遮罩 */}
      {isCalculating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          {/* 背景粒子效果 */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-ping"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`
                }}
              />
            ))}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md mx-4 animate-fade-in relative">
            <div className="text-center space-y-6">
              {/* 动画图标 */}
              <div className="relative">
                <div className="w-20 h-20 mx-auto">
                  {/* 外圈 */}
                  <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-600 rounded-full opacity-20"></div>
                  {/* 旋转圈1 */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-red-500 border-r-red-300 rounded-full animate-spin"></div>
                  {/* 旋转圈2 */}
                  <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 border-l-blue-300 rounded-full animate-spin" 
                       style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                  {/* 旋转圈3 */}
                  <div className="absolute inset-4 border-2 border-transparent border-t-purple-500 rounded-full animate-spin" 
                       style={{animationDuration: '2s'}}></div>
                  {/* 中心图标 */}
                  <SparklesIcon className="absolute inset-0 m-auto size-8 text-amber-500 animate-pulse" />
                </div>
                
                {/* 环绕的小点 */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-red-500 to-blue-500 rounded-full animate-ping"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-40px)`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
              
              {/* 标题和描述 */}
              <div className="space-y-3">
                <Heading level={3} className="text-xl font-bold text-gray-900 dark:text-white animate-pulse">
                  正在计算八字命理
                </Heading>
                <Text className="text-gray-600 dark:text-gray-400">
                  正在分析您的生辰八字，解读命理信息...
                </Text>
              </div>
              
              {/* 进度指示 */}
              <div className="space-y-3">
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 h-full rounded-full shadow-sm" 
                       style={{
                         width: '100%',
                         animation: 'progress-fill 3s ease-out forwards'
                       }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="animate-pulse">解析生辰八字</span>
                  <span className="animate-pulse" style={{animationDelay: '1s'}}>分析五行十神</span>
                  <span className="animate-pulse" style={{animationDelay: '2s'}}>计算大运流年</span>
                </div>
              </div>
              
              {/* 装饰性文字 */}
              <div className="text-xs text-gray-400 dark:text-gray-500 animate-pulse">
                <Text>🔮 运用传统命理学算法精密计算</Text>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 标题区域 - 参考首页居中设计 */}
      <div className="text-center space-y-4">
        <Heading level={1} className="text-4xl font-bold text-gray-900 dark:text-white">
          八字命理计算
        </Heading>
        <Text className="text-xl text-gray-600 dark:text-gray-400">
          用法:复制结果后去询问Ai
        </Text>
        <div className="flex justify-center gap-3 items-center">
          <Button
            plain
            onClick={handleUseExample}
            className="text-sm px-4 py-2 transition-all duration-300 transform hover:scale-105"
          >
            使用示例数据
          </Button>
          <Badge color="green">
            <SparklesIcon className="size-4 mr-1" />
            功能完善
          </Badge>
        </div>
      </div>
      
      <Divider />
      
      {/* 输入表单 - 采用网格布局 */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：基本信息 */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <Heading level={3} className="text-lg font-semibold">
                  基本信息
                </Heading>
                <Badge color="blue">
                  <CalendarIcon className="size-4 mr-1" />
                  出生信息
                </Badge>
              </div>
              
              <div className="space-y-4">
                {/* 日期类型选择 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    日期类型
                  </Text>
                  <div className="flex rounded-md overflow-hidden">
                    <Button 
                      onClick={() => setDateType('lunar')}
                      className={`px-4 py-1.5 transition-all duration-300 ${dateType === 'lunar'
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                      农历
                    </Button>
                    <Button 
                      onClick={() => setDateType('solar')}
                      className={`px-4 py-1.5 transition-all duration-300 ${dateType === 'solar'
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                      公历
                    </Button>
                  </div>
                </div>

                {/* 日期选择 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    {dateType === 'lunar' ? '农历日期' : '公历日期'}
                  </Text>
                  {dateType === 'lunar' ? (
                    <LunarDatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      type="date"
                      value={selectedDate.toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="w-full [&>input]:border-2 [&>input]:focus-within:border-red-500 [&>input]:dark:focus-within:border-red-400 [&>input]:rounded-lg [&>input]:shadow-sm [&>input]:transition-all [&>input]:duration-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:dark:text-white [&>input]:bg-white [&>input]:dark:bg-gray-700/50 [&>input]:border-gray-300 [&>input]:dark:border-gray-600 [&>input]:hover:border-gray-400 [&>input]:dark:hover:border-gray-500 [&>input]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
                      onClick={(e) => {
                        const input = e.currentTarget as HTMLInputElement;
                        input.focus();
                        input.showPicker?.();
                      }}
                    />
                  )}
                </div>

                {/* 时间输入 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    出生时间
                  </Text>
                  <Input
                    type="time"
                    value={timeInput}
                    onChange={(e) => setTimeInput(e.target.value)}
                    className="w-full [&>input]:border-2 [&>input]:focus-within:border-red-500 [&>input]:dark:focus-within:border-red-400 [&>input]:rounded-lg [&>input]:shadow-sm [&>input]:transition-all [&>input]:duration-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:dark:text-white [&>input]:bg-white [&>input]:dark:bg-gray-700/50 [&>input]:border-gray-300 [&>input]:dark:border-gray-600 [&>input]:hover:border-gray-400 [&>input]:dark:hover:border-gray-500 [&>input]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
                    onClick={(e) => {
                      const input = e.currentTarget as HTMLInputElement;
                      input.focus();
                      input.showPicker?.();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：个人信息 */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <Heading level={3} className="text-lg font-semibold">
                  个人信息
                </Heading>
                <Badge color="purple">
                  <ClockIcon className="size-4 mr-1" />
                  配置
                </Badge>
              </div>
              
              <div className="space-y-4">
                {/* 性别选择 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    性别
                  </Text>
                  <div className="flex rounded-md overflow-hidden">
                    <Button 
                      onClick={() => setGender('MAN')}
                      className={`px-4 py-1.5 transition-all duration-300 ${gender === 'MAN'
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                      男
                    </Button>
                    <Button 
                      onClick={() => setGender('WOMAN')}
                      className={`px-4 py-1.5 transition-all duration-300 ${gender === 'WOMAN'
                        ? 'bg-pink-600 text-white hover:bg-pink-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                    >
                      女
                    </Button>
                  </div>
                </div>

                {/* 大运流年起始 */}
                <div>
                  <Text className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    输出第几次大运的流年
                  </Text>
                  <div className="grid grid-cols-5 gap-1 rounded-md overflow-hidden">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <Button
                        key={num}
                        onClick={() => setStartAge(num)}
                        className={`px-3 py-1.5 text-sm transition-all duration-300 ${startAge === num
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>
                  <Text className="text-xs text-gray-500 mt-1">
                    选择要显示的大运次数（1-10）
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：其他设置 */}
          <div className="space-y-6">

          </div>
        </div>

        {/* 操作按钮区域 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 计算按钮 */}
            <div className="bg-gradient-to-r from-red-50 to-blue-50 dark:from-red-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
              <div className="text-center space-y-4">
                <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
                  开始计算
                </Heading>
                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className={`w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white font-semibold py-3 px-6 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isCalculating 
                      ? 'animate-pulse bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isCalculating && (
                      <SparklesIcon className="size-4 animate-spin" />
                    )}
                    {isCalculating ? '计算中...' : '计算八字命理'}
                  </div>
                </Button>
              </div>
            </div>

            {/* 结果复制 */}
            <div className={`bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800`}>
              <div className="text-center space-y-4">
                <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
                  结果操作
                </Heading>
                <div className="flex justify-center gap-3">
                  <Button
                    outline
                    onClick={handleCopy}
                    disabled={!calculationResult}
                    className={`border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-4 py-2 ${
                      copySuccess 
                        ? 'animate-bounce bg-green-50 dark:bg-green-900/20 border-green-500 text-green-600' 
                        : calculationResult 
                          ? '' 
                          : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {copySuccess && (
                        <SparklesIcon className="size-4 animate-pulse" />
                      )}
                      {copySuccess ? '复制成功！' : '复制结果'}
                    </div>
                  </Button>
                  
                  <Button
                    outline
                    onClick={handleJianPi}
                    disabled={!structuredResult}
                    className={`border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-semibold px-4 py-2 ${
                      !structuredResult ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <SparklesIcon className="size-4" />
                      简批命理
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 计算结果 - 卡片式布局 */}
      {structuredResult && (
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <Heading level={2} className="text-3xl font-bold text-gray-900 dark:text-white">
              计算结果
            </Heading>
            <Text className="text-lg text-gray-600 dark:text-gray-400">
              详细的八字命理分析结果
            </Text>
            <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            {/* 八字基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 八字四柱 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Heading level={3} className="text-lg font-semibold">
                    八字四柱
                  </Heading>
                  <Badge color="blue">
                    基础
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">年柱</Text>
                    <Text className="text-lg font-bold">{structuredResult.eightChar.year}</Text>
                  </div>
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">月柱</Text>
                    <Text className="text-lg font-bold">{structuredResult.eightChar.month}</Text>
                  </div>
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">日柱</Text>
                    <Text className="text-lg font-bold text-red-600 dark:text-red-400">{structuredResult.eightChar.day}</Text>
                  </div>
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">时柱</Text>
                    <Text className="text-lg font-bold">{structuredResult.eightChar.hour}</Text>
                  </div>
                </div>
              </div>

              {/* 五行分析 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Heading level={3} className="text-lg font-semibold">
                    五行分析
                  </Heading>
                  <Badge color="red">
                    五行
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">年</Text>
                    <Badge color="orange" className="text-sm">{structuredResult.elements.year}</Badge>
                  </div>
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">月</Text>
                    <Badge color="orange" className="text-sm">{structuredResult.elements.month}</Badge>
                  </div>
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">日</Text>
                    <Badge color="red" className="text-sm">{structuredResult.elements.day}</Badge>
                  </div>
                  <div className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">时</Text>
                    <Badge color="orange" className="text-sm">{structuredResult.elements.hour}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 纳音和十神 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 纳音五行 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Heading level={3} className="text-lg font-semibold">
                    纳音五行
                  </Heading>
                  <Badge color="yellow">
                    纳音
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">年柱：</Text>
                    <Text className="font-medium">{structuredResult.sounds.year}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">月柱：</Text>
                    <Text className="font-medium">{structuredResult.sounds.month}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">日柱：</Text>
                    <Text className="font-medium text-red-600 dark:text-red-400">{structuredResult.sounds.day}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">时柱：</Text>
                    <Text className="font-medium">{structuredResult.sounds.hour}</Text>
                  </div>
                </div>
              </div>

              {/* 十神分析 */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <Heading level={3} className="text-lg font-semibold">
                    十神分析
                  </Heading>
                  <Badge color="purple">
                    十神
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">年干：</Text>
                    <Badge color="purple" className="text-sm">{structuredResult.tenStars.year}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">月干：</Text>
                    <Badge color="purple" className="text-sm">{structuredResult.tenStars.month}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">日干：</Text>
                    <Badge color="red" className="text-sm">{structuredResult.tenStars.day}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">时干：</Text>
                    <Badge color="purple" className="text-sm">{structuredResult.tenStars.hour}</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 藏干分析 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <Heading level={3} className="text-lg font-semibold">
                  地支藏干十神
                </Heading>
                <Badge color="indigo">
                  藏干
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {structuredResult.hideStems.map((hideStem: any, index: number) => (
                  <div key={index} className="text-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">{hideStem.branch}</Text>
                    <div className="space-y-1">
                      {hideStem.stems.map((stem: string, stemIndex: number) => (
                        <Badge key={stemIndex} color="indigo" className="text-xs block mx-auto">
                          {stem}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 起运信息 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between mb-4">
                <Heading level={3} className="text-lg font-semibold text-gray-900 dark:text-white">
                  起运信息
                </Heading>
                <Badge color="pink">
                  <ClockIcon className="size-4 mr-1" />
                  起运
                </Badge>
              </div>
              <div className="text-center">
                <Text className="text-xl font-bold text-gray-900 dark:text-white">
                  {structuredResult.startTime}
                </Text>
              </div>
            </div>

            {/* 大运信息 */}
            {structuredResult.decadeFortuneList && structuredResult.decadeFortuneList.length > 0 && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <Heading level={3} className="text-lg font-semibold">
                      大运信息
                    </Heading>
                    <Badge color="green">
                      大运
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {structuredResult.decadeFortuneList.slice(0, 10).map((fortune: any, index: number) => (
                      <div key={index} className={`text-center p-4 rounded-lg border-2 ${index === structuredResult.selectedDecadeIndex ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">第{index + 1}运</Text>
                        <Text className="text-lg font-bold">{fortune.sixtyCycle}</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">{fortune.startYear}年</Text>
                        <Text className="text-sm text-gray-600 dark:text-gray-400">{fortune.startAge}岁</Text>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 选中大运的流年 */}
                {(() => {
                  const targetFortuneInfo = structuredResult.decadeFortuneList[structuredResult.selectedDecadeIndex]
                  if (!targetFortuneInfo) return null
                  
                  const startYear = targetFortuneInfo.startYear
                  const flowYears = Array.from({ length: 10 }, (_, i) => {
                    const currentYear = startYear + i
                    const currentAge = targetFortuneInfo.startAge + i
                    const ganzhiYear = calculateGanzhiYear(currentYear)
                    return { year: currentYear, age: currentAge, ganzhi: ganzhiYear }
                  })
                  
                  return (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <Heading level={3} className="text-lg font-semibold">
                          第{structuredResult.selectedDecadeIndex + 1}运流年详情
                        </Heading>
                        <Badge color="emerald">
                          流年
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {flowYears.map((flowYear, index) => (
                          <div key={index} className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">流年{index + 1}</Text>
                            <Text className="text-lg font-bold">{flowYear.ganzhi}</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">{flowYear.year}年</Text>
                            <Text className="text-sm text-gray-600 dark:text-gray-400">{flowYear.age}岁</Text>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      )}


    </div>
  )
} 