import type { MetadataRoute } from 'next'

const getBaseUrl = (): string => {
	const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
	if (envUrl) return envUrl.replace(/\/$/, '')
	return 'https://今夕何时.com'
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


