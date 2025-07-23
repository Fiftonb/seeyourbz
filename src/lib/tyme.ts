import { 
  SolarDay, 
  LunarDay, 
  LunarHour, 
  SolarTerm, 
  LunarYear, 
  LunarMonth,
  SolarTime,
  EightChar,
  ChildLimit,
  DecadeFortune,
  Fortune,
  HeavenStem,
  EarthBranch,
  SixtyCycle,
  TenStar,
  Terrain,
  Sound,
  HideHeavenStem,
  NineStar,
  TwelveStar,
  Duty,
  God,
  Taboo,
  Gender
} from 'tyme4ts'

// 基础日历信息接口
export interface CalendarInfo {
  // 基础信息
  solarDate: string
  lunarDate: string
  weekDay: string
  
  // 节气信息
  term: string | null
  
  // 干支信息
  zodiac: string
  yearGanzhi: string
  monthGanzhi: string
  dayGanzhi: string
  hourGanzhi: string
  
  // 星座信息
  constellation: string
  
  // 详细农历信息
  lunarYear: number
  lunarMonth: number
  lunarDay: number
  isLeapMonth: boolean
  monthDays: number
  
  // 其他信息
  season: string
  seasonIndex: number
  nineStar: string
  phase: string
  festival: string | null
}

// 详细的农历信息接口
export interface LunarDetailInfo {
  year: number
  month: number
  day: number
  isLeapMonth: boolean
  monthDays: number
  yearDays: number
  yearName: string
  monthName: string
  dayName: string
  season: string
  nineStar: string
  phase: string
  festival: string | null
}

// 时辰信息接口
export interface HourInfo {
  hourGanzhi: string
  hourName: string
  hourRange: string
  hourIndex: number
  description: string
}

// 节气信息接口
export interface SolarTermInfo {
  name: string
  date: string
  julianDay: number
  index: number
  description: string
}

// 八字信息接口
export interface EightCharInfo {
  year: string
  month: string
  day: string
  hour: string
  fetalOrigin: string
  fetalBreath: string
  ownSign: string
  bodySign: string
}

// 童限信息接口
export interface ChildLimitInfo {
  // 基础信息
  startTime: string
  endTime: string
  gender: string
  isForward: boolean
  
  // 起运时间
  yearCount: number
  monthCount: number
  dayCount: number
  hourCount: number
  minuteCount: number
  
  // 八字信息
  eightChar: EightCharInfo
}

// 大运信息接口
export interface DecadeFortuneInfo {
  // 大运干支
  sixtyCycle: string
  
  // 年龄范围
  startAge: number
  endAge: number
  
  // 年份范围
  startYear: number
  endYear: number
  
  // 运势描述
  description: string
}

// 小运(流年)信息接口
export interface FortuneInfo {
  // 小运干支
  sixtyCycle: string
  
  // 年龄
  age: number
  
  // 年份
  year: number
  
  // 运势描述
  description: string
}

// 十神分析接口
export interface TenStarAnalysis {
  // 日元
  dayMaster: string
  
  // 各柱十神
  yearTenStar: string
  monthTenStar: string
  dayTenStar: string
  hourTenStar: string
  
  // 十神统计
  tenStarCount: { [key: string]: number }
  
  // 十神强弱分析
  strongTenStars: string[]
  weakTenStars: string[]
}

// 藏干信息接口
export interface HideHeavenStemInfo {
  earthBranch: string
  hideStems: Array<{
    stem: string
    type: string // 本气、中气、余气
    tenStar: string // 对应十神
  }>
}

// 长生十二神信息接口
export interface TerrainInfo {
  name: string
  description: string
  fortune: 'good' | 'bad' | 'neutral'
}

// 纳音信息接口
export interface SoundInfo {
  name: string
  element: string
  description: string
}

// 空亡信息接口
export interface EmptyBranchInfo {
  ten: string // 所属旬
  emptyBranches: string[] // 空亡地支
  description: string
}

// 神煞信息接口
export interface GodInfo {
  name: string
  luck: string // 吉/凶
  description: string
}

// 完整八字排盘信息接口
export interface CompleteEightCharInfo {
  // 基础信息
  birthTime: string
  gender: string
  
  // 八字四柱
  eightChar: EightCharInfo
  
  // 童限起运
  childLimit: ChildLimitInfo
  
  // 大运列表 (10轮)
  decadeFortuneList: DecadeFortuneInfo[]
  
  // 小运列表 (当前大运的10年)
  fortuneList: FortuneInfo[]
  
  // 十神分析
  tenStarAnalysis: TenStarAnalysis
  
  // 五行分析
  elementAnalysis: {
    year: string
    month: string
    day: string
    hour: string
  }
  
  // 藏干分析
  hideHeavenStemAnalysis: HideHeavenStemInfo[]
  
  // 长生十二神
  terrainAnalysis: {
    year: TerrainInfo
    month: TerrainInfo
    day: TerrainInfo
    hour: TerrainInfo
  }
  
  // 纳音
  soundAnalysis: {
    year: SoundInfo
    month: SoundInfo
    day: SoundInfo
    hour: SoundInfo
  }
  
  // 空亡
  emptyBranchAnalysis: {
    year: EmptyBranchInfo
    month: EmptyBranchInfo
    day: EmptyBranchInfo
    hour: EmptyBranchInfo
  }
  
  // 神煞
  godAnalysis: {
    goodGods: GodInfo[]
    badGods: GodInfo[]
  }
  
  // 宜忌
  tabooAnalysis: {
    recommends: string[]
    avoids: string[]
  }
}

