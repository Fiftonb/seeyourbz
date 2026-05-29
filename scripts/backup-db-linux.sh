#!/bin/bash

# Linux 优化版数据库备份脚本
# 使用方法: ./scripts/backup-db-linux.sh [backup-type]
# backup-type: file (默认) 或 dump

set -e

# 配置
DB_PATH="prisma/dev.db"
BACKUP_DIR="prisma/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 检测操作系统
OS_TYPE=$(uname -s)
echo "🐧 检测到操作系统: $OS_TYPE"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 检查数据库是否存在
if [ ! -f "$DB_PATH" ]; then
    echo "❌ 错误: 数据库文件 $DB_PATH 不存在"
    exit 1
fi

# 获取备份类型
BACKUP_TYPE=${1:-file}

case $BACKUP_TYPE in
    "file")
        BACKUP_FILE="$BACKUP_DIR/dev-$TIMESTAMP.db"
        echo "📦 正在备份数据库文件..."
        
        # 针对 WAL 模式优化的在线备份方式（使用 sqlite3 官方 .backup 命令，保证数据一致性）
        if command -v sqlite3 >/dev/null 2>&1; then
            echo "💡 检测到 sqlite3，使用在线一致性备份 (WAL 友好)..."
            sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"
        else
            echo "⚠️  未检测到 sqlite3 命令，回退到文件复制方式..."
            if command -v pv >/dev/null 2>&1; then
                # 如果有 pv 命令，显示进度条
                pv "$DB_PATH" > "$BACKUP_FILE"
            else
                # 标准复制
                cp "$DB_PATH" "$BACKUP_FILE"
            fi
        fi
        
        echo "✅ 备份完成: $BACKUP_FILE"
        ;;
    "dump")
        BACKUP_FILE="$BACKUP_DIR/dump-$TIMESTAMP.sql"
        echo "📝 正在导出数据库为 SQL..."
        
        # 检查 sqlite3 是否安装
        if ! command -v sqlite3 >/dev/null 2>&1; then
            echo "❌ 错误: sqlite3 未安装"
            echo "请安装 sqlite3: sudo apt-get install sqlite3 (Ubuntu/Debian) 或 sudo yum install sqlite (CentOS/RHEL)"
            exit 1
        fi
        
        sqlite3 "$DB_PATH" .dump > "$BACKUP_FILE"
        echo "✅ 备份完成: $BACKUP_FILE"
        ;;
    *)
        echo "❌ 错误: 未知的备份类型 '$BACKUP_TYPE'"
        echo "支持的类型: file, dump"
        exit 1
        ;;
esac

# 显示备份文件大小 (Linux 优化)
if command -v du >/dev/null 2>&1; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📊 备份文件大小: $BACKUP_SIZE"
fi

# 显示备份目录中的文件数量
BACKUP_COUNT=$(find "$BACKUP_DIR" -type f \( -name "*.db" -o -name "*.sql" \) | wc -l)
echo "📂 备份目录中共有 $BACKUP_COUNT 个备份文件"

# 如果备份文件超过10个，提醒清理
if [ $BACKUP_COUNT -gt 10 ]; then
    echo "⚠️  提醒: 备份文件较多，建议运行清理命令"
    echo "   清理30天前的备份: find $BACKUP_DIR -name '*.db' -mtime +30 -delete"
fi

# Linux 系统信息
echo "🔧 系统信息:"
echo "   - 操作系统: $OS_TYPE"
echo "   - 磁盘可用空间:"
df -h "$BACKUP_DIR" | tail -1 | awk '{print "     可用: " $4 " (使用率: " $5 ")"}'

echo "🎉 备份操作完成!"

# Linux 特有的备份验证
echo "🔍 验证备份完整性..."
if [ "$BACKUP_TYPE" = "file" ]; then
    # 验证 SQLite 文件完整性
    if sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;" >/dev/null 2>&1; then
        echo "✅ 备份文件完整性验证通过"
    else
        echo "❌ 警告: 备份文件可能已损坏"
        exit 1
    fi
fi 