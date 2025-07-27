'use client'

import { useState, useEffect } from 'react'
import { Input } from './input'
import { Select } from './select'
import { Card } from './card'
import { Badge } from './badge'
import { Switch } from './switch'
import { CHINA_PROVINCES, getCityCoordinatesByProvince, getAllCities } from '@/lib/china-cities'
import { getTimeDifference, calculateSimpleSolarTime, calculateApparentSolarTime } from '@/lib/solar-time'
import { SolarTimeConfig, TimeConversionResult } from '@/lib/tyme'

interface SolarTimeConfigProps {
  value?: SolarTimeConfig
  onChange: (config: SolarTimeConfig) => void
  birthTime?: Date
  showPreview?: boolean
}

export function SolarTimeConfigComponent({ 
  value, 
  onChange, 
  birthTime, 
  showPreview = true 
}: SolarTimeConfigProps) {
  const [config, setConfig] = useState<SolarTimeConfig>(
    value || {
      useSolarTime: false,
      method: 'simple'
    }
  )
  
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [customLongitude, setCustomLongitude] = useState<string>('')
  const [preview, setPreview] = useState<TimeConversionResult | null>(null)
  
  // 获取可选择的城市列表
  const getAvailableCities = () => {
    if (selectedProvince) {
      const province = CHINA_PROVINCES.find(p => p.code === selectedProvince)
      return province?.cities || []
    }
    return []
  }
  
  // 更新预览
  useEffect(() => {
    if (showPreview && birthTime && config.useSolarTime) {
      try {
        let longitude: number
        
        if (config.longitude !== undefined) {
          longitude = config.longitude
        } else if (config.city && selectedProvince) {
          const coordinates = getCityCoordinatesByProvince(config.city, selectedProvince)
          longitude = coordinates?.longitude || 116.4074
        } else {
          longitude = 116.4074
        }
        
        // 根据用户选择的方法计算真太阳时
        const method = config.method || 'simple'
        const solarTime = method === 'accurate' 
          ? calculateApparentSolarTime(birthTime, longitude)
          : calculateSimpleSolarTime(birthTime, longitude)
        
        setPreview({
          originalTime: birthTime,
          solarTime,
          timeDifference: getTimeDifference(birthTime, solarTime),
          longitude,
          method: method === 'accurate' ? '精确计算' : '简化计算'
        })
      } catch (error) {
        setPreview(null)
      }
    } else {
      setPreview(null)
    }
  }, [config, birthTime, showPreview, selectedProvince])
  
  // 处理配置变更
  const handleConfigChange = (newConfig: Partial<SolarTimeConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    onChange(updatedConfig)
  }
  
  // 处理省份选择
  const handleProvinceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = event.target.value
    setSelectedProvince(provinceCode)
    // 清除城市选择
    handleConfigChange({
      city: undefined,
      longitude: undefined
    })
  }
  
  // 处理城市选择
  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = event.target.value
    if (cityName && selectedProvince) {
      handleConfigChange({
        city: cityName,
        longitude: undefined // 清除自定义经度
      })
      setCustomLongitude('')
    }
  }
  
  // 处理自定义经度
  const handleCustomLongitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setCustomLongitude(value)
    
    const longitude = parseFloat(value)
    if (!isNaN(longitude) && longitude >= -180 && longitude <= 180) {
      handleConfigChange({
        longitude,
        city: undefined // 清除城市选择
      })
      setSelectedProvince('') // 清除省份选择
    }
  }
  
  // 处理计算方法选择
  const handleMethodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const method = event.target.value as 'simple' | 'accurate'
    handleConfigChange({ method })
  }
  
  // 初始化省份选择
  useEffect(() => {
    if (config.city && !selectedProvince) {
      // 从所有省份中找到包含该城市的省份
      for (const province of CHINA_PROVINCES) {
        if (province.cities.some(city => city.name === config.city)) {
          setSelectedProvince(province.code)
          break
        }
      }
    }
  }, [config.city, selectedProvince])
  
  const availableCities = getAvailableCities()
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">真太阳时设置</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            真太阳时基于太阳实际位置计算，比标准时间更准确
          </p>
        </div>
        <Switch
          color="blue"
          checked={config.useSolarTime}
          onChange={(checked: boolean) => handleConfigChange({ useSolarTime: checked })}
        />
      </div>
      
      {config.useSolarTime && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* 位置设置 */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">位置设置</label>
            
            {/* 省份选择 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                选择省份/自治区/直辖市
              </label>
              <Select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="w-full [&>select]:border-2 [&>select]:focus-within:border-blue-500 [&>select]:dark:focus-within:border-blue-400 [&>select]:rounded-lg [&>select]:shadow-sm [&>select]:transition-all [&>select]:duration-300 [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-gray-900 [&>select]:dark:text-white [&>select]:bg-white [&>select]:dark:bg-gray-700/50 [&>select]:border-gray-300 [&>select]:dark:border-gray-600 [&>select]:hover:border-gray-400 [&>select]:dark:hover:border-gray-500 [&>select]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
              >
                <option value="">请选择省份</option>
                {CHINA_PROVINCES.map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </Select>
            </div>
            
            {/* 城市选择 */}
            {selectedProvince && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  选择城市
                </label>
                <Select
                  value={config.city || ''}
                  onChange={handleCityChange}
                  className="w-full [&>select]:border-2 [&>select]:focus-within:border-blue-500 [&>select]:dark:focus-within:border-blue-400 [&>select]:rounded-lg [&>select]:shadow-sm [&>select]:transition-all [&>select]:duration-300 [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-gray-900 [&>select]:dark:text-white [&>select]:bg-white [&>select]:dark:bg-gray-700/50 [&>select]:border-gray-300 [&>select]:dark:border-gray-600 [&>select]:hover:border-gray-400 [&>select]:dark:hover:border-gray-500 [&>select]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
                >
                  <option value="">请选择城市</option>
                  {availableCities.map(city => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            
            {/* 或者自定义经度 */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                或输入经度（东经为正，西经为负）
              </label>
              <Input
                type="number"
                placeholder="如：116.4074（北京）"
                value={customLongitude}
                onChange={handleCustomLongitudeChange}
                min="-180"
                max="180"
                step="0.0001"
                className="w-full [&>input]:border-2 [&>input]:focus-within:border-blue-500 [&>input]:dark:focus-within:border-blue-400 [&>input]:rounded-lg [&>input]:shadow-sm [&>input]:transition-all [&>input]:duration-300 [&>input]:px-3 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-gray-900 [&>input]:dark:text-white [&>input]:bg-white [&>input]:dark:bg-gray-700/50 [&>input]:border-gray-300 [&>input]:dark:border-gray-600 [&>input]:hover:border-gray-400 [&>input]:dark:hover:border-gray-500 [&>input]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
              />
            </div>
          </div>
          
          {/* 计算方法 */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">计算方法</label>
            <Select
              value={config.method || 'simple'}
              onChange={handleMethodChange}
              className="w-full [&>select]:border-2 [&>select]:focus-within:border-blue-500 [&>select]:dark:focus-within:border-blue-400 [&>select]:rounded-lg [&>select]:shadow-sm [&>select]:transition-all [&>select]:duration-300 [&>select]:px-3 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-gray-900 [&>select]:dark:text-white [&>select]:bg-white [&>select]:dark:bg-gray-700/50 [&>select]:border-gray-300 [&>select]:dark:border-gray-600 [&>select]:hover:border-gray-400 [&>select]:dark:hover:border-gray-500 [&>select]:min-h-[2.5rem] [&>span]:before:hidden [&>span]:after:hidden"
            >
              <option value="simple">简化计算（推荐）</option>
              <option value="accurate">精确计算</option>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              简化计算速度快且精度足够，精确计算更准确但稍慢
            </p>
          </div>
          
          {/* 统计信息 */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              📍 已收录 {CHINA_PROVINCES.length} 个省级行政区，
              {CHINA_PROVINCES.reduce((total, province) => total + province.cities.length, 0)} 个地级市
            </p>
          </div>
          
          {/* 预览 */}
          {preview && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-white">
                时间校正预览
                <Badge color="blue">
                  {preview.method}
                </Badge>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">标准时间：</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {preview.originalTime.toLocaleString('zh-CN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">真太阳时：</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {preview.solarTime.toLocaleString('zh-CN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">时间差异：</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    {preview.timeDifference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">使用经度：</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {preview.longitude.toFixed(4)}°
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {!config.useSolarTime && (
        <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          将使用标准时间进行计算
        </div>
      )}
    </div>
  )
} 