import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// 处理文本中的换行符
function processText(text: string | null): string | null {
  if (!text) return null;
  
  // 处理各种可能的换行符格式
  return text
    .replace(/\\r\\r/g, '<br/>')
    .replace(/\\r/g, '<br/>')
    .replace(/\r\r/g, '<br/>')
    .replace(/\r/g, '<br/>')
    .replace(/\n\n/g, '<br/>')
    .replace(/\n/g, '<br/>');
}

// 处理对象中所有字符串字段的换行符
function processObject(obj: any): any {
  if (!obj) return obj;
  
  const result = { ...obj };
  Object.keys(result).forEach(key => {
    if (typeof result[key] === 'string') {
      result[key] = processText(result[key]);
    }
  });
  
  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const keyword = searchParams.get('keyword');

  try {
    // 查询五行论命数据
    if (type === 'wuxing') {
      if (id) {
        const data = await prisma.wuXingLunMing.findFirst({
          where: { wh: id }
        });
        return NextResponse.json({ success: true, data: processObject(data) });
      } else {
        const data = await prisma.wuXingLunMing.findMany();
        return NextResponse.json({ success: true, data: data.map(processObject) });
      }
    }
    
    // 查询日干论命数据
    else if (type === 'rigan') {
      if (id) {
        const data = await prisma.riGanLunMing.findUnique({
          where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true, data: processObject(data) });
      } else if (keyword) {
        const data = await prisma.riGanLunMing.findMany({
          where: { rgz: { contains: keyword } }
        });
        return NextResponse.json({ success: true, data: data.map(processObject) });
      } else {
        const data = await prisma.riGanLunMing.findMany();
        return NextResponse.json({ success: true, data: data.map(processObject) });
      }
    }
    
    // 查询月日时命理数据
    else if (type === 'yueshi') {
      if (id) {
        const data = await prisma.riYueShiMingLi.findUnique({
          where: { id: parseInt(id) }
        });
        return NextResponse.json({ success: true, data: processObject(data) });
      } else if (keyword) {
        const data = await prisma.riYueShiMingLi.findMany({
          where: { siceng: { contains: keyword } }
        });
        return NextResponse.json({ success: true, data: data.map(processObject) });
      } else {
        const data = await prisma.riYueShiMingLi.findMany();
        return NextResponse.json({ success: true, data: data.map(processObject) });
      }
    }
    
    // 如果没有指定类型，返回所有类型的数据数量
    else {
      const wuxingCount = await prisma.wuXingLunMing.count();
      const riganCount = await prisma.riGanLunMing.count();
      const yueshiCount = await prisma.riYueShiMingLi.count();
      
      return NextResponse.json({
        success: true,
        counts: {
          wuxing: wuxingCount,
          rigan: riganCount,
          yueshi: yueshiCount
        }
      });
    }
  } catch (error) {
    console.error('API错误:', error);
    return NextResponse.json(
      { success: false, error: '查询数据失败' },
      { status: 500 }
    );
  }
} 