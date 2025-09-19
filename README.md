# LLM Connections Manager

A dynamic JavaScript library for connecting to Amazon Bedrock with Claude models. Features configurable credentials and easy-to-use API for AI-powered applications.

## Features

- 🔧 **Dynamic Configuration**: Update credentials without code changes
- 🏔️ **Amazon Bedrock Support**: Full Claude model integration
- 🌊 **Streaming Support**: Real-time streaming completions
- 💬 **Conversation History**: Multi-turn conversation support
- 📊 **Usage Tracking**: Built-in usage and token tracking
- 🛡️ **Error Handling**: Comprehensive error handling and validation
- 📝 **TypeScript Ready**: Full TypeScript support

## Quick Start

### 1. Installation

```bash
npm install
```

### 2. Configuration

Copy the example environment file and update with your credentials:

```bash
cp env.example .env
```

Update `.env` with your actual credentials:

```env
# Amazon Bedrock Configuration (for Claude)
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Default Configuration
DEFAULT_PROVIDER=bedrock
```

### 3. Basic Usage

```javascript
import llmManager from './llmManager.js';

// Simple completion
const response = await llmManager.generateCompletion(
  'Hello! Tell me a joke.'
);

if (response.success) {
  console.log(response.content);
}
```

## Examples

### Amazon Bedrock (Claude)

```javascript
import llmManager from './llmManager.js';

// Basic completion with Bedrock
const response = await llmManager.generateCompletion(
  'Explain quantum computing',
  {
    provider: 'bedrock',
    maxTokens: 500,
    temperature: 0.3
  }
);

// Conversation with history
const messages = [
  { role: 'user', content: 'My name is Alice' },
  { role: 'assistant', content: 'Hello Alice!' },
  { role: 'user', content: 'What is my name?' }
];

const conversationResponse = await llmManager.generateConversationCompletion(
  messages,
  { provider: 'bedrock' }
);
```

### Streaming Responses

```javascript
// Streaming completion
for await (const chunk of llmManager.generateStreamingCompletion(
  'Tell me a story',
  { provider: 'bedrock' }
)) {
  if (chunk.success && chunk.delta) {
    process.stdout.write(chunk.delta);
  }
}
```

## API Reference

### LLMManager

#### Methods

- `generateCompletion(prompt, options)` - Generate text completion
- `generateStreamingCompletion(prompt, options)` - Generate streaming completion
- `generateConversationCompletion(messages, options)` - Generate with conversation history
- `getModels(provider)` - Get available models for a provider
- `getConfigurationStatus()` - Get configuration status for all providers
- `setDefaultProvider(provider)` - Set the default provider

#### Options

```javascript
{
  provider: 'bedrock',           // Provider name
  modelId: 'claude-3-sonnet',   // Model ID
  maxTokens: 1000,              // Maximum tokens
  temperature: 0.7,             // Temperature (0-1)
  systemMessage: 'You are...',  // System message
  stopSequences: ['\n\n']       // Stop sequences
}
```

### BedrockConnection

Direct access to Bedrock functionality:

```javascript
import BedrockConnection from './connections/bedrockConnection.js';

const bedrock = new BedrockConnection();

// Check if ready
if (bedrock.isReady()) {
  const response = await bedrock.generateCompletion('Hello!');
}
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key | Required |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | Required |
| `AWS_REGION` | AWS Region | `us-east-1` |
| `BEDROCK_MODEL_ID` | Claude Model ID | `anthropic.claude-3-sonnet-20240229-v1:0` |
| `BEDROCK_MAX_TOKENS` | Default max tokens | `1000` |
| `BEDROCK_TEMPERATURE` | Default temperature | `0.7` |
| `DEFAULT_PROVIDER` | Default provider | `bedrock` |

### Dynamic Configuration

Update configuration at runtime:

```javascript
import llmManager from './llmManager.js';

// Update Bedrock configuration
llmManager.updateProviderConfig('bedrock', {
  modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
  maxTokens: 2000,
  temperature: 0.5
});
```

## Running Examples

```bash
# Run main examples
npm start

# Run Bedrock-specific examples
node examples/bedrockExample.js

# Development mode with auto-reload
npm run dev
```

## Error Handling

The library provides comprehensive error handling:

```javascript
const response = await llmManager.generateCompletion('Hello');

if (response.success) {
  console.log('Success:', response.content);
} else {
  console.log('Error:', response.error);
}
```

## Supported Models

### Amazon Bedrock (Claude)
- `anthropic.claude-3-sonnet-20240229-v1:0`
- `anthropic.claude-3-haiku-20240307-v1:0`
- `anthropic.claude-3-opus-20240229-v1:0`


## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

For issues and questions:
1. Check the examples in the `examples/` directory
2. Review the configuration in `config/llmConfig.js`
3. Open an issue on GitHub
