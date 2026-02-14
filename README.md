# 🚀 JustSearch: 智能 AI 深度搜索助手

**JustSearch** 是一款基于大语言模型（LLM）和自动化浏览器技术的深度搜索工具。它不仅能提供搜索结果，还能像人类一样“阅读”网页、提取关键信息，并生成带有引用的详尽答案。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![Playwright](https://img.shields.io/badge/browser-Playwright-green.svg)

## ✨ 核心特性

-   **🎯 任务多级拆解**：自动分析用户意图，将复杂问题拆解为多个搜索查询或直接访问特定 URL。
-   **🕵️ 深度爬取与分析**：不仅仅查看搜索摘要。系统会模拟浏览器行为进入网页，抓取正文，甚至能识别并点击“阅读更多”等交互元素。
-   **🔄 迭代式搜索逻辑**：如果初次搜索的信息不足以回答问题，AI 会自动发起补充搜索，直到获取足够证据。
-   **📝 自动标注引用**：生成答案时会严格标注来源编号 `[1]`, `[2]`，并在文末提供对应的原始链接，确保信息可追溯。
-   **🛡️ 浏览器反爬规避**：集成 `playwright-stealth` 插件，模拟真实人类行为，降低触发验证码（CAPTCHA）的概率。
-   **🎨 现代 Web UI**：流式输出（Streaming）、过程日志可视化、历史记录管理、深色/浅色模式切换。

## 🛠️ 技术栈

-   **后端**: Python 3.9+, FastAPI, Playwright (Headless Chrome)
-   **AI 模型**: 兼容 OpenAI API 协议（支持 DeepSeek, NVIDIA NIM, GPT-4 等）
-   **前端**: 原生 JS (ES6 Modules), CSS3, Markdown-it, DOMPurify
-   **数据存储**: 本地 JSON 文件（用于对话历史和配置）

## � 快速启动 (一键部署)

我们提供了简单的一键部署脚本，支持 Docker 和本地环境。推荐使用 Docker 以获得最佳体验。

### Mac/Linux 用户
```bash
chmod +x deploy.sh
./deploy.sh
```

### Windows 用户
双击运行 `deploy.bat` 即可。

脚本逻辑：
1. **优先检查 Docker**：如果有 Docker，会自动构建并启动容器。
2. **自动回退**：如果没有 Docker，会自动创建 Python 虚拟环境、安装依赖并启动服务。

---

## �📦 手动安装指南 (Manual Installation)

如果您更喜欢手动控制，可以参考以下步骤：

### 1. 克隆仓库
```bash
git clone https://github.com/yeahhe365/JustSearch.git
cd JustSearch
```

### 2. 安装依赖
建议使用虚拟环境：
```bash
python3 -m venv venv
source venv/bin/activate  # Windows 使用 venv\Scripts\activate
pip install -r backend/requirements.txt
```

### 3. 安装浏览器内核
```bash
playwright install chrome
```

## 🚀 快速启动

1.  **启动后端服务器**:
    ```bash
    bash run.sh
    # 或者手动运行:
    python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
    ```
2.  **访问界面**:
    打开浏览器访问 `http://localhost:8000`。

3.  **配置 API**:
    点击页面左下角的 **设置** 按钮，输入您的 `API Key`（如 DeepSeek 或 OpenAI）和 `Base URL`。

## 🤖 工作流程

1.  **Phase I: 分析 (Analysis)** - LLM 接收问题，决定是进行搜索还是直接访问链接。
2.  **Phase II: 搜索 (Search)** - 自动在 Google/Bing/DuckDuckGo 上执行并发搜索。
3.  **Phase III: 评估 (Assess)** - AI 筛选出最相关的 2-4 个结果进行深度阅读。
4.  **Phase IV: 爬取 (Crawl/Interact)** - 浏览器进入页面抓取全文。如果开启“交互模式”，AI 会自动点击潜在的内容展开按钮。
5.  **Phase V: 生成 (Generate)** - 融合所有来源，生成带引用的结构化答案。如果信息不足，则返回 Phase I 重新迭代。

## 🛠️ 实用工具

### 解决验证码 (CAPTCHA)
如果你在搜索时频繁遇到验证码，可以使用我们提供的脚本进行手动登录以保存 Cookies：
```bash
python tools/manual_login.py
```
这会启动一个可见的 Chrome 窗口。登录你的 Google 账号并完成一次搜索验证，随后 JustSearch 的后台爬虫将共享这些登录状态。

## 📂 项目结构

```text
├── backend
│   ├── app
│   │   ├── browser_manager.py  # 浏览器自动化控制
│   │   ├── llm_client.py       # 大模型交互封装
│   │   ├── workflow.py         # 核心搜索逻辑流
│   │   └── main.py             # FastAPI 路由
│   ├── static                  # 前端 UI (HTML/CSS/JS)
│   └── settings.json           # 本地配置保存
├── tools
│   └── manual_login.py         # 验证码辅助工具
└── user_data                   # 浏览器缓存与 Cookies
```

## ⚠️ 注意事项

-   **API 费用**：深度搜索会消耗较多 Token（因为需要处理长网页内容），建议使用性价比高的模型（如 DeepSeek-V3）。
-   **Headless 模式**：默认在无头模式下运行。如需观察浏览器行为，可在 `browser_manager.py` 或环境变量中设置 `HEADLESS=false`。
-   **GitHub 统计**：本项目支持自动优化 GitHub URL，访问用户主页时会自动跳转到 Repositories 页面按 Star 排序。

---

**JustSearch** - *让 AI 替你翻遍互联网的每一个角落。*
