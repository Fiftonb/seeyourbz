// 桃花运测算系统
import { SolarDay, LunarHour, EightChar, SixtyCycle, EarthBranch } from 'tyme4ts'

// 八字信息接口
export interface EightCharInfo {
  year: string
  month: string
  day: string
  hour: string
  yearPillar: string
  monthPillar: string
  dayPillar: string
  hourPillar: string
}

// 桃花运结果接口
export interface PeachBlossomResult {
  hasPeachBlossom: boolean
  positions: PeachBlossomPosition[]
  type: 'inside' | 'outside' | 'mixed' | 'none'
  strength: 'strong' | 'medium' | 'weak'
  analysis: string
  suggestions: string[]
  eightChar: EightCharInfo  // 新增八字信息
}

// 桃花位置信息
export interface PeachBlossomPosition {
  pillar: 'year' | 'month' | 'day' | 'hour'
  pillarName: string
  branch: string
  peachBlossomBranch: string
  meaning: string
}

// 每周桃花运指数
export interface WeeklyPeachBlossomFortune {
  week: string
  overallScore: number // 1-5分
  analysis: {
    eightCharScore: number
    constellationScore: number
    zodiacScore: number
    flowYearScore: number
  }
  suggestions: string[]
  luckyDays: string[]
  avoidDays: string[]
  luckyColors: string[]
  luckyItems: string[]
}

// 桃花查找映射表
const PEACH_BLOSSOM_MAP: Record<string, string> = {
  // 寅午戌见卯（火局见木）
  '寅': '卯', '午': '卯', '戌': '卯',
  // 申子辰见酉（水局见金）
  '申': '酉', '子': '酉', '辰': '酉',
  // 亥卯未见子（木局见水）
  '亥': '子', '卯': '子', '未': '子',
  // 巳酉丑见午（金局见火）
  '巳': '午', '酉': '午', '丑': '午'
}

// 桃花强度权重
const PEACH_BLOSSOM_WEIGHTS = {
  year: 0.8,   // 年柱桃花影响祖辈、早年
  month: 1.2,  // 月柱桃花影响父母、青年
  day: 1.5,    // 日柱桃花影响本人、中年 
  hour: 1.0    // 时柱桃花影响子女、晚年
}

/**
 * 查找八字中的桃花星
 */
export function findPeachBlossoms(
  birthDate: Date,
  birthTime: { hour: number, minute: number } = { hour: 12, minute: 0 }
): PeachBlossomResult {
  // 获取八字
  const solarDay = SolarDay.fromYmd(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    birthTime.hour,
    birthTime.minute,
    0
  )
  
  const eightChar = lunarHour.getEightChar()
  
  // 获取四柱地支
  const pillars = {
    year: eightChar.getYear().getEarthBranch().getName(),
    month: eightChar.getMonth().getEarthBranch().getName(),
    day: eightChar.getDay().getEarthBranch().getName(),
    hour: eightChar.getHour().getEarthBranch().getName()
  }
  
  // 查找桃花
  const positions: PeachBlossomPosition[] = []
  
  // 以年支和日支为基准查找桃花
  const baseBranches = [pillars.year, pillars.day]
  
  baseBranches.forEach(baseBranch => {
    const peachBlossomBranch = PEACH_BLOSSOM_MAP[baseBranch]
    if (peachBlossomBranch) {
      // 检查其他柱是否有桃花
      Object.entries(pillars).forEach(([pillarName, branch]) => {
        if (branch === peachBlossomBranch) {
          positions.push({
            pillar: pillarName as 'year' | 'month' | 'day' | 'hour',
            pillarName: pillarName === 'year' ? '年柱' : 
                       pillarName === 'month' ? '月柱' :
                       pillarName === 'day' ? '日柱' : '时柱',
            branch,
            peachBlossomBranch,
            meaning: getPeachBlossomMeaning(pillarName as any, baseBranch)
          })
        }
      })
    }
  })
  
  // 判断桃花类型
  const insidePillars = positions.filter(p => p.pillar === 'year' || p.pillar === 'month')
  const outsidePillars = positions.filter(p => p.pillar === 'day' || p.pillar === 'hour')
  
  let type: PeachBlossomResult['type'] = 'none'
  if (insidePillars.length > 0 && outsidePillars.length > 0) {
    type = 'mixed'
  } else if (insidePillars.length > 0) {
    type = 'inside'
  } else if (outsidePillars.length > 0) {
    type = 'outside'
  }
  
  // 计算桃花强度
  const totalWeight = positions.reduce((sum, pos) => {
    return sum + PEACH_BLOSSOM_WEIGHTS[pos.pillar]
  }, 0)
  
  let strength: PeachBlossomResult['strength'] = 'weak'
  if (totalWeight >= 2.5) strength = 'strong'
  else if (totalWeight >= 1.5) strength = 'medium'
  
  // 生成分析和建议
  const analysis = generatePeachBlossomAnalysis(positions, type, strength)
  const suggestions = generatePeachBlossomSuggestions(type, strength)
  
  return {
    hasPeachBlossom: positions.length > 0,
    positions,
    type,
    strength,
    analysis,
    suggestions,
    eightChar: {
      year: eightChar.getYear().getEarthBranch().getName(),
      month: eightChar.getMonth().getEarthBranch().getName(),
      day: eightChar.getDay().getEarthBranch().getName(),
      hour: eightChar.getHour().getEarthBranch().getName(),
      yearPillar: eightChar.getYear().toString(),
      monthPillar: eightChar.getMonth().toString(),
      dayPillar: eightChar.getDay().toString(),
      hourPillar: eightChar.getHour().toString()
    }
  }
}

