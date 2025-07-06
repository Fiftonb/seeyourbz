import { SolarDay, LunarDay } from 'tyme4ts'

export interface CalendarInfo {
  solarDate: string
  lunarDate: string
  weekDay: string
  term: string | null
  zodiac: string
  ganzhi: string
  constellation: string
}

export function getCalendarInfo(date: Date): CalendarInfo {
  const solarDay = SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
  
  const lunarDay = solarDay.getLunarDay()
  
  return {
    solarDate: solarDay.toString(),
    lunarDate: lunarDay.toString(),
    weekDay: solarDay.getWeek().getName(),
    term: solarDay.getTerm()?.getName() || null,
    zodiac: '', // 暂时留空，需要进一步研究API
    ganzhi: lunarDay.getSixtyCycleDay().toString(),
    constellation: solarDay.getConstellation().getName(),
  }
}

export function getSolarDayFromString(dateString: string): SolarDay {
  const date = new Date(dateString)
  return SolarDay.fromYmd(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}

export function getLunarDayFromString(dateString: string): LunarDay {
  return getSolarDayFromString(dateString).getLunarDay()
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate()
}

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