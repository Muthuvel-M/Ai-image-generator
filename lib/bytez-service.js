import Bytez from 'bytez.js';

/**
 * Bytez Service for AI Video Generation
 * Supports multiple video generation models including Google Veo 3
 */

class BytezService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('Bytez API key is required');
        }
        this.sdk = new Bytez(apiKey);
    }

    /**
   * Generate a video using the specified model
   * @param {string} prompt - The text prompt describing the video to generate
   * @param {string} modelId - The model ID to use (default: google/veo-3.0-fast-generate-001)
   * @returns {Promise<{error: any, output: any}>} - The video generation result
   */
    async generateVideo(prompt, modelId = 'google/veo-3.0-fast-generate-001') {
        try {
            const model = this.sdk.model(modelId);
            const result = await model.run(prompt);

            return result;
        } catch (error) {
            console.error('Error generating video:', error);
            return {
                error: error.message || 'Failed to generate video',
                output: null
            };
        }
    }

    /**
     * List all available tasks
     * @returns {Promise<{error: any, output: any}>} - List of available tasks
     */
    async listTasks() {
        try {
            const result = await this.sdk.list.tasks();
            return result;
        } catch (error) {
            console.error('Error listing tasks:', error);
            return {
                error: error.message || 'Failed to list tasks',
                output: null
            };
        }
    }

    /**
     * List all available models
     * @returns {Promise<{error: any, output: any}>} - List of available models
     */
    async listModels() {
        try {
            const result = await this.sdk.list.models();
            return result;
        } catch (error) {
            console.error('Error listing models:', error);
            return {
                error: error.message || 'Failed to list models',
                output: null
            };
        }
    }

    /**
   * Generate video with Camenduru Potat1 model
   * @param {string} prompt - The text prompt describing the video
   * @returns {Promise<{error: any, output: any}>} - The video generation result
   */
    async generateWithPotat1(prompt) {
        return this.generateVideo(prompt, 'camenduru/potat1');
    }

    /**
   * Generate video with OpenAI Sora 2 model
   * @param {string} prompt - The text prompt describing the video
   * @returns {Promise<{error: any, output: any}>} - The video generation result
   */
    async generateWithSora2(prompt) {
        return this.generateVideo(prompt, 'openai/sora-2');
    }

    /**
   * Generate video with Google Veo 3.0 Fast model
   * @param {string} prompt - The text prompt describing the video
   * @returns {Promise<{error: any, output: any}>} - The video generation result
   */
    async generateWithVeo3(prompt) {
        return this.generateVideo(prompt, 'google/veo-3.0-fast-generate-001');
    }

    /**
     * Generate video with alternative text-to-video model
     * @param {string} prompt - The text prompt describing the video
     * @returns {Promise<{error: any, output: any}>} - The video generation result
     */
    async generateWithAliVilab(prompt) {
        return this.generateVideo(prompt, 'ali-vilab/text-to-video-ms-1.7b');
    }
}

// Get API key from environment variable
const getApiKey = () => {
    if (typeof window !== 'undefined') {
        // Client-side
        return process.env.NEXT_PUBLIC_BYTEZ_API_KEY;
    }
    // Server-side
    return process.env.NEXT_PUBLIC_BYTEZ_API_KEY;
};

// Create and export a singleton instance
let bytezServiceInstance = null;

export const getBytezService = () => {
    if (!bytezServiceInstance) {
        const apiKey = getApiKey();
        if (!apiKey) {
            console.warn('Bytez API key not found in environment variables');
            return null;
        }
        bytezServiceInstance = new BytezService(apiKey);
    }
    return bytezServiceInstance;
};

// Export the class for custom instantiation
export default BytezService;
