/**
 * 真太阳时计算库
 * 基于天文学原理计算真太阳时，用于精确的命理计算
 */

import { getAllCities, getCityCoordinates as getNewCityCoordinates } from './china-cities'

/**
 * 计算均时差（天文学中的时间修正）
 * @param date - 日期
 * @returns 均时差（分钟）
 */
function calculateEquationOfTime(date: Date): number {
  // 获取一年中的第几天
  const dayOfYear = getDayOfYear(date)
  
  // 使用简化的傅里叶级数计算均时差
  const B = 2 * Math.PI * (dayOfYear - 81) / 365
  
  // 均时差公式（分钟）
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B)
  
  return equationOfTime
}

/**
 * 计算真太阳时（精确方法）
 * @param date - 本地标准时间
 * @param longitude - 经度（东经为正，西经为负）
 * @returns 真太阳时
 */
export function calculateApparentSolarTime(date: Date, longitude: number): Date {
  // 简化的经度校正：每15度经度对应1小时时差
  const standardLongitude = Math.round(longitude / 15) * 15 // 标准时区的中央经线
  const longitudeCorrection = (longitude - standardLongitude) * 4 // 分钟
  
  // 计算均时差
  const equationOfTime = calculateEquationOfTime(date)
  
  // 总校正时间（分钟）
  const totalCorrection = longitudeCorrection + equationOfTime
  
  // 应用校正
  const solarTime = new Date(date.getTime() + totalCorrection * 60 * 1000)
  
  return solarTime
}

/**
 * 简化版真太阳时计算（基于经度的简单校正）
 * @param date - 本地标准时间
 * @param longitude - 经度（东经为正，西经为负）
 * @returns 真太阳时
 */
export function calculateSimpleSolarTime(date: Date, longitude: number): Date {
  // 简单的经度校正：每15度经度对应1小时时差
  const standardLongitude = Math.round(longitude / 15) * 15 // 标准时区的中央经线
  const longitudeCorrection = (longitude - standardLongitude) * 4 // 分钟
  
  // 计算均时差
  const equationOfTime = calculateEquationOfTime(date)
  
  // 总校正时间（分钟）
  const totalCorrection = longitudeCorrection + equationOfTime
  
  // 应用校正
  const solarTime = new Date(date.getTime() + totalCorrection * 60 * 1000)
  
  return solarTime
}

/**
 * 获取一年中的第几天
 * @param date - 日期
 * @returns 天数（1-366）
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

/**
 * 旧版城市坐标数据（保持向后兼容）
 * @deprecated 请使用 china-cities.ts 中的新数据结构
 */
