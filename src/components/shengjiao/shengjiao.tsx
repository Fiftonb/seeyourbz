 'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, Label } from "@/components/ui/fieldset"
import { Text } from "@/components/ui/text"
import { Alert, AlertTitle, AlertDescription, AlertActions } from '@/components/ui/alert'

// 圣筊结果类型
type JiaoResult = 'sheng' | 'xiao' | 'ku' | null;

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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">圣筊规则说明</h2>
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
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">一、圣筊基本规则</h3>
              <p className="text-gray-700 dark:text-gray-300">圣筊是用两块弧形的木块或竹块进行占卜，根据掷出的结果来解读神明的意思：</p>
              <div className="space-y-4 mt-3">
                <div className="flex items-start gap-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-5 bg-red-500 rounded-full transform rotate-[20deg] absolute left-0"></div>
                      <div className="w-12 h-5 bg-red-300 rounded-full transform -rotate-[20deg] absolute right-0"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">圣筊（聖杯）</h4>
                    <p className="text-gray-700 dark:text-gray-300">一平面朝上，一平面朝下</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">表示神明允许、同意，或行事会顺利</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-5 bg-amber-500 rounded-full transform rotate-[20deg] absolute left-0"></div>
                      <div className="w-12 h-5 bg-amber-500 rounded-full transform -rotate-[20deg] absolute right-0"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">笑筊</h4>
                    <p className="text-gray-700 dark:text-gray-300">两平面朝上</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">表示神明一笑、不解，或者考虑中，行事状况不明</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-5 bg-gray-300 dark:bg-gray-600 rounded-full transform rotate-[160deg] absolute left-0"></div>
                      <div className="w-12 h-5 bg-gray-300 dark:bg-gray-600 rounded-full transform -rotate-[160deg] absolute right-0"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100">哭筊（阴筊）</h4>
                    <p className="text-gray-700 dark:text-gray-300">两平面朝下</p>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">表示神明否定、愤怒，或者不宜行事</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">二、使用场合</h3>
              <div className="text-gray-700 dark:text-gray-300">
                <p className="mb-2">圣筊常用于以下场合：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>向神明请示重要决定</li>
                  <li>询问事业、婚姻、健康等人生大事</li>
                  <li>确认祭拜是否被神明接受</li>
                  <li>寻求神明指引和保佑</li>
                  <li>庙会活动中请示神明意见</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">三、注意事项</h3>
              <div className="space-y-2">
                <p className="text-gray-700 dark:text-gray-300">1. 掷筊前应保持虔诚心态，尊重神明</p>
                <p className="text-gray-700 dark:text-gray-300">2. 问题应明确具体，避免模糊不清</p>
                <p className="text-gray-700 dark:text-gray-300">3. 若得到笑筊，可以重新整理思绪后再次掷筊</p>
                <p className="text-gray-700 dark:text-gray-300">4. 若连续得到哭筊，应暂停请示，另择吉日</p>
                <p className="text-gray-700 dark:text-gray-300">5. 不可为同一问题频繁掷筊，应尊重首次结果</p>
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

