import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: '测试用户',
    },
  })

  console.log('创建用户:', user)

  // 创建测试日历事件
  const sampleEvents = [
    {
      title: '春节',
      description: '农历新年',
      date: new Date('2024-02-10'),
      solarDate: '2024年2月10日',
      lunarDate: '甲辰年正月初一',
      userId: user.id,
    },
    {
      title: '中秋节',
      description: '团圆佳节',
      date: new Date('2024-09-17'),
      solarDate: '2024年9月17日',
      lunarDate: '甲辰年八月十五',
      userId: user.id,
    },
  ]

  for (const event of sampleEvents) {
    await prisma.calendarEvent.upsert({
      where: { 
        title_userId: { 
          title: event.title, 
          userId: event.userId 
        } 
      },
      update: {},
      create: event,
    })
  }

  console.log('数据种子创建完成')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 