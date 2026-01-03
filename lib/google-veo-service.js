
class GoogleVeoService {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('Google API key is required');
        }
        this.apiKey = apiKey;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }


    async generateVideo(prompt) {
        try {
            const model = 'veo-3.1-generate-preview';
            const url = `${this.baseUrl}/models/${model}:predictLongRunning`;

           
            const requestBody = {
                instances: [{
                    prompt: prompt
                }],
                parameters: {
                    aspectRatio: '16:9',
                    resolution: '720p',
                    durationSeconds: 8 
                }
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'x-goog-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
                throw new Error(errorData.error?.message || `API error: ${response.status}`);
            }

            const operationData = await response.json();
            const operationName = operationData.name;

            if (!operationName) {
                throw new Error('No operation name returned from API');
            }

            console.log('Video generation started, operation:', operationName);
            console.log('Polling for completion...');

           
            let operation = operationData;
            const maxAttempts = 60;
            let attempts = 0;

            while (!operation.done && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 10000));

                const statusResponse = await fetch(`${this.baseUrl}/${operationName}`, {
                    headers: {
                        'x-goog-api-key': this.apiKey,
                    }
                });

                if (!statusResponse.ok) {
                    throw new Error(`Failed to check operation status: ${statusResponse.status}`);
                }

                operation = await statusResponse.json();
                attempts++;

                if (operation.done) {
                    console.log('Video generation completed!');
                    break;
                }
            }

            if (!operation.done) {
                throw new Error('Video generation timed out');
            }

           
            const videoUri = operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri;

            if (!videoUri) {
                throw new Error('No video URI found in response');
            }

            console.log('Downloading video from:', videoUri);

           
            const videoResponse = await fetch(videoUri, {
                headers: {
                    'x-goog-api-key': this.apiKey,
                }
            });

            if (!videoResponse.ok) {
                throw new Error(`Failed to download video: ${videoResponse.status}`);
            }

           
            const videoBlob = await videoResponse.blob();
            const videoUrl = URL.createObjectURL(videoBlob);

            return {
                error: null,
                output: videoUrl
            };

        } catch (error) {
            console.error('Error generating video with Google Veo:', error);
            return {
                error: error.message || 'Failed to generate video',
                output: null
            };
        }
    }

    /**
     * Alias for generateVideo (for compatibility)
     */
    async generateWithVeo3(prompt) {
        return this.generateVideo(prompt);
    }
}

// Get API key from backend /api/data endpoint
const getApiKey = async () => {
    try {
       
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_URL}/api/data`);
        if (!response.ok) {
            throw new Error(`Backend responded with status ${response.status}`);
        }
        const data = await response.json();
        return data.video_api_key || null;
    } catch (error) {
        console.error('Failed to fetch API key from backend:', error);
        return null;
    }
};

export const getGoogleVeoService = async () => {
    const apiKey = await getApiKey();
    if (!apiKey) {
        console.warn('Google API key not found in backend response');
        return null;
    }
    return new GoogleVeoService(apiKey);
};

export default GoogleVeoService;
