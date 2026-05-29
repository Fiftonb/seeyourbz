/*
	Baidu URL Push Script

	Usage examples:
	- With env vars:
		BAIDU_SITE=your-site.com BAIDU_TOKEN=xxxx npm run seo:push-baidu -- --urls https://your-site.com/a https://your-site.com/b
	- With file:
		npm run seo:push-baidu -- --file urls.txt --site your-site.com --token YOUR_TOKEN
	- Direct with args:
		npx tsx src/lib/baidu-push.ts --site your-site.com --token YOUR_TOKEN --urls https://your-site.com/
*/

import fs from 'node:fs'
import path from 'node:path'
import { toASCII } from 'node:punycode'

export type BaiduPushResponse = {
	success?: number
	remain?: number
	not_same_site?: string[]
	not_valid?: string[]
}

function normalizeSite(input: string): string {
	if (!input) return ''
	try {
		if (input.includes('://')) {
			const url = new URL(input)
			return url.hostname
		}
		return input.replace(/^https?:\/\//, '').replace(/\/$/, '')
	} catch {
		return input
	}
}

export async function pushToBaidu(urls: string[], params: { site: string; token: string; apiBase?: string }): Promise<BaiduPushResponse> {
	const { site, token } = params
	if (!Array.isArray(urls) || urls.length === 0) {
		throw new Error('No URLs provided to push')
	}
	const host = normalizeSite(site)
	const endpoint = `${params.apiBase ?? 'http://data.zz.baidu.com'}/urls?site=${encodeURIComponent(host)}&token=${encodeURIComponent(token)}`
	const body = urls.join('\n')

	const res = await fetch(endpoint, {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain', 'User-Agent': 'curl/7.12.1' },
		body,
	})

	if (!res.ok) {
		const text = await res.text().catch(() => '')
		throw new Error(`Baidu push failed: ${res.status} ${res.statusText} ${text}`)
	}

	return (await res.json()) as BaiduPushResponse
}

function parseArgs(argv: string[]): Record<string, string | string[] | boolean> {
	const args: Record<string, string | string[] | boolean> = {}
	for (let i = 0; i < argv.length; i += 1) {
		const token = argv[i]
		if (!token.startsWith('--')) continue
		const key = token.slice(2)
		const next = argv[i + 1]
		if (!next || next.startsWith('--')) {
			args[key] = true
			continue
		}
		args[key] = next
		i += 1
	}
	return args
}

function extractUrlsFromSitemapText(text: string): string[] {
	// If it's not XML, treat as plain text (one URL per line)
	const looksLikeXml = /<\?xml|<urlset|<sitemapindex|<url>|<loc>/.test(text)
	if (!looksLikeXml) {
		return text
			.split(/\r?\n/)
			.map((l) => l.trim())
			.filter((l) => /^https?:\/\//.test(l))
	}

	// Extract <loc>...</loc> values
	const locRegex = /<loc>\s*([^<\s][^<]*)\s*<\/loc>/gim
	const urls: string[] = []
	let match: RegExpExecArray | null
	while ((match = locRegex.exec(text)) !== null) {
		urls.push(match[1].trim())
	}
	return urls
}

async function fetchSitemapUrls(sitemapUrl: string): Promise<string[]> {
	const res = await fetch(sitemapUrl, { headers: { 'User-Agent': 'curl/7.12.1' } })
	if (!res.ok) {
		throw new Error(`Fetch sitemap failed: ${res.status} ${res.statusText}`)
	}
	const text = await res.text()
	const urls = extractUrlsFromSitemapText(text)
	if (urls.length === 0) {
		throw new Error('No URLs parsed from sitemap')
	}
	return urls
}

async function pushWithAdaptiveQuota(urls: string[], opts: { site: string; token: string; sizes?: number[] }) {
	const sizes = opts.sizes ?? [50, 20, 10, 5, 1]
	let remainingUrls = [...urls]
	let totalPushed = 0
	let lastRemain: number | undefined

	while (remainingUrls.length > 0) {
		let pushedInThisRound = false
		for (const size of sizes) {
			const batch = remainingUrls.slice(0, size)
			try {
				const r = await pushToBaidu(batch, { site: opts.site, token: opts.token })
				totalPushed += r.success ?? 0
				lastRemain = r.remain
				remainingUrls = remainingUrls.slice(size)
				pushedInThisRound = true
				break
			} catch (e) {
				const msg = String((e as Error).message || '')
				if (msg.includes('over quota')) {
					continue
				}
				throw e
			}
		}
		if (!pushedInThisRound) {
			return { success: totalPushed, remain: lastRemain ?? 0, error: 'over quota' }
		}
	}
	return { success: totalPushed, remain: lastRemain ?? 0 }
}

async function main() {
	const args = parseArgs(process.argv.slice(2))
	const envSite = process.env.BAIDU_SITE || ''
	const envToken = process.env.BAIDU_TOKEN || process.env.BAIDU_PUSH_TOKEN || ''

	const site = (typeof args.site === 'string' ? args.site : envSite).trim()
	const token = (typeof args.token === 'string' ? args.token : envToken).trim()

	if (!token) {
		console.error('Missing token. Provide with --token or BAIDU_TOKEN env var.')
		process.exit(1)
	}

	let urls: string[] = []

	if (args.sitemap) {
		const defaultBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000'
		const sitemapUrl = typeof args.sitemap === 'string' ? String(args.sitemap) : `${defaultBase}/sitemap.xml`
		urls = await fetchSitemapUrls(sitemapUrl)
	} else if (typeof args.file === 'string') {
		const filePath = path.resolve(String(args.file))
		const content = fs.readFileSync(filePath, 'utf8')
		urls = content
			.split(/\r?\n/)
			.map((l) => l.trim())
			.filter((l) => l.length > 0)
	} else if (typeof args.urls === 'string') {
		urls = String(args.urls)
			.split(/[,\s]+/)
			.map((u) => u.trim())
			.filter((u) => u.length > 0)
	} else {
		// Remaining args as URLs
		urls = process.argv
			.slice(2)
			.filter((v) => !v.startsWith('--') && !v.includes('='))
	}

	if (urls.length === 0) {
		console.error('No URLs to push. Provide with --sitemap, --file urls.txt or --urls "url1 url2"')
		process.exit(1)
	}

	// Convert domain to punycode for Baidu API unless explicitly disabled
	const shouldPunycode = args['no-punycode'] !== true
	if (shouldPunycode) {
		urls = urls.map((u) => {
			try {
				const url = new URL(u)
				url.hostname = toASCII(url.hostname)
				return url.toString()
			} catch {
				return u
			}
		})
	}

	try {
		const result = await pushWithAdaptiveQuota(urls, { site, token })
		if ((result as any).error === 'over quota') {
			console.error(JSON.stringify({ ok: false, error: 'over quota', pushed: result.success, remain: result.remain }, null, 2))
			process.exit(1)
		}
		console.log(JSON.stringify({ ok: true, site: normalizeSite(site), pushed: result.success ?? 0, remain: result.remain ?? 0 }, null, 2))
	} catch (error) {
		console.error(JSON.stringify({ ok: false, error: (error as Error).message }, null, 2))
		process.exit(1)
	}
}

// Run when executed directly
if (require.main === module) {
	// eslint-disable-next-line @typescript-eslint/no-floating-promises
	main()
}