/**
 * 获取桃花含义
 */
function getPeachBlossomMeaning(pillar: string, baseBranch: string): string {
  const meanings = {
    year: '早年桃花，感情启蒙早，异性缘好',
    month: '青年桃花，感情丰富，魅力较强', 
    day: '正桃花，感情专一，婚姻美满',
    hour: '晚年桃花，老来俏，子女缘佳'
  }
  
  return meanings[pillar as keyof typeof meanings] || '桃花运势'
}

/**
 * 生成桃花分析
 */
function generatePeachBlossomAnalysis(
  positions: PeachBlossomPosition[],
  type: PeachBlossomResult['type'], 
  strength: PeachBlossomResult['strength']
): string {
  if (positions.length === 0) {
    return '您的八字中未见传统的咸池桃花星，但这并不意味着感情运势欠佳。只是在感情方面相对内敛含蓄，需要更多主动出击和积极表达才能收获理想的爱情。建议多参与社交活动，主动表达自己的感情想法。'
  }
  
  const typeDescriptions = {
    inside: '您的桃花属于"墙内桃花"，表示感情运势偏向保守内敛。通常感情机会多来自于熟悉的圈子，如同事、同学、朋友介绍等。在感情中比较专一认真，一旦确定关系就会全心投入',
    outside: '您的桃花属于"墙外桃花"，表示异性缘分广泛，魅力突出。容易在各种场合吸引异性注意，感情机会较多。但也要注意在众多选择中保持理性，避免感情纠葛',
    mixed: '您兼具"墙内"和"墙外"桃花的特质，既有稳定深厚的感情基础，又有广泛的异性缘分。这种组合让您在感情中既专情又有魅力，是很好的桃花配置',
    none: '桃花运势相对平稳，感情发展较为缓慢'
  }
  
  const strengthDescriptions = {
    strong: '桃花运势非常旺盛，异性缘极佳。您天生具有吸引异性的魅力，感情机会众多。但也要注意在多个选择中保持清醒的判断，选择真正适合的伴侣',
    medium: '桃花运势处于适中水平，有一定的异性缘分。虽然不如桃花旺盛者那样机会众多，但胜在质量较好，遇到的感情机会通常比较靠谱。需要把握好时机，主动出击',
    weak: '桃花运势相对较弱，感情发展需要更多的耐心和主动。虽然天生桃花不旺，但通过后天努力提升个人魅力、扩大社交圈子，同样能够收获美好的爱情'
  }
  
  let analysis = `${typeDescriptions[type]}。${strengthDescriptions[strength]}。`
  
  if (positions.length > 0) {
    analysis += `从八字分析来看，${positions.map(p => p.meaning).join('，')}。这些桃花星的出现表明您在相应的人生阶段会有较好的感情运势。`
  }
  
  return analysis
}

