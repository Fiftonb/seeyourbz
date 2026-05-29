import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const client = new PrismaClient()

  // 启用 SQLite 性能优化
  // WAL 模式：允许读写并发，大幅提升 Web 应用并发性能
  client.$executeRawUnsafe('PRAGMA journal_mode = WAL;').catch(() => {})
  // 关闭每次写入后的强制磁盘同步，提升写入速度（断电可能丢失最后一次事务，可接受）
  client.$executeRawUnsafe('PRAGMA synchronous = NORMAL;').catch(() => {})
  // 内存缓存页数，默认 -2000（约 2MB），设为 -32000（约 32MB）
  client.$executeRawUnsafe('PRAGMA cache_size = -32000;').catch(() => {})
  // 临时表和索引存放在内存中
  client.$executeRawUnsafe('PRAGMA temp_store = MEMORY;').catch(() => {})
  // 忙等待超时 5 秒，避免并发时立即报错
  client.$executeRawUnsafe('PRAGMA busy_timeout = 5000;').catch(() => {})

  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma