'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/ui/auth-layout'
import { Button } from '@/components/ui/button'
import { Field, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Input } from '@/components/ui/input'
import { Strong, Text, TextLink } from '@/components/ui/text'
import { Logo } from '@/components/ui/logo'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '注册失败')
      }

      // 注册成功，跳转到登录页
      router.push('/login')
      alert('注册成功！请登录')
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Logo className="text-zinc-950 dark:text-white forced-colors:text-[CanvasText] justify-center" />
        <Heading>创建你的账户</Heading>
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}
        
        <Field>
          <Label>用户名</Label>
          <input 
            type="text" 
            name="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-base"
          />
        </Field>
        
        <Field>
          <Label>邮箱</Label>
          <input 
            type="email" 
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-base"
          />
        </Field>
        
        <Field>
          <Label>密码</Label>
          <input 
            type="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-base"
          />
        </Field>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {loading ? '注册中...' : '注册'}
        </button>
        
        <Text>
          已有账户？{' '}
          <TextLink href={"/login" as any} className="cursor-pointer">
            <Strong>立即登录</Strong>
          </TextLink>
        </Text>
      </form>
    </AuthLayout>
  )
} 