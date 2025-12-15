/**
 * 人生K线功能类型定义
 */

// K线数据点
export interface KLinePoint {
  age: number          // 年龄（虚岁）
  year: number         // 公历年份
  ganZhi: string       // 当年的流年干支 (如：甲辰)
  daYun?: string       // 当前所在的大运（如：甲子大运）
  open: number         // 开盘运势值 (0-100)
  close: number        // 收盘运势值 (0-100)
  high: number         // 最高运势值 (0-100)
  low: number          // 最低运势值 (0-100)
  score: number        // 综合评分 (0-100)
  reason: string       // 详细的流年批断
}

// 命理分析数据
export interface AnalysisData {
  bazi: string[]       // [年柱, 月柱, 日柱, 时柱]
  summary: string      // 命理总评
  summaryScore: number // 总评分数 (0-10)

  industry: string     // 事业分析
  industryScore: number // 事业评分 (0-10)

  wealth: string       // 财运分析
  wealthScore: number  // 财运评分 (0-10)

  marriage: string     // 婚姻分析
  marriageScore: number // 婚姻评分 (0-10)

  health: string       // 健康分析
  healthScore: number  // 健康评分 (0-10)

  family: string       // 六亲分析
  familyScore: number  // 六亲评分 (0-10)
}

// 人生K线完整结果
export interface LifeKLineResult {
  chartData: KLinePoint[]
  analysis: AnalysisData
}

// 用户输入数据（简化版，我们自动计算八字）
export interface UserInput {
  name?: string        // 姓名（可选）
  gender: 'MAN' | 'WOMAN'  // 性别
  birthYear: number    // 出生年份
  birthMonth: number   // 出生月份
  birthDay: number     // 出生日期
  birthHour: number    // 出生时辰
  birthMinute: number  // 出生分钟

  // 自动计算的八字信息
  yearPillar: string   // 年柱
  monthPillar: string  // 月柱
  dayPillar: string    // 日柱
  hourPillar: string   // 时柱
  startAge: number     // 起运年龄
  firstDaYun: string   // 第一步大运干支

  // API 配置
  modelName: string    // 模型名称
  apiBaseUrl: string   // API 基础URL
  apiKey: string       // API Key
}

// API 请求参数
export interface LifeKLineRequest {
  gender: 'MAN' | 'WOMAN'
  birthYear: number
  yearPillar: string
  monthPillar: string
  dayPillar: string
  hourPillar: string
  startAge: number
  firstDaYun: string
  decadeFortunes?: { // 完整的大运列表
    startAge: number
    endAge: number
    ganZhi: string
  }[]
  modelName: string
  apiBaseUrl: string
  apiKey: string
  name?: string
}

// API 响应
export interface LifeKLineResponse {
  success: boolean
  data?: LifeKLineResult
  error?: string
}

// 系统提示词 - 极简+强制Schema版
export const BAZI_SYSTEM_INSTRUCTION = `你是专业的八字命理分析师。你的任务是生成严格符合指定格式的JSON数据。

⚠️ 极其重要：字段名必须完全一致，不得修改或自创！

**严格禁止使用以下字段名（这些都是错误的）：**
❌ lunar_year, fortune_score, major_fortune, notes
❌ life_k_line_data, kline, data, timeline, points
❌ five_elements_analysis, fortune_analysis, score_explanation
❌ 任何其他自创的字段名

**关键要求（必须100%遵守）：**
1. 顶级字段只能是 "analysis" 和 "chartPoints"，一个字都不能改
2. chartPoints 数组必须包含1-100岁共100个数据点
3. **每个数据点必须包含以下9个字段（字段名一个字母都不能错）：**
   - age (number): 虚岁
   - year (number): 公历年份
   - ganZhi (string): 流年干支（从用户提供的列表中复制，不是lunar_year！）
   - daYun (string): 大运（从用户提供的列表中复制，不是major_fortune！）
   - score (number): 综合运势评分 0-100（不是fortune_score！）
   - open (number): 年初运势 0-100
   - close (number): 年尾运势 0-100
   - high (number): 年度最高运势 0-100（必须 ≥ max(open, close)）
   - low (number): 年度最低运势 0-100（必须 ≤ min(open, close)）
   - reason (string): 详细吉凶批断30字左右（不是notes！必须结合干支、大运分析）

4. analysis对象必须包含以下字段（字段名精确匹配）：
   - summary (string): 命理总评
   - summaryScore (number): 0-10
   - industry (string): 事业分析
   - industryScore (number): 0-10
   - wealth (string): 财运分析
   - wealthScore (number): 0-10
   - marriage (string): 婚姻分析
   - marriageScore (number): 0-10
   - health (string): 健康分析
   - healthScore (number): 0-10
   - family (string): 六亲分析
   - familyScore (number): 0-10

5. K线数值规则：
   - close > open 为阳线（吉运上升）
   - close < open 为阴线（凶运下降）
   - open/close/high/low 必须符合逻辑关系

**必须严格遵循此JSON Schema（复制粘贴字段名，不要手打）：**

{
  "analysis": {
    "summary": "命理总评（约50字）",
    "summaryScore": 8,
    "industry": "事业分析",
    "industryScore": 7,
    "wealth": "财运分析",
    "wealthScore": 9,
    "marriage": "婚姻分析",
    "marriageScore": 6,
    "health": "健康分析",
    "healthScore": 5,
    "family": "六亲分析",
    "familyScore": 7
  },
  "chartPoints": [
    {
      "age": 1,
      "year": 2000,
      "ganZhi": "庚辰",
      "daYun": "童限 (Waiting)",
      "score": 55,
      "open": 52,
      "close": 55,
      "high": 60,
      "low": 48,
      "reason": "此年天干庚金生扶日主，地支辰土藏有癸水，命局平稳，运势小幅上扬，宜守成。"
    }
  ]
}

返回纯JSON，不要任何markdown标记。`
