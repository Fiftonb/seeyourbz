'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// 定义数据类型
interface WuXingData {
  wh: string;
  tnwh: string | null;
  ynwh: string | null;
  skzhyj: string | null;
  whzx: string | null;
  szwh: string | null;
  hyhw: string | null;
  whw: string | null;
  whq: string | null;
}

interface RiGanData {
  id: number;
  rgz: string | null;
  rgxx: string | null;
  rgcz: string | null;
  rgzfx: string | null;
  xgfx: string | null;
  aqfx: string | null;
  syfx: string | null;
  cyfx: string | null;
  jkfx: string | null;
}

interface YueShiData {
  id: number;
  siceng: string | null;
  mingmi: string | null;
}

export default function JianPiPage() {
  // 状态管理
  const [dataType, setDataType] = useState<string>('wuxing');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [wuxingData, setWuxingData] = useState<WuXingData[]>([]);
  const [riganData, setRiganData] = useState<RiGanData[]>([]);
  const [yueshiData, setYueShiData] = useState<YueShiData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // 加载数据
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `/api/jianpi?type=${dataType}`;
      if (searchTerm) {
        url += `&keyword=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || '获取数据失败');
      }
      
      // 根据数据类型更新状态
      if (dataType === 'wuxing') {
        setWuxingData(result.data);
      } else if (dataType === 'rigan') {
        setRiganData(result.data);
      } else if (dataType === 'yueshi') {
        setYueShiData(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载和类型变化时加载数据
  useEffect(() => {
    fetchData();
  }, [dataType]);
  
  // 渲染五行论命数据
  const renderWuXingData = () => {
    if (!wuxingData || wuxingData.length === 0) {
      return <Text>暂无五行论命数据</Text>;
    }
    
    return (
      <div className="space-y-6">
        {wuxingData.map((item) => (
          <Card key={item.wh} className="p-4">
            <Heading level={3} className="mb-2">{item.wh}</Heading>
            <div className="space-y-2">
              <div><strong>通年五行:</strong> {item.tnwh || '无'}</div>
              <div><strong>抑年五行:</strong> {item.ynwh || '无'}</div>
              <div><strong>生克制化原理:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.skzhyj || '无' }} /></div>
              <div><strong>五行之性:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.whzx || '无' }} /></div>
              <div><strong>身体五行:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.szwh || '无' }} /></div>
              <div><strong>行业和方位:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.hyhw || '无' }} /></div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  // 渲染日干论命数据
  const renderRiGanData = () => {
    if (!riganData || riganData.length === 0) {
      return <Text>暂无日干论命数据</Text>;
    }
    
    return (
      <div className="space-y-6">
        {riganData.map((item) => (
          <Card key={item.id} className="p-4">
            <Heading level={3} className="mb-2">{item.rgz || `日干 #${item.id}`}</Heading>
            <div className="space-y-2">
              <div><strong>日干性格:</strong> <span className="whitespace-pre-wrap">{item.rgxx || '无'}</span></div>
              <div><strong>日干词组:</strong> <span className="whitespace-pre-wrap">{item.rgcz || '无'}</span></div>
              <div><strong>日干支分析:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.rgzfx || '无' }} /></div>
              <div><strong>性格分析:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.xgfx || '无' }} /></div>
              <div><strong>爱情分析:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.aqfx || '无' }} /></div>
              <div><strong>事业分析:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.syfx || '无' }} /></div>
              <div><strong>财运分析:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.cyfx || '无' }} /></div>
              <div><strong>健康分析:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.jkfx || '无' }} /></div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  // 渲染月日时命理数据
  const renderYueShiData = () => {
    if (!yueshiData || yueshiData.length === 0) {
      return <Text>暂无月日时命理数据</Text>;
    }
    
    return (
      <div className="space-y-6">
        {yueshiData.map((item) => (
          <Card key={item.id} className="p-4">
            <Heading level={3} className="mb-2">{item.siceng || `时辰 #${item.id}`}</Heading>
            <div className="space-y-2">
              <div><strong>命理秘密:</strong> <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: item.mingmi || '无' }} /></div>
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-8">
      <Heading level={1} className="mb-6">简批命理查询</Heading>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/3">
          <Select
            value={dataType}
            onChange={(e) => setDataType(e.target.value)}
            className="w-full"
          >
            <option value="wuxing">五行论命</option>
            <option value="rigan">日干论命</option>
            <option value="yueshi">月日时命理</option>
          </Select>
        </div>
        
        <div className="w-full md:w-2/3 flex gap-2">
          <Input
            type="text"
            placeholder="输入关键字搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button onClick={fetchData}>搜索</Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">加载中...</div>
      ) : error ? (
        <div className="text-red-500 py-4">{error}</div>
      ) : (
        <div>
          {dataType === 'wuxing' && renderWuXingData()}
          {dataType === 'rigan' && renderRiGanData()}
          {dataType === 'yueshi' && renderYueShiData()}
        </div>
      )}
    </div>
  );
} 