/**
 * 获取指定日期的日历信息
 * @param date - 日期对象
 * @returns 日历信息
 */
export function getCalendarInfo(date: Date): CalendarInfo {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  // 获取时辰信息
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  // 获取八字信息
  const eightChar = lunarHour.getEightChar()
  
  // 获取干支信息
  const yearGanzhi = eightChar.getYear().toString()
  const monthGanzhi = eightChar.getMonth().toString()
  const dayGanzhi = eightChar.getDay().toString()
  const hourGanzhi = eightChar.getHour().toString()
  
  // 获取生肖 - 从年柱地支获取
  const zodiac = eightChar.getYear().getEarthBranch().getZodiac().getName()
  
  // 获取节气信息
  const term = solarDay.getTerm()
  
  // 获取星座信息
  const constellation = solarDay.getConstellation().getName()
  
  // 获取九星信息
  const nineStar = lunarDay.getNineStar().getName()
  
  // 获取月相信息
  const phase = lunarDay.getPhase().getName()
  
  // 获取传统节日
  const festival = lunarDay.getFestival()
  
  // 获取季节信息
  const month = date.getMonth() + 1
  const seasonNames = ['春', '夏', '秋', '冬']
  const seasonIndex = Math.floor((month % 12) / 3)
  const season = seasonNames[seasonIndex]
  
  return {
    solarDate: solarDay.toString(),
    lunarDate: lunarDay.toString(),
    weekDay: solarDay.getWeek().getName(),
    term: term ? term.getName() : null,
    zodiac,
    yearGanzhi,
    monthGanzhi,
    dayGanzhi,
    hourGanzhi,
    constellation,
    lunarYear: lunarYear.getYear(),
    lunarMonth: lunarMonth.getMonth(),
    lunarDay: lunarDay.getDay(),
    isLeapMonth: lunarMonth.isLeap(),
    monthDays: lunarMonth.getDayCount(),
    season,
    seasonIndex,
    nineStar,
    phase,
    festival: festival ? festival.getName() : null
  }
}

/**
 * 获取指定日期的详细农历信息
 * @param date - 日期对象
 * @returns 详细农历信息
 */
export function getLunarDetailInfo(date: Date): LunarDetailInfo {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  return {
    year: lunarYear.getYear(),
    month: lunarMonth.getMonth(),
    day: lunarDay.getDay(),
    isLeapMonth: lunarMonth.isLeap(),
    monthDays: lunarMonth.getDayCount(),
    yearDays: lunarYear.getDayCount(),
    yearName: lunarYear.getName(),
    monthName: lunarMonth.getName(),
    dayName: lunarDay.getName(),
    season: lunarMonth.getSeason().getName(),
    nineStar: lunarDay.getNineStar().getName(),
    phase: lunarDay.getPhase().getName(),
    festival: lunarDay.getFestival() ? lunarDay.getFestival()!.getName() : null
  }
}

/**
 * 获取指定日期和时间的时辰信息
 * @param date - 日期对象
 * @returns 时辰信息
 */
export function getHourInfo(date: Date): HourInfo {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const hourGanzhi = lunarHour.getSixtyCycle().toString()
  const hourIndex = lunarHour.getIndexInDay()
  
  // 时辰名称和时间范围
  const hourNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const hourRanges = [
    '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00',
    '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00',
    '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
  ]
  
  const hourDescriptions = [
    '夜半，又名子夜、中夜', '鸡鸣，又名荒鸡', '平旦，又名黎明、早晨、日旦', '日出，又名日始、破晓、旭日',
    '食时，又名早食', '隅中，又名日禺等', '日中，又名日正、中午', '日昳，又名日跌、日央',
    '晡时，又名日晡、夕食', '日入，又名日落、日沉、傍晚', '黄昏，又名日夕、日暮、日晚', '人定，又名定昏'
  ]
  
  return {
    hourGanzhi,
    hourName: hourNames[hourIndex],
    hourRange: hourRanges[hourIndex],
    hourIndex,
    description: hourDescriptions[hourIndex]
  }
}

/**
 * 获取指定年份的全年节气信息
 * @param year - 年份
 * @returns 节气信息数组
 */
export function getSolarTermsForYear(year: number): SolarTermInfo[] {
  const terms: SolarTermInfo[] = []
  
  for (let i = 0; i < 24; i++) {
    const term = SolarTerm.fromIndex(year, i)
    const julianDay = term.getJulianDay()
    const solarDay = julianDay.getSolarDay()
    
    terms.push({
      name: term.getName(),
      date: solarDay.toString(),
      julianDay: julianDay.getDay(),
      index: i,
      description: `第${i + 1}个节气`
    })
  }
  
  return terms
}

/**
 * 获取指定日期的八字信息
 * @param date - 日期对象
 * @returns 八字信息
 */
export function getEightCharInfo(date: Date): EightCharInfo {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const eightChar = lunarHour.getEightChar()
  
  return {
    year: eightChar.getYear().toString(),
    month: eightChar.getMonth().toString(),
    day: eightChar.getDay().toString(),
    hour: eightChar.getHour().toString(),
    fetalOrigin: eightChar.getFetalOrigin().toString(),
    fetalBreath: eightChar.getFetalBreath().toString(),
    ownSign: eightChar.getOwnSign().toString(),
    bodySign: eightChar.getBodySign().toString()
  }
}

/**
 * 检查指定日期是否为节气日
 * @param date - 日期对象
 * @returns 是否为节气日
 */
