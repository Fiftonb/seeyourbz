# 跨平台兼容性指南

## 🌐 支持的操作系统

| 操作系统 | 支持状态 | 推荐版本 | 特殊说明 |
|---------|---------|---------|---------|
| **Linux** | ✅ 完全支持 | Ubuntu 18.04+, CentOS 7+, Debian 9+ | 提供优化脚本 |
| **macOS** | ✅ 完全支持 | macOS 10.15+ | 提供优化脚本 |
| **Windows** | ✅ 基础支持 | Windows 10+ | 需要 Git Bash 或 WSL |

## 🐧 Linux 系统详细支持

### 已测试的发行版
- **Ubuntu**: 18.04, 20.04, 22.04
- **CentOS**: 7, 8
- **Debian**: 9, 10, 11
- **Red Hat Enterprise Linux**: 7, 8
- **Fedora**: 最新版本
- **Arch Linux**: 最新版本

### Linux 专用功能
- 🔍 自动系统检测
- 📊 磁盘空间监控
- ✅ 备份完整性验证
- ⚡ 进度条显示（需要 `pv` 包）
- 🛠️ 依赖检查和安装建议

### 安装依赖

#### Ubuntu/Debian
```bash
# 基础依赖
sudo apt-get update
sudo apt-get install nodejs npm sqlite3

# 可选依赖（进度条）
sudo apt-get install pv

# 验证安装
node --version
npm --version
sqlite3 --version
```

#### CentOS/RHEL
```bash
# 基础依赖
sudo yum install nodejs npm sqlite

# 或使用 DNF (较新版本)
sudo dnf install nodejs npm sqlite

# 可选依赖
sudo yum install pv
```

#### Arch Linux
```bash
# 基础依赖
sudo pacman -S nodejs npm sqlite

# 可选依赖
sudo pacman -S pv
```

## 🔧 系统特定配置

### Linux 环境变量
```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export DB_BACKUP_DIR="$HOME/app-backups"
export DB_RETENTION_DAYS=30
```

### 文件权限
```bash
# 确保脚本可执行
chmod +x scripts/backup-db-linux.sh

# 确保备份目录权限
chmod 755 prisma/backups
```

### SELinux 配置（如适用）
```bash
# 查看 SELinux 状态
getenforce

# 如果需要，允许应用访问备份目录
sudo setsebool -P httpd_can_network_connect 1
```

## 🚀 性能优化

### Linux 系统优化建议

#### SSD 存储优化
```bash
# 启用 TRIM（SSD）
sudo systemctl enable fstrim.timer

# 检查文件系统
sudo tune2fs -l /dev/sda1 | grep -i reserved
```

#### 内存优化
```bash
# 查看系统内存
free -h

# 调整 swap 使用策略
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

#### I/O 调度优化
```bash
# 查看当前调度器
cat /sys/block/sda/queue/scheduler

# 针对 SSD 设置 deadline 调度器
echo 'deadline' | sudo tee /sys/block/sda/queue/scheduler
```

## 🔒 安全考虑

### Linux 安全配置

#### 文件权限管控
```bash
# 备份文件只有所有者可读写
chmod 600 prisma/backups/*.db

# 应用目录权限
find . -type f -name "*.js" -exec chmod 644 {} \;
find . -type f -name "*.sh" -exec chmod 755 {} \;
```

#### 用户权限
```bash
# 创建专用用户（生产环境推荐）
sudo useradd -m -s /bin/bash appuser
sudo usermod -aG sudo appuser

# 切换到应用用户
sudo su - appuser
```

## 🐳 容器化部署

### Docker 支持
```dockerfile
# Dockerfile.linux
FROM node:18-alpine

# 安装 SQLite
RUN apk add --no-cache sqlite

# 设置工作目录
WORKDIR /app

# 复制文件
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# 创建备份目录
RUN mkdir -p prisma/backups

# 设置权限
RUN chmod +x scripts/backup-db-linux.sh

EXPOSE 12333
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile.linux
    ports:
      - "12333:12333"
    volumes:
      - ./prisma/backups:/app/prisma/backups
    environment:
      - NODE_ENV=production
      - DATABASE_URL=file:./dev.db
```

## 🔧 故障排除

### 常见问题解决

#### 权限问题
```bash
# 问题：Permission denied
# 解决：
sudo chown -R $USER:$USER .
chmod +x scripts/*.sh
```

#### 依赖缺失
```bash
# 问题：sqlite3: command not found
# 解决：
sudo apt-get install sqlite3  # Ubuntu/Debian
sudo yum install sqlite       # CentOS/RHEL
```

#### 磁盘空间不足
```bash
# 检查磁盘使用
df -h
du -sh prisma/backups/*

# 清理旧备份
npm run db:backup:clean

# 或手动清理
find prisma/backups -mtime +7 -delete
```

#### Node.js 版本问题
```bash
# 使用 NVM 管理 Node.js 版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## 🎯 测试验证

### 系统兼容性测试
```bash
# 运行完整测试
./scripts/test-compatibility.sh

# 手动测试备份功能
npm run db:backup:linux file
npm run db:backup:linux dump

# 验证备份文件
sqlite3 prisma/backups/latest.db "PRAGMA integrity_check;"
```

### 性能基准测试
```bash
# 备份性能测试
time npm run db:backup:linux file

# 恢复性能测试
time cp prisma/backups/test.db prisma/dev.db
```

## 📞 技术支持

### Linux 特定问题
如遇到 Linux 特定问题，请提供：
- 发行版和版本：`cat /etc/os-release`
- 内核版本：`uname -r`
- Node.js 版本：`node --version`
- 错误日志：完整的错误信息

### 社区资源
- **Ubuntu**: https://askubuntu.com/
- **CentOS**: https://www.centos.org/forums/
- **Arch**: https://bbs.archlinux.org/
- **通用**: https://stackoverflow.com/ 