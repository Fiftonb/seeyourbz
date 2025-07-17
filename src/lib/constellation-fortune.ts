// 星座运势系统
import { getAlmanacInfo } from './tyme'

// 星座类型
export type ConstellationType = 
  | '白羊' | '金牛' | '双子' | '巨蟹' | '狮子' | '处女' 
  | '天秤' | '天蝎' | '射手' | '摩羯' | '水瓶' | '双鱼'

// 运势类型
export type FortuneType = 'comprehensive' | 'career' | 'money' | 'love' | 'health'

// 运势评分 (1-5星)
export type FortuneScore = 1 | 2 | 3 | 4 | 5

// 单个运势信息
export interface FortuneInfo {
  type: FortuneType
  score: FortuneScore
  title: string
  description: string
  suggestion: string
  luckyColor?: string
  luckyNumber?: number
}

// 完整星座运势
export interface ConstellationFortune {
  constellation: ConstellationType
  date: string
  overall: FortuneInfo
  career: FortuneInfo
  money: FortuneInfo
  love: FortuneInfo
  health: FortuneInfo
  summary: string
  luckyItem: string
  avoidActivity: string
}

// 星座基础属性
const CONSTELLATION_ATTRIBUTES = {
  '白羊': { element: '火', planet: '火星', trait: '冲动积极', season: '春' },
  '金牛': { element: '土', planet: '金星', trait: '稳重固执', season: '春' },
  '双子': { element: '风', planet: '水星', trait: '灵活多变', season: '春' },
  '巨蟹': { element: '水', planet: '月亮', trait: '敏感体贴', season: '夏' },
  '狮子': { element: '火', planet: '太阳', trait: '自信热情', season: '夏' },
  '处女': { element: '土', planet: '水星', trait: '完美主义', season: '夏' },
  '天秤': { element: '风', planet: '金星', trait: '和谐平衡', season: '秋' },
  '天蝎': { element: '水', planet: '冥王星', trait: '神秘强烈', season: '秋' },
  '射手': { element: '火', planet: '木星', trait: '自由乐观', season: '秋' },
  '摩羯': { element: '土', planet: '土星', trait: '务实进取', season: '冬' },
  '水瓶': { element: '风', planet: '天王星', trait: '独立创新', season: '冬' },
  '双鱼': { element: '水', planet: '海王星', trait: '浪漫梦幻', season: '冬' }
}