export function isSolarTermDay(date: Date): boolean {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const termDay = solarDay.getTermDay()
  return termDay.getDayIndex() === 0 // 第一天为节气日（索引从0开始）
}

/**
 * 获取指定日期后的下一个节气
 * @param date - 日期对象
 * @returns 下一个节气信息
 */
export function getNextSolarTerm(date: Date): SolarTermInfo | null {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const currentTerm = solarDay.getTerm()
  if (!currentTerm) return null
  
  const nextTerm = currentTerm.next(1)
  const nextJulianDay = nextTerm.getJulianDay()
  const nextSolarDay = nextJulianDay.getSolarDay()
  
  return {
    name: nextTerm.getName(),
    date: nextSolarDay.toString(),
    julianDay: nextJulianDay.getDay(),
    index: nextTerm.getIndex(),
    description: `下一个节气`
  }
}

/**
 * 获取指定年月的月历信息
 * @param year - 年份
 * @param month - 月份 (1-12)
 * @returns 月历信息的二维数组
 */
export function getMonthCalendar(year: number, month: number): CalendarInfo[][] {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekDay = firstDay.getDay()
  
  const calendar: CalendarInfo[][] = []
  let week: CalendarInfo[] = []
  
  // 填充前面的空白日期
  for (let i = 0; i < startWeekDay; i++) {
    const prevDate = new Date(year, month - 1, -startWeekDay + i + 1)
    week.push(getCalendarInfo(prevDate))
  }
  
  // 填充当月日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    week.push(getCalendarInfo(date))
    
    if (week.length === 7) {
      calendar.push(week)
      week = []
    }
  }
  
  // 填充后面的空白日期
  let nextDay = 1
  while (week.length < 7) {
    const nextDate = new Date(year, month, nextDay)
    week.push(getCalendarInfo(nextDate))
    nextDay++
  }
  
  if (week.length > 0) {
    calendar.push(week)
  }
  
  return calendar
}

/**
 * 获取今日的详细信息
 * @returns 今日的详细信息
 */
export function getTodayInfo() {
  const today = new Date()
  return {
    calendarInfo: getCalendarInfo(today),
    lunarDetailInfo: getLunarDetailInfo(today),
    hourInfo: getHourInfo(today),
    eightCharInfo: getEightCharInfo(today),
    isSolarTermDay: isSolarTermDay(today),
    nextSolarTerm: getNextSolarTerm(today)
  }
}

// 导出便于使用的常量
export const HOUR_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
export const SEASON_NAMES = ['春', '夏', '秋', '冬']
export const ZODIAC_NAMES = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
export const CONSTELLATION_NAMES = ['白羊', '金牛', '双子', '巨蟹', '狮子', '处女', '天秤', '天蝎', '射手', '摩羯', '水瓶', '双鱼']

/**
 * 从农历日期创建公历日期
 * @param lunarYear - 农历年份
 * @param lunarMonth - 农历月份（正数为平月，负数为闰月）
 * @param lunarDay - 农历日期
 * @returns 对应的公历日期
 */
export function createSolarDateFromLunar(lunarYear: number, lunarMonth: number, lunarDay: number): Date {
  try {
    const lunarDate = LunarDay.fromYmd(lunarYear, lunarMonth, lunarDay)
    const solarDay = lunarDate.getSolarDay()
    return new Date(solarDay.getYear(), solarDay.getMonth() - 1, solarDay.getDay())
  } catch (error) {
    console.error('无效的农历日期:', { lunarYear, lunarMonth, lunarDay }, error)
    return new Date()
  }
}

/**
 * 获取指定农历年份的所有月份信息
 * @param lunarYear - 农历年份
 * @returns 月份信息数组
 */
export function getLunarMonthsInYear(lunarYear: number): Array<{
  month: number
  isLeap: boolean
  name: string
  days: number
}> {
  try {
    const year = LunarYear.fromYear(lunarYear)
    const months = year.getMonths()
    const result = []
    
    for (const month of months) {
      result.push({
        month: Math.abs(month.getMonth()),
        isLeap: month.isLeap(),
        name: month.getName(),
        days: month.getDayCount()
      })
    }
    
    return result
  } catch (error) {
    console.error('获取农历年份月份失败:', lunarYear, error)
    return []
  }
}

/**
 * 获取指定农历月份的天数
 * @param lunarYear - 农历年份
 * @param lunarMonth - 农历月份（正数为平月，负数为闰月）
 * @returns 该月的天数
 */
export function getLunarMonthDays(lunarYear: number, lunarMonth: number): number {
  try {
    const month = LunarMonth.fromYm(lunarYear, lunarMonth)
    return month.getDayCount()
  } catch (error) {
    console.error('获取农历月份天数失败:', { lunarYear, lunarMonth }, error)
    return 30
  }
}

/**
 * 验证农历日期是否有效
 * @param lunarYear - 农历年份
 * @param lunarMonth - 农历月份（正数为平月，负数为闰月）
 * @param lunarDay - 农历日期
 * @returns 是否有效
 */
export function isValidLunarDate(lunarYear: number, lunarMonth: number, lunarDay: number): boolean {
  try {
    LunarDay.fromYmd(lunarYear, lunarMonth, lunarDay)
    return true
  } catch (error) {
    return false
  }
}

/**
 * 获取童限起运信息
 * @param birthTime - 出生时间
 * @param gender - 性别 ('MAN' | 'WOMAN')
 * @returns 童限信息
 */
