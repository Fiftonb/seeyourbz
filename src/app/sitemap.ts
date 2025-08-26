import type { MetadataRoute } from 'next'

// 将中文域名转换为 Punycode 格式
const convertToAsciiDomain = (domain: string): string => {
	try {
		// 如果包含协议，先解析URL
		if (domain.includes('://')) {
			const url = new URL(domain)
			// 使用 URL 构造函数的内置 Punycode 转换
			return `${url.protocol}//${url.hostname}${url.port ? ':' + url.port : ''}`
		}
		// 如果只是域名，创建临时URL进行转换
		const tempUrl = new URL(`https://${domain}`)
		return tempUrl.hostname
	} catch (error) {
		console.warn('域名转换失败，使用原域名:', error)
		return domain
	}
}

const getBaseUrl = (): string => {
	const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
	if (envUrl) return convertToAsciiDomain(envUrl.replace(/\/$/, ''))
	// 中文域名 今夕何时.com 转换为 Punycode 格式
	return convertToAsciiDomain('https://今夕何时.com')
}

const publicPaths: string[] = [
	'/',
	'/almanac',
	'/calendar',
	'/constellation',
	'/destiny',
	'/destiny-jianpi',
	'/jianpi',
	'/liuyao',
	'/muyu',
	'/peach-blossom',
	'/privacy',
	'/shengjiao',
	'/statistics',
]

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = getBaseUrl()
	const now = new Date()

	return publicPaths.map((path) => ({
		url: `${baseUrl}${path}`,
		lastModified: now,
		changeFrequency: 'weekly',
		priority: path === '/' ? 1 : 0.7,
	}))
}