// 运势模板数据
const FORTUNE_TEMPLATES = {
  comprehensive: {
    positive: [
      '今日整体运势较为顺利，各方面都有不错的表现',
      '星象对你较为有利，是展现自己的好时机',
      '今天的能量状态很好，适合处理重要事务',
      '综合运势呈上升趋势，把握机会主动出击',
      '今日运势平稳向好，保持积极心态即可'
    ],
    neutral: [
      '今日运势平平，保持平常心即可',
      '整体运势中等，注意细节处理',
      '今天适合按部就班，不宜冒险',
      '运势波动较小，专注当下的事情',
      '今日宜静不宜动，多思考少行动'
    ],
    negative: [
      '今日运势略有波动，需要谨慎应对',
      '整体运势稍显低迷，建议多休息',
      '今天不太适合做重大决定',
      '运势略有阻滞，耐心等待转机',
      '今日宜低调行事，避免冲突'
    ]
  },
  career: {
    positive: [
      '工作效率很高，容易获得上司认可',
      '事业运势强劲，适合推进重要项目',
      '今日在工作中表现突出，有晋升机会',
      '团队合作顺利，能够轻松完成任务',
      '创意思维活跃，适合创新工作'
    ],
    neutral: [
      '工作运势平稳，按计划进行即可',
      '职场中保持低调，专心工作',
      '今日适合处理常规事务',
      '工作中避免与人发生争执',
      '专注细节，确保工作质量'
    ],
    negative: [
      '工作中可能遇到阻碍，需要耐心',
      '避免在职场中表现过于激进',
      '今日不宜做重要的工作决策',
      '与同事沟通时要格外小心',
      '工作压力较大，注意调节情绪'
    ]
  },
  money: {
    positive: [
      '财运不错，有意外收获的可能',
      '投资理财方面有获利机会',
      '今日适合进行财务规划',
      '偏财运旺盛，可以适当投资',
      '财务状况稳中有升'
    ],
    neutral: [
      '财运平平，保守理财为宜',
      '今日不宜大额消费',
      '理财方面保持现状即可',
      '避免冲动性购买',
      '财务管理要谨慎'
    ],
    negative: [
      '财运稍显低迷，避免投资',
      '今日不宜借贷或担保',
      '控制消费欲望，理性花钱',
      '投资方面要格外谨慎',
      '避免金钱纠纷'
    ]
  },
  love: {
    positive: [
      '感情运势不错，单身者有脱单机会',
      '恋爱中的人感情升温，关系稳定',
      '今日适合表达爱意，增进感情',
      '桃花运旺盛，魅力指数上升',
      '感情生活和谐美满'
    ],
    neutral: [
      '感情运势平稳，维持现状即可',
      '今日适合陪伴恋人，享受简单快乐',
      '感情中避免过度敏感',
      '保持理性，不要期望过高',
      '专注于彼此的沟通'
    ],
    negative: [
      '感情中可能有小摩擦，需要包容',
      '避免因小事与恋人争吵',
      '单身者今日桃花运较弱',
      '感情中要多一些耐心',
      '避免情绪化的表达方式'
    ]
  },
  health: {
    positive: [
      '身体状态良好，精力充沛',
      '今日适合运动锻炼，增强体质',
      '健康运势佳，免疫力强',
      '心情愉悦，有利于身心健康',
      '今日是养生保健的好时机'
    ],
    neutral: [
      '健康状况平稳，注意作息规律',
      '适度运动，不要过度疲劳',
      '保持良好的生活习惯',
      '注意饮食营养搭配',
      '心态平和，避免情绪波动'
    ],
    negative: [
      '注意身体健康，避免过度劳累',
      '今日不宜剧烈运动',
      '小心感冒等小疾病',
      '注意饮食卫生，避免肠胃不适',
      '保持充足休息，缓解压力'
    ]
  }
}

// 幸运物品
const LUCKY_ITEMS = [
  '红色饰品', '绿色植物', '水晶摆件', '香薰蜡烛', '音乐播放器',
  '书籍杂志', '花朵', '茶叶', '巧克力', '手写笔记本',
  '运动手环', '太阳镜', '围巾', '香水', '小盆栽'
]

// 避免活动
const AVOID_ACTIVITIES = [
  '重大决策', '投资理财', '激烈争论', '熬夜加班', '暴饮暴食',
  '冲动消费', '长途旅行', '剧烈运动', '情绪化表达', '过度社交',
  '复杂谈判', '冒险活动', '重要签约', '新项目启动', '搬家装修'
]

// 幸运颜色
const LUCKY_COLORS = ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色', '粉色', '白色', '黑色', '金色']

// 星座专属幸运物品
const CONSTELLATION_LUCKY_ITEMS = {
  '白羊': ['红色饰品', '运动手环', '能量石', '火焰蜡烛', '辣味零食'],
  '金牛': ['绿色植物', '香薰蜡烛', '美食', '舒适抱枕', '音乐播放器'],
  '双子': ['书籍杂志', '通讯设备', '笔记本', '益智游戏', '社交APP'],
  '巨蟹': ['家居用品', '月亮饰品', '温暖围巾', '贝壳装饰', '珍珠饰品'],
  '狮子': ['金色饰品', '太阳镜', '奢华香水', '闪亮首饰', '舞台道具'],
  '处女': ['整理用品', '健康食品', '精油', '笔记工具', '清洁用品'],
  '天秤': ['美妆用品', '艺术品', '粉色饰品', '和谐铃铛', '美丽花朵'],
  '天蝎': ['神秘水晶', '深色饰品', '侦探小说', '冥想用品', '黑曜石'],
  '射手': ['旅行用品', '地图册', '运动装备', '异国纪念品', '冒险指南'],
  '摩羯': ['商务用品', '时间管理工具', '山石摆件', '成功书籍', '传统饰品'],
  '水瓶': ['科技产品', '创新工具', '水晶球', '未来主义饰品', '电子设备'],
  '双鱼': ['艺术用品', '梦幻饰品', '水族摆件', '冥想音乐', '诗歌集']
}