export function getChildLimitInfo(birthTime: Date, gender: 'MAN' | 'WOMAN'): ChildLimitInfo {
  const solarTime = SolarTime.fromYmdHms(
    birthTime.getFullYear(),
    birthTime.getMonth() + 1,
    birthTime.getDate(),
    birthTime.getHours(),
    birthTime.getMinutes(),
    birthTime.getSeconds()
  )
  
  const genderEnum = gender === 'MAN' ? Gender.MAN : Gender.WOMAN
  const childLimit = ChildLimit.fromSolarTime(solarTime, genderEnum)
  
  return {
    startTime: childLimit.getStartTime().toString(),
    endTime: childLimit.getEndTime().toString(),
    gender: gender,
    isForward: childLimit.isForward(),
    yearCount: childLimit.getYearCount(),
    monthCount: childLimit.getMonthCount(),
    dayCount: childLimit.getDayCount(),
    hourCount: childLimit.getHourCount(),
    minuteCount: childLimit.getMinuteCount(),
    eightChar: {
      year: childLimit.getEightChar().getYear().toString(),
      month: childLimit.getEightChar().getMonth().toString(),
      day: childLimit.getEightChar().getDay().toString(),
      hour: childLimit.getEightChar().getHour().toString(),
      fetalOrigin: childLimit.getEightChar().getFetalOrigin().toString(),
      fetalBreath: childLimit.getEightChar().getFetalBreath().toString(),
      ownSign: childLimit.getEightChar().getOwnSign().toString(),
      bodySign: childLimit.getEightChar().getBodySign().toString()
    }
  }
}

/**
 * 获取大运信息列表
 * @param birthTime - 出生时间
 * @param gender - 性别
 * @param count - 获取大运的数量，默认10轮
 * @returns 大运信息列表
 */
export function getDecadeFortuneList(birthTime: Date, gender: 'MAN' | 'WOMAN', count: number = 10): DecadeFortuneInfo[] {
  const solarTime = SolarTime.fromYmdHms(
    birthTime.getFullYear(),
    birthTime.getMonth() + 1,
    birthTime.getDate(),
    birthTime.getHours(),
    birthTime.getMinutes(),
    birthTime.getSeconds()
  )
  
  const genderEnum = gender === 'MAN' ? Gender.MAN : Gender.WOMAN
  const childLimit = ChildLimit.fromSolarTime(solarTime, genderEnum)
  
  const decadeFortuneList: DecadeFortuneInfo[] = []
  let decadeFortune = childLimit.getStartDecadeFortune()
  
  for (let i = 0; i < count; i++) {
    const startYear = decadeFortune.getStartSixtyCycleYear().getSixtyCycle().toString()
    const endYear = decadeFortune.getEndSixtyCycleYear().getSixtyCycle().toString()
    
    decadeFortuneList.push({
      sixtyCycle: decadeFortune.getSixtyCycle().toString(),
      startAge: decadeFortune.getStartAge(),
      endAge: decadeFortune.getEndAge(),
      startYear: decadeFortune.getStartSixtyCycleYear().getYear(),
      endYear: decadeFortune.getEndSixtyCycleYear().getYear(),
      description: `${decadeFortune.getStartAge()}岁-${decadeFortune.getEndAge()}岁 ${decadeFortune.getSixtyCycle().toString()}运`
    })
    
    decadeFortune = decadeFortune.next(1)
  }
  
  return decadeFortuneList
}

/**
 * 获取小运(流年)信息列表
 * @param birthTime - 出生时间
 * @param gender - 性别
 * @param count - 获取小运的数量，默认10年
 * @returns 小运信息列表
 */
export function getFortuneList(birthTime: Date, gender: 'MAN' | 'WOMAN', count: number = 10): FortuneInfo[] {
  const solarTime = SolarTime.fromYmdHms(
    birthTime.getFullYear(),
    birthTime.getMonth() + 1,
    birthTime.getDate(),
    birthTime.getHours(),
    birthTime.getMinutes(),
    birthTime.getSeconds()
  )
  
  const genderEnum = gender === 'MAN' ? Gender.MAN : Gender.WOMAN
  const childLimit = ChildLimit.fromSolarTime(solarTime, genderEnum)
  
  const fortuneList: FortuneInfo[] = []
  let fortune = childLimit.getStartFortune()
  
  for (let i = 0; i < count; i++) {
    fortuneList.push({
      sixtyCycle: fortune.getSixtyCycle().toString(),
      age: fortune.getAge(),
      year: fortune.getSixtyCycleYear().getYear(),
      description: `${fortune.getAge()}岁 ${fortune.getSixtyCycle().toString()}年`
    })
    
    fortune = fortune.next(1)
  }
  
  return fortuneList
}

/**
 * 获取十神分析
 * @param date - 日期
 * @returns 十神分析
 */
