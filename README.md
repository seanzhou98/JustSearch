# 🚀 JustSearch: 智能 AI 深度搜索助手

**JustSearch** 是一款基于大语言模型（LLM）和自动化浏览器技术的深度搜索工具。它不仅仅是一个搜索界面，更是一个能够像人类一样“思考、搜索、阅读、总结”的智能代理。它能自动拆解复杂问题，深入网页正文提取关键信息，并生成带有精确引用的详尽答案。

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/)
[![Playwright](https://img.shields.io/badge/browser-Playwright-green.svg)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)

---

## 💡 为什么选择 JustSearch？

传统的搜索引擎往往只给你一系列链接，而 JustSearch 会：
1. **深度理解**：利用 LLM 拆解您的意图，不只是关键词匹配。
2. **真机阅读**：通过 Playwright 模拟真人打开网页，绕过简单的反爬，获取正文。
3. **事实核查**：在生成答案时强制要求标注引用，拒绝 AI 幻觉。
4. **自主迭代**：如果初次搜索结果不足以回答，它会自己决定“再搜一次”。

---

## ✨ 核心特性

-   **🎯 任务多级拆解**：自动分析用户意图，将复杂问题拆解为多个搜索查询或直接访问特定 URL。
-   **🕵️ 深度爬取与分析**：模拟真实浏览器行为进入网页抓取正文。支持**交互模式**，能自动识别并点击“阅读更多”、“展开全文”等按钮。
-   **🔄 迭代式搜索逻辑**：AI 会评估当前获取的信息是否足以回答问题。如果不足，会自动发起补充搜索，直到获取足够证据。
-   **📝 自动标注引用**：生成答案时会严格标注来源编号 `[1]`, `[2]`，并在文末提供对应的原始链接，确保信息真实可靠、可追溯。
-   **🛡️ 浏览器反爬规避**：集成 `playwright-stealth` 模拟真实人类行为，降低触发验证码（CAPTCHA）的概率。
-   **🎨 现代 Web UI**：支持流式输出（Streaming）、过程日志实时可视化、对话历史管理、深色/浅色模式切换。
-   **🐙 GitHub 深度优化**：针对 GitHub 用户和仓库页面进行了专门的爬取逻辑优化，更准确地获取星数、活跃度等信息。

---

## 🛠️ 技术栈

-   **后端**: Python 3.9+, FastAPI, Playwright (Headless Chromium)
-   **AI 模型**: 兼容 OpenAI API 协议（支持 DeepSeek, GPT-4, Claude, NVIDIA NIM 等）
-   **前端**: 原生 JS (ES6 Modules), CSS3, Markdown-it, DOMPurify
-   **部署**: Docker / Docker Compose / 本地 Python 环境

---

## 🚀 快速启动

我们提供了一键部署脚本，支持 Docker 和本地环境。**推荐使用 Docker 以获得最佳体验。**

### 1. 克隆项目
```bash
git clone https://github.com/yeahhe365/JustSearch.git
cd JustSearch
```

### 2. 一键部署
#### Mac / Linux 用户
```bash
chmod +x deploy.sh
./deploy.sh
```
#### Windows 用户
双击运行 `deploy.bat`。

> **脚本逻辑说明**：
> 1. 优先检查 Docker 环境，若存在则自动构建镜像并启动容器。
> 2. 若无 Docker，则自动回退至本地 Python 环境，创建虚拟环境、安装依赖并启动服务。

### 3. 访问与配置
1. 打开浏览器访问 `http://localhost:8000`。
2. 点击页面左下角的 **设置** ⚙️ 按钮。
3. 输入您的 `API Key` 和 `Base URL`（例如 DeepSeek 的 API 地址）。
    - **💡 提示**：`API Key` 支持输入多个（用英文逗号分隔），程序会自动轮询使用，适合多 Key 负载均衡。
4. 开始提问！

---

## 📦 手动安装指南 (针对开发者)

如果您希望手动控制开发环境：

### 1. 环境准备
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 2. 安装浏览器内核
```bash
playwright install chromium
```

### 3. 运行服务
```bash
# 使用脚本运行
./run.sh

# 或手动启动
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 🔄 更新指南

如果您需要更新到最新版本，请执行以下步骤：

### 1. 获取最新代码
```bash
git pull
```

### 2. 重新部署
#### Docker 用户 (推荐)
直接运行：
```bash
./deploy.sh
```
或者手动运行：
```bash
docker-compose up -d --build
```
> **注意**：使用 `--build` 参数确保 Docker 重新构建镜像以应用最新的代码和依赖变更。您的配置 (`settings.json`) 和聊天记录 (`chats/`) 将会被保留。

#### 本地 Python 用户
```bash
./deploy.sh
```
或者手动更新：
```bash
source venv/bin/activate
pip install -r backend/requirements.txt
playwright install chromium
```

---

## 🤖 工作流程详解

JustSearch 采用多阶段迭代流程，确保回答的深度和准确性：

1.  **Phase I: 分析 (Analysis)** - LLM 接收问题，决定是进行关键词搜索还是直接访问特定链接。
2.  **Phase II: 搜索 (Search)** - 在 DuckDuckGo/Google/Bing 等引擎执行并发搜索。
3.  **Phase III: 评估 (Assess)** - AI 筛选出最相关的多个结果进行深度阅读。
4.  **Phase IV: 爬取与交互 (Crawl & Interact)** - 浏览器进入页面抓取全文。如果开启“交互模式”，AI 会自动点击潜在的内容展开按钮。
5.  **Phase V: 生成 (Generate)** - 融合所有来源，生成带引用的结构化答案。如果信息不足，则返回 Phase I 重新迭代。

---

## 🛠️ 实用工具：解决验证码 (CAPTCHA)

如果您在搜索时频繁遇到验证码，可以使用我们提供的脚本手动登录以保存 Cookies：
```bash
python tools/manual_login.py
```
这会启动一个可见的 Chrome 窗口。登录您的常用搜索账号并完成一次搜索验证，JustSearch 的后台爬虫将共享这些登录状态，从而显著降低被拦截的概率。

---

## 📂 项目结构

```text
JustSearch/
├── backend/            # 后端核心代码
│   ├── app/            # FastAPI 应用逻辑
│   ├── chats/          # 对话历史存储 (自动创建)
│   ├── static/         # 前端静态资源 (HTML/JS/CSS)
│   ├── settings.json.example # 配置模板
│   └── requirements.txt # Python 依赖
├── tools/              # 辅助工具 (如手动登录脚本)
├── user_data/          # 浏览器持久化数据 (Cookies/配置，自动创建)
├── Dockerfile          # Docker 构建文件
├── docker-compose.yml  # Docker Compose 配置
├── deploy.sh/bat       # 智能一键部署脚本 (推荐)
└── run.sh/bat          # 服务启动脚本
```

---

## 📄 开源协议

本项目采用 [MIT License](LICENSE) 协议。
