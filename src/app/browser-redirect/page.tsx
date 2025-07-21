'use client'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Check, Compass, Copy, ExternalLink, MoreVertical } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function BrowserRedirectPage() {
  const [currentUrl, setCurrentUrl] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    // This ensures window.location.origin is only accessed on the client side.
    setCurrentUrl(window.location.origin)
  }, [])

  const copyToClipboard = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) // Reset after 2 seconds
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg dark:bg-slate-800">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 rounded-full bg-blue-100 p-4 dark:bg-blue-900/50">
            <Compass className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <Heading
            level={1}
            className="mb-2 text-2xl font-bold text-slate-900 dark:text-white"
          >
            请在浏览器中打开
          </Heading>
          <Text className="mb-8 text-slate-600 dark:text-slate-400">
            为了获得最佳体验，请在您的手机浏览器中继续。
          </Text>
        </div>

        <div className="mb-6">
          <label
            htmlFor="url-to-copy"
            className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            页面链接
          </label>
          <div className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
            <Text
              id="url-to-copy"
              className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300"
            >
              {currentUrl}
            </Text>
            <Button
              plain
              onClick={copyToClipboard}
              aria-label="复制链接"
              className="relative"
            >
              {copySuccess ? (
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <Copy className="h-5 w-5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Heading
            level={2}
            className="text-base font-semibold text-slate-700 dark:text-slate-300"
          >
            如何操作？
          </Heading>
          <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-center">
              <MoreVertical className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500" />
              <span>
                点击右上角的{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  更多
                </span>{' '}
                按钮（通常是三个点）。
              </span>
            </li>
            <li className="flex items-center">
              <ExternalLink className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500" />
              <span>
                在菜单中选择{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  "在浏览器中打开"
                </span>
                。
              </span>
            </li>
          </ol>
        </div>
      </div>
      <footer className="mt-8 text-center">
        <Text className="text-sm text-slate-500 dark:text-slate-400">
          Powered by 今夕何时
        </Text>
      </footer>
      {copySuccess && (
        <div
          aria-live="polite"
          className="fixed bottom-10 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-slate-800 dark:text-white"
        >
          已复制到剪贴板！
        </div>
      )}
    </div>
  )
} 