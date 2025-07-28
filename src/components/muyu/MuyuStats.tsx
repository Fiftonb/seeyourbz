'use client'

interface MuyuData {
  totalCount: number
  todayCount: number
  lastTapDate: string
  sessionCount: number
}

interface MuyuStatsProps {
  data: MuyuData
  sessionCount: number
}

export function MuyuStats({ data, sessionCount }: MuyuStatsProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="flex justify-between items-center hover:scale-[1.02] transition-transform duration-200">
          <span className="text-sm text-amber-200/80 dark:text-amber-200/80 text-amber-900 font-medium tracking-wide">本次修行</span>
          <div className="px-3 py-1.5 bg-green-500/20 dark:bg-green-500/20 bg-green-100/60 border border-green-400/30 dark:border-green-400/30 border-green-600/50 rounded-lg text-sm text-green-300 dark:text-green-300 text-green-800 font-medium min-w-[3rem] text-center">
            {sessionCount}
          </div>
        </div>
        
        <div className="flex justify-between items-center hover:scale-[1.02] transition-transform duration-200">
          <span className="text-sm text-amber-200/80 dark:text-amber-200/80 text-amber-900 font-medium tracking-wide">今日功德</span>
          <div className="px-3 py-1.5 bg-blue-500/20 dark:bg-blue-500/20 bg-blue-100/60 border border-blue-400/30 dark:border-blue-400/30 border-blue-600/50 rounded-lg text-sm text-blue-300 dark:text-blue-300 text-blue-800 font-medium min-w-[3rem] text-center">
            {data.todayCount}
          </div>
        </div>
        
        <div className="flex justify-between items-center hover:scale-[1.02] transition-transform duration-200">
          <span className="text-sm text-amber-200/80 dark:text-amber-200/80 text-amber-900 font-medium tracking-wide">累计功德</span>
          <div className="px-3 py-1.5 bg-amber-500/20 dark:bg-amber-500/20 bg-amber-100/60 border border-amber-400/30 dark:border-amber-400/30 border-amber-600/50 rounded-lg text-sm text-amber-300 dark:text-amber-300 text-amber-800 font-medium min-w-[3rem] text-center">
            {data.totalCount}
          </div>
        </div>
      </div>

      {/* 修行等级 */}
      <div className="pt-4 border-t border-amber-400/20 dark:border-amber-400/20 border-amber-600/30">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-amber-200/70 dark:text-amber-200/70 text-amber-800 font-medium tracking-wide">修行境界</span>
          <span className="text-sm text-amber-300 dark:text-amber-300 text-amber-800 font-medium tracking-wide">
            {getMeditationLevel(data.totalCount)}
          </span>
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-amber-900/30 dark:bg-amber-900/30 bg-amber-300/30 rounded-full h-2.5 overflow-hidden mb-2">
          <div 
            className="bg-gradient-to-r from-amber-400/70 to-amber-300/90 dark:from-amber-400/70 dark:to-amber-300/90 from-amber-600 to-amber-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${getLevelProgress(data.totalCount)}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-amber-300/60 dark:text-amber-300/60 text-amber-700 font-medium">
            {getCurrentLevelThreshold(data.totalCount)}
          </span>
          <span className="text-xs text-amber-300/60 dark:text-amber-300/60 text-amber-700 font-medium">
            {getNextLevelThreshold(data.totalCount)}
          </span>
        </div>
      </div>
    </div>
  )
}

// 根据敲击次数确定修行等级
function getMeditationLevel(count: number): string {
  if (count < 108) return '初学者'
  if (count < 500) return '入门弟子'
  if (count < 1000) return '精进行者'
  if (count < 5000) return '修行居士'
  if (count < 10000) return '虔诚信徒'
  if (count < 50000) return '得道高僧'
  return '圆满大师'
}

// 获取当前等级进度百分比
function getLevelProgress(count: number): number {
  const levels = [0, 108, 500, 1000, 5000, 10000, 50000, 100000]
  
  for (let i = 0; i < levels.length - 1; i++) {
    if (count >= levels[i] && count < levels[i + 1]) {
      const progress = ((count - levels[i]) / (levels[i + 1] - levels[i])) * 100
      return Math.min(progress, 100)
    }
  }
  
  return 100
}

// 获取当前等级起始值
function getCurrentLevelThreshold(count: number): number {
  const levels = [0, 108, 500, 1000, 5000, 10000, 50000]
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (count >= levels[i]) {
      return levels[i]
    }
  }
  
  return 0
}

// 获取下一等级目标值
function getNextLevelThreshold(count: number): number {
  const levels = [108, 500, 1000, 5000, 10000, 50000, 100000]
  
  for (let i = 0; i < levels.length; i++) {
    if (count < levels[i]) {
      return levels[i]
    }
  }
  
  return 100000
} 