# 六爻算卦功能迁移指南

## 1. 文件结构准备

在你的Next.js项目中创建以下目录结构：

```
├── lib/
│   ├── constants/
│   ├── types/
│   └── utils/
├── components/
└── public/
```

## 2. 文件迁移

从原项目复制以下文件到你的项目中：

1. **类型定义**：
   - `lib/types/index.ts` → 包含BaZiType、BaGuaInfoType和HexagramInfoType等类型定义

2. **常量文件**：
   - `lib/constants/bagua.ts` → 八卦信息
   - `lib/constants/yao.ts` → 爻位信息
   - `lib/constants/hexagram.ts` → 64卦详细信息

3. **工具函数**：
   - `lib/utils/hexagram.ts` → 卦象名称工具函数
   - `lib/utils/index.ts` → 样式工具函数(如果需要)

4. **组件**：
   - `components/liuyao.tsx` → 六爻算卦主组件

5. **图片资源**：
   - 将`public/coin-yang.png`、`public/coin-yin.png`和`public/right-allow.png`复制到你项目的public目录

## 3. 修改图片路径

在`components/liuyao.tsx`中，修改硬币图片路径为本地路径：

```typescript
// 修改前
const COIN_YANG = "https://smallteddygames.github.io/divination-liuyao/coin-yang.png"
const COIN_YIN = "https://smallteddygames.github.io/divination-liuyao/coin-yin.png"
const RIGHT_ALLOW = "https://smallteddygames.github.io/divination-liuyao/right-allow.png"

// 修改后
const COIN_YANG = "/coin-yang.png"
const COIN_YIN = "/coin-yin.png"
const RIGHT_ALLOW = "/right-allow.png"
```

## 4. 添加依赖

确保你的项目中安装了必要的依赖：

```bash
npm install clsx tailwind-merge
```

如果你使用shadcn/ui组件库，还需要安装：

```bash
npm install @radix-ui/react-slot class-variance-authority
```

## 5. 创建页面

在你的Next.js项目中创建一个页面来使用六爻组件，例如`app/liuyao/page.tsx`：

```tsx
import { Liuyao } from "@/components/liuyao"

export default function LiuyaoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">六爻算卦</h1>
      <Liuyao />
    </div>
  )
}
```

## 6. 调整UI组件引用

如果你的项目使用不同的UI组件库，需要调整`liuyao.tsx`中的Button、Card等组件引用，确保与你的项目风格一致。

## 7. 添加导航链接

在你的导航菜单中添加六爻算卦页面的链接，方便用户访问。

## 8. 测试功能

完成迁移后，访问六爻算卦页面，测试投掷硬币和解卦功能是否正常工作。

## 注意事项

1. 确保路径引用正确，特别是`@/components`和`@/lib`这样的路径别名配置
2. hexagram.ts文件较大(约193KB)，可能需要考虑优化加载方式
3. 如果需要自定义样式，可以在全局CSS中添加相应的样式定义
4. 如果你的项目没有使用Tailwind CSS，需要调整相应的样式类名