// 星座专属幸运颜色
const CONSTELLATION_LUCKY_COLORS = {
  '白羊': ['红色', '橙色', '金色'],
  '金牛': ['绿色', '粉色', '棕色'],
  '双子': ['黄色', '银色', '蓝色'],
  '巨蟹': ['白色', '银色', '海蓝色'],
  '狮子': ['金色', '橙色', '黄色'],
  '处女': ['深蓝色', '灰色', '白色'],
  '天秤': ['粉色', '蓝色', '薰衣草色'],
  '天蝎': ['深红色', '黑色', '紫色'],
  '射手': ['紫色', '蓝色', '绿色'],
  '摩羯': ['黑色', '棕色', '深绿色'],
  '水瓶': ['蓝色', '青色', '银色'],
  '双鱼': ['海绿色', '紫色', '薰衣草色']
}

// 星座专属避免活动
const CONSTELLATION_AVOID_ACTIVITIES = {
  '白羊': ['过度犹豫', '被动等待', '复杂计划', '长时间思考', '缓慢行动'],
  '金牛': ['冲动决策', '频繁变动', '激进改革', '不稳定投资', '匆忙行事'],
  '双子': ['长期承诺', '单调重复', '深度专注', '固执己见', '拒绝沟通'],
  '巨蟹': ['情感冷漠', '离家太远', '忽视家人', '强硬态度', '公开冲突'],
  '狮子': ['低调处理', '避免出头', '委屈求全', '缺乏自信', '团体埋没'],
  '处女': ['粗心大意', '完美拖延', '忽视细节', '混乱环境', '不健康习惯'],
  '天秤': ['独断专行', '激烈争论', '偏激立场', '破坏和谐', '匆忙决定'],
  '天蝎': ['表面化交往', '泄露秘密', '情绪外露', '轻信他人', '缺乏深度'],
  '射手': ['局限思维', '束缚行动', '拒绝学习', '狭隘观念', '固守成规'],
  '摩羯': ['不切实际', '急功近利', '缺乏计划', '逃避责任', '盲目乐观'],
  '水瓶': ['从众跟风', '传统束缚', '拒绝创新', '情感依赖', '保守思维'],
  '双鱼': ['过度理性', '忽视直觉', '冷酷无情', '现实主义', '拒绝梦想']
}

/**
 * 根据日期生成伪随机数种子
 */
function getDateSeed(date: Date): number {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return year * 10000 + month * 100 + day
}

/**
 * 基于种子的伪随机数生成器
 */
function seededRandom(seed: number, min: number = 0, max: number = 1): number {
  const x = Math.sin(seed) * 10000
  const random = x - Math.floor(x)
  return min + random * (max - min)
}

/**
 * 基于种子获取数组中的随机元素
 */
function getSeededRandomElement<T>(array: T[], seed: number, offset: number = 0): T {
  const index = Math.floor(seededRandom(seed + offset, 0, array.length))
  return array[index]
}

/**
 * 计算运势评分
 */
function calculateFortuneScore(
  constellation: ConstellationType,
  date: Date,
  type: FortuneType
): FortuneScore {
  const seed = getDateSeed(date)
  const constellationIndex = Object.keys(CONSTELLATION_ATTRIBUTES).indexOf(constellation)
  const typeOffset = ['comprehensive', 'career', 'money', 'love', 'health'].indexOf(type)
  
  // 基于星座、日期和运势类型生成稳定的评分
  const score = seededRandom(seed + constellationIndex * 100 + typeOffset * 10, 1, 6)
  return Math.floor(score) as FortuneScore
}

