# n8n-nodes-zeabur

這是一個 [n8n](https://n8n.io/) 社群節點，用於整合 [Zeabur AI Hub](https://zeabur.com/ai-hub)。

Zeabur AI Hub 提供統一的 API 存取多種 AI 模型，包括 OpenAI GPT、Claude、Gemini 等，讓你可以在 n8n 工作流程中輕鬆使用各種 AI 功能。

![Zeabur AI Hub Node](https://raw.githubusercontent.com/zeabur/n8n-nodes-zeabur/main/docs/screenshot.png)

## ✨ 功能特色

- 🤖 **聊天完成** - 使用 GPT-4、Claude、Gemini 等模型進行對話
- 🎨 **圖片生成** - 使用 DALL-E 生成圖片
- 🔍 **圖片分析** - 使用視覺模型分析圖片內容
- 🎙️ **語音轉文字** - 使用 Whisper 轉錄音訊
- 📢 **文字轉語音** - 使用 TTS 生成語音
- 📊 **嵌入向量** - 生成文字嵌入向量

## 📋 前置需求

- n8n 版本 >= 0.200.0
- [Zeabur AI Hub](https://zeabur.com/ai-hub) 帳戶和 API 金鑰

## 🚀 安裝方式

### 方法一：透過 n8n 社群節點安裝

1. 進入 **Settings** > **Community Nodes**
2. 搜尋 `n8n-nodes-zeabur`
3. 點擊 **Install**

### 方法二：手動安裝

```bash
# 進入 n8n 自訂節點目錄
cd ~/.n8n/custom

# 安裝套件
npm install n8n-nodes-zeabur
```

### 方法三：Docker 安裝

在 Docker 環境中，設定環境變數：

```yaml
environment:
  - N8N_CUSTOM_EXTENSIONS=n8n-nodes-zeabur
```

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

### 聊天完成

使用 AI 模型進行對話：

1. 新增 **Zeabur AI Hub** 節點
2. 選擇 **Resource**: Chat
3. 選擇 **Operation**: Complete
4. 選擇模型（例如 `gpt-4o-mini`）
5. 輸入 Prompt
6. 可選：設定 System Message 來定義 AI 角色

### 圖片生成

使用 DALL-E 生成圖片：

1. 選擇 **Resource**: Image
2. 選擇 **Operation**: Generate
3. 選擇模型（`dall-e-3` 或 `dall-e-2`）
4. 輸入圖片描述
5. 可選：設定尺寸、品質和風格

### 圖片分析

分析圖片內容：

1. 選擇 **Resource**: Image
2. 選擇 **Operation**: Analyze
3. 選擇支援視覺的模型（例如 `gpt-4o`）
4. 輸入圖片 URL
5. 輸入關於圖片的問題

### 語音轉文字

轉錄音訊檔案：

1. 選擇 **Resource**: Audio
2. 選擇 **Operation**: Transcribe
3. 指定包含音訊檔案的二進位欄位名稱
4. 可選：設定語言和回應格式

### 文字轉語音

生成語音：

1. 選擇 **Resource**: Audio
2. 選擇 **Operation**: Generate Speech
3. 輸入要轉換的文字
4. 選擇語音音色

### 嵌入向量

生成文字嵌入：

1. 選擇 **Resource**: Embeddings
2. 選擇 **Operation**: Create
3. 選擇嵌入模型
4. 輸入要嵌入的文字

## 🔧 支援的模型

Zeabur AI Hub 支援多種 AI 模型，包括但不限於：

### 聊天模型
- OpenAI: `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `gpt-3.5-turbo`
- Anthropic: `claude-3-5-sonnet`, `claude-3-opus`, `claude-3-haiku`
- Google: `gemini-1.5-pro`, `gemini-1.5-flash`

### 圖片模型
- `dall-e-3`, `dall-e-2`

### 音訊模型
- TTS: `tts-1`, `tts-1-hd`
- STT: `whisper-1`

### 嵌入模型
- `text-embedding-3-small`, `text-embedding-3-large`, `text-embedding-ada-002`

## 🆚 與直接使用 OpenAI 節點的差異

| 功能 | OpenAI 節點 | Zeabur AI Hub 節點 |
|------|-------------|-------------------|
| 區域選擇 | 手動輸入 URL | 下拉選單 |
| 品牌識別 | OpenAI 圖標 | Zeabur 專屬圖標 |
| 預設設定 | 需手動調整 | 已針對 Zeabur 優化 |
| 多模型支援 | 僅 OpenAI | 支援 Claude、Gemini 等 |
| 文檔連結 | OpenAI 官方 | Zeabur 專屬文檔 |

## 📚 相關資源

- [Zeabur AI Hub 文檔](https://zeabur.com/docs/ai-hub)
- [n8n 整合指南](https://zeabur.com/docs/ai-hub/n8n-integration)
- [n8n 社群節點開發](https://docs.n8n.io/integrations/creating-nodes/)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE.md)
