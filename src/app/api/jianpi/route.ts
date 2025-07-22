import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getLunarDetailInfo } from '@/lib/tyme';

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

// 新增POST接口，根据八字数据获取简批结果
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eightChar, birthDate, birthTime } = body;

    if (!eightChar || !eightChar.day || !eightChar.hour) {
      return NextResponse.json(
        { success: false, error: '缺少必要的八字信息' },
        { status: 400 }
      );
    }

    // 提取日干和时辰信息
    const dayStem = eightChar.day.charAt(0); // 日干天干
    const hourBranch = eightChar.hour.charAt(1); // 时辰地支

    // 查询日干论命数据
    const riganData = await prisma.riGanLunMing.findFirst({
      where: { rgz: { contains: dayStem } }
    });

    // 构建月日时查询条件
    let monthQuery = '';
    let dayQuery = '';
    let hourQuery = '';

    // 如果有出生日期信息，使用农历日期进行转换
    if (birthDate) {
      const date = new Date(birthDate);
      
      // 获取农历信息
      const lunarInfo = getLunarDetailInfo(date);
      
      // 转换月份为中文（使用农历月份）
      const monthNames = ['', '正月', '二月', '三月', '四月', '五月', '六月', 
                         '七月', '八月', '九月', '十月', '十一月', '十二月'];
      monthQuery = monthNames[lunarInfo.month] || '';

      // 转换日期为中文格式（使用农历日期）
      const lunarDay = lunarInfo.day;
      if (lunarDay === 1) dayQuery = '初一日';
      else if (lunarDay === 2) dayQuery = '初二日';
      else if (lunarDay === 3) dayQuery = '初三日';
      else if (lunarDay === 4) dayQuery = '初四日';
      else if (lunarDay === 5) dayQuery = '初五日';
      else if (lunarDay === 6) dayQuery = '初六日';
      else if (lunarDay === 7) dayQuery = '初七日';
      else if (lunarDay === 8) dayQuery = '初八日';
      else if (lunarDay === 9) dayQuery = '初九日';
      else if (lunarDay === 10) dayQuery = '初十日';
      else if (lunarDay === 11) dayQuery = '十一日';
      else if (lunarDay === 12) dayQuery = '十二日';
      else if (lunarDay === 13) dayQuery = '十三日';
      else if (lunarDay === 14) dayQuery = '十四日';
      else if (lunarDay === 15) dayQuery = '十五日';
      else if (lunarDay === 16) dayQuery = '十六日';
      else if (lunarDay === 17) dayQuery = '十七日';
      else if (lunarDay === 18) dayQuery = '十八日';
      else if (lunarDay === 19) dayQuery = '十九日';
      else if (lunarDay === 20) dayQuery = '二十日';
      else if (lunarDay === 21) dayQuery = '廿一日';
      else if (lunarDay === 22) dayQuery = '廿二日';
      else if (lunarDay === 23) dayQuery = '廿三日';
      else if (lunarDay === 24) dayQuery = '廿四日';
      else if (lunarDay === 25) dayQuery = '廿五日';
      else if (lunarDay === 26) dayQuery = '廿六日';
      else if (lunarDay === 27) dayQuery = '廿七日';
      else if (lunarDay === 28) dayQuery = '廿八日';
      else if (lunarDay === 29) dayQuery = '廿九日';
      else if (lunarDay === 30) dayQuery = '三十日';
    }

    // 转换时辰地支为中文时辰
    const timeMapping: { [key: string]: string } = {
      '子': '子时',
      '丑': '丑时',
      '寅': '寅时',
      '卯': '卯时',
      '辰': '辰时',
      '巳': '巳时',
      '午': '午时',
      '未': '未时',
      '申': '申时',
      '酉': '酉时',
      '戌': '戌时',
      '亥': '亥时'
    };
    hourQuery = timeMapping[hourBranch] || '';

    // 查询月日时命理数据
    const yueshiQueries = [];
    if (monthQuery) {
      yueshiQueries.push(
        prisma.riYueShiMingLi.findFirst({
          where: { siceng: { contains: monthQuery } }
        })
      );
    }
    if (dayQuery) {
      yueshiQueries.push(
        prisma.riYueShiMingLi.findFirst({
          where: { siceng: { contains: dayQuery } }
        })
      );
    }
    if (hourQuery) {
      yueshiQueries.push(
        prisma.riYueShiMingLi.findFirst({
          where: { siceng: { contains: hourQuery } }
        })
      );
    }

    // 执行所有查询
    const yueshiResults = await Promise.all(yueshiQueries);
    const yueshiData = yueshiResults.filter(result => result !== null);

    return NextResponse.json({
      success: true,
      data: {
        rigan: processObject(riganData),
        yueshi: yueshiData.map(processObject),
        searchInfo: {
          dayStem,
          hourBranch,
          monthQuery,
          dayQuery,
          hourQuery
        }
      }
    });
  } catch (error) {
    console.error('简批命理API错误:', error);
    return NextResponse.json(
      { success: false, error: '获取简批结果失败' },
      { status: 500 }
    );
  }
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