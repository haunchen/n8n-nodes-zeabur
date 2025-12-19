# n8n-nodes-zeabur

This is an [n8n](https://n8n.io/) community node for integrating with [Zeabur AI Hub](https://zeabur.com/ai-hub).

Zeabur AI Hub provides unified API access to multiple AI models, including Claude, Gemini, GPT, DeepSeek, Qwen, and more, allowing you to easily use various AI capabilities in your n8n workflows.

[中文文檔 (Chinese Documentation)](README.zh-TW.md)

## ✨ Features

- 🤖 AI Agent Integration - Provides a Chat Model node that works with n8n's AI Agent
- 💬 Standalone Chat Node - Use Zeabur AI Hub directly in your workflows without AI Agent
- 🌐 Multi-Model Support - Access Claude, Gemini, GPT, DeepSeek, Qwen, GLM, Kimi, and more through a single API
- 📋 Dynamic Model List - Automatically fetches the latest available models from the API
- 🌍 Multi-Region Endpoints - Supports Tokyo (HND1) and San Francisco (SFO1) regions

## 📋 Prerequisites

- n8n version >= 1.0.0
- [Zeabur AI Hub](https://zeabur.com/ai-hub) account and API key

## 🚀 Installation

### Method 1: Install via n8n Community Nodes

1. Go to **Settings** > **Community Nodes**
2. Search for `@haunchen/n8n-nodes-zeabur`
3. Click **Install**

### Method 2: Manual Installation

```bash
# Navigate to n8n custom nodes directory
cd ~/.n8n/custom

# Install the package
npm install @haunchen/n8n-nodes-zeabur
```

### Method 3: Docker Installation

In a Docker environment, set the environment variable:

```yaml
environment:
  - N8N_CUSTOM_EXTENSIONS=@haunchen/n8n-nodes-zeabur
```

## ⚙️ Credential Setup

1. Go to [Zeabur AI Hub](https://zeabur.com/ai-hub) to create an API key
2. In n8n, add a new credential and select **Zeabur AI Hub API**
3. Enter your API key and select a region endpoint

### Available Region Endpoints

| Region | Endpoint |
|--------|----------|
| HND1 - Tokyo, Japan | `https://hnd1.aihub.zeabur.ai/v1` |
| SFO1 - San Francisco, USA | `https://sfo1.aihub.zeabur.ai/v1` |

## 📖 Usage

### Standalone Chat Node

The Zeabur AI Hub node can be used directly in your workflows for simple chat completions:

1. Add a Zeabur AI Hub node to your workflow
2. Configure credentials
3. Select a model (choose from the list or manually enter a model ID)
4. Enter your message
5. Optional: Adjust Temperature, Max Tokens, Top P, and penalty parameters

### Using with AI Agent

The Zeabur AI Hub Chat Model can be used as a language model for n8n AI Agent:

1. Add an AI Agent node
2. Add Zeabur AI Hub Chat Model to the Chat Model connection
3. Configure credentials
4. Select a model (choose from the list or manually enter a model ID)
5. Optional: Adjust Temperature, Max Tokens, and other parameters

## 🔧 Supported Models

Zeabur AI Hub supports a wide variety of AI models. For the complete list, please refer to the [Models Page](https://zeabur.com/models):

### Claude Models (Anthropic)
- `claude-sonnet-4-5` - Claude Sonnet 4.5
- `claude-haiku-4-5` - Claude Haiku 4.5

### Gemini Models (Google)
- `gemini-3-pro-preview` - Gemini 3 Pro Preview
- `gemini-3-flash-preview` - Gemini 3 Flash Preview
- `gemini-2.5-pro` - Gemini 2.5 Pro
- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-flash-lite` - Gemini 2.5 Flash Lite

### GPT Models (OpenAI)
- `gpt-5` - GPT-5
- `gpt-5-mini` - GPT-5 mini
- `gpt-4.1` - GPT-4.1
- `gpt-4.1-mini` - GPT-4.1 mini
- `gpt-4o` - GPT-4o
- `gpt-4o-mini` - GPT-4o mini

### Grok Models (xAI)
- `grok-4-fast` - Grok 4 Fast

### DeepSeek Models
- `deepseek-v3.2-exp` - DeepSeek v3.2 Exp

### GLM Models (Zhipu AI)
- `glm-4.6` - GLM-4.6

### Llama Models (Meta)
- `llama-3.3-70b` - Llama 3.3 70B

### Qwen Models (Alibaba)
- `qwen-3-32` - Qwen 3 32B
- `qwen3-next` - Qwen 3 Next 80B

### Kimi Models (Moonshot AI)
- `kimi-k2-thinking` - Kimi K2 Thinking

> 💡 The model list is continuously updated. For the latest available models, please visit the [Zeabur AI Hub Models Page](https://zeabur.com/models)

## 🆚 Differences from Using OpenAI Node Directly

| Feature | OpenAI Node | Zeabur AI Hub Node |
|---------|-------------|-------------------|
| Multi-Model Access | OpenAI models only | Claude, Gemini, GPT, DeepSeek, Qwen, and more |
| Region Selection | Manual URL input | Dropdown menu for region selection |
| Model List | Static list | Dynamically fetched from API |
| Branding | OpenAI icon | Zeabur branded icon |
| Default Settings | Manual adjustment required | Optimized for Zeabur |

## 📚 Resources

- [Zeabur AI Hub](https://zeabur.com/ai-hub)
- [Models Page](https://zeabur.com/models)
- [Zeabur Documentation](https://zeabur.com/docs)
- [n8n Community Node Development](https://docs.n8n.io/integrations/creating-nodes/)

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License - See [LICENSE](LICENSE.md)
