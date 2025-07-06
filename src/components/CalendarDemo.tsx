'use client'

import { useState } from 'react'
import { SolarDay } from 'tyme4ts'

export function CalendarDemo() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  const solarDay = SolarDay.fromYmd(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    selectedDate.getDate()
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-4">日历演示</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">选择日期：</label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">公历信息</h4>
          <p>日期：{solarDay.toString()}</p>
          <p>星期：{solarDay.getWeek().getName()}</p>
          <p>节气：{solarDay.getTerm()?.getName() || '无'}</p>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">农历信息</h4>
          <p>日期：{solarDay.getLunarDay().toString()}</p>
          <p>干支：{solarDay.getLunarDay().getSixtyCycleDay().toString()}</p>
          <p>星座：{solarDay.getConstellation().toString()}</p>
        </div>
      </div>
    </div>
  )
} 