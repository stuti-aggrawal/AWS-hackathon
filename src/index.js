/**
 * Bedrock LLM Connector
 * Production-ready Amazon Bedrock connector with bearer token support
 * 
 * @author Your Name
 * @version 1.0.0
 */

import llmManager from './llmManager.js';
import llmConfig from './config/llmConfig.js';

// Export the main components for external use
export { llmManager, llmConfig };

// Export default as the manager for convenience
export default llmManager;

/**
 * Quick setup function for easy initialization
 * @param {Object} options - Configuration options
 * @returns {Object} Configured LLM manager
 */
export function createBedrockConnector(options = {}) {
  // Update configuration if provided
  if (options.bearerToken) {
    llmManager.updateProviderConfig('bedrock', {
      bearerToken: options.bearerToken,
      region: options.region || 'us-east-1',
      modelId: options.modelId || 'anthropic.claude-3-sonnet-20240229-v1:0',
      maxTokens: options.maxTokens || 1000,
      temperature: options.temperature || 0.7
    });
  }
  
  return llmManager;
}

/**
 * Check if the connector is properly configured
 * @returns {Object} Configuration status
 */
export function getConnectionStatus() {
  return llmManager.getConfigurationStatus();
}

/**
 * Simple completion function for quick usage
 * @param {string} prompt - The prompt to send
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Completion response
 */
export async function complete(prompt, options = {}) {
  return await llmManager.generateCompletion(prompt, {
    provider: 'bedrock',
    ...options
  });
}
