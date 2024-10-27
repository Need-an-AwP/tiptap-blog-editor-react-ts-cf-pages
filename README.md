# Tiptap Cloudflare Editor
> 此readme由AI生成

### 关于tiptap模板源码
tiptap模板源码来自https://cloud.tiptap.dev/react-templates
该模板构建在nextjs上
原模板使用了许多pro extension，在此项目中尽量避免了使用相关功能
但是拖动手柄还是不可避免地使用了pro extension
`"@tiptap-pro/extension-drag-handle-react": "^2.10.11"`
安装pro extension需要在npm配置中添加tiptap的私有镜像
具体可参考https://cloud.tiptap.dev/pro-extensions

这是一个基于 Tiptap 示例编辑器重构的富文本编辑器项目。该项目专为在 Cloudflare Pages 上部署而设计，并通过 Cloudflare Worker 与 D1 数据库进行交互。

## 特性

- 基于 Tiptap 的富文本编辑功能
- 使用 React 和 TypeScript 构建
- 与 Cloudflare Worker 和 D1 数据库集成
- 支持文档的创建、保存、加载和删除
- 响应式设计，支持移动设备

## 技术栈

- React
- TypeScript
- Vite
- Tiptap
- Tailwind CSS
- Cloudflare Pages
- Cloudflare Workers
- Cloudflare D1 数据库

## 快速开始

1. 克隆仓库
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm run dev`
4. 构建项目：`npm run build`

## 部署

本项目设计为在 Cloudflare Pages 上部署。
此pages请求的worker地址须更改
请确保在部署之前配置好 Cloudflare Worker 和 D1 数据库。
