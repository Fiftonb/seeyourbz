'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { baguaInfo } from '@/lib/liuyao/constants/bagua'
import { hexagramInfo } from '@/lib/liuyao/constants/hexagram'
import { yaoBodyParts, yaoFengShui, yaoFamilyMembers } from '@/lib/liuyao/constants/yao'

const COIN_YANG = "/coin-yang.png"
const COIN_YIN = "/coin-yin.png"
const RIGHT_ALLOW = "/right-allow.png"

type YaoType = {
  value: 'yin' | 'yang',
  changing: boolean,
  name: string
}

type ThrowResult = {
  coins: boolean[],  // true代表正面（字），false代表背面
  yao: YaoType
}

const throwCoins = (): ThrowResult => {
  const coins = [
    Math.random() < 0.5,
    Math.random() < 0.5,
    Math.random() < 0.5
  ]

  const yangCount = coins.filter(c => c).length

  let yao: YaoType
  switch (yangCount) {
    case 3:
      yao = { value: 'yin', changing: true, name: '老阴' }
      break
    case 2:
      yao = { value: 'yin', changing: false, name: '少阴' }
      break
    case 1:
      yao = { value: 'yang', changing: false, name: '少阳' }
      break
    case 0:
      yao = { value: 'yang', changing: true, name: '老阳' }
      break
    default:
      yao = { value: 'yang', changing: false, name: '少阳' }
  }

  return { coins, yao }
}

// 规则图标组件
const RulesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10,9 9,9 8,9" />
  </svg>
)

// 规则说明组件
const RulesDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* 固定头部 */}
        <div className="flex-shrink-0 flex justify-between items-center p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">占卦规则说明</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 可滚动内容区域 */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">一、铜钱摇卦法说明</h3>
              <p className="text-gray-700 dark:text-gray-300">1、一背面两字面：少阳🌱</p>
              <p className="text-gray-700 dark:text-gray-300">2、两背面一字面：少阴🍃</p>
              <p className="text-gray-700 dark:text-gray-300">3、三个字面：老阴🌺（变爻）</p>
              <p className="text-gray-700 dark:text-gray-300">4、三个背面：老阳☀️（变爻）</p>
              <div className="flex items-center space-x-2 mt-2">
                <img src={COIN_YANG} alt="正面" className="w-6 h-6" />
                <img src={RIGHT_ALLOW} alt="右" className="w-6 h-6" />
                <span className="text-gray-700 dark:text-gray-300">正面</span>
                <img src={COIN_YIN} alt="反面" className="w-6 h-6" />
                <img src={RIGHT_ALLOW} alt="右" className="w-6 h-6" />
                <span className="text-gray-700 dark:text-gray-300">反面</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">二、可测内容</h3>
              <div className="text-gray-700 dark:text-gray-300">大象、运势、事业、经商、求名、婚恋、决策、时运、财运、家宅、身体、疾病、胎孕、家运、子女、周转、买卖、等人、寻人、失物、外出、考试、诉讼、求事、改行、开业</div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">三、周易五不测</h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">1、不动不测。万物变动兆于机，事物变化之前都有先兆，能够把握就占得先机；事物未动则不需要占，如一场体育比赛，时间、地点、参加人员都还没有确定，不用预测</p>
                <p className="text-gray-700 dark:text-gray-300">2、不诚不测。以现代话说，易经反映出整体论、系统论、全息论的特色，万物生命是一个整体，特别是测的人与被占者的心理有直接的关系，常言心诚则灵，念力，意念发动有力，也是信息的发射，感应自然万物接收。心不诚，念不纯，影响信息的准确性</p>
                <p className="text-gray-700 dark:text-gray-300">3、不正不测。违背良知之事，非法之事，自然不应。道德二字，现在变成一个词，变成说教。其实不是，道德，大道为先，德行居后，合与道才有德，有德方合于道。所谓无道无良，无法无天，如一些腐败分子害怕东窗事发，烧香求佑，最后锒铛入狱，徒增笑柄</p>
                <p className="text-gray-700 dark:text-gray-300">4、重卦不测。比如测事情，已经占得了一卦，又想再起一卦看是否相符，不能保证预测的准确性</p>
                <p className="text-gray-700 dark:text-gray-300">5、没事不测。没有事情，不用测，抱着玩玩看的心理，也不要测，测也不准</p>
              </div>
            </div>
          </div>
        </div>

        {/* 固定底部 */}
        <div className="flex-shrink-0 flex justify-center p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors"
          >
            知道了
          </Button>
        </div>
      </div>
    </div>
  );
};