export function getTenStarAnalysis(date: Date): TenStarAnalysis {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const eightChar = lunarHour.getEightChar()
  
  // 日元(日主)
  const dayMaster = eightChar.getDay().getHeavenStem()
  
  // 计算各柱十神 - 日柱显示为"日主"
  const yearTenStar = dayMaster.getTenStar(eightChar.getYear().getHeavenStem()).getName()
  const monthTenStar = dayMaster.getTenStar(eightChar.getMonth().getHeavenStem()).getName()
  const dayTenStar = '日主' // 日柱固定显示为日主
  const hourTenStar = dayMaster.getTenStar(eightChar.getHour().getHeavenStem()).getName()
  
  // 统计十神数量 - 不包括日主
  const tenStarCount: { [key: string]: number } = {}
  const tenStars = [yearTenStar, monthTenStar, hourTenStar] // 排除日主
  
  tenStars.forEach(star => {
    tenStarCount[star] = (tenStarCount[star] || 0) + 1
  })
  
  // 分析强弱 (简单规则：出现2次以上为强)
  const strongTenStars: string[] = []
  const weakTenStars: string[] = []
  
  Object.entries(tenStarCount).forEach(([star, count]) => {
    if (count >= 2) {
      strongTenStars.push(star)
    } else {
      weakTenStars.push(star)
    }
  })
  
  return {
    dayMaster: dayMaster.getName(),
    yearTenStar,
    monthTenStar,
    dayTenStar,
    hourTenStar,
    tenStarCount,
    strongTenStars,
    weakTenStars
  }
}

/**
 * 获取五行分析
 * @param date - 日期
 * @returns 五行分析 - 格式：天干五行+地支五行+柱名
 */
export function getElementAnalysis(date: Date) {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const eightChar = lunarHour.getEightChar()
  
  // 获取各柱的天干地支五行
  const yearHeavenElement = eightChar.getYear().getHeavenStem().getElement().getName()
  const yearEarthElement = eightChar.getYear().getEarthBranch().getElement().getName()
  const monthHeavenElement = eightChar.getMonth().getHeavenStem().getElement().getName()
  const monthEarthElement = eightChar.getMonth().getEarthBranch().getElement().getName()
  const dayHeavenElement = eightChar.getDay().getHeavenStem().getElement().getName()
  const dayEarthElement = eightChar.getDay().getEarthBranch().getElement().getName()
  const hourHeavenElement = eightChar.getHour().getHeavenStem().getElement().getName()
  const hourEarthElement = eightChar.getHour().getEarthBranch().getElement().getName()
  
  return {
    year: `${yearHeavenElement}${yearEarthElement}年`,
    month: `${monthHeavenElement}${monthEarthElement}月`,
    day: `${dayHeavenElement}${dayEarthElement}日`,
    hour: `${hourHeavenElement}${hourEarthElement}时`
  }
}

/**
 * 获取藏干分析
 * @param date - 日期
 * @returns 藏干分析
 */
export function getHideHeavenStemAnalysis(date: Date): HideHeavenStemInfo[] {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const eightChar = lunarHour.getEightChar()
  const dayMaster = eightChar.getDay().getHeavenStem()
  
  const result: HideHeavenStemInfo[] = []
  const earthBranches = [
    eightChar.getYear().getEarthBranch(),
    eightChar.getMonth().getEarthBranch(), 
    eightChar.getDay().getEarthBranch(),
    eightChar.getHour().getEarthBranch()
  ]
  
  earthBranches.forEach(earthBranch => {
    const hideStems = earthBranch.getHideHeavenStems()
    const hideInfo: HideHeavenStemInfo = {
      earthBranch: earthBranch.getName(),
      hideStems: []
    }
    
    hideStems.forEach(hideStem => {
      const stem = hideStem.getHeavenStem()
      const tenStar = dayMaster.getTenStar(stem).getName()
      
      // 根据藏干类型映射到中文
      const typeStr = hideStem.getType().toString()
      let type = '余气'
      if (typeStr.includes('MAIN')) type = '本气'
      else if (typeStr.includes('MIDDLE')) type = '中气'
      else if (typeStr.includes('RESIDUAL')) type = '余气'
      
      hideInfo.hideStems.push({
        stem: stem.getName(),
        type,
        tenStar
      })
    })
    
    result.push(hideInfo)
  })
  
  return result
}

/**
 * 获取长生十二神分析
 * @param date - 日期
 * @returns 长生十二神分析
 */
export function getTerrainAnalysis(date: Date) {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const eightChar = lunarHour.getEightChar()
  const dayMaster = eightChar.getDay().getHeavenStem()
  
  // 获取长生十二神的描述和吉凶
  const getTerrainInfo = (terrain: any): TerrainInfo => {
    const name = terrain.getName()
    const descriptions: { [key: string]: { desc: string, fortune: 'good' | 'bad' | 'neutral' } } = {
      '长生': { desc: '如人初生，充满生机', fortune: 'good' },
      '沐浴': { desc: '如人沐浴，易受外界影响', fortune: 'bad' },
      '冠带': { desc: '如人成年戴冠，开始担当', fortune: 'neutral' },
      '临官': { desc: '如人做官，有权威地位', fortune: 'good' },
      '帝旺': { desc: '如帝王般强盛，达到巅峰', fortune: 'good' },
      '衰': { desc: '如人年老体衰，力量减弱', fortune: 'bad' },
      '病': { desc: '如人生病，运势不佳', fortune: 'bad' },
      '死': { desc: '如人死亡，事物终结', fortune: 'bad' },
      '墓': { desc: '如人入墓，潜藏不显', fortune: 'neutral' },
      '绝': { desc: '如断绝，完全消失', fortune: 'bad' },
      '胎': { desc: '如受孕，新的开始', fortune: 'neutral' },
      '养': { desc: '如养育，逐渐成长', fortune: 'good' }
    }
    
    const info = descriptions[name] || { desc: '未知', fortune: 'neutral' as const }
    return {
      name,
      description: info.desc,
      fortune: info.fortune
    }
  }
  
  return {
    year: getTerrainInfo(dayMaster.getTerrain(eightChar.getYear().getEarthBranch())),
    month: getTerrainInfo(dayMaster.getTerrain(eightChar.getMonth().getEarthBranch())),
    day: getTerrainInfo(dayMaster.getTerrain(eightChar.getDay().getEarthBranch())),
    hour: getTerrainInfo(dayMaster.getTerrain(eightChar.getHour().getEarthBranch()))
  }
}

