'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar } from '@/components/ui/avatar'
import { LogoIcon } from '@/components/ui/logo'
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@/components/ui/dropdown'
import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from '@/components/ui/navbar'
import { Sidebar, SidebarBody, SidebarHeader, SidebarItem, SidebarLabel, SidebarSection } from '@/components/ui/sidebar'
import { StackedLayout } from '@/components/ui/stacked-layout'
import { Button } from '@/components/ui/button'
import {
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PlusIcon,
  ShieldCheckIcon,
  UserIcon,
} from '@heroicons/react/16/solid'
import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
  { label: '首页', url: '/' },
  { label: '黄历', url: '/almanac' },
  { label: '星座', url: '/constellation' },
  { label: '桃花运', url: '/peach-blossom' },
  { label: '命理', url: '/destiny' },
]

function TeamDropdownMenu() {
  return (
    <DropdownMenu className="min-w-80 lg:min-w-64" anchor="bottom start">
      <DropdownItem href={"/settings" as any}>
        <Cog8ToothIcon />
        <DropdownLabel>设置</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href={"/" as any}>
        <LogoIcon className="!size-4" />
        <DropdownLabel>今夕何时</DropdownLabel>
      </DropdownItem>
      <DropdownItem href={"/demo" as any}>
        <Avatar slot="icon" initials="Demo" className="bg-purple-500 text-white !size-4" />
        <DropdownLabel>演示项目</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href={"/new-project" as any}>
        <PlusIcon />
        <DropdownLabel>新建项目&hellip;</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

function UserDropdownMenu({ user, onLogout }: { user: any, onLogout: () => void }) {
  return (
    <DropdownMenu className="min-w-64" anchor="bottom end">
      <DropdownItem href={"/profile" as any}>
        <UserIcon />
        <DropdownLabel>个人资料</DropdownLabel>
      </DropdownItem>
      <DropdownItem href={"/settings" as any}>
        <Cog8ToothIcon />
        <DropdownLabel>设置</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem href={"/privacy" as any}>
        <ShieldCheckIcon />
        <DropdownLabel>隐私政策</DropdownLabel>
      </DropdownItem>
      <DropdownItem href={"/feedback" as any}>
        <LightBulbIcon />
        <DropdownLabel>意见反馈</DropdownLabel>
      </DropdownItem>
      <DropdownDivider />
      <DropdownItem onClick={onLogout}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>退出登录</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  )
}

export function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // 检查用户登录状态
  useEffect(() => {
    checkUserAuth()
  }, [])

  const checkUserAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    } finally {
      setCheckingAuth(false)
    }
  }

  // 处理退出登录
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      
      if (response.ok) {
        setUser(null)
        router.push('/login')
      }
    } catch (error) {
      console.error('退出登录失败:', error)
    }
  }

  // 防止初始加载时的动画闪烁
  useEffect(() => {
    // 添加预加载类
    document.body.classList.add('preload')
    
    // 页面加载完成后移除预加载类，启用动画
    const timer = setTimeout(() => {
      document.body.classList.remove('preload')
      setIsLoaded(true)
    }, 100) // 短暂延迟确保样式稳定
    
    return () => {
      clearTimeout(timer)
      document.body.classList.remove('preload')
    }
  }, [])

  return (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarItem href={"/" as any} className="max-lg:hidden">
            <LogoIcon className="!size-5" />
            <NavbarLabel>今夕何时</NavbarLabel>
          </NavbarItem>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url }) => (
              <NavbarItem key={label} href={url as any} current={pathname === url}>
                {label}
              </NavbarItem>
            ))}
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href={"/search" as any} aria-label="搜索">
              <MagnifyingGlassIcon />
            </NavbarItem>
            <NavbarItem href={"/inbox" as any} aria-label="收件箱">
              <InboxIcon />
            </NavbarItem>
            {!checkingAuth && (
              user ? (
                <Dropdown>
                  <DropdownButton as={NavbarItem}>
                    <Avatar 
                      initials={user?.name ? user.name.slice(0, 1) : "用户"} 
                      className="bg-gray-500 text-white !size-5" 
                      square 
                    />
                  </DropdownButton>
                  <UserDropdownMenu user={user} onLogout={handleLogout} />
                </Dropdown>
              ) : (
                <a 
                  href="/login"
                  className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm ml-2 inline-flex items-center justify-center"
                >
                  登录
                </a>
              )
            )}
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-3 px-2 py-2.5">
              <LogoIcon className="!size-6" />
              <SidebarLabel>今夕何时</SidebarLabel>
            </div>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url as any} current={pathname === url}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {isLoaded ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.95 }}
            transition={{
              duration: 0.1,
              ease: "linear",
            }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="h-full opacity-0">
          {children}
        </div>
      )}
    </StackedLayout>
  )
} 