/**
 * 获取运势描述
 */
function getFortuneDescription(score: FortuneScore, type: FortuneType, seed: number): string {
  const templates = FORTUNE_TEMPLATES[type]
  
  if (score >= 4) {
    return getSeededRandomElement(templates.positive, seed)
  } else if (score >= 3) {
    return getSeededRandomElement(templates.neutral, seed)
  } else {
    return getSeededRandomElement(templates.negative, seed)
  }
}

/**
 * 获取运势建议
 */
function getFortuneSuggestion(
  constellation: ConstellationType,
  score: FortuneScore,
  type: FortuneType
): string {
  const attr = CONSTELLATION_ATTRIBUTES[constellation]
  
  const suggestions = {
    comprehensive: {
      high: `发挥${attr.trait}的优势，积极把握机会`,
      medium: `保持${attr.trait}的特质，稳步前进`,
      low: `调整心态，利用${attr.trait}的力量化解困难`
    },
    career: {
      high: `利用你的${attr.trait}在工作中脱颖而出`,
      medium: `在职场中发挥${attr.trait}的稳定作用`,
      low: `控制${attr.trait}可能带来的负面影响，谨慎行事`
    },
    money: {
      high: `理性利用${attr.trait}，做出明智的财务决策`,
      medium: `保持${attr.trait}，稳健管理财务`,
      low: `克制${attr.trait}中的冲动，避免财务风险`
    },
    love: {
      high: `展现你${attr.trait}的魅力，增进感情`,
      medium: `在感情中保持${attr.trait}的平衡`,
      low: `注意${attr.trait}在感情中的表达方式`
    },
    health: {
      high: `保持${attr.trait}的生活节奏，维护健康`,
      medium: `适度调节${attr.trait}，注意身心平衡`,
      low: `避免${attr.trait}带来的健康压力`
    }
  }
  
  const level = score >= 4 ? 'high' : score >= 3 ? 'medium' : 'low'
  return suggestions[type][level]
}

/**
 * 生成单个运势信息
 */
function generateFortuneInfo(
  constellation: ConstellationType,
  date: Date,
  type: FortuneType
): FortuneInfo {
  const seed = getDateSeed(date)
  const constellationIndex = Object.keys(CONSTELLATION_ATTRIBUTES).indexOf(constellation)
  const score = calculateFortuneScore(constellation, date, type)
  const typeOffset = ['comprehensive', 'career', 'money', 'love', 'health'].indexOf(type)
  
  const titles = {
    comprehensive: '综合运势',
    career: '事业运势', 
    money: '财运',
    love: '感情运势',
    health: '健康运势'
  }
  
  return {
    type,
    score,
    title: titles[type],
    description: getFortuneDescription(score, type, seed + typeOffset),
    suggestion: getFortuneSuggestion(constellation, score, type),
    luckyColor: type === 'comprehensive' ? getSeededRandomElement(CONSTELLATION_LUCKY_COLORS[constellation], seed + constellationIndex * 50) : undefined,
    luckyNumber: type === 'comprehensive' ? Math.floor(seededRandom(seed + constellationIndex * 50, 1, 100)) : undefined
  }
}

/**
 * 生成完整的星座运势
 */
