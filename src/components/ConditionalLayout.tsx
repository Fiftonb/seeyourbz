'use client'

import { usePathname } from 'next/navigation'
import { AppLayout } from '@/components/AppLayout'

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isBrowserRedirectPage = pathname === '/browser-redirect'

  if (isBrowserRedirectPage) {
    return <>{children}</>
  }

  return <AppLayout>{children}</AppLayout>
} 