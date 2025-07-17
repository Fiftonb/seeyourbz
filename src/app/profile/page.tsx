'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Field, Label } from '@/components/ui/fieldset'
import { UserIcon, EnvelopeIcon, CalendarDaysIcon, LockClosedIcon } from '@heroicons/react/16/solid'

interface UserProfile {
  id: string
  email: string
  name: string
  createdAt: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // 密码修改相关状态
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  
  // 邮箱修改相关状态
  const [changingEmail, setChangingEmail] = useState(false)
  const [emailSaving, setEmailSaving] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login')
          return
        }
        throw new Error('获取用户信息失败')
      }

      const data = await response.json()
      setUser(data.user)
      setName(data.user.name || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取用户信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '更新失败')
      }

      const data = await response.json()
      setUser(data.user)
      setEditing(false)
      setSuccess('个人资料更新成功')
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新失败')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    setPasswordSaving(true)
    setPasswordError('')
    setPasswordSuccess('')
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          currentPassword, 
          newPassword, 
          confirmPassword 
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '修改密码失败')
      }

      // 清空表单并显示成功消息
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setChangingPassword(false)
      setPasswordSuccess('密码修改成功')
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : '修改密码失败')
    } finally {
      setPasswordSaving(false)
    }
  }

  const handleEmailChange = async () => {
    setEmailSaving(true)
    setEmailError('')
    setEmailSuccess('')
    
    try {
      const response = await fetch('/api/user/change-email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          newEmail, 
          currentPassword: emailPassword 
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || '修改邮箱失败')
      }

      const data = await response.json()
      
      // 更新用户信息
      setUser(data.user)
      
      // 清空表单并显示成功消息
      setNewEmail('')
      setEmailPassword('')
      setChangingEmail(false)
      setEmailSuccess('邮箱修改成功')
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : '修改邮箱失败')
    } finally {
      setEmailSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text>加载中...</Text>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Text className="text-red-600">{error || '用户信息加载失败'}</Text>
          <button 
            onClick={() => router.push('/login')} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            重新登录
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <Heading className="text-2xl font-bold text-gray-900 dark:text-white">
          个人资料
        </Heading>
        <Text className="mt-2 text-gray-600 dark:text-gray-400">
          管理你的账户信息和偏好设置
        </Text>
      </div>

      {/* 错误和成功消息 */}
      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          {success}
        </div>
      )}

      {/* 密码修改成功消息 */}
      {passwordSuccess && (
        <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          {passwordSuccess}
        </div>
      )}

      {/* 邮箱修改成功消息 */}
      {emailSuccess && (
        <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
          {emailSuccess}
        </div>
      )}

      {/* 个人信息卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <Heading level={2} className="text-lg font-semibold">
                基本信息
              </Heading>
            </div>
            
            {!editing && !changingEmail && (
              <button 
                onClick={() => setEditing(true)} 
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                编辑用户名
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* 用户名 */}
            <Field>
              <Label className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>用户名</span>
              </Label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入用户名"
                  disabled={saving}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Text>{user.name || '未设置'}</Text>
                </div>
              )}
            </Field>

            {/* 邮箱 */}
            <Field>
              <Label className="flex items-center space-x-2">
                <EnvelopeIcon className="w-4 h-4" />
                <span>邮箱</span>
              </Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Text>{user.email}</Text>
                </div>
                {!changingEmail && !editing && (
                  <button 
                    onClick={() => setChangingEmail(true)} 
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-2 rounded transition-colors duration-200"
                  >
                    修改
                  </button>
                )}
              </div>
              <Text className="text-xs text-gray-500 mt-1">
                修改邮箱需要输入当前密码验证身份
              </Text>
            </Field>

            {/* 注册时间 */}
            <Field>
              <Label className="flex items-center space-x-2">
                <CalendarDaysIcon className="w-4 h-4" />
                <span>注册时间</span>
              </Label>
              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                <Text>{new Date(user.createdAt).toLocaleDateString('zh-CN')}</Text>
              </div>
            </Field>
          </div>

          {/* 编辑模式按钮 */}
          {editing && (
            <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setName(user.name || '')
                  setError('')
                  setSuccess('')
                }}
                disabled={saving}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                取消
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 邮箱修改卡片 */}
      {changingEmail && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                  <EnvelopeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Heading level={2} className="text-lg font-semibold">
                  修改邮箱
                </Heading>
              </div>
            </div>

            {/* 邮箱修改错误消息 */}
            {emailError && (
              <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 mb-4">
                {emailError}
              </div>
            )}

            <div className="space-y-4">
              {/* 当前邮箱显示 */}
              <Field>
                <Label className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>当前邮箱</span>
                </Label>
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Text>{user.email}</Text>
                </div>
              </Field>

              {/* 新邮箱 */}
              <Field>
                <Label className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>新邮箱</span>
                </Label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="请输入新的邮箱地址"
                  disabled={emailSaving}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </Field>

              {/* 验证密码 */}
              <Field>
                <Label className="flex items-center space-x-2">
                  <LockClosedIcon className="w-4 h-4" />
                  <span>验证密码</span>
                </Label>
                <input
                  type="password"
                  value={emailPassword}
                  onChange={(e) => setEmailPassword(e.target.value)}
                  placeholder="请输入当前密码验证身份"
                  disabled={emailSaving}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Text className="text-xs text-gray-500 mt-1">
                  为了您的账户安全，修改邮箱需要验证当前密码
                </Text>
              </Field>

              {/* 邮箱修改按钮 */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleEmailChange}
                  disabled={emailSaving || !newEmail || !emailPassword}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {emailSaving ? '修改中...' : '确认修改'}
                </button>
                <button
                  onClick={() => {
                    setChangingEmail(false)
                    setNewEmail('')
                    setEmailPassword('')
                    setEmailError('')
                    setEmailSuccess('')
                  }}
                  disabled={emailSaving}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 密码修改卡片 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                <LockClosedIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <Heading level={2} className="text-lg font-semibold">
                修改密码
              </Heading>
            </div>
            
            {!changingPassword && !editing && !changingEmail && (
              <button 
                onClick={() => setChangingPassword(true)} 
                className="text-sm bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                修改密码
              </button>
            )}
          </div>

          {/* 密码修改错误消息 */}
          {passwordError && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 mb-4">
              {passwordError}
            </div>
          )}

          {changingPassword ? (
            <div className="space-y-4">
              {/* 当前密码 */}
              <Field>
                <Label className="flex items-center space-x-2">
                  <LockClosedIcon className="w-4 h-4" />
                  <span>当前密码</span>
                </Label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="请输入当前密码"
                  disabled={passwordSaving}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </Field>

              {/* 新密码 */}
              <Field>
                <Label className="flex items-center space-x-2">
                  <LockClosedIcon className="w-4 h-4" />
                  <span>新密码</span>
                </Label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请输入新密码（至少6位）"
                  disabled={passwordSaving}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </Field>

              {/* 确认新密码 */}
              <Field>
                <Label className="flex items-center space-x-2">
                  <LockClosedIcon className="w-4 h-4" />
                  <span>确认新密码</span>
                </Label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  disabled={passwordSaving}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </Field>

              {/* 密码修改按钮 */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handlePasswordChange}
                  disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  {passwordSaving ? '修改中...' : '确认修改'}
                </button>
                <button
                  onClick={() => {
                    setChangingPassword(false)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordError('')
                    setPasswordSuccess('')
                  }}
                  disabled={passwordSaving}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Text className="text-gray-600 dark:text-gray-400">
                为了您的账户安全，建议定期更换密码
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 