export function generateConstellationFortune(
  constellation: ConstellationType,
  date: Date = new Date()
): ConstellationFortune {
  const seed = getDateSeed(date)
  const constellationIndex = Object.keys(CONSTELLATION_ATTRIBUTES).indexOf(constellation)
  
  // 生成各类运势
  const overall = generateFortuneInfo(constellation, date, 'comprehensive')
  const career = generateFortuneInfo(constellation, date, 'career')
  const money = generateFortuneInfo(constellation, date, 'money')
  const love = generateFortuneInfo(constellation, date, 'love')
  const health = generateFortuneInfo(constellation, date, 'health')
  
  // 计算平均分生成总结
  const avgScore = Math.round((overall.score + career.score + money.score + love.score + health.score) / 5)
  
  const summaries = {
    high: '今日整体运势良好，各方面都有不错的表现，是积极行动的好时机。',
    medium: '今日运势平稳，保持平常心，按部就班地处理各项事务即可。',
    low: '今日运势略有波动，建议低调行事，多关注内在修养和休息调整。'
  }
  
  const summaryLevel = avgScore >= 4 ? 'high' : avgScore >= 3 ? 'medium' : 'low'
  
  return {
    constellation,
    date: date.toLocaleDateString('zh-CN'),
    overall,
    career,
    money,
    love,
    health,
    summary: summaries[summaryLevel],
    luckyItem: getSeededRandomElement(CONSTELLATION_LUCKY_ITEMS[constellation], seed + constellationIndex * 30),
    avoidActivity: getSeededRandomElement(CONSTELLATION_AVOID_ACTIVITIES[constellation], seed + constellationIndex * 30 + 100)
  }
}

/**
 * 获取今日星座运势（结合黄历信息）
 */
export function getTodayConstellationFortune(constellation: ConstellationType): ConstellationFortune {
  const today = new Date()
  const fortune = generateConstellationFortune(constellation, today)
  
  try {
    // 获取黄历信息
    const almanac = getAlmanacInfo(today)
    
    // 根据黄历宜忌调整建议
    if (almanac.recommends.length > 0) {
      const goodActivities = almanac.recommends.slice(0, 2).join('、')
      fortune.overall.suggestion += `。今日黄历宜${goodActivities}，可多关注相关事务。`
    }
    
    // 智能结合黄历和星座避免活动
    if (almanac.avoids.length > 0) {
      const badActivities = almanac.avoids.slice(0, 1).join('、')
      fortune.avoidActivity = `${fortune.avoidActivity}、${badActivities}（黄历忌）`
    }
    
  } catch (error) {
    console.warn('获取黄历信息失败:', error)
  }
  
  return fortune
}

/**
 * 获取星座运势的简化版本（用于首页显示）
 */
export function getSimpleConstellationFortune(constellation: ConstellationType): {
  constellation: ConstellationType
  score: FortuneScore
  description: string
  suggestion: string
  luckyColor: string
} {
  const fortune = getTodayConstellationFortune(constellation)
  
  return {
    constellation: fortune.constellation,
    score: fortune.overall.score,
    description: fortune.overall.description,
    suggestion: fortune.overall.suggestion,
    luckyColor: fortune.overall.luckyColor || '蓝色'
  }
}

/**
 * 将数字评分转换为星级显示
 */
export function scoreToStars(score: FortuneScore): string {
  return '★'.repeat(score) + '☆'.repeat(5 - score)
}

/**
 * 获取运势评分的颜色类名
 */
export function getScoreColor(score: FortuneScore): string {
  if (score >= 4) return 'text-green-500'
  if (score >= 3) return 'text-yellow-500'
  return 'text-red-500'
}

/**
 * 展示不同星座在同一天的幸运元素差异（调试用）
 */
export function showConstellationDifferences(date: Date = new Date()): void {
  console.log(`=== ${date.toLocaleDateString('zh-CN')} 各星座幸运元素对比 ===`)
  
  const constellations: ConstellationType[] = ['白羊', '金牛', '双子', '天蝎', '狮子', '处女']
  
  constellations.forEach(constellation => {
    const fortune = getSimpleConstellationFortune(constellation)
    const fullFortune = generateConstellationFortune(constellation, date)
    
    console.log(`${constellation}座:`)
    console.log(`  幸运颜色: ${fortune.luckyColor}`)
    console.log(`  幸运物品: ${fullFortune.luckyItem}`)
    console.log(`  避免活动: ${fullFortune.avoidActivity}`)
    console.log(`  运势评分: ${fortune.score}/5 (${scoreToStars(fortune.score)})`)
    console.log('---')
  })
} 