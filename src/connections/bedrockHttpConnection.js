import llmConfig from '../config/llmConfig.js';

/**
 * Amazon Bedrock HTTP Connection Manager
 * Handles Amazon Bedrock API interactions with Claude models using HTTP requests and Bearer Token
 */
class BedrockHttpConnection {
  constructor() {
    this.config = null;
    this.initialize();
  }

  /**
   * Initialize connection with current configuration
   */
  initialize() {
    try {
      this.config = llmConfig.getProviderConfig('bedrock');
      
      // Check for either traditional AWS credentials or bearer token
      const hasTraditionalCreds = this.config.accessKeyId && this.config.secretAccessKey;
      const hasBearerToken = this.config.bearerToken;
      
      if (!hasTraditionalCreds && !hasBearerToken) {
        throw new Error('AWS credentials or bearer token not configured for Bedrock');
      }

      // Connection initialized successfully
    } catch (error) {
      console.error('Failed to initialize Bedrock HTTP connection:', error.message);
      this.config = null;
    }
  }

  /**
   * Check if connection is ready
   * @returns {boolean} True if connection is initialized
   */
  isReady() {
    return this.config !== null;
  }

  /**
   * Update configuration and reinitialize
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    llmConfig.updateProviderConfig('bedrock', newConfig);
    this.initialize();
  }

  /**
   * Get the Bedrock endpoint URL
   * @param {string} modelId - The model ID
   * @returns {string} The endpoint URL
   */
  getEndpointUrl(modelId) {
    return `https://bedrock-runtime.${this.config.region}.amazonaws.com/model/${modelId}/invoke`;
  }

  /**
   * Get authentication headers
   * @returns {Object} Headers object
   */
  getAuthHeaders() {
    if (this.config.bearerToken) {
      return {
        'Authorization': `Bearer ${this.config.bearerToken}`
      };
    } else {
      // For traditional AWS credentials, you would need to implement AWS signature
      throw new Error('Traditional AWS credentials not supported in HTTP mode. Use bearer token.');
    }
  }

  /**
   * Generate text completion using Claude
   * @param {string} prompt - Input prompt
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Completion response
   */
  async generateCompletion(prompt, options = {}) {
    if (!this.isReady()) {
      throw new Error('Bedrock HTTP connection not initialized');
    }

    try {
      const modelId = options.modelId || this.config.modelId;
      const maxTokens = options.maxTokens || this.config.maxTokens;
      const temperature = options.temperature || this.config.temperature;

      // Prepare the request body for Claude
      const requestBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      };

      // Add system message if provided
      if (options.systemMessage) {
        requestBody.system = options.systemMessage;
      }

      // Add stop sequences if provided
      if (options.stopSequences) {
        requestBody.stop_sequences = options.stopSequences;
      }

      const endpointUrl = this.getEndpointUrl(modelId);
      const authHeaders = this.getAuthHeaders();

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseBody = await response.json();

      return {
        success: true,
        data: responseBody,
        provider: 'bedrock',
        model: modelId,
        usage: responseBody.usage,
        content: responseBody.content[0].text
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'bedrock'
      };
    }
  }

  /**
   * Generate streaming completion using Claude
   * @param {string} prompt - Input prompt
   * @param {Object} options - Additional options
   * @returns {AsyncGenerator} Streaming response
   */
  async* generateStreamingCompletion(prompt, options = {}) {
    if (!this.isReady()) {
      throw new Error('Bedrock HTTP connection not initialized');
    }

    try {
      const modelId = options.modelId || this.config.modelId;
      const maxTokens = options.maxTokens || this.config.maxTokens;
      const temperature = options.temperature || this.config.temperature;

      // Prepare the request body for Claude streaming
      const requestBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        temperature: temperature,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true
      };

      // Add system message if provided
      if (options.systemMessage) {
        requestBody.system = options.systemMessage;
      }

      const endpointUrl = this.getEndpointUrl(modelId);
      const authHeaders = this.getAuthHeaders();

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.trim() === '') continue;
            
            try {
              const data = JSON.parse(line);
              if (data.type === 'content_block_delta') {
                yield {
                  success: true,
                  data: data,
                  provider: 'bedrock',
                  delta: data.delta?.text || ''
                };
              } else if (data.type === 'message_stop') {
                yield {
                  success: true,
                  data: data,
                  provider: 'bedrock',
                  finished: true
                };
              }
            } catch (parseError) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      yield {
        success: false,
        error: error.message,
        provider: 'bedrock'
      };
    }
  }

  /**
   * Get available models (simplified - returns common Claude models)
   * @returns {Promise<Object>} Models response
   */
  async getModels() {
    if (!this.isReady()) {
      throw new Error('Bedrock HTTP connection not initialized');
    }

    try {
      // Return common Claude models since we can't easily list them via HTTP
      const commonModels = [
        {
          modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
          providerName: 'Anthropic',
          modelName: 'Claude 3 Sonnet'
        },
        {
          modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
          providerName: 'Anthropic',
          modelName: 'Claude 3 Haiku'
        },
        {
          modelId: 'anthropic.claude-3-opus-20240229-v1:0',
          providerName: 'Anthropic',
          modelName: 'Claude 3 Opus'
        }
      ];

      return {
        success: true,
        data: commonModels,
        provider: 'bedrock',
        models: commonModels
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'bedrock'
      };
    }
  }

  /**
   * Get Claude-specific models
   * @returns {Promise<Object>} Claude models list
   */
  async getClaudeModels() {
    return await this.getModels();
  }

  /**
   * Generate completion with conversation history
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Completion response
   */
  async generateConversationCompletion(messages, options = {}) {
    if (!this.isReady()) {
      throw new Error('Bedrock HTTP connection not initialized');
    }

    try {
      const modelId = options.modelId || this.config.modelId;
      const maxTokens = options.maxTokens || this.config.maxTokens;
      const temperature = options.temperature || this.config.temperature;

      const requestBody = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: maxTokens,
        temperature: temperature,
        messages: messages
      };

      // Add system message if provided
      if (options.systemMessage) {
        requestBody.system = options.systemMessage;
      }

      const endpointUrl = this.getEndpointUrl(modelId);
      const authHeaders = this.getAuthHeaders();

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const responseBody = await response.json();

      return {
        success: true,
        data: responseBody,
        provider: 'bedrock',
        model: modelId,
        usage: responseBody.usage,
        content: responseBody.content[0].text
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'bedrock'
      };
    }
  }
}

export default BedrockHttpConnection;