// 添加新的结果显示组件
const HexagramResult = ({ yao, result }: { yao: YaoType[], result: string }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  // 解析结果文本
  const parseResult = (text: string) => {
    const lines = text.split('\n')
    const parsed = {
      basic: '',
      hexagram: '',
      interpretation: '',
      aspects: {} as Record<string, string>,
      yaoExplanation: [] as Array<{index: number, name: string, body: string, fengshui: string, family: string, isChanging: boolean}>,
      guaExplanation: ''
    }

    let currentSection = ''
    let yaoIndex = -1

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.startsWith('下卦为') && line.includes('上卦为')) {
        parsed.basic = line
      } else if (/^第\d+卦$/.test(line)) {
        // 匹配 "第X卦" 的格式
        currentSection = 'hexagram'
        parsed.hexagram += line + '\n'
      } else if (line.startsWith('卦名：') || line.startsWith('原文：') || line.startsWith('吉凶：')) {
        currentSection = 'hexagram'
        parsed.hexagram += line + '\n'
      } else if (line.startsWith('解释：')) {
        currentSection = 'interpretation'
        // 将解释部分的内容处理，提取【】项目
        const interpretationText = line.replace('解释：', '')
        parsed.interpretation = interpretationText
        
        // 继续处理后续行直到遇到爻位解释
        for (let j = i + 1; j < lines.length; j++) {
          const nextLine = lines[j].trim()
          if (nextLine === '爻位解释：') {
            i = j - 1  // 设置外层循环位置
            break
          }
          parsed.interpretation += '\n' + nextLine
        }
        
        // 从解释文本中提取【】项目
        const aspectRegex = /【(.+?)】([^【]*)/g
        let match
        while ((match = aspectRegex.exec(parsed.interpretation)) !== null) {
          const aspectName = match[1]
          const aspectContent = match[2].trim()
          if (aspectContent) {
            parsed.aspects[aspectName] = aspectContent
          }
        }
      } else if (line === '爻位解释：') {
        currentSection = 'yao'
      } else if (/^第\d+爻（.+）：$/.test(line)) {
        // 匹配 "第X爻（名称）：" 的格式
        const match = line.match(/^第(\d+)爻（(.+?)）：$/)
        if (match) {
          yaoIndex = parseInt(match[1]) - 1
          const yaoName = match[2]
          const isChanging = yao[yaoIndex]?.changing || false
          parsed.yaoExplanation[yaoIndex] = {
            index: yaoIndex,
            name: yaoName,
            body: '',
            fengshui: '',
            family: '',
            isChanging
          }
        }
      } else if (line.startsWith('人体：') && yaoIndex >= 0 && parsed.yaoExplanation[yaoIndex]) {
        parsed.yaoExplanation[yaoIndex].body = line.replace('人体：', '').trim()
      } else if (line.startsWith('风水：') && yaoIndex >= 0 && parsed.yaoExplanation[yaoIndex]) {
        parsed.yaoExplanation[yaoIndex].fengshui = line.replace('风水：', '').trim()
      } else if (line.startsWith('家庭成员：') && yaoIndex >= 0 && parsed.yaoExplanation[yaoIndex]) {
        parsed.yaoExplanation[yaoIndex].family = line.replace('家庭成员：', '').trim()
      } else if (line === '卦象解释：') {
        currentSection = 'gua'
      } else if (currentSection === 'hexagram' && line) {
        parsed.hexagram += line + '\n'
      } else if (currentSection === 'gua' && line) {
        parsed.guaExplanation += line + '\n'
      }
    }

    return parsed
  }

  if (!result) return null

  const parsedResult = parseResult(result)

  const aspectCategories = {
    '基础运势': ['大象', '运势', '决策', '时运'],
    '事业财运': ['事业', '经商', '财运', '周转', '买卖', '求事', '改行', '开业'],
    '感情家庭': ['婚恋', '家宅', '家运', '子女', '胎孕'],
    '健康医疗': ['身体', '疾病'],
    '学业出行': ['求名', '外出', '考试'],
    '日常事务': ['等人', '寻人', '失物', '诉讼']
  }

  return (
    <div className="space-y-4">
      {/* 基本卦象信息 */}
      <Card>
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('basic')}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <span>🎯 基本卦象</span>
            <span className="text-xl">{expandedSections.has('basic') ? '−' : '+'}</span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('basic') && (
          <CardContent className="space-y-3">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{parsedResult.basic}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              {parsedResult.hexagram.split('\n').filter(line => line.trim()).map((line, index) => (
                <div key={index} className="flex">
                  <span className="text-gray-600 dark:text-gray-400 min-w-[80px]">
                    {/^第\d+卦$/.test(line) ? '卦序：' :
                     line.startsWith('卦名：') ? '卦名：' :
                     line.startsWith('原文：') ? '原文：' :
                     line.startsWith('吉凶：') ? '吉凶：' : ''}
                  </span>
                  <span className="flex-1">{line.replace(/^(卦名：|原文：|吉凶：)/, '').replace(/^第(\d+)卦$/, '$1')}</span>
                </div>
              ))}
              {parsedResult.interpretation && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex">
                    <span className="text-gray-600 dark:text-gray-400 min-w-[80px]">基本释义：</span>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {parsedResult.interpretation.split('【')[0].trim()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* 运势解读 */}
      {Object.entries(aspectCategories).map(([category, aspects]) => {
        const categoryAspects = aspects.filter(aspect => parsedResult.aspects[aspect])
        if (categoryAspects.length === 0) return null

        return (
          <Card key={category}>
            <CardHeader 
              className="cursor-pointer" 
              onClick={() => toggleSection(category)}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <span>
                  {category === '基础运势' ? '📊' :
                   category === '事业财运' ? '💼' :
                   category === '感情家庭' ? '❤️' :
                   category === '健康医疗' ? '🏥' :
                   category === '学业出行' ? '🎓' :
                   category === '日常事务' ? '📝' : '📋'} {category}
                </span>
                <span className="text-xl">{expandedSections.has(category) ? '−' : '+'}</span>
              </CardTitle>
            </CardHeader>
            {expandedSections.has(category) && (
              <CardContent>
                <div className="grid gap-3">
                  {categoryAspects.map(aspect => (
                    <div key={aspect} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">{aspect}</h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {parsedResult.aspects[aspect]}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}

      {/* 爻位解释 */}
      <Card>
        <CardHeader 
          className="cursor-pointer" 
          onClick={() => toggleSection('yao')}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <span>🔮 爻位详解</span>
            <span className="text-xl">{expandedSections.has('yao') ? '−' : '+'}</span>
          </CardTitle>
        </CardHeader>
        {expandedSections.has('yao') && (
          <CardContent>
            <div className="grid gap-3">
              {parsedResult.yaoExplanation.map((yaoInfo, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${yaoInfo.isChanging ? 'border-amber-300 bg-amber-50 dark:border-amber-600 dark:bg-amber-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      第{index + 1}爻（{yaoInfo.name}）
                    </h4>
                    {yaoInfo.isChanging && (
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-xs rounded-full font-medium">
                        ⚠️ 变爻
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">人体：</span>
                      <span className="text-gray-900 dark:text-gray-100">{yaoInfo.body}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">风水：</span>
                      <span className="text-gray-900 dark:text-gray-100">{yaoInfo.fengshui}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">家庭：</span>
                      <span className="text-gray-900 dark:text-gray-100">{yaoInfo.family}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* 卦象解释 */}
      {parsedResult.guaExplanation && (
        <Card>
          <CardHeader 
            className="cursor-pointer" 
            onClick={() => toggleSection('gua')}
          >
            <CardTitle className="flex items-center justify-between text-lg">
              <span>☯️ 卦象详解</span>
              <span className="text-xl">{expandedSections.has('gua') ? '−' : '+'}</span>
            </CardTitle>
          </CardHeader>
          {expandedSections.has('gua') && (
            <CardContent>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {parsedResult.guaExplanation}
                </pre>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}

export function Liuyao() {
  const [yao, setYao] = useState<YaoType[]>(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
  const [throwResults, setThrowResults] = useState<ThrowResult[]>([])
  const [currentThrow, setCurrentThrow] = useState(0)
  const [result, setResult] = useState('')
  const [isFlipping, setIsFlipping] = useState(false)
  const [showRules, setShowRules] = useState(false);

  const throwNextCoins = () => {
    if (currentThrow >= 6) return

    setIsFlipping(true)

    setTimeout(() => {
      const throwResult = throwCoins()
      const newThrowResults = [...throwResults, throwResult]
      setThrowResults(newThrowResults)

      const newYao = [...yao]
      newYao[currentThrow] = throwResult.yao
      setYao(newYao)

      setCurrentThrow(prev => prev + 1)
      setIsFlipping(false)
    }, 500)
  }

  const resetDivination = () => {
    setYao(Array(6).fill({ value: 'yang', changing: false, name: '少阳' }))
    setThrowResults([])
    setCurrentThrow(0)
    setResult('')
  }

  const interpretYao = () => {
    const lowerTrigram = yao.slice(0, 3).map(y => y.value === 'yang' ? '1' : '0').join('')
    const upperTrigram = yao.slice(3).map(y => y.value === 'yang' ? '1' : '0').join('')
    const fullHexagram = yao.map(y => y.value === 'yang' ? '1' : '0').join('')

    const trigramMap: { [key: string]: string } = {
      '111': '乾', '110': '兑', '101': '离', '100': '震',
      '011': '巽', '010': '坎', '001': '艮', '000': '坤'
    }

    const lowerGua = trigramMap[lowerTrigram]
    const upperGua = trigramMap[upperTrigram]

    let interpretation = `下卦为${lowerGua}，上卦为${upperGua}。\n\n`

    if (hexagramInfo[fullHexagram]) {
      const { no, name, pinyin, qian, original, meaning, description } = hexagramInfo[fullHexagram]
      interpretation += `第${no}卦\n\n`
      interpretation += `卦名：${name}【${pinyin}】\n\n`
      interpretation += `原文：${original}\n\n`
      interpretation += `吉凶：${qian}\n\n`
      // interpretation += `卦象：${description}\n\n`
      interpretation += `解释：${meaning}\n\n`
    } else {
      interpretation += `未找到对应的卦象解释（二进制码：${fullHexagram}）\n\n`
    }

    interpretation += '爻位解释：\n\n'
    yao.forEach((y, index) => {
      interpretation += `第${index + 1}爻（${y.name}）：\n`
      interpretation += `  人体：${yaoBodyParts[index]}\n`
      interpretation += `  风水：${yaoFengShui[index]}\n`
      interpretation += `  家庭成员：${yaoFamilyMembers[index]}\n`
      if (y.changing) {
        interpretation += `  ⚠️ 此爻为变爻\n`
      }
      interpretation += '\n'
    })

    interpretation += '卦象解释：\n\n'
    interpretation += `下卦${lowerGua}：${Object.entries(baguaInfo[lowerGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n\n`
    interpretation += `上卦${upperGua}：${Object.entries(baguaInfo[upperGua as keyof typeof baguaInfo]).map(([key, value]) => `${key}为${value}`).join('，')}\n\n`

    setResult(interpretation)
  }

  return (
    <div className="relative">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">六爻卜卦</CardTitle>
            <Button
              outline
              onClick={() => setShowRules(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <RulesIcon />
              查看规则说明
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            六爻卜卦是一种起源于周朝时期的占卜方法，主要基于易经的原理。六爻卜卦通过掷铜钱六次来形成卦象，每次掷出的结果（正面或反面）决定了一个爻是阳爻（正面）还是阴爻（反面）。六个爻组合在一起形成一个完整的卦象，称为六爻卦。
          </div>
          <div className="space-y-6">
            {/* 显示投掷结果 */}
            {throwResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">投掷记录</h3>
                {throwResults.map((result, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-gray-100 min-w-[60px]">第{index + 1}次：</span>
                    <div className="flex space-x-1">
                      {result.coins.map((isYang, coinIndex) => (
                        <img
                          key={coinIndex}
                          src={isYang ? COIN_YANG : COIN_YIN}
                          alt={isYang ? '正面' : '反面'}
                          className="w-6 h-6"
                        />
                      ))}
                    </div>
                    <span className="text-gray-400">
                      <img src={RIGHT_ALLOW} alt="箭头" className="w-4 h-4" />
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 min-w-[50px]">
                      {result.coins.map(isYang => isYang ? '正' : '反').join('')}
                    </span>
                    <span className="text-gray-400">
                      <img src={RIGHT_ALLOW} alt="箭头" className="w-4 h-4" />
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{result.yao.name}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-4">
              {currentThrow < 6 ? (
                <button
                  onClick={throwNextCoins}
                  disabled={isFlipping}
                  className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  投掷铜钱（第{currentThrow + 1}次）
                </button>
              ) : (
                <>
                  <button 
                    onClick={interpretYao} 
                    className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    解卦
                  </button>
                  <button 
                    onClick={resetDivination} 
                    className="flex-1 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-black border border-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    重新开始
                  </button>
                </>
              )}
            </div>
          </div>

          {result && (
            <div className="mt-6">
              <HexagramResult yao={yao} result={result} />
            </div>
          )}
        </CardContent>
      </Card>

      <RulesDialog
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />
    </div>
  )
}