// 圣筊结果展示组件
const JiaoResultDisplay = ({ result, question }: { result: JiaoResult; question: string }) => {
  if (!result) return null;

  const resultInfo = {
    sheng: {
      title: '圣筊（聖杯）',
      description: '表示神明允许、同意，或行事会顺利。',
      color: 'bg-red-50 dark:bg-red-900/20',
      textColor: 'text-red-700 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: '🙏',
      interpretation: '神明对您的请求表示认可与支持，您可以放心前行。保持虔诚与感恩之心，事情将会顺利进行。'
    },
    xiao: {
      title: '笑筊',
      description: '表示神明一笑、不解，或者考虑中，行事状况不明。',
      color: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-700 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800',
      icon: '😊',
      interpretation: '神明对此事尚在考虑中，或是您的问题不够明确。建议整理思绪，明确意图后再次请示。也可能是时机尚未成熟，需要耐心等待。'
    },
    ku: {
      title: '哭筊（阴筊）',
      description: '表示神明否定、愤怒，或者不宜行事。',
      color: 'bg-gray-50 dark:bg-gray-800',
      textColor: 'text-gray-700 dark:text-gray-300',
      borderColor: 'border-gray-200 dark:border-gray-700',
      icon: '😔',
      interpretation: '神明对此事表示不认同，当前不适合进行。建议慎重考虑，或寻求其他方案。也可能是提醒您需要调整心态或方向。'
    }
  };

  const info = resultInfo[result];

  return (
    <Card className={`${info.color} ${info.borderColor} border mt-6`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl">{info.icon}</span>
          <span className={info.textColor}>{info.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="w-32 h-32 flex items-center justify-center">
            {result === 'sheng' && (
              <div className="relative">
                <div className="w-20 h-8 bg-red-500 rounded-full transform rotate-[20deg] absolute left-0"></div>
                <div className="w-20 h-8 bg-red-300 rounded-full transform -rotate-[20deg] absolute right-0 top-10"></div>
              </div>
            )}
            {result === 'xiao' && (
              <div className="relative">
                <div className="w-20 h-8 bg-amber-500 rounded-full transform rotate-[20deg] absolute left-0"></div>
                <div className="w-20 h-8 bg-amber-500 rounded-full transform -rotate-[20deg] absolute right-0"></div>
              </div>
            )}
            {result === 'ku' && (
              <div className="relative">
                <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transform rotate-[160deg] absolute left-0"></div>
                <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded-full transform -rotate-[160deg] absolute right-0"></div>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <h4 className="font-medium mb-2">您的问题：</h4>
              <p className="text-gray-700 dark:text-gray-300 italic">"{question}"</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-lg">
          <h4 className="font-medium mb-2">神明指示：</h4>
          <p className="text-gray-700 dark:text-gray-300">{info.description}</p>
        </div>
        
        <div className="p-4 bg-white/80 dark:bg-gray-900/80 rounded-lg">
          <h4 className="font-medium mb-2">解读：</h4>
          <p className="text-gray-700 dark:text-gray-300">{info.interpretation}</p>
        </div>
        
        <div className="flex justify-center pt-2">
          <Text className="text-sm text-center max-w-md text-gray-500 dark:text-gray-400">
            结果仅供参考，请结合实际情况理性判断。无论结果如何，都应保持平常心，尊重神明指引。
          </Text>
        </div>
      </CardContent>
    </Card>
  );
};

// 掷筊动画组件
const ThrowingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-32 h-32 animate-bounce">
        <div className="w-20 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full transform rotate-[20deg] absolute left-0 animate-pulse shadow-lg"></div>
        <div className="w-20 h-8 bg-gradient-to-r from-red-300 to-red-400 rounded-full transform -rotate-[20deg] absolute right-0 animate-pulse shadow-lg"></div>
      </div>
      <div className="mt-6 space-y-2 text-center">
        <Text className="text-gray-600 dark:text-gray-400 animate-pulse font-medium">
          🙏 掷筊中，请稍候...
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-500">
          神明正在倾听您的祈求
        </Text>
      </div>
    </div>
  );
};

export function Shengjiao() {
  const [question, setQuestion] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(''); // 跟踪当前掷筊的问题
  const [result, setResult] = useState<JiaoResult>(null);
  const [isThrowing, setIsThrowing] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [throwHistory, setThrowHistory] = useState<Array<{result: JiaoResult, time: string}>>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 当问题改变时，清空结果和历史记录
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuestion = e.target.value;
    setQuestion(newQuestion);
    
    // 如果问题发生实质性改变，清空结果和历史记录
    if (newQuestion.trim() !== currentQuestion.trim()) {
      setResult(null);
      setThrowHistory([]);
    }
  };

  const throwJiao = () => {
    if (!question.trim()) {
      setShowAlert(true);
      setAlertMessage('请先输入您要请示的问题');
      return;
    }
    
    // 如果是新问题，更新当前问题并清空历史记录
    if (question.trim() !== currentQuestion.trim()) {
      setCurrentQuestion(question.trim());
      setThrowHistory([]);
    }
    
    setIsThrowing(true);
    setResult(null);
    
    setTimeout(() => {
      // 使用数组随机选择，确保完全公平的概率分配
      const results: JiaoResult[] = ['sheng', 'xiao', 'ku'];
      const randomIndex = Math.floor(Math.random() * 3);
      const newResult = results[randomIndex];
      
      setResult(newResult);
      setIsThrowing(false);
      
      // 添加到历史记录
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      setThrowHistory(prev => [...prev, {result: newResult, time: timeString}]);
    }, 1500);
  };

  const resetJiao = () => {
    setResult(null);
    setQuestion('');
    setCurrentQuestion('');
    setThrowHistory([]);
  };

  // 根据结果类型确定按钮显示逻辑
  const renderActionButtons = () => {
    if (!result) {
      return (
        <Button
          onClick={throwJiao}
          disabled={isThrowing || !question.trim()}
          className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
        >
          掷筊
        </Button>
      );
    }

    // 圣筊或哭筊：只能重新开始（已有明确意见）
    if (result === 'sheng' || result === 'ku') {
      return (
        <Button
          onClick={resetJiao}
          disabled={isThrowing}
          className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white disabled:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
        >
          重新开始
        </Button>
      );
    }

    // 笑筊：可以继续掷筊或重新开始
    if (result === 'xiao') {
      return (
        <>
          <Button
            onClick={throwJiao}
            disabled={isThrowing}
            className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
          >
            继续掷筊
          </Button>
          <Button
            onClick={resetJiao}
            disabled={isThrowing}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white disabled:text-gray-300 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            重新开始
          </Button>
        </>
      );
    }
  };

  return (
    <div className="relative">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">掷圣杯(圣筊)</CardTitle>
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
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8 leading-relaxed bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🙏</span>
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-2">关于圣筊</p>
                <p>圣筊是一种传统的占卜方式，通过掷两块弧形的木块或竹块来解读神明的意思。在掷筊前，请保持虔诚的心态，明确您要请示的问题，然后点击"掷筊"按钮。</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Field>
              <Label>请输入您要请示的问题：</Label>
              <input
                id="question"
                type="text"
                placeholder="例如：我是否应该接受这份工作？"
                value={question}
                onChange={handleQuestionChange}
                disabled={isThrowing}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500 text-base"
              />
            </Field>
            
            {isThrowing ? (
              <ThrowingAnimation />
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {renderActionButtons()}
              </div>
            )}
            
            {/* 显示结果 */}
            {result && <JiaoResultDisplay result={result} question={currentQuestion} />}
            
            {/* 历史记录 - 只显示当前问题的记录 */}
            {throwHistory.length > 0 && currentQuestion && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  "{currentQuestion}" 的掷筊记录
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 max-h-40 overflow-y-auto">
                  {throwHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                    >
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{item.time}</span>
                      <span className="font-medium">
                        {item.result === 'sheng' && '圣筊（同意）'}
                        {item.result === 'xiao' && '笑筊（考虑中）'}
                        {item.result === 'ku' && '哭筊（否定）'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <RulesDialog
        isOpen={showRules}
        onClose={() => setShowRules(false)}
      />

      <Alert open={showAlert} onClose={() => setShowAlert(false)} size="sm">
        <AlertTitle>提示</AlertTitle>
        <AlertDescription>{alertMessage}</AlertDescription>
        <AlertActions>
          <Button color="zinc" onClick={() => setShowAlert(false)}>
            知道了
          </Button>
        </AlertActions>
      </Alert>
    </div>
  )
}