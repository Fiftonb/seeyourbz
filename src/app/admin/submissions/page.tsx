'use client'

import { useState, useEffect } from 'react'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table } from '@/components/ui/table'
import { EyeIcon, FunnelIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface User {
  id: string
  email: string
  name: string | null
}

interface Submission {
  id: string
  type: string
  ipAddress: string
  userAgent: string | null
  inputData: any
  resultData: any | null
  userId: string | null
  createdAt: string
  user: User | null
}

interface SubmissionsResponse {
  submissions: Submission[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 筛选条件
  const [filters, setFilters] = useState({
    type: '',
    startDate: '',
    endDate: ''
  })
  
  // 详情弹窗
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  // 获取提交记录
  const fetchSubmissions = async (page = 1) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.type && { type: filters.type }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate })
      })

      const response = await fetch(`/api/admin/submissions?${params}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('请先登录')
          return
        }
        if (response.status === 403) {
          setError('您没有权限访问此页面')
          return
        }
        throw new Error('获取数据失败')
      }

      const data: SubmissionsResponse = await response.json()
      setSubmissions(data.submissions)
      setPagination(data.pagination)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取数据
  useEffect(() => {
    fetchSubmissions()
  }, [])

  // 筛选条件变化时重新获取数据
  const handleFilterChange = () => {
    fetchSubmissions(1)
  }

  // 重置筛选条件
  const resetFilters = () => {
    setFilters({ type: '', startDate: '', endDate: '' })
    setTimeout(() => fetchSubmissions(1), 100)
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  // 获取类型显示文本
  const getTypeText = (type: string) => {
    switch (type) {
      case 'peach-blossom':
        return '桃花运'
      case 'destiny':
        return '八字排盘'
      default:
        return type
    }
  }

  // 获取类型颜色
  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'peach-blossom':
        return 'pink'
      case 'destiny':
        return 'blue'
      default:
        return 'zinc'
    }
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center">
          <Heading level={1} className="text-2xl font-bold text-red-600 mb-4">
            {error}
          </Heading>
          {error.includes('权限') && (
            <Text className="text-gray-600">
              只有管理员可以访问此页面
            </Text>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={1} className="text-3xl font-bold text-gray-900 dark:text-white">
            用户提交记录
          </Heading>
          <Text className="mt-2 text-gray-600 dark:text-gray-400">
            管理员可查看所有用户的测算提交记录
          </Text>
        </div>
        <Badge color="blue">
          总计 {pagination.total} 条记录
        </Badge>
      </div>

      {/* 筛选器 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <FunnelIcon className="w-5 h-5 text-gray-500" />
          <Heading level={3} className="text-lg font-semibold">
            筛选条件
          </Heading>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Text className="text-sm font-medium mb-2">测算类型</Text>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部类型</option>
              <option value="peach-blossom">桃花运</option>
              <option value="destiny">八字排盘</option>
            </select>
          </div>
          
          <div>
            <Text className="text-sm font-medium mb-2">开始日期</Text>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <Text className="text-sm font-medium mb-2">结束日期</Text>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end gap-2">
            <Button
              onClick={handleFilterChange}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              筛选
            </Button>
            <Button
              onClick={resetFilters}
              plain
              className="text-gray-600 hover:text-gray-800"
            >
              重置
            </Button>
          </div>
        </div>
      </div>

      {/* 提交记录表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {loading ? (
          <div className="p-8 text-center">
            <Text className="text-gray-500">加载中...</Text>
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-8 text-center">
            <Text className="text-gray-500">暂无提交记录</Text>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    类型
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    IP地址
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    提交时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color={getTypeBadgeColor(submission.type) as any}>
                        {getTypeText(submission.type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.user ? (
                        <div>
                          <Text className="font-medium">{submission.user.name || '未设置姓名'}</Text>
                          <Text className="text-sm text-gray-500">{submission.user.email}</Text>
                        </div>
                                             ) : (
                         <Badge color="zinc">访客</Badge>
                       )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="text-sm font-mono">{submission.ipAddress}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="text-sm">{formatDate(submission.createdAt)}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        plain
                        onClick={() => setSelectedSubmission(submission)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <EyeIcon className="w-4 h-4" />
                        查看详情
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 分页 */}
        {!loading && submissions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                显示第 {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
                共 {pagination.total} 条记录
              </Text>
              <div className="flex gap-2">
                <Button
                  plain
                  onClick={() => fetchSubmissions(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                >
                  上一页
                </Button>
                <Button
                  plain
                  onClick={() => fetchSubmissions(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                >
                  下一页
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 详情弹窗 */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl max-h-[80vh] overflow-auto p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <Heading level={2} className="text-xl font-bold">
                提交详情
              </Heading>
              <Button
                plain
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">测算类型</Text>
                  <Badge color={getTypeBadgeColor(selectedSubmission.type) as any} className="mt-1">
                    {getTypeText(selectedSubmission.type)}
                  </Badge>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">提交时间</Text>
                  <Text className="mt-1">{formatDate(selectedSubmission.createdAt)}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">IP地址</Text>
                  <Text className="mt-1 font-mono">{selectedSubmission.ipAddress}</Text>
                </div>
                <div>
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">用户信息</Text>
                  {selectedSubmission.user ? (
                    <div className="mt-1">
                      <Text>{selectedSubmission.user.name || '未设置姓名'}</Text>
                      <Text className="text-sm text-gray-500">{selectedSubmission.user.email}</Text>
                    </div>
                                     ) : (
                     <Badge color="zinc" className="mt-1">访客</Badge>
                   )}
                </div>
              </div>

              {/* 输入数据 */}
              <div>
                <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">输入数据</Text>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-auto">
                  {JSON.stringify(selectedSubmission.inputData, null, 2)}
                </pre>
              </div>

              {/* 结果数据 */}
              {selectedSubmission.resultData && (
                <div>
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">计算结果</Text>
                  <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-auto max-h-60">
                    {JSON.stringify(selectedSubmission.resultData, null, 2)}
                  </pre>
                </div>
              )}

              {/* 浏览器信息 */}
              {selectedSubmission.userAgent && (
                <div>
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">浏览器信息</Text>
                  <Text className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    {selectedSubmission.userAgent}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 