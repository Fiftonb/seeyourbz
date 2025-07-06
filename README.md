# SeeYourBz - 基于 tyme4ts 的日历应用

这是一个基于 [tyme4ts](https://github.com/6tail/tyme4ts) 日历工具库开发的现代化日历应用。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: SQLite3 + Prisma ORM
- **认证**: JWT (使用 jose 库)
- **UI**: Tailwind CSS + Catalyst UI Kit
- **日历库**: tyme4ts
- **图标**: Heroicons
- **运行环境**: Node.js >= 18

## 功能特性

- 🗓️ 公历、农历日期转换
- 🐉 生肖、干支、星座计算
- 🌙 节气信息展示
- 🎋 藏历支持
- 👤 用户认证系统
- 📅 个人日历事件管理
- 🎨 现代化UI设计（基于 Catalyst UI Kit）

## UI 组件系统

本项目使用 [Catalyst UI Kit](https://catalyst.tailwindui.com/) 作为UI组件库，它是由 Tailwind CSS 团队开发的生产就绪的 React 组件集合。

### 可用组件

项目中包含了完整的 Catalyst UI Kit 组件，位于 `src/components/ui/` 目录下：

- **布局组件**: `sidebar-layout.tsx`, `stacked-layout.tsx`, `auth-layout.tsx`
- **导航组件**: `navbar.tsx`, `sidebar.tsx`
- **表单组件**: `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio.tsx`, `switch.tsx`
- **交互组件**: `button.tsx`, `dropdown.tsx`, `dialog.tsx`, `listbox.tsx`, `combobox.tsx`
- **数据展示**: `table.tsx`, `description-list.tsx`, `avatar.tsx`, `badge.tsx`, `alert.tsx`
- **其他**: `link.tsx`, `heading.tsx`, `text.tsx`, `divider.tsx`, `pagination.tsx`

### 使用示例

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from '@heroicons/react/16/solid'

function MyComponent() {
  return (
    <div className="space-y-4">
      <Input type="text" placeholder="输入内容..." />
      <Button>
        <PlusIcon />
        添加项目
      </Button>
    </div>
  )
}
```

### 图标使用

项目使用 Heroicons 图标库，支持两种尺寸：

- **16x16 图标**: 用于按钮、下拉菜单等小型组件
- **20x20 图标**: 用于导航栏、侧边栏等大型组件

```tsx
import { HomeIcon } from '@heroicons/react/20/solid'  // 20x20 图标
import { PlusIcon } from '@heroicons/react/16/solid'  // 16x16 图标
```

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd seeyourbz
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

复制 `.env.example` 文件为 `.env.local`：

```bash
cp .env.example .env.local
```

然后修改 `.env.local` 文件中的环境变量。

### 4. 数据库设置

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 运行数据种子
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
seeyourbz/
├── prisma/
│   ├── schema.prisma      # 数据库模式
│   └── seed.ts           # 数据种子文件
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API 路由
│   │   ├── globals.css   # 全局样式
│   │   ├── layout.tsx    # 根布局
│   │   └── page.tsx      # 首页
│   ├── components/       # React 组件
│   │   ├── ui/           # Catalyst UI Kit 组件
│   │   └── ...           # 其他业务组件
│   ├── lib/              # 工具函数
│   │   ├── auth.ts       # JWT 认证
│   │   ├── db.ts         # 数据库连接
│   │   └── tyme.ts       # tyme4ts 工具函数
│   └── types/            # TypeScript 类型定义
├── middleware.ts         # Next.js 中间件
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── package.json          # 项目配置
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run db:push` - 推送数据库模式
- `npm run db:studio` - 打开 Prisma Studio
- `npm run db:generate` - 生成 Prisma 客户端
- `npm run db:seed` - 运行数据种子

## 测试账号

- 邮箱: test@example.com
- 密码: 123456

## 开发指南

### 使用 Catalyst UI Kit 组件

1. **导入组件**：所有UI组件都位于 `@/components/ui/` 路径下
2. **遵循设计系统**：Catalyst 使用一致的设计语言和组件API
3. **图标集成**：使用 Heroicons 图标，注意选择合适的尺寸
4. **类型安全**：所有组件都有完整的 TypeScript 类型定义

### 组件开发最佳实践

```tsx
// 推荐的组件导入方式
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { PlusIcon } from '@heroicons/react/16/solid'

// 使用组件
function CreateEventDialog() {
  return (
    <Dialog open={isOpen} onClose={setIsOpen}>
      <DialogTitle>创建新事件</DialogTitle>
      <DialogDescription>
        填写事件详情来创建新的日历事件。
      </DialogDescription>
      <DialogBody>
        <Input placeholder="事件标题" />
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => setIsOpen(false)}>
          取消
        </Button>
        <Button type="submit">
          <PlusIcon />
          创建事件
        </Button>
      </DialogActions>
    </Dialog>
  )
}
```

### 样式自定义

Catalyst UI Kit 基于 Tailwind CSS，支持：

- 通过 `className` 属性扩展样式
- 使用 Tailwind 的修饰符（`hover:`, `focus:`, `dark:` 等）
- 保持设计系统的一致性

## 关于 tyme4ts

tyme4ts 是一个非常强大的日历工具库，支持：

- 公历、农历、藏历转换
- 星座、干支、生肖计算
- 节气计算
- 中国传统历法支持

更多信息请查看：https://6tail.cn/tyme.html

## 许可证

MIT License 