/**
 * 生成桃花建议
 */
function generatePeachBlossomSuggestions(
  type: PeachBlossomResult['type'],
  strength: PeachBlossomResult['strength']
): string[] {
  const suggestions: string[] = []
  
  // 根据桃花类型给出建议
  switch (type) {
    case 'inside':
      suggestions.push('重视身边熟悉圈子的感情机会，朋友同事的介绍往往更靠谱')
      suggestions.push('参加同学聚会、同事活动等熟人聚会，增加在熟悉环境中的曝光度')
      suggestions.push('对家人安排的相亲不要抵触，墙内桃花往往通过这种方式开花结果')
      break
    case 'outside':
      suggestions.push('大胆参加各种新鲜的社交活动，如户外运动、兴趣社团、培训课程等')
      suggestions.push('提升个人形象和谈吐，在陌生环境中展现最佳状态')
      suggestions.push('学会在众多追求者中理性选择，不被表面魅力迷惑')
      break
    case 'mixed':
      suggestions.push('既要珍惜身边稳定的感情基础，也要保持对新鲜感情的开放心态')
      suggestions.push('在稳定与激情之间寻找平衡，选择既有激情又能长久的伴侣')
      suggestions.push('利用自己的双重魅力，在不同场合展现不同的个人特质')
      break
    default:
      suggestions.push('主动提升个人魅力：学习新技能、改善形象、培养兴趣爱好')
      suggestions.push('扩大社交圈子：参加各种活动、加入兴趣小组、多与人交流')
      suggestions.push('增强自信心：相信自己值得被爱，展现真实而美好的自己')
  }
  
  // 根据桃花强度给出建议
  switch (strength) {
    case 'strong':
      suggestions.push('学会在多个选择中保持理性判断，不要被一时的激情冲昏头脑')
      suggestions.push('明确自己的感情标准和底线，避免在感情中迷失方向')
      suggestions.push('珍惜当前的桃花运势，但也要为长远考虑选择合适的伴侣')
      break
    case 'medium':
      suggestions.push('把握关键时机主动表达感情，机会往往稍纵即逝')
      suggestions.push('适当包装自己但保持真实，展现最好的一面给心仪的人')
      suggestions.push('保持耐心的同时也要有所行动，被动等待可能错失良缘')
      break
    case 'weak':
      suggestions.push('通过后天努力弥补先天不足：学习沟通技巧、提升情商、增强个人魅力')
      suggestions.push('更加主动积极地创造感情机会，不要只是被动等待')
      suggestions.push('保持乐观心态，相信每个人都有属于自己的感情缘分')
      break
  }
  
  // 通用建议
  suggestions.push('保持真诚的心态，用真心对待每一段感情')
  suggestions.push('注重个人成长，成为更好的自己才能吸引更好的人')
  
  return suggestions
}

/**
 * 计算每周桃花运指数
 */