/**
 * 获取纳音分析
 * @param date - 日期
 * @returns 纳音分析
 */
export function getSoundAnalysis(date: Date) {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const eightChar = lunarHour.getEightChar()
  
  const getSoundInfo = (sound: any): SoundInfo => {
    const name = sound.getName()
    // 修复：Sound对象可能没有getElement方法，直接使用name
    const element = name.includes('金') ? '金' : 
                   name.includes('木') ? '木' : 
                   name.includes('水') ? '水' : 
                   name.includes('火') ? '火' : 
                   name.includes('土') ? '土' : '未知'
    
    return {
      name,
      element,
      description: `${name}，五行属${element}`
    }
  }
  
  return {
    year: getSoundInfo(eightChar.getYear().getSound()),
    month: getSoundInfo(eightChar.getMonth().getSound()),
    day: getSoundInfo(eightChar.getDay().getSound()),
    hour: getSoundInfo(eightChar.getHour().getSound())
  }
}

/**
 * 获取空亡分析
 * @param date - 日期
 * @returns 空亡分析
 */
export function getEmptyBranchAnalysis(date: Date) {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const lunarHour = LunarHour.fromYmdHms(
    lunarYear.getYear(),
    lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
    lunarDay.getDay(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds()
  )
  
  const eightChar = lunarHour.getEightChar()
  
  const getEmptyBranchInfo = (sixtyCycle: any): EmptyBranchInfo => {
    const ten = sixtyCycle.getTen().getName()
    const emptyBranches = sixtyCycle.getExtraEarthBranches().map((branch: any) => branch.getName())
    
    return {
      ten,
      emptyBranches,
      description: `${ten}旬空亡：${emptyBranches.join('、')}`
    }
  }
  
  return {
    year: getEmptyBranchInfo(eightChar.getYear()),
    month: getEmptyBranchInfo(eightChar.getMonth()),
    day: getEmptyBranchInfo(eightChar.getDay()),
    hour: getEmptyBranchInfo(eightChar.getHour())
  }
}

/**
 * 获取神煞分析
 * @param date - 日期
 * @returns 神煞分析
 */
export function getGodAnalysis(date: Date) {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const gods = lunarDay.getGods()
  
  const goodGods: GodInfo[] = []
  const badGods: GodInfo[] = []
  
  gods.forEach(god => {
    const godInfo: GodInfo = {
      name: god.getName(),
      luck: god.getLuck().getName(),
      description: `${god.getName()} - ${god.getLuck().getName()}`
    }
    
    if (god.getLuck().getName() === '吉') {
      goodGods.push(godInfo)
    } else {
      badGods.push(godInfo)
    }
  })
  
  return {
    goodGods,
    badGods
  }
}

/**
 * 获取宜忌分析
 * @param date - 日期
 * @returns 宜忌分析
 */
export function getTabooAnalysis(date: Date) {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  
  const recommends = lunarDay.getRecommends().map(taboo => taboo.getName())
  const avoids = lunarDay.getAvoids().map(taboo => taboo.getName())
  
  return {
    recommends,
    avoids
  }
}

/**
 * 获取完整的八字排盘信息
 * @param birthTime - 出生时间
 * @param gender - 性别 ('MAN' | 'WOMAN')
 * @returns 完整八字排盘信息
 */
export function getCompleteEightCharInfo(birthTime: Date, gender: 'MAN' | 'WOMAN'): CompleteEightCharInfo {
  return {
    // 基础信息
    birthTime: birthTime.toString(),
    gender,
    
    // 八字四柱
    eightChar: getEightCharInfo(birthTime),
    
    // 童限起运
    childLimit: getChildLimitInfo(birthTime, gender),
    
    // 大运列表
    decadeFortuneList: getDecadeFortuneList(birthTime, gender, 10),
    
    // 小运列表
    fortuneList: getFortuneList(birthTime, gender, 10),
    
    // 十神分析
    tenStarAnalysis: getTenStarAnalysis(birthTime),
    
    // 五行分析
    elementAnalysis: getElementAnalysis(birthTime),
    
    // 藏干分析
    hideHeavenStemAnalysis: getHideHeavenStemAnalysis(birthTime),
    
    // 长生十二神
    terrainAnalysis: getTerrainAnalysis(birthTime),
    
    // 纳音
    soundAnalysis: getSoundAnalysis(birthTime),
    
    // 空亡
    emptyBranchAnalysis: getEmptyBranchAnalysis(birthTime),
    
    // 神煞
    godAnalysis: getGodAnalysis(birthTime),
    
    // 宜忌
    tabooAnalysis: getTabooAnalysis(birthTime)
  }
} 

// 黄历信息接口
export interface AlmanacInfo {
  // 基础日期信息
  solarDate: string
  lunarDate: string
  weekDay: string
  
  // 宜忌信息
  recommends: string[]  // 宜
  avoids: string[]      // 忌
  
  // 神煞信息
  goodGods: string[]    // 吉神宜趋
  badGods: string[]     // 凶神宜忌
  
  // 值神信息
  duty: string          // 值神
  
  // 建除十二神
  buildGod: string      // 建除
  
  // 九星信息
  nineStar: string      // 九星
  
  // 二十八宿
  star28: string        // 二十八宿
  
  // 胎神方位
  fetus: string         // 胎神
  
  // 冲煞信息
  clash: string         // 冲
  evil: string          // 煞
  
  // 彭祖百忌
  pengzu: string        // 彭祖百忌
  
  // 其他信息
  phase: string         // 月相
  season: string        // 季节
  festival: string | null // 传统节日
}

// 时辰宜忌信息接口
export interface HourTabooInfo {
  hour: string          // 时辰
  hourName: string      // 时辰名
  hourRange: string     // 时间范围
  recommends: string[]  // 时辰宜
  avoids: string[]      // 时辰忌
  description: string   // 描述
}

/**
 * 获取指定日期的完整黄历信息
 * @param date - 日期对象
 * @returns 黄历信息
 */
export function getAlmanacInfo(date: Date): AlmanacInfo {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  
  // 获取宜忌
  const recommends = lunarDay.getRecommends().map(taboo => taboo.getName())
  const avoids = lunarDay.getAvoids().map(taboo => taboo.getName())
  
  // 获取神煞
  const gods = lunarDay.getGods()
  const goodGods: string[] = []
  const badGods: string[] = []
  
  gods.forEach(god => {
    if (god.getLuck().getName() === '吉') {
      goodGods.push(god.getName())
    } else {
      badGods.push(god.getName())
    }
  })
  
  // 获取值神
  const duty = lunarDay.getDuty().getName()
  
  // 获取建除十二神 (通过值神获取)
  const buildGod = duty
  
  // 获取九星
  const nineStar = lunarDay.getNineStar().getName()
  
  // 获取二十八宿
  const star28 = lunarDay.getTwentyEightStar().getName()
  
  // 获取胎神
  const fetus = lunarDay.getFetusDay().getName()
  
  // 获取冲煞信息
  const dayGanzhi = lunarDay.getSixtyCycle()
  const clashBranch = dayGanzhi.getEarthBranch().getOpposite()
  const clash = `冲${clashBranch.getZodiac().getName()}(${clashBranch.getName()})`
  
  // 获取煞向 (简化处理)
  const evilDirection = dayGanzhi.getEarthBranch().getDirection().getName()
  const evil = `${evilDirection}煞`
  
  // 获取彭祖百忌
  const pengZu = dayGanzhi.getPengZu()
  const pengzuHeaven = pengZu.getPengZuHeavenStem().getName()
  const pengzuEarth = pengZu.getPengZuEarthBranch().getName()
  const pengzu = `${pengzuHeaven} ${pengzuEarth}`
  
  // 获取月相
  const phase = lunarDay.getPhase().getName()
  
  // 获取季节
  const season = lunarDay.getLunarMonth().getSeason().getName()
  
  // 获取传统节日
  const festival = lunarDay.getFestival()
  
  return {
    solarDate: solarDay.toString(),
    lunarDate: lunarDay.toString(),
    weekDay: solarDay.getWeek().getName(),
    recommends,
    avoids,
    goodGods,
    badGods,
    duty,
    buildGod,
    nineStar,
    star28,
    fetus,
    clash,
    evil,
    pengzu,
    phase,
    season,
    festival: festival ? festival.getName() : null
  }
}

/**
 * 获取指定日期的时辰宜忌信息
 * @param date - 日期对象
 * @returns 时辰宜忌信息数组（12个时辰）
 */
export function getHourTabooInfo(date: Date): HourTabooInfo[] {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  const lunarMonth = lunarDay.getLunarMonth()
  const lunarYear = lunarMonth.getLunarYear()
  
  const hourTaboos: HourTabooInfo[] = []
  
  // 遍历12个时辰
  for (let hour = 0; hour < 24; hour += 2) {
    const lunarHour = LunarHour.fromYmdHms(
      lunarYear.getYear(),
      lunarMonth.getMonth() * (lunarMonth.isLeap() ? -1 : 1),
      lunarDay.getDay(),
      hour,
      0,
      0
    )
    
    const hourIndex = Math.floor(hour / 2)
    const hourNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    const hourRanges = [
      '23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00',
      '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00',
      '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'
    ]
    
    const recommends = lunarHour.getRecommends().map(taboo => taboo.getName())
    const avoids = lunarHour.getAvoids().map(taboo => taboo.getName())
    
    hourTaboos.push({
      hour: lunarHour.getSixtyCycle().toString(),
      hourName: hourNames[hourIndex],
      hourRange: hourRanges[hourIndex],
      recommends,
      avoids,
      description: `${hourNames[hourIndex]}时（${hourRanges[hourIndex]}）`
    })
  }
  
  return hourTaboos
}

/**
 * 获取今日黄历信息
 * @returns 今日黄历信息
 */
export function getTodayAlmanac(): AlmanacInfo {
  return getAlmanacInfo(new Date())
}

/**
 * 判断今日是否宜某事
 * @param activity - 活动名称
 * @returns 是否适宜
 */
export function isTodayGoodFor(activity: string): boolean {
  const almanac = getTodayAlmanac()
  return almanac.recommends.includes(activity)
}

/**
 * 判断今日是否忌某事
 * @param activity - 活动名称
 * @returns 是否禁忌
 */
export function isTodayBadFor(activity: string): boolean {
  const almanac = getTodayAlmanac()
  return almanac.avoids.includes(activity)
}

/**
 * 获取指定日期范围内的黄历信息
 * @param startDate - 开始日期
 * @param endDate - 结束日期
 * @returns 黄历信息数组
 */
export function getAlmanacRange(startDate: Date, endDate: Date): AlmanacInfo[] {
  const almanacs: AlmanacInfo[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    almanacs.push(getAlmanacInfo(new Date(currentDate)))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return almanacs
}

/**
 * 查找适宜某活动的日期
 * @param activity - 活动名称
 * @param startDate - 开始查找的日期
 * @param days - 查找的天数范围
 * @returns 适宜的日期数组
 */
export function findGoodDatesFor(activity: string, startDate: Date = new Date(), days: number = 30): Date[] {
  const goodDates: Date[] = []
  const currentDate = new Date(startDate)
  
  for (let i = 0; i < days; i++) {
    const almanac = getAlmanacInfo(currentDate)
    if (almanac.recommends.includes(activity) && !almanac.avoids.includes(activity)) {
      goodDates.push(new Date(currentDate))
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return goodDates
}

/**
 * 获取黄历活动的详细说明
 * @returns 常见黄历活动的说明对象
 */
export function getAlmanacActivityDescriptions(): { [key: string]: string } {
  return {
    '嫁娶': '男娶女嫁，举行结婚大典的吉日',
    '祭祀': '指祠堂之祭祀、即祭拜祖先或庙寺的祭拜',
    '出行': '指远行、旅游、出差等',
    '修造': '指建造、修缮房屋等',
    '动土': '建造房屋时第一次动工挖土，指阳宅建筑工程',
    '安床': '指安置床铺之事',
    '开市': '商店开张营业或年后第一次开张营业',
    '交易': '订立各种契约互相买卖之事',
    '立券': '订立各种契约买卖之事',
    '入宅': '迁入新居',
    '移徙': '迁移居所',
    '破土': '建造坟墓、安葬时挖掘土地，指阴宅相关工程',
    '安葬': '举行埋葬仪式',
    '启攒': '墓地迁葬',
    '解除': '清扫房屋、解除灾难',
    '沐浴': '祈福设醮或还愿等',
    '裁衣': '裁制新娘衣服或给死者做寿衣',
    '冠笄': '男女成人之礼',
    '会亲友': '聚集朋友',
    '安机械': '安装机器',
    '造车器': '制作车辆等工具',
         '纳财': '购屋产业、进货、收帐等',
     '栽种': '播种、种植花草',
     '牧养': '牧养牲畜',
     '造畜稠': '修建牲畜棚舍',
     '教牛马': '训练牛马等牲畜',
     '破屋壤垣': '拆除房屋或围墙',
     '拆卸': '拆卸建筑物等',
     '开渠': '筑下水道、水沟',
     '掘井开池': '开凿水井、挖掘池塘',
     '开厕': '建造厕所',
     '造仓库': '建造仓库',
     '塞穴': '填平洞穴',
     '平治道涂': '铺平道路',
     '造桥': '建造桥梁',
     '作灶': '安装灶具',
     '治病': '治疗疾病',
     '结网': '制作鱼网等',
     '理发': '剃头、修发',
     '整手足甲': '修剪指甲等',
     '求医': '去看病',
     '疗病': '治疗疾病',
     '词讼': '诉讼、打官司',
     '起基': '建筑房屋的第一步',
     '竖柱上梁': '房屋建造的重要步骤',
     '开柱眼': '在柱子上凿眼',
     '穿屏扇架': '制作屏风、扇子等',
     '盖屋合脊': '盖房子、合龙',
     '开厨': '安装灶具开始使用',
     '造船': '建造船只',
     '造庙': '建造寺庙',
     '作井': '挖掘水井',
     '作陂放水': '建造河堤、放水灌溉',
     '造酒': '酿造酒类',
     '造车': '制作车辆',
     '造器': '制作器具',
     '修饰垣墙': '修建围墙',
     '苫盖': '修理屋顶',
     '修仓': '修理仓库',
     '鼓铸': '冶炼金属、铸造器具',
     '酝酿': '酿造酒类等',
     '造畜椆栖': '建造牲畜棚舍',
     '会友': '朋友聚会',
     '纳婿': '招赘女婿',
     '问名': '求婚问名',
     '纳采': '缔结婚姻的仪式、受授聘金',
     '纳征': '缔结婚姻的仪式、受授聘金',
     '入学': '拜师学艺',
     '习艺': '学习手艺',
     '上官赴任': '走马上任',
     '临政亲民': '临政亲民',
     '结婚姻': '结成婚姻关系',
     '开仓': '商家开仓营业',
     '出货财': '出货、销售',
     '穿井': '挖掘水井',
     '纳畜': '买入牲畜',
     '馀事勿取': '除了黄历上特别标明可以做的事情之外，其他事情都不宜进行',
     '诸事不宜': '所有事情都不适合进行，宜静不宜动的日子'
  }
}

/**
 * 获取黄历的简化版本（只包含核心信息）
 * @param date - 日期对象
 * @returns 简化的黄历信息
 */
export function getSimpleAlmanac(date: Date) {
  const almanac = getAlmanacInfo(date)
  
  return {
    date: almanac.solarDate,
    lunarDate: almanac.lunarDate,
    weekDay: almanac.weekDay,
    recommends: almanac.recommends.slice(0, 3), // 只取前3个
    avoids: almanac.avoids.slice(0, 3),         // 只取前3个
    goodGods: almanac.goodGods.slice(0, 2),     // 只取前2个
    badGods: almanac.badGods.slice(0, 2),       // 只取前2个
    summary: `宜：${almanac.recommends.slice(0, 3).join('、') || '无'} | 忌：${almanac.avoids.slice(0, 3).join('、') || '无'}`
  }
} 