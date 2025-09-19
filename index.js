/**
 * Bedrock LLM Connector
 * Production-ready Amazon Bedrock connector with bearer token support
 * 
 * @author Your Name
 * @version 1.0.0
 */

import llmManager from './src/llmManager.js';
import llmConfig from './src/config/llmConfig.js';

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

/**
 * Example usage (only runs when file is executed directly)
 */
async function example() {
  console.log('🚀 Bedrock LLM Connector - Example Usage');
  console.log('=======================================\n');

  // Check connection status
  const status = getConnectionStatus();
  if (!status.bedrock.configured) {
    console.log('❌ Bedrock not configured. Please set AWS_BEARER_TOKEN_BEDROCK environment variable.');
    return;
  }

  console.log('✅ Connection ready! Testing with a simple question...\n');

  try {
    const response = await complete('Say "Hello from Bedrock!" and nothing else.');
    
    if (response.success) {
      console.log('🤖 Response:', response.content);
      console.log(`📊 Tokens used: ${response.usage.input_tokens + response.usage.output_tokens}`);
    } else {
      console.log('❌ Error:', response.error);
    }
  } catch (error) {
    console.log('❌ Exception:', error.message);
  }
}

// Run example only if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  example().catch(console.error);
}