export function calculateWeeklyPeachBlossomFortune(
  birthDate: Date,
  birthTime: { hour: number, minute: number },
  targetWeek: Date = new Date()
): WeeklyPeachBlossomFortune {
  // 获取基础桃花信息
  const peachBlossom = findPeachBlossoms(birthDate, birthTime)
  
  // 获取目标周的年份信息
  const targetYear = targetWeek.getFullYear()
  
  // 计算各项指数
  const eightCharScore = calculateEightCharScore(peachBlossom)
  const constellationScore = calculateConstellationScore(birthDate, targetWeek)
  const zodiacScore = calculateZodiacScore(birthDate, targetWeek)
  const flowYearScore = calculateFlowYearScore(birthDate, targetWeek)
  
  // 综合评分（加权平均）
  const overallScore = Math.round(
    (eightCharScore * 0.4 + 
     constellationScore * 0.25 + 
     zodiacScore * 0.2 + 
     flowYearScore * 0.15) * 10
  ) / 10
  
  // 生成建议和幸运信息
  const suggestions = generateWeeklySuggestions(overallScore, peachBlossom)
  const luckyDays = generateLuckyDays(targetWeek, overallScore)
  const avoidDays = generateAvoidDays(targetWeek, overallScore)
  const luckyColors = generateLuckyColors(peachBlossom.type)
  const luckyItems = generateLuckyItems(peachBlossom.strength)
  
  return {
    week: `${targetWeek.getFullYear()}年第${getWeekNumber(targetWeek)}周`,
    overallScore: Math.max(1, Math.min(5, overallScore)),
    analysis: {
      eightCharScore: Math.round(eightCharScore * 10) / 10,
      constellationScore: Math.round(constellationScore * 10) / 10, 
      zodiacScore: Math.round(zodiacScore * 10) / 10,
      flowYearScore: Math.round(flowYearScore * 10) / 10
    },
    suggestions,
    luckyDays,
    avoidDays,
    luckyColors,
    luckyItems
  }
}

/**
 * 计算八字桃花评分（考虑桃花位置和类型）
 */
function calculateEightCharScore(peachBlossom: PeachBlossomResult): number {
  if (!peachBlossom.hasPeachBlossom) return 2.0
  
  // 基础强度评分
  const strengthScores = { weak: 3.0, medium: 4.0, strong: 5.0 }
  let baseScore = strengthScores[peachBlossom.strength]
  
  // 根据桃花类型调整
  let typeBonus = 0
  switch (peachBlossom.type) {
    case 'mixed':   // 内外桃花，最好
      typeBonus = 0.3
      break
    case 'outside': // 墙外桃花，较好
      typeBonus = 0.1
      break
    case 'inside':  // 墙内桃花，稳定
      typeBonus = 0.0
      break
    default:
      typeBonus = 0
  }
  
  // 根据桃花位置数量微调（多个位置有桃花更好）
  const positionBonus = Math.min(peachBlossom.positions.length * 0.1, 0.4)
  
  // 特殊组合奖励（如果日柱有桃花，额外加分）
  let specialBonus = 0
  const hasDayPillarPeach = peachBlossom.positions.some(p => p.pillar === 'day')
  if (hasDayPillarPeach) {
    specialBonus = 0.2 // 日柱桃花最重要
  }
  
  const finalScore = Math.max(1, Math.min(5, baseScore + typeBonus + positionBonus + specialBonus))
  return Math.round(finalScore * 10) / 10
}

/**
 * 计算星座评分（考虑周数变化）
 */
function calculateConstellationScore(birthDate: Date, targetWeek: Date): number {
  const solarDay = SolarDay.fromYmd(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate())
  const constellation = solarDay.getConstellation().getName()
  const weekNumber = getWeekNumber(targetWeek)
  const targetYear = targetWeek.getFullYear()
  
  // 星座基础桃花评分
  const baseScores: Record<string, number> = {
    '白羊': 3.8, '金牛': 3.2, '双子': 4.0, '巨蟹': 3.1,
    '狮子': 4.2, '处女': 2.8, '天秤': 4.5, '天蝎': 3.9,
    '射手': 3.7, '摩羯': 2.9, '水瓶': 3.4, '双鱼': 4.1
  }
  
  const baseScore = baseScores[constellation] || 3.0
  
  // 根据年份和周数添加周期性变化（每个星座有不同的周期）
  const constellationIndex = Object.keys(baseScores).indexOf(constellation)
  const yearWeekSeed = targetYear * 100 + weekNumber // 年份权重更大
  const weeklyVariation = Math.sin((yearWeekSeed + constellationIndex * 4.3) * 0.0003) * 0.4
  
  // 月份调整（春夏桃花运更旺）
  const month = targetWeek.getMonth() + 1
  let seasonalBonus = 0
  if (month >= 3 && month <= 8) { // 春夏季
    seasonalBonus = 0.2
  } else if (month >= 9 && month <= 11) { // 秋季
    seasonalBonus = 0.1
  }
  
  const finalScore = Math.max(1, Math.min(5, baseScore + weeklyVariation + seasonalBonus))
  return Math.round(finalScore * 10) / 10
}

