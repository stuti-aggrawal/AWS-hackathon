import BedrockHttpConnection from './connections/bedrockHttpConnection.js';
import llmConfig from './config/llmConfig.js';

/**
 * Main LLM Manager
 * Handles Amazon Bedrock LLM provider with dynamic configuration
 */
class LLMManager {
  constructor() {
    this.connections = {
      bedrock: new BedrockHttpConnection()
    };
    this.defaultProvider = llmConfig.getDefaultConfig().provider;
  }

  /**
   * Get available providers
   * @returns {Array} List of available provider names
   */
  getAvailableProviders() {
    return Object.keys(this.connections);
  }

  /**
   * Get configured providers
   * @returns {Array} List of configured provider names
   */
  getConfiguredProviders() {
    return llmConfig.getConfiguredProviders();
  }

  /**
   * Check if a provider is ready
   * @param {string} provider - Provider name
   * @returns {boolean} True if provider is ready
   */
  isProviderReady(provider) {
    const connection = this.connections[provider];
    return connection && connection.isReady();
  }

  /**
   * Get connection for a specific provider
   * @param {string} provider - Provider name
   * @returns {Object} Connection instance
   */
  getConnection(provider) {
    if (!this.connections[provider]) {
      throw new Error(`Provider '${provider}' not supported. Available: ${this.getAvailableProviders().join(', ')}`);
    }
    return this.connections[provider];
  }

  /**
   * Generate completion using specified provider
   * @param {string} prompt - Input prompt
   * @param {Object} options - Options including provider
   * @returns {Promise<Object>} Completion response
   */
  async generateCompletion(prompt, options = {}) {
    const provider = options.provider || this.defaultProvider;
    
    if (!this.isProviderReady(provider)) {
      throw new Error(`Provider '${provider}' is not ready. Please check configuration.`);
    }

    const connection = this.getConnection(provider);
    return await connection.generateCompletion(prompt, options);
  }

  /**
   * Generate streaming completion using specified provider
   * @param {string} prompt - Input prompt
   * @param {Object} options - Options including provider
   * @returns {AsyncGenerator} Streaming response
   */
  async* generateStreamingCompletion(prompt, options = {}) {
    const provider = options.provider || this.defaultProvider;
    
    if (!this.isProviderReady(provider)) {
      throw new Error(`Provider '${provider}' is not ready. Please check configuration.`);
    }

    const connection = this.getConnection(provider);
    yield* connection.generateStreamingCompletion(prompt, options);
  }

  /**
   * Generate completion with conversation history
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Options including provider
   * @returns {Promise<Object>} Completion response
   */
  async generateConversationCompletion(messages, options = {}) {
    const provider = options.provider || this.defaultProvider;
    
    if (!this.isProviderReady(provider)) {
      throw new Error(`Provider '${provider}' is not ready. Please check configuration.`);
    }

    const connection = this.getConnection(provider);
    return await connection.generateConversationCompletion(messages, options);
  }

  /**
   * Get available models for a provider
   * @param {string} provider - Provider name
   * @returns {Promise<Object>} Models response
   */
  async getModels(provider) {
    if (!this.isProviderReady(provider)) {
      throw new Error(`Provider '${provider}' is not ready. Please check configuration.`);
    }

    const connection = this.getConnection(provider);
    return await connection.getClaudeModels();
  }

  /**
   * Update provider configuration
   * @param {string} provider - Provider name
   * @param {Object} newConfig - New configuration
   */
  updateProviderConfig(provider, newConfig) {
    if (!this.connections[provider]) {
      throw new Error(`Provider '${provider}' not supported`);
    }

    llmConfig.updateProviderConfig(provider, newConfig);
    this.connections[provider].updateConfig(newConfig);
  }

  /**
   * Validate all provider configurations
   * @returns {Object} Validation results
   */
  validateConfigurations() {
    return llmConfig.validateConfigurations();
  }

  /**
   * Get configuration status for all providers
   * @returns {Object} Configuration status
   */
  getConfigurationStatus() {
    const status = {};
    const validation = this.validateConfigurations();
    
    for (const provider of this.getAvailableProviders()) {
      status[provider] = {
        available: true,
        configured: validation[provider]?.configured || false,
        ready: this.isProviderReady(provider),
        missingFields: validation[provider]?.missingFields || []
      };
    }
    
    return status;
  }

  /**
   * Set default provider
   * @param {string} provider - Provider name
   */
  setDefaultProvider(provider) {
    if (!this.connections[provider]) {
      throw new Error(`Provider '${provider}' not supported`);
    }
    this.defaultProvider = provider;
  }

  /**
   * Get current default provider
   * @returns {string} Default provider name
   */
  getDefaultProvider() {
    return this.defaultProvider;
  }
}

// Export singleton instance
export default new LLMManager();
