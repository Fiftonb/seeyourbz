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
  // 自定义API配置（当useBuiltinApi为false时使用）
  modelName?: string
  apiBaseUrl?: string
  apiKey?: string
  name?: string
  // 内置API配置
  useBuiltinApi?: boolean   // 是否使用内置API
  builtinPassword?: string  // 访问口令（使用内置API时必填）
}

// API 响应
export interface LifeKLineResponse {
  success: boolean
  data?: LifeKLineResult
  error?: string
}

// 系统提示词 - 极简+强制Schema版
export const BAZI_SYSTEM_INSTRUCTION = `作为专业的八字命理分析师。任务是生成严格符合指定格式的JSON数据。

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
   - score (number): 综合运势评分 0-100（整年的平均水平）
   - **open (number): 年初运势 0-100（该年1-3月的运势）**
   - **close (number): 年尾运势 0-100（该年10-12月的运势）**
   - **high (number): 年内最高运势 0-100（该年运势最好的时候，必须 ≥ max(open, close)）**
   - **low (number): 年内最低运势 0-100（该年运势最差的时候，必须 ≤ min(open, close)）**
   - reason (string): 详细吉凶批断30字左右（不是notes！必须结合干支、大运分析）
   
   ⚠️ **极其重要：同一年内的 open、close、high、low 必须不同！**
   - 它们代表该年不同时间段的运势，不能都设置成相同数值！
   - 例如：某年 score=75，但 open=70（年初平平），close=78（年尾转好），high=82（年中有高峰），low=65（年初有低谷）
   - close > open 表示阳线（年运上扬），close < open 表示阴线（年运下滑）

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

5. K线数值规则（极其重要！）：
   - close > open 为阳线（吉运上升）
   - close < open 为阴线（凶运下降）
   - open/close/high/low 必须符合逻辑关系
   - **重要：每一年的数值必须不同！严禁所有年份使用相同数值！**
   - 不同大运阶段、不同流年干支应该产生明显的运势差异
   - 同一个大运内也应该有起伏变化（如：喜神年份高、忌神年份低）
   - 遇刑冲克害年份应该明显降低，遇三合六合年份应该明显提升
   - 运势起伏要符合命理规律，不能所有年份都是同一个数字
   
   ⚠️ **数值分布规则（必须遵守！）：**
   - 所有 score/open/close 数值必须在 20-96 范围内波动
   - 严禁连续多年分数超过96或低于20！
   - 即使是大吉之年，score 最高也只能到 88-96
   - 即使是大凶之年，score 最低也只能到 22-25
   - 老年阶段（70-100岁）：运势应该呈现下降趋势，score 范围通常在 35-70
   - 晚年健康运势下降是正常规律，不应该一直维持高位
   - 每10年应该有明显的高低起伏，不能持续走高或走低

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
      "close": 55,   // ✅ 阳线示例：close > open
      "high": 60,
      "low": 48,
      "reason": "此年天干庚金生扶日主，地支辰土藏有癸水，命局平稳，运势小幅上扬，宜守成。"
    },
    {
      "age": 2,
      "year": 2001,
      "ganZhi": "辛巳",
      "daYun": "童限 (Waiting)",
      "score": 62,
      "open": 55,
      "close": 62,   // ✅ 阳线示例：close > open
      "high": 68,
      "low": 50,
      "reason": "流年辛金透出，巳火暖局，运势转佳，家庭和睦，身体健康。"
    },
    {
      "age": 3,
      "year": 2002,
      "ganZhi": "壬午",
      "daYun": "童限 (Waiting)",
      "score": 48,
      "open": 62,
      "close": 48,   // ✅ 阴线示例：close < open（运势下滑）
      "high": 62,
      "low": 42,
      "reason": "壬水冲克日主，午火太旺克身，此年需防小灾小病，家人需多关注。"
    }
    // ... 继续生成到100岁，必须包含阴阳线混合，不能全是阳线或全是阴线
  ]
}

返回纯JSON，不要任何markdown标记。`