/**
 * 计算生肖评分（考虑周数和完整兼容性）
 */
function calculateZodiacScore(birthDate: Date, targetWeek: Date): number {
  const targetYear = targetWeek.getFullYear()
  const weekNumber = getWeekNumber(targetWeek)
  const solarDay = SolarDay.fromYmd(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate())
  const lunarDay = solarDay.getLunarDay()
  const lunarYear = lunarDay.getLunarMonth().getLunarYear()
  const birthZodiac = lunarYear.getSixtyCycle().getEarthBranch().getZodiac().getName()
  
  const targetSolarDay = SolarDay.fromYmd(targetYear, 1, 1)
  const targetLunarDay = targetSolarDay.getLunarDay()
  const targetLunarYear = targetLunarDay.getLunarMonth().getLunarYear()
  const targetZodiac = targetLunarYear.getSixtyCycle().getEarthBranch().getZodiac().getName()
  
  // 完整的12生肖基础桃花运势
  const zodiacBaseScores: Record<string, number> = {
    '鼠': 3.5, '牛': 3.0, '虎': 3.8, '兔': 4.0,
    '龙': 4.2, '蛇': 3.9, '马': 3.7, '羊': 3.6,
    '猴': 4.1, '鸡': 3.3, '狗': 3.2, '猪': 3.4
  }
  
  // 生肖年份兼容性（桃花年、相合等）
  const zodiacCompatibility: Record<string, Record<string, number>> = {
    '鼠': { '龙': 4.5, '猴': 4.3, '牛': 3.8, '鸡': 4.2, '鼠': 3.0 },
    '牛': { '蛇': 4.4, '鸡': 4.1, '鼠': 3.8, '马': 4.3, '牛': 3.1 },
    '虎': { '马': 4.6, '狗': 4.2, '猪': 3.9, '兔': 4.0, '虎': 3.2 },
    '兔': { '羊': 4.3, '猪': 4.1, '狗': 3.7, '鼠': 4.4, '兔': 3.3 },
    '龙': { '鼠': 4.5, '猴': 4.4, '鸡': 3.8, '龙': 3.1 },
    '蛇': { '牛': 4.4, '鸡': 4.2, '猴': 3.9, '蛇': 3.2 },
    '马': { '虎': 4.6, '狗': 4.3, '羊': 3.8, '牛': 4.3, '马': 3.0 },
    '羊': { '兔': 4.3, '猪': 4.0, '马': 3.8, '羊': 3.1 },
    '猴': { '鼠': 4.3, '龙': 4.4, '蛇': 3.9, '猴': 3.2 },
    '鸡': { '牛': 4.1, '蛇': 4.2, '龙': 3.8, '鼠': 4.2, '鸡': 3.0 },
    '狗': { '虎': 4.2, '马': 4.3, '兔': 3.7, '狗': 3.1 },
    '猪': { '兔': 4.1, '羊': 4.0, '虎': 3.9, '猪': 3.3 }
  }
  
  // 基础评分
  const baseScore = zodiacBaseScores[birthZodiac] || 3.0
  
  // 年份兼容性评分
  const compatibilityScore = zodiacCompatibility[birthZodiac]?.[targetZodiac] || 3.0
  
  // 综合评分（基础分占40%，兼容性占60%）
  const combinedScore = baseScore * 0.4 + compatibilityScore * 0.6
  
  // 基于生肖组合、年份和周数的确定性变化
  const zodiacIndex1 = Object.keys(zodiacBaseScores).indexOf(birthZodiac)
  const zodiacIndex2 = Object.keys(zodiacBaseScores).indexOf(targetZodiac)
  
  // 周期性变化（每个生肖组合有不同的周期，考虑年份）
  const yearWeekSeed = targetYear * 100 + weekNumber // 年份权重更大
  const weeklyVariation = Math.sin((yearWeekSeed + zodiacIndex1 * 3.7 + zodiacIndex2 * 1.9) * 0.0002) * 0.3
  
  // 基础的生肖组合调整
  const baseVariation = Math.sin((zodiacIndex1 + zodiacIndex2 * 2.7) * 0.5) * 0.15
  
  const finalScore = Math.max(1, Math.min(5, combinedScore + weeklyVariation + baseVariation))
  return Math.round(finalScore * 10) / 10
}

