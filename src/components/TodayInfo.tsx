import { SolarDay } from 'tyme4ts'
import { Text } from '@/components/ui/text'
import { Badge } from '@/components/ui/badge'
import { getAlmanacInfo } from '@/lib/tyme'
import Link from 'next/link'

interface TodayInfoProps {
  date?: Date
}

export function TodayInfo({ date = new Date() }: TodayInfoProps) {
  const today = SolarDay.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const lunarDay = today.getLunarDay()
  const almanacInfo = getAlmanacInfo(date)
  const term = today.getTerm()
  
  // 构建今日描述文本
  const buildTodayDescription = () => {
    const parts = []
    
    // 基本日期信息
    parts.push(`今天是${today.toString()}`)
    parts.push(`星期${today.getWeek().getName()}`)
    
    // 农历和干支信息
    const lunarDateStr = lunarDay.toString()
    const ganzhi = lunarDay.getSixtyCycle().toString()
    parts.push(`${lunarDateStr}(${ganzhi})`)
    
    // 节气信息
    if (term) {
      parts.push(`正值${term.getName()}节气`)
    }
    
    return parts.join('，') + '。'
  }
  
  // 构建冲煞建议文本
  const buildClashAdvice = () => {
    const clashInfo = almanacInfo.clash.replace('冲', '')
    const clashAnimal = clashInfo.split('(')[0] // 只取生肖名，不要地支
    const evilDirection = almanacInfo.evil.replace('煞', '')
    
    const advice = []
    advice.push(`今日与${clashInfo}相冲，属${clashAnimal}的朋友今天宜静不宜动`)
    advice.push(`${evilDirection}方向不太吉利，重要事情尽量避开朝${evilDirection}方向进行`)
    
    // 值神建议
    if (almanacInfo.duty) {
      const dutyAdvice = getDutyAdvice(almanacInfo.duty)
      if (dutyAdvice) {
        advice.push(dutyAdvice)
      }
    }
    
    return advice.join('；')
  }
  
  // 获取值神建议
  const getDutyAdvice = (duty: string) => {
    const dutyAdviceMap: { [key: string]: string } = {
      '青龙': '今日青龙值日，适合开业、签约、结婚等喜庆之事',
      '明堂': '今日明堂值日，适合学习、考试、见贵人',
      '天刑': '今日天刑值日，不宜诉讼、争执，宜谨慎行事',
      '朱雀': '今日朱雀值日，注意口舌是非，慎言为好',
      '金匮': '今日金匮值日，适合理财、投资、收藏',
      '天德': '今日天德值日，诸事皆宜，是个好日子',
      '白虎': '今日白虎值日，不宜动土、搬家，注意安全',
      '玉堂': '今日玉堂值日，适合文书、学习、创作',
      '天牢': '今日天牢值日，不宜出行、重要决定，宜安静',
      '元武': '今日元武值日，宜保守，不宜冒险',
      '司命': '今日司命值日，适合求职、升迁、重要决定',
      '勾陈': '今日勾陈值日，容易纠纷，宜谨慎处理人际关系'
    }
    return dutyAdviceMap[duty] || `今日${duty}值日`
  }
  
  // 构建宜忌建议
  const buildTabooAdvice = () => {
    const parts = []
    
    if (almanacInfo.recommends.length > 0) {
      const topRecommends = almanacInfo.recommends.slice(0, 3)
      parts.push(`今天适合：${topRecommends.join('、')}`)
    }
    
    if (almanacInfo.avoids.length > 0) {
      const topAvoids = almanacInfo.avoids.slice(0, 3)
      parts.push(`今天不宜：${topAvoids.join('、')}`)
    }
    
    return parts.join('　')
  }

  const todayDescription = buildTodayDescription()
  const clashAdvice = buildClashAdvice()
  const tabooAdvice = buildTabooAdvice()

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 shadow-sm">
      <div className="space-y-4">
        {/* 主要描述 */}
        <div className="text-center">
          <Text className="text-lg font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
            {todayDescription}
          </Text>
        </div>
        
        {/* 分隔线 */}
        <div className="flex items-center justify-center">
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
          <div className="px-4">
            <Badge color="orange" className="text-xs">
              今日提醒
            </Badge>
          </div>
          <div className="flex-1 border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        
        {/* 冲煞建议 */}
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-md p-4 border border-orange-200 dark:border-orange-800">
          <Text className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
            💡 {clashAdvice}
          </Text>
        </div>
        
        {/* 宜忌建议 */}
        {tabooAdvice && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-4 border border-green-200 dark:border-green-800">
            <Text className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
              📅 {tabooAdvice}　
              <Link 
                href="/almanac"
                className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 underline decoration-dotted underline-offset-2 hover:decoration-solid transition-colors ml-2"
              >
                完整黄历
              </Link>
            </Text>
          </div>
        )}
        
        {/* 额外信息 */}
        <div className="flex justify-center space-x-4 text-xs">
          {almanacInfo.star28 && (
            <Badge color="purple" className="text-xs">
              {almanacInfo.star28}宿值日
            </Badge>
          )}
          {almanacInfo.nineStar && (
            <Badge color="green" className="text-xs">
              {almanacInfo.nineStar}星当值
            </Badge>
          )}
          {almanacInfo.phase && (
            <Badge color="yellow" className="text-xs">
              月相{almanacInfo.phase}
            </Badge>
          )}
        </div>
        
        {/* 友好提示 */}
        <div className="text-center pt-2">
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            以上内容仅供参考，具体安排请结合实际情况 🙂
          </Text>
        </div>
      </div>
    </div>
  )
} 