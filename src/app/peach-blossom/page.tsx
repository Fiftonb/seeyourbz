'use client'

import { useState } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { 
  findPeachBlossoms, 
  calculateWeeklyPeachBlossomFortune,
  type PeachBlossomResult,
  type WeeklyPeachBlossomFortune 
} from '@/lib/peach-blossom-fortune'
import { PeachBlossomForm } from '@/components/peach-blossom/PeachBlossomForm'
import { PeachBlossomResultComponent } from '@/components/peach-blossom/PeachBlossomResult'
import { WeeklyFortune } from '@/components/peach-blossom/WeeklyFortune'
import { PeachBlossomSuggestions } from '@/components/peach-blossom/PeachBlossomSuggestions'
import { HeartIcon } from '@heroicons/react/24/outline'
import { SolarTimeConfig, processSolarTimeConversion } from '@/lib/tyme'

interface UserInput {
  birthDate: Date
  birthTime: string
  gender: 'male' | 'female'
  name: string
  dateType: 'solar' | 'lunar'
  solarTimeConfig: SolarTimeConfig
}

export default function PeachBlossomPage() {
  const [result, setResult] = useState<PeachBlossomResult | null>(null)
  const [weeklyFortune, setWeeklyFortune] = useState<WeeklyPeachBlossomFortune | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserInput | null>(null)

  const handleCalculate = async (userInput: UserInput) => {
    setIsLoading(true)
    setCurrentUser(userInput)
    
    try {
      // 模拟计算过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 构建完整的出生时间
      const [hour, minute] = userInput.birthTime.split(':').map(Number)
      const fullBirthTime = new Date(userInput.birthDate)
      fullBirthTime.setHours(hour, minute, 0, 0)
      
      // 处理真太阳时转换
      const { finalTime } = processSolarTimeConversion(fullBirthTime, userInput.solarTimeConfig)
      
      // 使用转换后的时间进行计算
      const birthTime = { 
        hour: finalTime.getHours(), 
        minute: finalTime.getMinutes() 
      }
      
      const peachBlossomResult = findPeachBlossoms(finalTime, birthTime)
      const weeklyResult = calculateWeeklyPeachBlossomFortune(finalTime, birthTime)
      
      setResult(peachBlossomResult)
      setWeeklyFortune(weeklyResult)

      // 记录用户提交信息
      try {
        const response = await fetch('/api/submissions/record', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'peach-blossom',
            inputData: {
              birthDate: userInput.birthDate.toISOString(),
              birthTime: userInput.birthTime,
              gender: userInput.gender,
              name: userInput.name,
              dateType: userInput.dateType,
              solarTimeConfig: userInput.solarTimeConfig
            },
            resultData: {
              peachBlossomResult,
              weeklyResult
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
      console.error('计算桃花运失败:', error)
      alert('计算失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const resetCalculation = () => {
    setResult(null)
    setWeeklyFortune(null)
    setCurrentUser(null)
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <Heading className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          桃花运测算
        </Heading>
        <Text className="mt-4 text-gray-600 max-w-2xl mx-auto">
          基于传统八字命理学，为您深度分析桃花运势，预测感情机遇，助您把握爱情良缘
        </Text>
      </div>

      {!result ? (
        // 输入表单
        <div className="max-w-2xl mx-auto">
          <PeachBlossomForm onSubmit={handleCalculate} isLoading={isLoading} />
        </div>
      ) : (
        // 结果展示
        <div className="space-y-8">
          {/* 桃花运分析结果 */}
          <PeachBlossomResultComponent 
            result={result} 
            userName={currentUser?.name}
            birthDate={currentUser?.birthDate}
            birthTime={currentUser ? { 
              hour: parseInt(currentUser.birthTime.split(':')[0]), 
              minute: parseInt(currentUser.birthTime.split(':')[1]) 
            } : undefined}
            onReset={resetCalculation}
          />

          {/* 每周桃花运指数 */}
          <WeeklyFortune 
            fortune={weeklyFortune} 
            userName={currentUser?.name} 
          />

          {/* 桃花运提升建议 */}
          <PeachBlossomSuggestions 
            result={result} 
            userName={currentUser?.name} 
          />
        </div>
      )}
    </div>
  )
} 