/**
 * 计算流年评分（考虑具体周数）
 */
function calculateFlowYearScore(birthDate: Date, targetWeek: Date): number {
  const targetYear = targetWeek.getFullYear()
  const weekNumber = getWeekNumber(targetWeek)
  
  // 基于出生年份和目标年份的确定性算法
  const birthYear = birthDate.getFullYear()
  const ageInTargetYear = targetYear - birthYear
  
  // 使用出生日期的数字特征和周数作为种子
  const dateSum = birthDate.getFullYear() + birthDate.getMonth() + birthDate.getDate()
  const seed = (dateSum * targetYear + weekNumber * 17) % 100 // 加入周数因子
  
  // 基于年龄段的基础评分
  let baseScore = 3.0
  if (ageInTargetYear >= 18 && ageInTargetYear <= 35) {
    baseScore = 3.5 // 黄金年龄段
  } else if (ageInTargetYear >= 36 && ageInTargetYear <= 50) {
    baseScore = 3.2 // 成熟期
  } else if (ageInTargetYear > 50) {
    baseScore = 2.8 // 成熟后期
  }
  
  // 基于种子的调整值，年份和周数共同影响波动
  const yearWeekFactor = targetYear * 100 + weekNumber
  const weeklyVariation = Math.sin(yearWeekFactor * 0.00015) * 0.3 // 年份+周数的周期性变化
  const adjustment = (seed % 20) / 10 - 0.5 + weeklyVariation
  
  // 确保分数在1-5之间
  const finalScore = Math.max(1, Math.min(5, baseScore + adjustment))
  
  return Math.round(finalScore * 10) / 10
}

/**
 * 生成每周建议
 */
function generateWeeklySuggestions(score: number, peachBlossom: PeachBlossomResult): string[] {
  const suggestions = []
  
  if (score >= 4) {
    suggestions.push('本周桃花运势不错，适合主动出击')
    suggestions.push('参加社交活动，展现个人魅力')
  } else if (score >= 3) {
    suggestions.push('本周桃花运势平稳，保持开放心态')
    suggestions.push('注重内在修养，提升个人魅力')
  } else {
    suggestions.push('本周桃花运势较弱，以充实自己为主')
    suggestions.push('避免强求感情，注重自我提升')
  }
  
  if (peachBlossom.hasPeachBlossom) {
    suggestions.push('利用天生的桃花优势，但要理性选择')
  }
  
  return suggestions
}

/**
 * 生成幸运日
 */
function generateLuckyDays(targetWeek: Date, score: number): string[] {
  const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const luckyCount = score >= 4 ? 3 : score >= 3 ? 2 : 1
  
  return weekdays.slice(0, luckyCount)
}

/**
 * 生成不利日
 */
function generateAvoidDays(targetWeek: Date, score: number): string[] {
  const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const avoidCount = score <= 2 ? 3 : score <= 3 ? 2 : 1
  
  return weekdays.slice(-avoidCount)
}

/**
 * 生成幸运颜色
 */
function generateLuckyColors(type: PeachBlossomResult['type']): string[] {
  const colorMap = {
    inside: ['粉色', '白色', '米色'],
    outside: ['红色', '橙色', '玫红'],
    mixed: ['紫色', '薰衣草', '桃色'],
    none: ['蓝色', '绿色', '咖啡色']
  }
  
  return colorMap[type]
}

/**
 * 生成幸运物品
 */
function generateLuckyItems(strength: PeachBlossomResult['strength']): string[] {
  const itemMap = {
    strong: ['玫瑰花', '香水', '珠宝首饰'],
    medium: ['鲜花', '丝巾', '精致配饰'],
    weak: ['小盆栽', '书籍', '温暖围巾']
  }
  
  return itemMap[strength]
}

/**
 * 获取周数
 */
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
} 