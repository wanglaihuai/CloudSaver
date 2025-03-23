# CloudSaver

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.x-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)
[![GitHub Stars](https://img.shields.io/github/stars/jiangrui1994/CloudSaver.svg?style=flat&logo=github)](https://github.com/jiangrui1994/CloudSaver/stargazers)
![Docker](https://img.shields.io/docker/pulls/jiangrui1994/cloudsaver.svg)


一个基于 Vue 3 + Express 的网盘资源搜索与转存工具，支持响应式布局，移动端与PC完美适配，可通过 Docker 一键部署。

官方Telegram群组：[https://t.me/cloud_saver](https://t.me/cloud_saver)

版本更新日志:[https://www.yuque.com/xiaoruihenbangde/ggogn3/vxoqxkx4rkcz3g94](https://www.yuque.com/xiaoruihenbangde/ggogn3/vxoqxkx4rkcz3g94)

CloudSaver部署与使用常见问题:[https://www.yuque.com/xiaoruihenbangde/ggogn3/ga6gaaiy5fsyw62l](https://www.yuque.com/xiaoruihenbangde/ggogn3/ga6gaaiy5fsyw62l)

## 功能特性

- 🔍 多源资源搜索
  - 支持多个资源订阅源搜索
  - 支持关键词搜索与资源链接解析
  - 支持豆瓣热门榜单展示
- 💾 网盘资源转存
  - 支持 115 网盘，夸克网盘，天翼网盘一键转存
  - 支持转存文件夹展示与选择
- 👥 多用户系统
  - 支持用户注册登录
  - 支持管理员与普通用户权限区分
- 📱 响应式设计
  - 支持 PC 端与移动端自适应布局
  - 针对不同设备优化的交互体验

## 产品展示

### PC 端

<div align="center">
  <img src="./docs/images/pc/login.png" width="400" alt="PC登录页面">
   <img src="./docs/images/pc/douban.png" width="400" alt="PC豆瓣榜单">
  <p>登录页面/榜单</p>
</div>

<div align="center">
  <img src="./docs/images/pc/search.png" width="400" alt="PC资源搜索">
  <img src="./docs/images/pc/detail.png" width="400" alt="PC资源详情">
  <p>资源搜索/资源详情</p>
</div>

<div align="center">
  <img src="./docs/images/pc/save.png" width="400" alt="PC资源转存">
  <img src="./docs/images/pc/save1.png" width="400" alt="PC资源转存">
  <p>资源转存</p>
</div>

### 移动端

<div align="center">
  <div style="display: inline-block; margin: 0 20px;">
    <img src="./docs/images/mobile/login.png" width="200" alt="移动端登录页面">
    <img src="./docs/images/mobile/search.png" width="200" alt="移动端资源搜索">
    <img src="./docs/images/mobile/save.png" width="200" alt="移动端资源转存">
    <img src="./docs/images/mobile/save1.png" width="200" alt="移动端资源转存">
  </div>
</div>

## 技术栈

### 前端

- 核心框架
  - Vue 3
  - TypeScript
  - Vite
- 状态管理
  - Pinia
- 路由管理
  - Vue Router
- UI 组件库
  - Element Plus (PC)
  - Vant (Mobile)
- 工具库
  - Axios

### 后端

- 运行环境
  - Node.js
  - Express
- 数据存储
  - SQLite3

## 环境要求

- Node.js >= 18.x
- pnpm >= 8.x (推荐)

## 快速开始

### 开发环境

1. 克隆项目

```bash
git clone https://github.com/jiangrui1994/CloudSaver.git
cd CloudSaver
```

2. 安装依赖

```bash
pnpm install
```

3. 配置环境变量

```bash
cp ./backend/.env.example ./backend/.env
```

根据 `.env.example` 文件说明配置必要的环境变量。

4. 启动开发服务器

```bash
pnpm dev
```

### 生产环境部署

1. 构建前端

```bash
pnpm build:frontend
```

2. 构建后端

```bash
cd backend
pnpm build
```

3. 启动服务

```bash
pnpm start
```

### Docker 部署

说明：镜像源有**两个地址**供选择，下面部署命令中使用的是dockerhub托管的地址为例，github托管的地址请自行替换

- dockerhub托管：
  - `jiangrui1994/cloudsaver:latest` 稳定版
  - `jiangrui1994/cloudsaver:test` 测试版 （包含最新功能和bug修复，但可能不如稳定版稳定）
- github托管：
  - `ghcr.io/jiangrui1994/cloudsaver:latest` 稳定版
  - `ghcr.io/jiangrui1994/cloudsaver:test` 测试版 （包含最新功能和bug修复，但可能不如稳定版稳定）

#### 单容器部署

稳定版：

```bash
docker run -d \
  -p 8008:8008 \
  -v /your/local/path/data:/app/data \
  -v /your/local/path/config:/app/config \
  --name cloud-saver \
  jiangrui1994/cloudsaver:latest
```

测试版（包含最新功能和bug修复，但可能不如稳定版稳定）：

```bash
docker run -d \
  -p 8008:8008 \
  -v /your/local/path/data:/app/data \
  -v /your/local/path/config:/app/config \
  --name cloud-saver \
  jiangrui1994/cloudsaver:test
```

#### Docker Compose 部署

创建 `docker-compose.yml` 文件：

稳定版：

```yaml
version: "3"
services:
  cloudsaver:
    image: jiangrui1994/cloudsaver:latest
    container_name: cloud-saver
    ports:
      - "8008:8008"
    volumes:
      - /your/local/path/data:/app/data
      - /your/local/path/config:/app/config
    restart: unless-stopped
```

测试版：

```yaml
version: "3"
services:
  cloudsaver:
    image: jiangrui1994/cloudsaver:test
    container_name: cloud-saver
    ports:
      - "8008:8008"
    volumes:
      - /your/local/path/data:/app/data
      - /your/local/path/config:/app/config
    restart: unless-stopped
```

#### /app/config 目录说明

- `env` 文件：包含后端环境变量配置

```bash
# JWT配置
JWT_SECRET=your_jwt_secret_here

# Telegram配置
TELEGRAM_BASE_URL=https://t.me/s

# Telegram频道配置(0.3.0及之后版本无效)
TELE_CHANNELS=[{"id":"xxxx","name":"xxxx资源分享"}]
```

运行：

```bash
docker-compose up -d
```

> **注意**: 测试版（:test标签）包含最新的功能开发和bug修复，但可能存在不稳定因素。建议生产环境使用稳定版（:latest标签）。

## 注意事项

1. 资源搜索需要配置代理环境
2. 默认注册码
   - 管理员：230713
   - 普通用户：9527

## 联系方式

<div align="center">
  <div>
    <img src="./docs/images/wechat.jpg" height="200" alt="微信号">
    <p>微信交流群</p>
  </div>
</div>

## 支持项目

如果您觉得这个项目对您有帮助，可以考虑给予一点支持，这将帮助我们持续改进项目 ❤️

您可以：

- ⭐ 给项目点个 Star
- 🎉 分享给更多有需要的朋友
- ☕ 请作者喝杯冰阔乐或咖啡
- 💰 **赞赏了一定记得和我联系**

<div align="center">
  <div style="display: inline-block; margin: 0 20px;">
    <img src="./docs/images/wechat_pay.jpg" height="300" alt="微信打赏">
    <img src="./docs/images/alipay.png" height="300" alt="支付宝打赏">
  </div>
</div>

## 特别声明

1. 本项目仅供学习交流使用，请勿用于非法用途
2. 仅支持个人使用，不支持任何形式的商业使用
3. 禁止在项目页面进行任何形式的广告宣传
4. 所有搜索到的资源均来自第三方，本项目不对其真实性、合法性做出任何保证

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 开源协议

本项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解更多细节

## 鸣谢

- 👨‍💻 感谢所有为这个项目做出贡献的开发者们！
- 👥 感谢所有使用本项目并提供反馈的用户！
- 感谢所有给予支持和鼓励的朋友们！
