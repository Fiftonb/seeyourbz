# 数据库备份与恢复指南

## 备份操作

### 快速备份（跨平台兼容）
```bash
# 文件备份（推荐）- 快速且完整
npm run db:backup

# SQL 导出备份 - 可读性好，便于查看
npm run db:backup:dump
```

### 系统专用备份（增强功能）

#### Linux 系统
```bash
# 使用 Linux 优化脚本
npm run db:backup:linux file     # 文件备份
npm run db:backup:linux dump     # SQL 导出

# 或直接运行脚本
./scripts/backup-db-linux.sh file
./scripts/backup-db-linux.sh dump
```

**Linux 特性**：
- 🔍 自动检测操作系统类型
- 📊 显示磁盘空间使用情况  
- ✅ 自动验证备份文件完整性
- ⚡ 支持 `pv` 命令显示进度条
- 🛠️ 自动检查 `sqlite3` 依赖

#### macOS 系统
```bash
# 使用 macOS 优化脚本
npm run db:backup:macos file     # 文件备份
npm run db:backup:macos dump     # SQL 导出

# 或直接运行脚本
./scripts/backup-db.sh file
./scripts/backup-db.sh dump
```

#### Windows 系统
```bash
# 在 Git Bash 或 WSL 中运行
npm run db:backup
npm run db:backup:dump

# PowerShell 手动备份
New-Item -ItemType Directory -Force -Path prisma\backups
Copy-Item prisma\dev.db prisma\backups\dev-backup.db
```

### 备份文件说明
- **文件备份**: `dev-YYYYMMDD-HHMMSS.db` - SQLite 数据库文件的直接复制
- **SQL 备份**: `dump-YYYYMMDD-HHMMSS.sql` - 可读的 SQL 脚本格式

## 恢复操作

### 从文件备份恢复
```bash
# 1. 停止应用服务
# 2. 备份当前数据库（可选）
cp prisma/dev.db prisma/dev.db.backup

# 3. 恢复指定备份文件
cp prisma/backups/dev-20241201-143022.db prisma/dev.db

# 4. 重启应用服务
```

### 从 SQL 备份恢复
```bash
# 1. 停止应用服务
# 2. 删除当前数据库
rm prisma/dev.db

# 3. 从 SQL 脚本恢复
sqlite3 prisma/dev.db < prisma/backups/dump-20241201-143022.sql

# 4. 重启应用服务
```

## 数据库维护

### 重置数据库
```bash
# ⚠️ 危险操作：完全删除数据库并重新初始化
npm run db:reset
```

### 清理旧备份
```bash
# 删除30天前的备份文件
npm run db:backup:clean
```

### 查看备份文件
```bash
# 列出所有备份文件
ls -lah prisma/backups/

# 查看备份文件大小
du -h prisma/backups/*
```

## 备份策略建议

### 开发环境
- **频率**: 重要功能开发前后
- **方式**: 文件备份即可
- **保留**: 最近10个备份文件

### 生产环境  
- **频率**: 每日自动备份
- **方式**: 文件备份 + SQL 导出
- **保留**: 30天内的所有备份
- **存储**: 异地备份到云端

### 自动化备份（推荐）

#### Linux/Unix 系统 - Cron 定时任务

编辑 crontab：
```bash
crontab -e
```

添加以下定时任务：
```bash
# 每日凌晨2点使用 Linux 优化脚本备份
0 2 * * * cd /path/to/your/project && npm run db:backup:linux file

# 每周日凌晨3点 SQL 导出备份
0 3 * * 0 cd /path/to/your/project && npm run db:backup:linux dump

# 每月1号清理旧备份
0 4 1 * * cd /path/to/your/project && npm run db:backup:clean

# 每日上午9点验证备份完整性
0 9 * * * cd /path/to/your/project && find prisma/backups -name "*.db" -mtime -1 -exec sqlite3 {} "PRAGMA integrity_check;" \;
```

#### systemd 定时器（现代 Linux 推荐）

创建服务文件 `/etc/systemd/system/db-backup.service`：
```ini
[Unit]
Description=Database Backup Service
After=network.target

[Service]
Type=oneshot
User=your-username
WorkingDirectory=/path/to/your/project
ExecStart=/usr/bin/npm run db:backup:linux file
```

创建定时器文件 `/etc/systemd/system/db-backup.timer`：
```ini
[Unit]
Description=Run database backup daily
Requires=db-backup.service

[Timer]
OnCalendar=daily
Persistent=true

[Install]
WantedBy=timers.target
```

启用定时器：
```bash
sudo systemctl enable db-backup.timer
sudo systemctl start db-backup.timer
```

## 恢复测试

定期测试备份文件的完整性：

```bash
# 1. 创建测试数据库
cp prisma/backups/dev-20241201-143022.db test.db

# 2. 验证数据库完整性
sqlite3 test.db "PRAGMA integrity_check;"

# 3. 查看表结构
sqlite3 test.db ".tables"

# 4. 清理测试文件
rm test.db
```

## 应急恢复流程

如果数据库损坏或丢失：

1. **立即停止应用服务**
2. **评估损失范围**
3. **选择最近的可用备份**
4. **按照恢复步骤操作**
5. **验证数据完整性**
6. **重启应用服务**
7. **通知相关人员**

## 联系支持

如遇到数据恢复问题，请联系技术支持并提供：
- 问题发生时间
- 错误信息截图
- 最后成功备份的时间
- 已尝试的恢复步骤 