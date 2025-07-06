'use client'

import { Avatar } from '@/components/ui/avatar'
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

const navItems = [
  { label: '首页', url: '/' },
  { label: '日历', url: '/calendar' },
  { label: '统计', url: '/statistics' },
  { label: '设置', url: '/settings' },
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
        <Avatar slot="icon" initials="SB" className="bg-blue-500 text-white !size-4" />
        <DropdownLabel>SeeYourBz</DropdownLabel>
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

function UserDropdownMenu() {
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
      <DropdownItem href={"/logout" as any}>
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
  return (
    <StackedLayout
      navbar={
        <Navbar>
          <NavbarItem href={"/" as any} className="max-lg:hidden">
            <Avatar initials="SB" className="bg-blue-500 text-white !size-5" />
            <NavbarLabel>SeeYourBz</NavbarLabel>
          </NavbarItem>
          <NavbarDivider className="max-lg:hidden" />
          <NavbarSection className="max-lg:hidden">
            {navItems.map(({ label, url }) => (
              <NavbarItem key={label} href={url as any}>
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
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar initials="用户" className="bg-gray-500 text-white !size-5" square />
              </DropdownButton>
              <UserDropdownMenu />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Dropdown>
              <DropdownButton as={SidebarItem} className="lg:mb-2.5">
                <Avatar initials="SB" className="bg-blue-500 text-white !size-6" />
                <SidebarLabel>SeeYourBz</SidebarLabel>
                <ChevronDownIcon />
              </DropdownButton>
              <TeamDropdownMenu />
            </Dropdown>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              {navItems.map(({ label, url }) => (
                <SidebarItem key={label} href={url as any}>
                  {label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </StackedLayout>
  )
} 