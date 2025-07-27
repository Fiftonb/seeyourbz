/**
 * 真太阳时功能测试
 * 这个文件用于测试真太阳时计算的准确性
 */

import { 
  calculateApparentSolarTime, 
  calculateSimpleSolarTime, 
  getCityCoordinates, 
  getTimeDifference 
} from './solar-time'

import { 
  getCompleteEightCharInfo, 
  getCompleteEightCharInfoWithSolarTime, 
  createSolarTimeConfig 
} from './tyme'

// 测试用例
export function testSolarTimeCalculation() {
  console.log('=== 真太阳时功能测试 ===')
  
  // 测试数据：2000年10月15日 3:30
  const testDate = new Date(2000, 9, 15, 3, 30, 0)
  console.log('测试时间:', testDate.toLocaleString('zh-CN'))
  
  // 测试不同城市的经度获取
  const cities = ['北京', '上海', '广州', '成都', '乌鲁木齐']
  cities.forEach(city => {
    const coordinates = getCityCoordinates(city)
    if (coordinates) {
      console.log(`${city}: 经度 ${coordinates.longitude}°, 纬度 ${coordinates.latitude}°`)
      
      // 计算真太阳时
      const solarTime = calculateSimpleSolarTime(testDate, coordinates.longitude)
      const timeDiff = getTimeDifference(testDate, solarTime)
      
      console.log(`  真太阳时: ${solarTime.toLocaleString('zh-CN')}`)
      console.log(`  时间差异: ${timeDiff}`)
      console.log('---')
    }
  })
  
  // 测试八字计算对比
  console.log('=== 八字计算对比 ===')
  const gender = 'MAN'
  
  // 标准时间八字
  const standardResult = getCompleteEightCharInfo(testDate, gender)
  console.log('标准时间八字:', standardResult.eightChar)
  
  // 真太阳时八字（北京）
  const solarConfig = createSolarTimeConfig('北京')
  const solarResult = getCompleteEightCharInfoWithSolarTime(testDate, gender, solarConfig)
  console.log('真太阳时八字:', solarResult.eightCharInfo.eightChar)
  
  if (solarResult.timeConversion) {
    console.log('时间转换信息:', {
      原始时间: solarResult.timeConversion.originalTime,
      真太阳时: solarResult.timeConversion.solarTime,
      时间差异: solarResult.timeConversion.timeDifference,
      使用经度: solarResult.timeConversion.longitude,
      计算方法: solarResult.timeConversion.method
    })
  }
  
  // 检查是否有差异
  const hasDifference = JSON.stringify(standardResult.eightChar) !== JSON.stringify(solarResult.eightCharInfo.eightChar)
  console.log('八字是否有差异:', hasDifference ? '是' : '否')
  
  return {
    standardResult: standardResult.eightChar,
    solarResult: solarResult.eightCharInfo.eightChar,
    timeConversion: solarResult.timeConversion,
    hasDifference
  }
}

// 测试边缘情况
export function testEdgeCases() {
  console.log('\n=== 边缘情况测试 ===')
  
  // 测试极端经度
  const testCases = [
    { name: '东经180度', longitude: 180 },
    { name: '西经180度', longitude: -180 },
    { name: '本初子午线', longitude: 0 },
    { name: '东经90度', longitude: 90 },
    { name: '西经90度', longitude: -90 }
  ]
  
  const testDate = new Date(2000, 0, 1, 12, 0, 0) // 2000年1月1日中午12点
  
  testCases.forEach(testCase => {
    try {
      const solarTime = calculateSimpleSolarTime(testDate, testCase.longitude)
      const timeDiff = getTimeDifference(testDate, solarTime)
      console.log(`${testCase.name}: ${timeDiff}`)
    } catch (error) {
      console.log(`${testCase.name}: 计算出错 - ${error}`)
    }
  })
}

// 如果直接运行此文件，执行测试
if (typeof window === 'undefined' && require.main === module) {
  testSolarTimeCalculation()
  testEdgeCases()
} 