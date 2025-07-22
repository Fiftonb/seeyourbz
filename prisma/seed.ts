import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// 处理SQL数据中的换行符
function processText(text: string): string {
  if (!text) return text;
  
  // 处理SQL数据中的各种换行符格式
  return text
    .replace(/\\r<BR>/g, '\n')
    .replace(/\\r\\r/g, '\n')
    .replace(/\\r/g, '\n')
    .replace(/\\n\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/<br\/>/gi, '\n')
    .replace(/<br>/gi, '\n');
}

async function main() {
  console.log('开始导入数据...');
  
  // 创建测试用户
  await createTestUser();
  
  // 导入五行论命数据
  await importWuXingLunMing();
  
  // 导入日干论命数据
  await importRiGanLunMing();
  
  // 导入月日时命理数据
  await importRiYueShiMingLi();
  
  console.log('数据导入完成！');
}

async function createTestUser() {
  console.log('创建测试用户...');
  
  // 创建测试用户
  const hashedPassword = await bcrypt.hash('123456', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: hashedPassword,
      name: '测试用户',
    },
  });

  console.log('创建用户:', user);

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
  ];

  for (const event of sampleEvents) {
    await prisma.calendarEvent.create({
      data: event,
    }).catch(() => {
      // 如果已存在，忽略错误
      console.log(`日历事件 "${event.title}" 可能已存在，跳过创建`);
    });
  }

  console.log('测试数据创建完成');
}

async function importWuXingLunMing() {
  console.log('导入五行论命数据...');
  
  // 检查是否已有数据，如果有则跳过导入
  const existingCount = await prisma.wuXingLunMing.count();
  if (existingCount > 0) {
    console.log(`五行论命数据已存在 ${existingCount} 条记录，跳过导入`);
    return;
  }
  
  // 读取SQL文件内容
  const sqlFilePath = path.join(__dirname, '../src/lib/jianpi/五行论命.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  // 解析INSERT语句
  const insertRegex = /INSERT INTO `wh` VALUES \('([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)'\);/g;
  
  let match;
  let count = 0;
  
  // 逐条插入数据
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    try {
      await prisma.wuXingLunMing.create({
        data: {
          wh: match[1],
          tnwh: match[2],
          ynwh: match[3],
          skzhyj: processText(match[4]),
          whzx: processText(match[5]),
          szwh: processText(match[6]),
          hyhw: processText(match[7]),
          whw: processText(match[8]),
          whq: processText(match[9])
        }
      });
      count++;
    } catch (error) {
      console.error(`导入五行论命数据失败: ${error}`);
    }
  }
  
  console.log(`成功导入 ${count} 条五行论命数据`);
}

async function importRiGanLunMing() {
  console.log('导入日干论命数据...');
  
  // 检查是否已有数据，如果有则跳过导入
  const existingCount = await prisma.riGanLunMing.count();
  if (existingCount > 0) {
    console.log(`日干论命数据已存在 ${existingCount} 条记录，跳过导入`);
    return;
  }
  
  // 读取SQL文件内容
  const sqlFilePath = path.join(__dirname, '../src/lib/jianpi/日干论命.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  // 解析INSERT语句
  const insertRegex = /INSERT INTO `rgnm` VALUES \((\d+), '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)', '([^']*)'\);/g;
  
  let match;
  let count = 0;
  
  // 逐条插入数据
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    try {
      await prisma.riGanLunMing.create({
        data: {
          id: parseInt(match[1]),
          rgz: match[2],
          rgxx: processText(match[3]),
          rgcz: processText(match[4]),
          rgzfx: processText(match[5]),
          xgfx: processText(match[6]),
          aqfx: processText(match[7]),
          syfx: processText(match[8]),
          cyfx: processText(match[9]),
          jkfx: processText(match[10])
        }
      });
      count++;
    } catch (error) {
      console.error(`导入日干论命数据失败: ${error}`);
    }
  }
  
  console.log(`成功导入 ${count} 条日干论命数据`);
}

async function importRiYueShiMingLi() {
  console.log('导入月日时命理数据...');
  
  // 检查是否已有数据，如果有则跳过导入
  const existingCount = await prisma.riYueShiMingLi.count();
  if (existingCount > 0) {
    console.log(`月日时命理数据已存在 ${existingCount} 条记录，跳过导入`);
    return;
  }
  
  // 读取SQL文件内容
  const sqlFilePath = path.join(__dirname, '../src/lib/jianpi/月日时命理.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  // 解析INSERT语句
  const insertRegex = /INSERT INTO `rysmn` VALUES \((\d+), '([^']*)', '([^']*)'\);/g;
  
  let match;
  let count = 0;
  
  // 逐条插入数据
  while ((match = insertRegex.exec(sqlContent)) !== null) {
    try {
      await prisma.riYueShiMingLi.create({
        data: {
          id: parseInt(match[1]),
          siceng: match[2],
          mingmi: processText(match[3])
        }
      });
      count++;
    } catch (error) {
      console.error(`导入月日时命理数据失败: ${error}`);
    }
  }
  
  console.log(`成功导入 ${count} 条月日时命理数据`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 