'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthLayout } from '@/components/ui/auth-layout'
import { Button } from '@/components/ui/button'
import { Field, Label } from '@/components/ui/fieldset'
import { Heading } from '@/components/ui/heading'
import { Strong, Text, TextLink } from '@/components/ui/text'
import { Logo } from '@/components/ui/logo'
import { Alert, AlertTitle, AlertDescription, AlertActions } from '@/components/ui/alert'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 登录成功，跳转到首页
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    setAlertMessage('忘记密码功能正在开发中，敬请期待！')
    setShowAlert(true)
  }

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault()
    setAlertMessage('注册功能正在开发中，敬请期待！')
    setShowAlert(true)
  }



  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="grid w-full max-w-sm grid-cols-1 gap-8">
        <Logo className="text-zinc-950 dark:text-white forced-colors:text-[CanvasText] justify-center" />
        <Heading>登录到你的账户</Heading>
        
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            {error}
          </div>
        )}
        
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
        
        <div className="flex items-center justify-end">
          <Text>
            <TextLink href="#" onClick={handleForgotPassword} className="cursor-pointer">
              <Strong>忘记密码？</Strong>
            </TextLink>
          </Text>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          {loading ? '登录中...' : '登录'}
        </button>
        
        <Text>
          还没有账户？{' '}
          <TextLink href="#" onClick={handleRegister} className="cursor-pointer">
            <Strong>立即注册</Strong>
          </TextLink>
        </Text>
      </form>

      <Alert open={showAlert} onClose={() => setShowAlert(false)} size="sm">
        <AlertTitle>提示</AlertTitle>
        <AlertDescription>{alertMessage}</AlertDescription>
        <AlertActions>
          <Button color="zinc" onClick={() => setShowAlert(false)}>
            知道了
          </Button>
        </AlertActions>
      </Alert>
    </AuthLayout>
  )
} 