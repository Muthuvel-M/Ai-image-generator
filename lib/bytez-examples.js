/**
 * Bytez SDK Examples
 * This file demonstrates various ways to use the Bytez SDK for video generation
 */

import { getBytezService } from './bytez-service';

// Example 1: Basic video generation with Google Veo 3
export async function example1_basicVideoGeneration() {
    console.log('Example 1: Basic Video Generation with Google Veo 3');

    const bytezService = getBytezService();
    const prompt = "A cat playing with a rose in a beautiful garden";

    const { error, output } = await bytezService.generateWithVeo3(prompt);

    if (error) {
        console.error('Error:', error);
        return null;
    }

    console.log('Generated video:', output);
    return output;
}

// Example 2: Video generation with alternative model
export async function example2_alternativeModel() {
    console.log('Example 2: Video Generation with Ali-Vilab Model');

    const bytezService = getBytezService();
    const prompt = "A sunset over the ocean with waves crashing";

    const { error, output } = await bytezService.generateWithAliVilab(prompt);

    if (error) {
        console.error('Error:', error);
        return null;
    }

    console.log('Generated video:', output);
    return output;
}

// Example 3: List all available models
export async function example3_listModels() {
    console.log('Example 3: List All Available Models');

    const bytezService = getBytezService();
    const { error, output } = await bytezService.listModels();

    if (error) {
        console.error('Error:', error);
        return null;
    }

    console.log('Available models:', output);
    return output;
}

// Example 4: List all available tasks
export async function example4_listTasks() {
    console.log('Example 4: List All Available Tasks');

    const bytezService = getBytezService();
    const { error, output } = await bytezService.listTasks();

    if (error) {
        console.error('Error:', error);
        return null;
    }

    console.log('Available tasks:', output);
    return output;
}

// Example 5: Custom model usage
export async function example5_customModel(modelId, prompt) {
    console.log(`Example 5: Custom Model Usage (${modelId})`);

    const bytezService = getBytezService();
    const { error, output } = await bytezService.generateVideo(prompt, modelId);

    if (error) {
        console.error('Error:', error);
        return null;
    }

    console.log('Generated video:', output);
    return output;
}

// Example 6: Batch video generation
export async function example6_batchGeneration(prompts) {
    console.log('Example 6: Batch Video Generation');

    const bytezService = getBytezService();
    const results = [];

    for (const prompt of prompts) {
        console.log(`Generating video for: "${prompt}"`);
        const { error, output } = await bytezService.generateWithVeo3(prompt);

        results.push({
            prompt,
            error,
            output
        });
    }

    console.log('Batch generation results:', results);
    return results;
}

// Example usage in a React component or API route
export async function generateVideoFromUserInput(userPrompt, selectedModel = 'google/veo-3.0-fast-generate-001') {
    try {
        const bytezService = getBytezService();

        if (!bytezService) {
            throw new Error('Bytez service is not configured. Please check your API key.');
        }

        // Validate prompt
        if (!userPrompt || userPrompt.trim().length === 0) {
            throw new Error('Please provide a valid video description');
        }

        // Generate video
        const { error, output } = await bytezService.generateVideo(userPrompt, selectedModel);

        if (error) {
            throw new Error(error);
        }

        return {
            success: true,
            data: output,
            prompt: userPrompt,
            model: selectedModel
        };

    } catch (error) {
        console.error('Video generation failed:', error);
        return {
            success: false,
            error: error.message,
            prompt: userPrompt,
            model: selectedModel
        };
    }
}

// Sample prompts for testing
export const samplePrompts = [
    "A cat playing with a rose",
    "A majestic eagle flying over mountains at sunrise",
    "Fireworks exploding over a city skyline at night",
    "A peaceful stream flowing through a forest",
    "A futuristic city with flying cars",
    "Ocean waves crashing on a tropical beach",
    "A time-lapse of flowers blooming",
    "Northern lights dancing in the night sky",
    "A butterfly landing on a flower",
    "Rain falling on a window with city lights in the background"
];

// Model configurations
export const availableModels = [
    {
        id: 'camenduru/potat1',
        name: 'Camenduru Potat1',
        description: 'Fast and efficient video generation model',
        capabilities: ['text-to-video', 'fast-generation', 'efficient']
    },
    {
        id: 'openai/sora-2',
        name: 'OpenAI Sora 2',
        description: 'OpenAI\'s latest video generation model with exceptional quality',
        capabilities: ['text-to-video', 'high-quality', 'cinematic', 'realistic']
    },
    {
        id: 'google/veo-3.0-fast-generate-001',
        name: 'Google Veo 3.0 Fast',
        description: 'Fast variant of Google Veo 3 for quick video generation',
        capabilities: ['text-to-video', 'high-quality', 'fast-generation']
    },
    {
        id: 'google/veo-3.1-fast-generate-preview',
        name: 'Google Veo 3.1 Fast',
        description: 'Faster variant of Google Veo 3 for quick video generation',
        capabilities: ['text-to-video', 'high-quality', 'fast-generation']
    },
    {
        id: 'google/veo-3.1-generate-preview',
        name: 'Google Veo 3.1 Standard',
        description: 'State-of-the-art video generation from Google',
        capabilities: ['text-to-video', 'high-quality', 'long-form']
    },
    {
        id: 'ali-vilab/text-to-video-ms-1.7b',
        name: 'Ali-Vilab Text-to-Video',
        description: 'Efficient text-to-video generation model',
        capabilities: ['text-to-video', 'fast-generation']
    }
];
