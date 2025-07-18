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

// 桃花类型枚举
export type PeachBlossomType = 'xianchi' | 'redPhoenix' | 'heavenlyJoy' | 'bath' | 'redRomance'

// 桃花位置信息
export interface PeachBlossomPosition {
  pillar: 'year' | 'month' | 'day' | 'hour'
  pillarName: string
  branch: string
  peachBlossomBranch: string
  meaning: string
  type: PeachBlossomType
  typeName: string
  strength: number  // 单个桃花星的强度
}

// 桃花运结果接口
export interface PeachBlossomResult {
  hasPeachBlossom: boolean
  positions: PeachBlossomPosition[]
  type: 'inside' | 'outside' | 'mixed' | 'none'
  strength: 'strong' | 'medium' | 'weak'
  analysis: string
  suggestions: string[]
  eightChar: EightCharInfo
  // 新增：按类型分组的桃花星
  peachBlossomTypes: {
    xianchi: PeachBlossomPosition[]     // 咸池桃花
    redPhoenix: PeachBlossomPosition[]   // 红鸾桃花
    heavenlyJoy: PeachBlossomPosition[]  // 天喜桃花
    bath: PeachBlossomPosition[]         // 沐浴桃花
    redRomance: PeachBlossomPosition[]   // 红艳桃花
  }
  overallScore: number  // 综合桃花运评分 (1-10分)
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

// 咸池桃花查找映射表（传统桃花）
const XIANCHI_PEACH_MAP: Record<string, string> = {
  // 寅午戌见卯（火局见木）
  '寅': '卯', '午': '卯', '戌': '卯',
  // 申子辰见酉（水局见金）
  '申': '酉', '子': '酉', '辰': '酉',
  // 亥卯未见子（木局见水）
  '亥': '子', '卯': '子', '未': '子',
  // 巳酉丑见午（金局见火）
  '巳': '午', '酉': '午', '丑': '午'
}

// 红鸾桃花映射表（基于生肖，主婚姻喜庆）
const RED_PHOENIX_MAP: Record<string, string> = {
  '子': '卯',  // 鼠→兔
  '丑': '寅',  // 牛→虎
  '寅': '丑',  // 虎→牛
  '卯': '子',  // 兔→鼠
  '辰': '亥',  // 龙→猪
  '巳': '戌',  // 蛇→狗
  '午': '酉',  // 马→鸡
  '未': '申',  // 羊→猴
  '申': '未',  // 猴→羊
  '酉': '午',  // 鸡→马
  '戌': '巳',  // 狗→蛇
  '亥': '辰'   // 猪→龙
}

// 天喜桃花映射表（红鸾的对冲，主喜庆吉利）
const HEAVENLY_JOY_MAP: Record<string, string> = {
  '子': '酉',  // 鼠→鸡
  '丑': '申',  // 牛→猴
  '寅': '未',  // 虎→羊
  '卯': '午',  // 兔→马
  '辰': '巳',  // 龙→蛇
  '巳': '辰',  // 蛇→龙
  '午': '卯',  // 马→兔
  '未': '寅',  // 羊→虎
  '申': '丑',  // 猴→牛
  '酉': '子',  // 鸡→鼠
  '戌': '亥',  // 狗→猪
  '亥': '戌'   // 猪→狗
}

// 沐浴桃花映射表（基于天干，主多情善感）
const BATH_PEACH_MAP: Record<string, string> = {
  '甲': '子',  // 甲木→子水
  '乙': '巳',  // 乙木→巳火
  '丙': '卯',  // 丙火→卯木
  '丁': '申',  // 丁火→申金
  '戊': '卯',  // 戊土→卯木
  '己': '申',  // 己土→申金
  '庚': '午',  // 庚金→午火
  '辛': '亥',  // 辛金→亥水
  '壬': '酉',  // 壬水→酉金
  '癸': '寅'   // 癸水→寅木
}

// 红艳桃花映射表（基于天干，主激情浪漫）
const RED_ROMANCE_MAP: Record<string, string> = {
  '甲': '午',  // 甲木→午火
  '乙': '申',  // 乙木→申金
  '丙': '寅',  // 丙火→寅木
  '丁': '未',  // 丁火→未土
  '戊': '辰',  // 戊土→辰土
  '己': '辰',  // 己土→辰土
  '庚': '戌',  // 庚金→戌土
  '辛': '酉',  // 辛金→酉金
  '壬': '子',  // 壬水→子水
  '癸': '申'   // 癸水→申金
}

// 扩展的桃花强度权重系统
const PEACH_BLOSSOM_WEIGHTS = {
  // 柱位权重
  pillar: {
    year: 0.8,   // 年柱：影响祖辈、早年
    month: 1.2,  // 月柱：影响父母、青年
    day: 1.5,    // 日柱：影响本人、中年（最重要）
    hour: 1.0    // 时柱：影响子女、晚年
  },
  // 桃花类型权重
  type: {
    xianchi: 1.0,      // 咸池桃花：基础权重
    redPhoenix: 1.3,   // 红鸾桃花：正桃花，权重较高
    heavenlyJoy: 1.2,  // 天喜桃花：吉利桃花
    bath: 0.8,         // 沐浴桃花：多情桃花，权重较低
    redRomance: 0.9    // 红艳桃花：激情桃花
  }
}

// 桃花类型中文名称
const PEACH_BLOSSOM_TYPE_NAMES: Record<PeachBlossomType, string> = {
  xianchi: '咸池桃花',
  redPhoenix: '红鸾桃花',
  heavenlyJoy: '天喜桃花',
  bath: '沐浴桃花',
  redRomance: '红艳桃花'
}

/**
 * 查找八字中的所有桃花星
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
  
  // 获取四柱天干地支
  const pillars = {
    year: {
      stem: eightChar.getYear().getHeavenStem().getName(),
      branch: eightChar.getYear().getEarthBranch().getName()
    },
    month: {
      stem: eightChar.getMonth().getHeavenStem().getName(),
      branch: eightChar.getMonth().getEarthBranch().getName()
    },
    day: {
      stem: eightChar.getDay().getHeavenStem().getName(),
      branch: eightChar.getDay().getEarthBranch().getName()
    },
    hour: {
      stem: eightChar.getHour().getHeavenStem().getName(),
      branch: eightChar.getHour().getEarthBranch().getName()
    }
  }
  
  // 存储所有桃花位置
  const allPositions: PeachBlossomPosition[] = []
  
  // 按类型分组的桃花星
  const peachBlossomTypes = {
    xianchi: [] as PeachBlossomPosition[],
    redPhoenix: [] as PeachBlossomPosition[],
    heavenlyJoy: [] as PeachBlossomPosition[],
    bath: [] as PeachBlossomPosition[],
    redRomance: [] as PeachBlossomPosition[]
  }
  
  // 1. 查找咸池桃花（以年支和日支为基准）
  const baseBranches = [pillars.year.branch, pillars.day.branch]
  baseBranches.forEach(baseBranch => {
    const peachBlossomBranch = XIANCHI_PEACH_MAP[baseBranch]
    if (peachBlossomBranch) {
      Object.entries(pillars).forEach(([pillarName, pillarData]) => {
        if (pillarData.branch === peachBlossomBranch) {
          const position = createPeachBlossomPosition(
            pillarName as keyof typeof pillars,
            pillarData.branch,
            peachBlossomBranch,
            'xianchi',
            baseBranch
          )
          allPositions.push(position)
          peachBlossomTypes.xianchi.push(position)
        }
      })
    }
  })
  
  // 2. 查找红鸾桃花（以年支为基准）
  const redPhoenixBranch = RED_PHOENIX_MAP[pillars.year.branch]
  if (redPhoenixBranch) {
    Object.entries(pillars).forEach(([pillarName, pillarData]) => {
      if (pillarData.branch === redPhoenixBranch) {
        const position = createPeachBlossomPosition(
          pillarName as keyof typeof pillars,
          pillarData.branch,
          redPhoenixBranch,
          'redPhoenix'
        )
        allPositions.push(position)
        peachBlossomTypes.redPhoenix.push(position)
      }
    })
  }
  
  // 3. 查找天喜桃花（以年支为基准）
  const heavenlyJoyBranch = HEAVENLY_JOY_MAP[pillars.year.branch]
  if (heavenlyJoyBranch) {
    Object.entries(pillars).forEach(([pillarName, pillarData]) => {
      if (pillarData.branch === heavenlyJoyBranch) {
        const position = createPeachBlossomPosition(
          pillarName as keyof typeof pillars,
          pillarData.branch,
          heavenlyJoyBranch,
          'heavenlyJoy'
        )
        allPositions.push(position)
        peachBlossomTypes.heavenlyJoy.push(position)
      }
    })
  }
  
  // 4. 查找沐浴桃花（以日干为基准）
  const bathBranch = BATH_PEACH_MAP[pillars.day.stem]
  if (bathBranch) {
    Object.entries(pillars).forEach(([pillarName, pillarData]) => {
      if (pillarData.branch === bathBranch) {
        const position = createPeachBlossomPosition(
          pillarName as keyof typeof pillars,
          pillarData.branch,
          bathBranch,
          'bath'
        )
        allPositions.push(position)
        peachBlossomTypes.bath.push(position)
      }
    })
  }
  
  // 5. 查找红艳桃花（以日干为基准）
  const redRomanceBranch = RED_ROMANCE_MAP[pillars.day.stem]
  if (redRomanceBranch) {
    Object.entries(pillars).forEach(([pillarName, pillarData]) => {
      if (pillarData.branch === redRomanceBranch) {
        const position = createPeachBlossomPosition(
          pillarName as keyof typeof pillars,
          pillarData.branch,
          redRomanceBranch,
          'redRomance'
        )
        allPositions.push(position)
        peachBlossomTypes.redRomance.push(position)
      }
    })
  }
  
  // 去重处理（同一柱位可能有多种桃花）
  const uniquePositions = removeDuplicatePositions(allPositions)
  
  // 判断桃花类型（内外桃花）
  const insidePillars = uniquePositions.filter(p => p.pillar === 'year' || p.pillar === 'month')
  const outsidePillars = uniquePositions.filter(p => p.pillar === 'day' || p.pillar === 'hour')
  
  let type: PeachBlossomResult['type'] = 'none'
  if (insidePillars.length > 0 && outsidePillars.length > 0) {
    type = 'mixed'
  } else if (insidePillars.length > 0) {
    type = 'inside'
  } else if (outsidePillars.length > 0) {
    type = 'outside'
  }
  
  // 计算综合桃花强度
  const { strength, overallScore } = calculatePeachBlossomStrength(uniquePositions)
  
  // 生成分析和建议
  const analysis = generateEnhancedPeachBlossomAnalysis(uniquePositions, peachBlossomTypes, type, strength)
  const suggestions = generateEnhancedPeachBlossomSuggestions(type, strength, peachBlossomTypes)
  
  return {
    hasPeachBlossom: uniquePositions.length > 0,
    positions: uniquePositions,
    type,
    strength,
    analysis,
    suggestions,
    peachBlossomTypes,
    overallScore,
    eightChar: {
      year: pillars.year.branch,
      month: pillars.month.branch,
      day: pillars.day.branch,
      hour: pillars.hour.branch,
      yearPillar: eightChar.getYear().toString(),
      monthPillar: eightChar.getMonth().toString(),
      dayPillar: eightChar.getDay().toString(),
      hourPillar: eightChar.getHour().toString()
    }
  }
}

/**
 * 创建桃花位置信息
 */
function createPeachBlossomPosition(
  pillar: 'year' | 'month' | 'day' | 'hour',
  branch: string,
  peachBlossomBranch: string,
  type: PeachBlossomType,
  baseBranch?: string
): PeachBlossomPosition {
  const pillarWeight = PEACH_BLOSSOM_WEIGHTS.pillar[pillar]
  const typeWeight = PEACH_BLOSSOM_WEIGHTS.type[type]
  const strength = pillarWeight * typeWeight
  
  return {
    pillar,
    pillarName: pillar === 'year' ? '年柱' : 
               pillar === 'month' ? '月柱' :
               pillar === 'day' ? '日柱' : '时柱',
    branch,
    peachBlossomBranch,
    meaning: getPeachBlossomMeaning(pillar, type),
    type,
    typeName: PEACH_BLOSSOM_TYPE_NAMES[type],
    strength
  }
}

/**
 * 去重处理桃花位置
 */
function removeDuplicatePositions(positions: PeachBlossomPosition[]): PeachBlossomPosition[] {
  const positionMap = new Map<string, PeachBlossomPosition>()
  
  positions.forEach(position => {
    const key = `${position.pillar}-${position.branch}`
    const existing = positionMap.get(key)
    
    if (!existing || position.strength > existing.strength) {
      // 如果是新位置或者当前桃花星强度更高，则替换
      positionMap.set(key, position)
    }
  })
  
  return Array.from(positionMap.values())
}

/**
 * 计算桃花强度
 */
function calculatePeachBlossomStrength(positions: PeachBlossomPosition[]): {
  strength: 'strong' | 'medium' | 'weak'
  overallScore: number
} {
  if (positions.length === 0) {
    return { strength: 'weak', overallScore: 0 }
  }
  
  // 计算总强度值
  const totalStrength = positions.reduce((sum, pos) => sum + pos.strength, 0)
  
  // 类型多样性奖励
  const typeSet = new Set(positions.map(p => p.type))
  const diversityBonus = typeSet.size * 0.2
  
  // 特殊组合奖励
  let specialBonus = 0
  if (typeSet.has('redPhoenix') && typeSet.has('heavenlyJoy')) {
    specialBonus += 0.5 // 红鸾天喜同现
  }
  if (positions.some(p => p.pillar === 'day' && p.type === 'xianchi')) {
    specialBonus += 0.3 // 日柱咸池
  }
  
  const finalScore = Math.min(10, totalStrength + diversityBonus + specialBonus)
  
  let strength: 'strong' | 'medium' | 'weak' = 'weak'
  if (finalScore >= 4.0) strength = 'strong'
  else if (finalScore >= 2.5) strength = 'medium'
  
  return {
    strength,
    overallScore: Math.round(finalScore * 10) / 10
  }
}

/**
 * 获取桃花含义
 */
function getPeachBlossomMeaning(pillar: string, type: PeachBlossomType): string {
  const pillarMeanings = {
    year: '早年',
    month: '青年',
    day: '中年',
    hour: '晚年'
  }
  
  const typeMeanings = {
    xianchi: '异性缘佳，魅力突出',
    redPhoenix: '婚姻运佳，感情顺利',
    heavenlyJoy: '喜庆连连，感情甜蜜',
    bath: '多情善感，异性缘好',
    redRomance: '激情浪漫，魅力十足'
  }
  
  return `${pillarMeanings[pillar as keyof typeof pillarMeanings]}${typeMeanings[type]}，${getDetailedMeaning(pillar, type)}`
}

/**
 * 获取详细含义
 */
function getDetailedMeaning(pillar: string, type: PeachBlossomType): string {
  if (type === 'redPhoenix') {
    return pillar === 'year' ? '早婚之兆，感情启蒙早' :
           pillar === 'month' ? '青年时期感情丰富，容易遇到正缘' :
           pillar === 'day' ? '婚姻美满，配偶条件好' : '子女缘佳，晚年感情和睦'
  } else if (type === 'heavenlyJoy') {
    return pillar === 'year' ? '家庭和睦，早年感情顺利' :
           pillar === 'month' ? '人缘极佳，容易得到帮助' :
           pillar === 'day' ? '夫妻恩爱，感情稳定' : '晚年幸福，子女孝顺'
  } else if (type === 'bath') {
    return '善于处理异性关系，但需注意感情专一'
  } else if (type === 'redRomance') {
    return '感情激烈，容易有浪漫际遇，但需理性对待'
  } else {
    return '感情运势平稳'
  }
}

/**
 * 生成增强的桃花分析
 */
function generateEnhancedPeachBlossomAnalysis(
  positions: PeachBlossomPosition[],
  peachBlossomTypes: PeachBlossomResult['peachBlossomTypes'],
  type: PeachBlossomResult['type'], 
  strength: PeachBlossomResult['strength']
): string {
  if (positions.length === 0) {
    return '您的八字中未见明显的桃花星，但这并不意味着感情运势欠佳。只是在感情方面相对内敛含蓄，需要更多主动出击和积极表达才能收获理想的爱情。建议多参与社交活动，主动表达自己的感情想法。'
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
  
  // 分析不同类型的桃花星
  const typeAnalysis: string[] = []
  
  if (peachBlossomTypes.redPhoenix.length > 0) {
    typeAnalysis.push('红鸾星照命，主婚姻喜庆，感情发展顺利，容易遇到正缘')
  }
  
  if (peachBlossomTypes.heavenlyJoy.length > 0) {
    typeAnalysis.push('天喜星加持，喜庆连连，感情甜蜜，人际关系和谐')
  }
  
  if (peachBlossomTypes.xianchi.length > 0) {
    typeAnalysis.push('咸池桃花出现，异性缘佳，魅力突出，感情生活丰富')
  }
  
  if (peachBlossomTypes.bath.length > 0) {
    typeAnalysis.push('沐浴桃花显现，多情善感，善于处理异性关系，但需注意感情专一')
  }
  
  if (peachBlossomTypes.redRomance.length > 0) {
    typeAnalysis.push('红艳桃花入命，感情激烈浪漫，容易有浪漫际遇，魅力十足')
  }
  
  if (typeAnalysis.length > 0) {
    analysis += `\n\n从桃花星类型来看：${typeAnalysis.join('；')}。`
  }
  
  // 特殊组合分析
  if (peachBlossomTypes.redPhoenix.length > 0 && peachBlossomTypes.heavenlyJoy.length > 0) {
    analysis += '\n\n红鸾天喜双星照临，这是极佳的婚姻组合，预示着感情顺遂，婚姻美满，容易遇到理想伴侣。'
  }
  
  if (positions.length > 0) {
    const pillarInfo = positions.map(p => `${p.pillarName}有${p.typeName}`).join('，')
    analysis += `\n\n具体来看，${pillarInfo}，这些桃花星的出现表明您在相应的人生阶段会有较好的感情运势。`
  }
  
  return analysis
}

/**
 * 生成增强的桃花建议
 */
function generateEnhancedPeachBlossomSuggestions(
  type: PeachBlossomResult['type'],
  strength: PeachBlossomResult['strength'],
  peachBlossomTypes: PeachBlossomResult['peachBlossomTypes']
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
  
  // 根据具体桃花星类型给出专业建议
  if (peachBlossomTypes.redPhoenix.length > 0) {
    suggestions.push('红鸾星现，主婚姻喜庆：适合在传统节庆期间表白或举办婚礼，选择穿着红色服饰增强桃花运')
    suggestions.push('红鸾桃花利正缘：重点关注品德良好、家庭背景相当的对象，避免只看外表')
  }
  
  if (peachBlossomTypes.heavenlyJoy.length > 0) {
    suggestions.push('天喜星照：多参加喜庆活动如婚礼、满月酒等场合，容易在这些场合遇到良缘')
    suggestions.push('保持开朗乐观的心态，您的正能量会吸引同样积极的伴侣')
  }
  
  if (peachBlossomTypes.xianchi.length > 0) {
    suggestions.push('咸池桃花旺盛：注意在水边场所（如咖啡厅、茶室、游泳池）容易遇到心仪对象')
    suggestions.push('提升个人魅力和气质，但要避免过于张扬，保持神秘感更能吸引异性')
  }
  
  if (peachBlossomTypes.bath.length > 0) {
    suggestions.push('沐浴桃花多情：善用您的同理心和善解人意的特质，但要建立明确的感情边界')
    suggestions.push('避免同时与多人暧昧，专注经营一段认真的感情更容易获得幸福')
  }
  
  if (peachBlossomTypes.redRomance.length > 0) {
    suggestions.push('红艳桃花激情：感情来得快去得也快，要学会在激情中保持理智判断')
    suggestions.push('适合追求浪漫的恋爱体验，但要注意识别真心与虚情，避免被欺骗感情')
  }
  
  // 特殊组合建议
  if (peachBlossomTypes.redPhoenix.length > 0 && peachBlossomTypes.heavenlyJoy.length > 0) {
    suggestions.push('红鸾天喜双现：极佳的婚姻组合，适合在今年内考虑订婚或结婚，时机成熟')
  }
  
  // 通用建议
  suggestions.push('保持真诚的心态，用真心对待每一段感情，真爱需要时间沉淀')
  suggestions.push('注重个人成长和内在修养，成为更好的自己才能吸引更好的人')
  suggestions.push('相信缘分但不依赖缘分，主动创造机会但不强求结果')
  
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
 * 计算八字桃花评分（增强版，考虑多种桃花类型）
 */
function calculateEightCharScore(peachBlossom: PeachBlossomResult): number {
  if (!peachBlossom.hasPeachBlossom) return 2.0
  
  // 使用新的综合评分系统
  let baseScore = Math.min(5.0, 2.0 + peachBlossom.overallScore * 0.3)
  
  // 桃花类型多样性奖励
  const typeCount = Object.values(peachBlossom.peachBlossomTypes).filter(arr => arr.length > 0).length
  const diversityBonus = Math.min(typeCount * 0.15, 0.6)
  
  // 特殊桃花星奖励
  let specialBonus = 0
  if (peachBlossom.peachBlossomTypes.redPhoenix.length > 0) {
    specialBonus += 0.3 // 红鸾桃花最吉利
  }
  if (peachBlossom.peachBlossomTypes.heavenlyJoy.length > 0) {
    specialBonus += 0.2 // 天喜桃花吉利
  }
  if (peachBlossom.peachBlossomTypes.redPhoenix.length > 0 && 
      peachBlossom.peachBlossomTypes.heavenlyJoy.length > 0) {
    specialBonus += 0.3 // 红鸾天喜双现大吉
  }
  
  // 根据传统桃花内外类型调整
  let typeBonus = 0
  switch (peachBlossom.type) {
    case 'mixed':   // 内外桃花，最好
      typeBonus = 0.2
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
  
  // 日柱桃花特别奖励
  const hasDayPillarPeach = peachBlossom.positions.some(p => p.pillar === 'day')
  const dayPillarBonus = hasDayPillarPeach ? 0.2 : 0
  
  const finalScore = Math.max(1, Math.min(5, baseScore + diversityBonus + specialBonus + typeBonus + dayPillarBonus))
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