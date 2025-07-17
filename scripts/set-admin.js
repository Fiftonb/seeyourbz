const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function setAdmin(email, isAdmin = true) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin },
      select: {
        id: true,
        email: true,
        name: true,
        isAdmin: true
      }
    })
    
    console.log(`用户 ${user.email} 已${isAdmin ? '设置为' : '取消'}管理员权限`)
    console.log('用户信息:', user)
  } catch (error) {
    if (error.code === 'P2025') {
      console.error(`用户 ${email} 不存在`)
    } else {
      console.error('设置管理员权限失败:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

// 从命令行参数获取邮箱
const email = process.argv[2]
const action = process.argv[3] // 'true' 或 'false'

if (!email) {
  console.log('使用方法: node set-admin.js <用户邮箱> [true|false]')
  console.log('示例: node set-admin.js admin@example.com true')
  process.exit(1)
}

const isAdmin = action !== 'false'
setAdmin(email, isAdmin) 