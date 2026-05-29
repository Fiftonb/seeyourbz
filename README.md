# 今夕何时 - 传统文化智能工具站

一个集传统黄历、八字命理、桃花运测算、星座运势、AI 人生 K 线图于一体的现代化传统文化学习平台，基于 [tyme4ts](https://github.com/6tail/tyme4ts) 日历工具库开发。

## 项目特色

✨ **多元化功能**：黄历查询、八字命理、桃花运测算、星座运势、AI 人生 K 线图  
🎨 **现代化设计**：基于 Catalyst UI Kit 的精美界面，支持暗色模式  
📱 **响应式体验**：完美适配桌面端和移动端  
🔐 **完整用户系统**：注册登录、个人资料、管理员后台  
📊 **数据分析**：用户行为追踪和管理员统计面板  
🌙 **传统文化**：深度结合中国传统历法和命理学  
🤖 **AI 驱动**：接入兼容 OpenAI 格式的大模型，生成个性化命理分析

## 技术栈

- **框架**: Next.js 14 (App Router)
- **数据库**: SQLite3 + Prisma ORM  
- **认证**: JWT (使用 jose 库)
- **UI 框架**: Tailwind CSS + Catalyst UI Kit
- **日历库**: tyme4ts (中国传统历法核心库)
- **图标**: Heroicons + Lucide React
- **类型检查**: TypeScript
- **运行环境**: Node.js >= 18

## 核心功能

### 🗓️ 传统黄历
- **完整黄历信息**：宜忌事项、吉神凶煞、节气信息
- **智能日期选择**：日历选择器 + 快速跳转
- **时辰宜忌**：十二时辰详细吉凶分析
- **多维度信息**：九星、二十八宿、胎神方位等

### 🌸 桃花运测算
- **八字桃花分析**：基于传统命理学的桃花运计算
- **详细运势报告**：桃花类型、强度、位置分析
- **每周运势**：桃花运指数和建议
- **个性化建议**：根据八字特点提供专业指导

### 🎯 八字命理计算  
- **完整八字分析**：年月日时四柱详解
- **大运流年**：人生运势周期分析
- **五行分析**：强弱喜忌全面解读
- **专业排盘**：传统命理排盘功能

### ⭐ 星座运势
- **每日运势**：综合、事业、财运、爱情、健康
- **详细分析**：专业的星座运势解读
- **幸运元素**：幸运颜色、数字、方位
- **个性化建议**：基于星座特点的生活指导

### 📈 AI 人生 K 线图
- **百岁流年**：将 1-100 岁运势绘制成股票 K 线风格图表
- **大运周期**：每十年大运清晰标注
- **流年详批**：点击任意年份查看 AI 生成的详细分析
- **多维分析**：事业、财运、婚姻、健康、六亲全覆盖
- **灵活配置**：支持使用内置 API（需口令）或自带 OpenAI 兼容 API Key

### 👤 用户系统
- **账户管理**：注册、登录、个人资料
- **安全设置**：密码修改、邮箱变更
- **数据记录**：自动保存用户的测算记录
- **管理员后台**：用户数据统计和管理

## 快速开始

### 1. 环境准备

确保你的系统已安装：
- Node.js >= 18.0.0
- npm 或 yarn

### 2. 项目安装

```bash
# 克隆项目
git clone <your-repo-url>
cd seeyourbz

# 安装依赖
npm install
```

### 3. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env.local
```

编辑 `.env.local`，填入以下必要配置：

```env
# 数据库（默认 SQLite，无需修改）
DATABASE_URL="file:./dev.db"

# JWT 认证密钥（使用 openssl rand -base64 32 生成）
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"

# 站点 URL（生产环境修改为实际域名）
NEXT_PUBLIC_SITE_URL="http://localhost:12333"
NEXTAUTH_URL="http://localhost:12333"
```

> 如需启用 **AI 人生 K 线图**的内置 API 模式，还需配置：
> ```env
> BUILTIN_API_BASE_URL="https://api.openai.com/v1"
> BUILTIN_MODEL_NAME="gpt-4o-mini"
> BUILTIN_API_KEY="sk-your-api-key"
> BUILTIN_ACCESS_PASSWORD="your-access-password"
> ```
> 不配置时，用户仍可选择「自定义 API」模式，自带 Key 使用。

### 4. 数据库初始化

```bash
# 生成 Prisma 客户端
npm run db:generate

# 推送数据库模式
npm run db:push

# 运行数据种子
npm run db:seed
```

### 5. 启动项目

```bash
# 开发模式
npm run dev

# 访问应用
# http://localhost:12333
```

## 项目结构

```
seeyourbz/
├── prisma/                    # 数据库相关
│   ├── schema.prisma         # 数据库模式定义
│   ├── seed.ts              # 数据种子文件  
│   └── migrations/          # 数据库迁移文件
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   │   ├── auth/       # 认证相关 API
│   │   │   ├── user/       # 用户管理 API
│   │   │   ├── admin/      # 管理员 API
│   │   │   └── submissions/ # 提交记录 API
│   │   ├── (pages)/        # 功能页面
│   │   │   ├── almanac/    # 黄历页面
│   │   │   ├── peach-blossom/ # 桃花运页面
│   │   │   ├── destiny/    # 八字命理页面
│   │   │   ├── constellation/ # 星座运势页面
│   │   │   ├── calendar/   # 日历页面
│   │   │   ├── statistics/ # 统计页面
│   │   │   ├── profile/    # 个人资料页面
│   │   │   └── settings/   # 设置页面
│   │   ├── globals.css     # 全局样式
│   │   ├── layout.tsx      # 根布局
│   │   └── page.tsx        # 首页
│   ├── components/         # React 组件
│   │   ├── ui/            # Catalyst UI Kit 组件
│   │   ├── almanac/       # 黄历相关组件
│   │   ├── peach-blossom/ # 桃花运相关组件
│   │   ├── AppLayout.tsx  # 应用布局组件
│   │   └── CalendarDemo.tsx # 日历演示组件
│   └── lib/               # 工具库
│       ├── auth.ts        # JWT 认证
│       ├── db.ts          # 数据库连接
│       ├── tyme.ts        # tyme4ts 工具函数
│       ├── peach-blossom-fortune.ts # 桃花运算法
│       └── constellation-fortune.ts # 星座运势算法
├── middleware.ts          # Next.js 中间件
├── next.config.js        # Next.js 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── package.json          # 项目配置
```

## 可用命令

```bash
# 开发相关
npm run dev          # 启动开发服务器 (端口: 12333)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器 (端口: 12333)
npm run lint         # 运行 ESLint 检查

# 数据库相关
npm run db:push      # 推送数据库模式到 SQLite
npm run db:studio    # 打开 Prisma Studio 数据管理界面
npm run db:generate  # 生成 Prisma 客户端代码
npm run db:seed      # 运行数据种子脚本

# 数据库备份相关 (跨平台兼容)
npm run db:backup         # 备份数据库文件 (文件复制方式)
npm run db:backup:dump    # 备份数据库为 SQL 脚本
npm run db:restore        # 显示恢复数据库的帮助信息
npm run db:reset          # 重置数据库 (删除并重新创建)
npm run db:backup:clean   # 清理30天前的备份文件

# 系统专用备份脚本 (增强功能)
npm run db:backup:linux   # Linux 优化版备份脚本
npm run db:backup:macos   # macOS 优化版备份脚本

# SEO 相关（需在 .env.local 中配置 BAIDU_SITE 和 BAIDU_TOKEN）
npm run seo:push-baidu             # 手动推送 URL 到百度
npm run seo:push-baidu:sitemap -- <sitemap-url>  # 通过 sitemap 批量推送
```

## 数据库模型

### 用户表 (User)
- 基本信息：邮箱、密码、姓名
- 权限管理：普通用户/管理员
- 时间戳：创建时间、更新时间

### 日历事件表 (CalendarEvent)  
- 事件信息：标题、描述、日期
- 日期格式：公历、农历双重存储
- 用户关联：每个用户的个人事件

### 用户提交记录表 (UserSubmission)
- 提交类型：桃花运、八字命理等
- 详细数据：输入参数、计算结果
- 追踪信息：IP地址、用户代理
- 关联用户：已登录用户的提交记录

## 功能详解

### 黄历功能
- **日期转换**：公历农历精确转换
- **宜忌查询**：传统宜忌事项查询
- **神煞信息**：吉神凶煞方位查询
- **时辰分析**：十二时辰宜忌详情

### 桃花运测算
- **八字分析**：基于出生时间的精确八字计算
- **桃花定位**：墙内桃花、墙外桃花识别
- **运势评估**：桃花强度五星评级
- **专业建议**：个性化桃花运提升方案

### 八字命理
- **四柱八字**：年月日时完整排盘
- **大运推算**：十年大运周期分析
- **流年运势**：每年运势变化趋势
- **五行分析**：命局强弱和用神喜忌

### 星座运势
- **多维运势**：综合、事业、财运、爱情、健康
- **每日更新**：基于天象变化的运势计算
- **幸运指数**：星级评分系统
- **实用建议**：生活工作的具体指导

## 管理员功能

管理员用户可以：
- 查看所有用户提交记录
- 按类型和时间筛选数据
- 导出统计报表
- 管理用户账户

默认管理员账户可通过运行以下脚本创建：
```bash
node scripts/set-admin.js <user-email>
```

## 开发指南

### UI 组件使用

```tsx
// 推荐的组件导入方式
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'  
import { Heading } from '@/components/ui/heading'
import { Badge } from '@/components/ui/badge'

// 使用示例
function MyComponent() {
  return (
    <div>
      <Heading level={1}>页面标题</Heading>
      <Badge color="blue">状态标签</Badge>
      <Button color="red">操作按钮</Button>
    </div>
  )
}
```

### 传统文化数据

项目集成了丰富的传统文化数据：
- **tyme4ts**：提供精确的中国传统历法算法
- **黄历数据**：包含完整的宜忌、神煞、节气信息
- **命理算法**：实现了传统八字命理的核心算法
- **星座系统**：结合西方占星学的运势计算

### API 设计

所有 API 遵循 RESTful 设计原则：
- 认证：`/api/auth/*`
- 用户：`/api/user/*`  
- 管理：`/api/admin/*`
- 数据：`/api/submissions/*`

## 关于 tyme4ts

tyme4ts 是本项目的核心依赖，提供了：

- **精确历法**：公历、农历、藏历互转
- **传统文化**：干支、生肖、星座、节气
- **命理基础**：八字、紫微斗数基础算法
- **现代适配**：TypeScript 支持，现代化 API

更多信息：https://6tail.cn/tyme.html

## 部署说明

### 生产环境
1. 设置环境变量
2. 构建项目：`npm run build`
3. 启动服务：`npm run start`

### 数据库备份与恢复

#### 备份数据库
```bash
# 方式1：直接复制数据库文件 (推荐)
npm run db:backup

# 方式2：导出为 SQL 脚本
npm run db:backup:dump
```

#### 恢复数据库
```bash
# 从备份文件恢复
cp prisma/backups/dev-20241201-143022.db prisma/dev.db

# 从 SQL 脚本恢复
sqlite3 prisma/dev.db < prisma/backups/dump-20241201-143022.sql
```

#### 数据库维护
```bash
# 重置数据库（危险操作！）
npm run db:reset

# 清理旧备份文件
npm run db:backup:clean
```

### 跨平台兼容性

项目完全支持多操作系统：

#### ✅ Linux (Ubuntu, CentOS, Debian 等)
```bash
# 基础备份命令 (推荐)
npm run db:backup
npm run db:backup:dump

# Linux 优化版本 (增强功能)
npm run db:backup:linux file
npm run db:backup:linux dump

# 安装依赖 (如需要)
sudo apt-get install sqlite3  # Ubuntu/Debian
sudo yum install sqlite       # CentOS/RHEL  
```

#### ✅ macOS
```bash
# 基础备份命令
npm run db:backup
npm run db:backup:dump

# macOS 优化版本
npm run db:backup:macos file
npm run db:backup:macos dump
```

#### ✅ Windows
```bash
# 基础命令在 Git Bash/WSL 中运行
npm run db:backup
npm run db:backup:dump

# 或使用 PowerShell 手动备份
copy prisma\dev.db prisma\backups\dev-backup.db
```

### 数据库
- 开发：SQLite（本地文件）
- 生产：可配置为 PostgreSQL 或 MySQL
- 备份：自动时间戳命名，存储在 `prisma/backups/` 目录
- 兼容性：✅ Linux ✅ macOS ✅ Windows

### ⚠️ 数据安全提醒

**重要**：定期备份数据库是保护用户数据的重要措施。建议：

1. **定期备份**：建议每日或每周定期备份数据库
2. **多重备份**：同时使用文件备份和 SQL 导出两种方式
3. **异地存储**：将备份文件存储到云端或其他安全位置
4. **恢复测试**：定期测试备份文件是否可以正常恢复

```bash
# 推荐的备份策略
# 1. 每日文件备份
npm run db:backup

# 2. 每周 SQL 导出备份  
npm run db:backup:dump

# 3. 定期清理旧备份
npm run db:backup:clean
```

📖 **详细指南**: 
- [`prisma/BACKUP.md`](prisma/BACKUP.md) - 完整的备份和恢复流程
- [`PLATFORM-COMPATIBILITY.md`](PLATFORM-COMPATIBILITY.md) - 跨平台兼容性详细说明

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feat/your-feature`
5. 提交 Pull Request

## 许可证

[MIT License](LICENSE)

---

**今夕何时** - 传承文化，智慧生活