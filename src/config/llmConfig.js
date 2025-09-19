import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Dynamic LLM Configuration Manager
 * Handles credentials and settings for different LLM providers
 */
class LLMConfig {
  constructor() {
    this.configs = {
      bedrock: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bearerToken: process.env.AWS_BEARER_TOKEN_BEDROCK,
        region: process.env.AWS_REGION || 'us-east-1',
        modelId: process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0',
        maxTokens: parseInt(process.env.BEDROCK_MAX_TOKENS) || 1000,
        temperature: parseFloat(process.env.BEDROCK_TEMPERATURE) || 0.7
      }
    };

    this.defaults = {
      provider: process.env.DEFAULT_PROVIDER || 'bedrock',
      model: process.env.DEFAULT_MODEL || 'anthropic.claude-3-sonnet-20240229-v1:0',
      maxTokens: parseInt(process.env.DEFAULT_MAX_TOKENS) || 1000,
      temperature: parseFloat(process.env.DEFAULT_TEMPERATURE) || 0.7
    };
  }

  /**
   * Get configuration for a specific provider
   * @param {string} provider - The LLM provider name
   * @returns {Object} Provider configuration
   */
  getProviderConfig(provider) {
    const config = this.configs[provider];
    if (!config) {
      throw new Error(`Provider '${provider}' not supported. Available providers: ${Object.keys(this.configs).join(', ')}`);
    }
    return config;
  }

  /**
   * Get default configuration
   * @returns {Object} Default configuration
   */
  getDefaultConfig() {
    return this.defaults;
  }

  /**
   * Update provider configuration dynamically
   * @param {string} provider - The LLM provider name
   * @param {Object} newConfig - New configuration object
   */
  updateProviderConfig(provider, newConfig) {
    if (!this.configs[provider]) {
      throw new Error(`Provider '${provider}' not supported`);
    }
    this.configs[provider] = { ...this.configs[provider], ...newConfig };
  }

  /**
   * Check if a provider is configured
   * @param {string} provider - The LLM provider name
   * @returns {boolean} True if provider has required credentials
   */
  isProviderConfigured(provider) {
    const config = this.configs[provider];
    if (!config) return false;
    
    // Check for required credentials based on provider
    if (provider === 'bedrock') {
      // Support both traditional AWS credentials and bearer token
      return !!(config.accessKeyId && config.secretAccessKey) || !!config.bearerToken;
    }
    
    // Check for required API key for other providers
    return !!config.apiKey;
  }

  /**
   * Get list of configured providers
   * @returns {Array} Array of configured provider names
   */
  getConfiguredProviders() {
    return Object.keys(this.configs).filter(provider => this.isProviderConfigured(provider));
  }

  /**
   * Validate all configurations
   * @returns {Object} Validation results
   */
  validateConfigurations() {
    const results = {};
    
    for (const [provider, config] of Object.entries(this.configs)) {
      results[provider] = {
        configured: this.isProviderConfigured(provider),
        missingFields: []
      };

      // Bedrock doesn't use apiKey, it uses AWS credentials

      // Provider-specific validations
      if (provider === 'bedrock') {
        // Check for either traditional AWS credentials OR bearer token
        const hasTraditionalCreds = config.accessKeyId && config.secretAccessKey;
        const hasBearerToken = config.bearerToken;
        
        if (!hasTraditionalCreds && !hasBearerToken) {
          results[provider].missingFields.push('accessKeyId, secretAccessKey, or bearerToken');
        }
      }
    }

    return results;
  }
}

// Export singleton instance
export default new LLMConfig();
