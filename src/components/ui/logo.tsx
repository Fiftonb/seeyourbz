import React from 'react'

interface LogoProps {
  className?: string
}

interface LogoIconProps {
  className?: string
}

export function LogoIcon({ className }: LogoIconProps) {
  return (
    <svg className={`h-6 w-6 ${className}`} viewBox="0 0 100 100" fill="currentColor" aria-label="今夕何时">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1"/>
      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1"/>
      <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1"/>
      <circle cx="50" cy="50" r="3" fill="currentColor"/>
      <path d="M50 15 L52 25 L50 35 L48 25 Z" fill="currentColor"/>
      <path d="M85 50 L75 52 L65 50 L75 48 Z" fill="currentColor"/>
      <path d="M50 85 L48 75 L50 65 L52 75 Z" fill="currentColor"/>
      <path d="M15 50 L25 48 L35 50 L25 52 Z" fill="currentColor"/>
    </svg>
  )
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg className="h-8 w-8 mr-2" viewBox="0 0 100 100" fill="currentColor" aria-label="今夕何时">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1"/>
        <circle cx="50" cy="50" r="3" fill="currentColor"/>
        <path d="M50 15 L52 25 L50 35 L48 25 Z" fill="currentColor"/>
        <path d="M85 50 L75 52 L65 50 L75 48 Z" fill="currentColor"/>
        <path d="M50 85 L48 75 L50 65 L52 75 Z" fill="currentColor"/>
        <path d="M15 50 L25 48 L35 50 L25 52 Z" fill="currentColor"/>
      </svg>
      <span className="text-lg font-bold">今夕何时</span>
    </div>
  )
} 