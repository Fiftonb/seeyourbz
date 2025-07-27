'use client'

import { useTheme } from '@/lib/theme'
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid'

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}
      className="relative flex items-center justify-center size-[18px] rounded-md hover:bg-zinc-950/10 dark:hover:bg-white/10 transition-colors border border-transparent hover:border-zinc-950/10 dark:hover:border-white/10"
    >
      <div className="relative size-4">
        <SunIcon 
          className={`absolute inset-0 transition-all duration-300 text-zinc-500 dark:text-zinc-400 ${
            isDarkMode 
              ? 'scale-0 opacity-0 rotate-90' 
              : 'scale-100 opacity-100 rotate-0'
          }`}
        />
        <MoonIcon 
          className={`absolute inset-0 transition-all duration-300 text-zinc-500 dark:text-zinc-400 ${
            isDarkMode 
              ? 'scale-100 opacity-100 rotate-0' 
              : 'scale-0 opacity-0 -rotate-90'
          }`}
        />
      </div>
    </button>
  )
} 