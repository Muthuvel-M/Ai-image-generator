#!/usr/bin/env node

/**
 * Test script for Bytez SDK integration
 * Run with: node test-bytez.js
 */

import Bytez from 'bytez.js';

// Your API key
const BYTEZ_API_KEY = 'dc00a414d1dfb6d2e5c1749234b82db3';

async function testBytezSDK() {
    console.log('🧪 Testing Bytez SDK Integration\n');
    console.log('='.repeat(50));

    try {
        // Initialize SDK
        console.log('\n1️⃣  Initializing Bytez SDK...');
        const sdk = new Bytez(BYTEZ_API_KEY);
        console.log('✅ SDK initialized successfully\n');

        // Test 1: List available tasks
        console.log('2️⃣  Fetching available tasks...');
        const { error: tasksError, output: tasks } = await sdk.list.tasks();

        if (tasksError) {
            console.error('❌ Error listing tasks:', tasksError);
        } else {
            console.log('✅ Available tasks:', tasks ? `${tasks.length || 'N/A'} tasks found` : 'N/A');
        }

        // Test 2: List available models
        console.log('\n3️⃣  Fetching available models...');
        const { error: modelsError, output: models } = await sdk.list.models();

        if (modelsError) {
            console.error('❌ Error listing models:', modelsError);
        } else {
            console.log('✅ Available models:', models ? `${models.length || 'N/A'} models found` : 'N/A');
        }

        // Test 3: Generate a test video with Google Veo 3.0 Fast
        console.log('\n4️⃣  Testing video generation with Google Veo 3.0 Fast...');
        console.log('   Prompt: "A cat playing with a rose"');
        console.log('   Model: google/veo-3.0-fast-generate-001');
        console.log('   ⏳ This may take a while...\n');

        const model = sdk.model('google/veo-3.0-fast-generate-001');
        const input = "A cat playing with a rose";

        const startTime = Date.now();
        const { error, output } = await model.run(input);
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        if (error) {
            console.error('❌ Error generating video:', error);
        } else {
            console.log(`✅ Video generated successfully in ${duration}s`);
            console.log('\n📹 Output:');
            console.log(JSON.stringify(output, null, 2));
        }

        console.log('\n' + '='.repeat(50));
        console.log('✅ All tests completed!');

    } catch (err) {
        console.error('\n❌ Fatal error:', err.message);
        console.error(err);
    }
}

// Run the tests
testBytezSDK().catch(console.error);
