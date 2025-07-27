import type { Metadata } from 'next'
import './globals.css'
import './fonts.css'
import { ConditionalLayout } from '@/components/ConditionalLayout'
import { ThemeProvider } from '@/lib/theme'
import { interFont } from '@/lib/fonts'

export const metadata: Metadata = {
  title: '今夕何时 - 传统文化',
  description: '学习传统文化以分析日历信息',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // 检测是否在微信或QQ浏览器中
                var ua = navigator.userAgent.toLowerCase();
                var isWechat = ua.indexOf('micromessenger') !== -1;
                var isQQ = ua.indexOf('qq/') !== -1 || ua.indexOf('mqqbrowser') !== -1;
                
                // 检测当前路径是否已经是重定向页面
                var isRedirectPage = window.location.pathname === '/browser-redirect';
                
                // 如果是微信或QQ浏览器且不在重定向页面，则跳转
                if ((isWechat || isQQ) && !isRedirectPage) {
                  window.location.href = '/browser-redirect';
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${interFont.className} font-sans antialiased`}>
        <ThemeProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
        </ThemeProvider>
      </body>
    </html>
  )
} 