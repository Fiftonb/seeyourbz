import { MuyuContainer } from '@/components/muyu/MuyuContainer'

export default function MuyuPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* 沉浸式背景 - 支持主题适配 */}
      <div className="absolute inset-0">
        {/* 主背景渐变 */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-amber-900/40 to-slate-800 dark:from-slate-900 dark:via-amber-900/40 dark:to-slate-800 from-slate-50 via-amber-50/80 to-slate-100"></div>
        
        {/* 云雾效果 */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-32 bg-white/10 dark:bg-white/10 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-80 h-24 bg-amber-200/10 dark:bg-amber-200/10 bg-orange-200/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 left-1/3 w-64 h-20 bg-orange-200/10 dark:bg-orange-200/10 bg-amber-300/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        {/* 装饰性光点 */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/60 dark:bg-amber-400/60 bg-amber-500/80 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* 禅意图案 */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 dark:opacity-5 opacity-10">
          <div className="w-96 h-96 border border-amber-400/20 dark:border-amber-400/20 border-amber-600/30 rounded-full"></div>
          <div className="absolute top-8 left-8 w-80 h-80 border border-amber-400/15 dark:border-amber-400/15 border-amber-600/25 rounded-full"></div>
          <div className="absolute top-16 left-16 w-64 h-64 border border-amber-400/10 dark:border-amber-400/10 border-amber-600/20 rounded-full"></div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10">
        <MuyuContainer />
      </div>
    </div>
  )
} 