export const CITY_COORDINATES: { [key: string]: { longitude: number, latitude: number } } = {
  // 直辖市
  '北京': { longitude: 116.4074, latitude: 39.9042 },
  '上海': { longitude: 121.4737, latitude: 31.2304 },
  '天津': { longitude: 117.1901, latitude: 39.1034 },
  '重庆': { longitude: 106.5108, latitude: 29.5630 },
  
  // 省会城市
  '广州': { longitude: 113.2644, latitude: 23.1291 },
  '深圳': { longitude: 114.0579, latitude: 22.5431 },
  '杭州': { longitude: 120.1614, latitude: 30.2936 },
  '南京': { longitude: 118.7969, latitude: 32.0603 },
  '武汉': { longitude: 114.2999, latitude: 30.5844 },
  '成都': { longitude: 104.0665, latitude: 30.5728 },
  '西安': { longitude: 108.9402, latitude: 34.3416 },
  '沈阳': { longitude: 123.4315, latitude: 41.8057 },
  '长春': { longitude: 125.3235, latitude: 43.8171 },
  '哈尔滨': { longitude: 126.5358, latitude: 45.8018 },
  '济南': { longitude: 117.0009, latitude: 36.6758 },
  '郑州': { longitude: 113.6254, latitude: 34.7466 },
  '石家庄': { longitude: 114.5149, latitude: 38.0428 },
  '太原': { longitude: 112.5489, latitude: 37.8706 },
  '呼和浩特': { longitude: 111.7519, latitude: 40.8424 },
  '长沙': { longitude: 112.9388, latitude: 28.2282 },
  '南昌': { longitude: 115.8921, latitude: 28.6765 },
  '福州': { longitude: 119.3063, latitude: 26.0745 },
  '厦门': { longitude: 118.1689, latitude: 24.4797 },
  '海口': { longitude: 110.3467, latitude: 20.0175 },
  '南宁': { longitude: 108.3669, latitude: 22.8170 },
  '昆明': { longitude: 102.8329, latitude: 24.8801 },
  '贵阳': { longitude: 106.6302, latitude: 26.6477 },
  '拉萨': { longitude: 91.1409, latitude: 29.6456 },
  '兰州': { longitude: 103.8236, latitude: 36.0581 },
  '西宁': { longitude: 101.7782, latitude: 36.6171 },
  '银川': { longitude: 106.2309, latitude: 38.4872 },
  '乌鲁木齐': { longitude: 87.6168, latitude: 43.8256 },
  
  // 其他重要城市
  '苏州': { longitude: 120.6191, latitude: 31.2990 },
  '无锡': { longitude: 120.3019, latitude: 31.5804 },
  '宁波': { longitude: 121.5440, latitude: 29.8683 },
  '温州': { longitude: 120.6994, latitude: 27.9944 },
  '台州': { longitude: 121.4204, latitude: 28.6568 },
  '嘉兴': { longitude: 120.7507, latitude: 30.7461 },
  '湖州': { longitude: 120.0874, latitude: 30.8936 },
  '绍兴': { longitude: 120.5820, latitude: 30.0023 },
  '金华': { longitude: 119.6478, latitude: 29.0789 },
  '衢州': { longitude: 118.8732, latitude: 28.9417 },
  '舟山': { longitude: 122.2069, latitude: 29.9859 },
  '丽水': { longitude: 119.9212, latitude: 28.4676 },
  
  // 其他
  '香港': { longitude: 114.1694, latitude: 22.3193 },
  '澳门': { longitude: 113.5491, latitude: 22.1987 },
  '台北': { longitude: 121.5654, latitude: 25.0330 }
}

/**
 * 根据城市名称获取坐标
 * @param cityName - 城市名称
 * @returns 坐标信息或null
 * @deprecated 建议使用新的分省数据结构
 */
export function getCityCoordinates(cityName: string): { longitude: number, latitude: number } | null {
  // 优先使用新的数据结构
  const newCoordinates = getNewCityCoordinates(cityName)
  if (newCoordinates) {
    return newCoordinates
  }
  
  // 如果新数据中没有，则使用旧数据（向后兼容）
  return CITY_COORDINATES[cityName] || null
}

/**
 * 计算两个时间的差异描述
 * @param standardTime - 标准时间
 * @param solarTime - 真太阳时
 * @returns 差异描述
 */
export function getTimeDifference(standardTime: Date, solarTime: Date): string {
  const diffMs = solarTime.getTime() - standardTime.getTime()
  const diffMinutes = Math.round(diffMs / (1000 * 60))
  
  if (diffMinutes === 0) {
    return '无差异'
  } else if (diffMinutes > 0) {
    return `真太阳时比标准时间快 ${diffMinutes} 分钟`
  } else {
    return `真太阳时比标准时间慢 ${Math.abs(diffMinutes)} 分钟`
  }
}

/**
 * 验证经度值是否有效
 * @param longitude - 经度值
 * @returns 是否有效
 */
export function isValidLongitude(longitude: number): boolean {
  return longitude >= -180 && longitude <= 180
}

/**
 * 验证纬度值是否有效
 * @param latitude - 纬度值
 * @returns 是否有效
 */
export function isValidLatitude(latitude: number): boolean {
  return latitude >= -90 && latitude <= 90
} 