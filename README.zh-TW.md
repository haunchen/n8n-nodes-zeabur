# n8n-nodes-zeabur

這是一個 [n8n](https://n8n.io/) 社群節點，用於整合 [Zeabur AI Hub](https://zeabur.com/ai-hub)。

Zeabur AI Hub 提供統一的 API 存取多種 AI 模型，包括 Claude、Gemini、GPT、DeepSeek、Qwen 等，讓你可以在 n8n 工作流程中輕鬆使用各種 AI 功能。

## ✨ 功能特色

- 🤖 AI Agent 整合 - 提供 Chat Model 節點，可搭配 n8n 的 AI Agent 使用
- 💬 獨立對話節點 - 可在工作流程中直接使用 Zeabur AI Hub，無需搭配 AI Agent
- 🌐 多模型支援 - 透過單一 API 存取 Claude、Gemini、GPT、DeepSeek、Qwen、GLM、Kimi 等模型
- 📋 動態模型清單 - 自動從 API 獲取最新可用模型
- 🌍 多區域端點 - 支援東京 (HND1) 和舊金山 (SFO1) 兩個區域

## 📋 前置需求

- n8n 版本 >= 1.0.0
- [Zeabur AI Hub](https://zeabur.com/ai-hub) 帳戶和 API 金鑰

## 🚀 安裝方式

1. 進入 **Settings** > **Community Nodes**
2. 搜尋 `@haunchen/n8n-nodes-zeabur`
3. 點擊 **Install**

## ⚙️ 設定憑證

1. 前往 [Zeabur AI Hub](https://zeabur.com/ai-hub) 建立 API 金鑰
2. 在 n8n 中新增憑證，選擇 **Zeabur AI Hub API**
3. 填入 API 金鑰並選擇區域端點

### 可用區域端點

| 區域 | 端點 |
|------|------|
| HND1 - 東京，日本 | `https://hnd1.aihub.zeabur.ai/v1` |
| SFO1 - 舊金山，美國 | `https://sfo1.aihub.zeabur.ai/v1` |

## 📖 使用方式

### 獨立對話節點

Zeabur AI Hub 節點可直接在工作流程中使用，進行簡單的對話完成：

1. 在工作流程中新增 Zeabur AI Hub 節點
2. 設定憑證
3. 選擇模型（從清單選取或手動輸入模型 ID）
4. 輸入訊息
5. 可選：調整 Temperature、Max Tokens、Top P 和懲罰參數

### 搭配 AI Agent 使用

Zeabur AI Hub Chat Model 可作為 n8n AI Agent 的語言模型：

1. 新增 AI Agent 節點
2. 在 Chat Model 連接點新增 Zeabur AI Hub Chat Model
3. 設定憑證
4. 選擇模型（從清單選取或手動輸入模型 ID）
5. 可選：調整 Temperature、Max Tokens 等參數

## 🔧 支援的模型

Zeabur AI Hub 支援多種 AI 模型，完整清單請參考 [模型總表](https://zeabur.com/models)：

### Claude 模型 (Anthropic)
- `claude-sonnet-4-5` - Claude Sonnet 4.5
- `claude-haiku-4-5` - Claude Haiku 4.5

### Gemini 模型 (Google)
- `gemini-3-pro-preview` - Gemini 3 Pro Preview
- `gemini-3-flash-preview` - Gemini 3 Flash Preview
- `gemini-2.5-pro` - Gemini 2.5 Pro
- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-flash-lite` - Gemini 2.5 Flash Lite

### GPT 模型 (OpenAI)
- `gpt-5` - GPT-5
- `gpt-5-mini` - GPT-5 mini
- `gpt-4.1` - GPT-4.1
- `gpt-4.1-mini` - GPT-4.1 mini
- `gpt-4o` - GPT-4o
- `gpt-4o-mini` - GPT-4o mini

### Grok 模型 (xAI)
- `grok-4-fast` - Grok 4 Fast

### DeepSeek 模型
- `deepseek-v3.2-exp` - DeepSeek v3.2 Exp

### GLM 模型 (智譜 AI)
- `glm-4.6` - GLM-4.6

### Llama 模型 (Meta)
- `llama-3.3-70b` - Llama 3.3 70B

### Qwen 模型 (阿里巴巴)
- `qwen-3-32` - Qwen 3 32B
- `qwen3-next` - Qwen 3 Next 80B

### Kimi 模型 (月之暗面)
- `kimi-k2-thinking` - Kimi K2 Thinking

> 💡 模型清單持續更新中，最新可用模型請參考 [Zeabur AI Hub 模型頁面](https://zeabur.com/models)

## 🆚 與直接使用 OpenAI 節點的差異

| 功能 | OpenAI 節點 | Zeabur AI Hub 節點 |
|------|-------------|-------------------|
| 多模型存取 | 僅 OpenAI 模型 | Claude、Gemini、GPT、DeepSeek、Qwen 等 |
| 區域選擇 | 手動輸入 URL | 下拉選單選擇區域 |
| 模型清單 | 靜態列表 | 動態從 API 獲取 |
| 品牌識別 | OpenAI 圖標 | Zeabur 專屬圖標 |
| 預設設定 | 需手動調整 | 已針對 Zeabur 優化 |

## 📚 相關資源

- [Zeabur AI Hub](https://zeabur.com/ai-hub)
- [模型總表](https://zeabur.com/models)
- [Zeabur 文檔](https://zeabur.com/docs)
- [n8n 社群節點開發](https://docs.n8n.io/integrations/creating-nodes/)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE.md)

## 👤 作者

[Frank Chen](https://www.frankchen.tw/personal)
