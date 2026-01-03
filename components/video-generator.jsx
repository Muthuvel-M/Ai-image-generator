'use client';

import { useState } from 'react';
import { getBytezService } from '@/lib/bytez-service';

/**
 * Video Generator Component using Bytez SDK with Google Veo 3
 */
export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoResult, setVideoResult] = useState(null);
  const [error, setError] = useState(null);
  const [modelId, setModelId] = useState('google/veo-3.0-fast-generate-001');

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      setError('Please enter a video description');
      return;
    }

    setLoading(true);
    setError(null);
    setVideoResult(null);

    try {
      const bytezService = getBytezService();

      if (!bytezService) {
        throw new Error('Bytez service not available. Please check your API key configuration.');
      }

      const { error: apiError, output } = await bytezService.generateVideo(prompt, modelId);

      if (apiError) {
        setError(apiError);
      } else {
        setVideoResult(output);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-generator-container">
      <div className="video-generator-card">
        <h2 className="video-generator-title">
          🎬 AI Video Generator
        </h2>
        <p className="video-generator-subtitle">
          Generate stunning videos using Google Veo 3 and other AI models
        </p>

        <div className="form-group">
          <label htmlFor="model-select" className="form-label">
            Select Model
          </label>
          <select
            id="model-select"
            value={modelId}
            onChange={(e) => setModelId(e.target.value)}
            className="model-select"
            disabled={loading}
          >
            <option value="google/veo-3.0-fast-generate-001">Google Veo 3.0 Fast (Recommended)</option>
            <option value="camenduru/potat1">Camenduru Potat1</option>
            <option value="openai/sora-2">OpenAI Sora 2</option>
            <option value="google/veo-3.1-fast-generate-preview">Google Veo 3.1 Fast</option>
            <option value="google/veo-3.1-generate-preview">Google Veo 3.1 Standard</option>
            <option value="ali-vilab/text-to-video-ms-1.7b">Ali-Vilab Text-to-Video</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="video-prompt" className="form-label">
            Video Description
          </label>
          <textarea
            id="video-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to generate... (e.g., A cat playing with a rose)"
            className="video-prompt-input"
            rows={4}
            disabled={loading}
          />
        </div>

        <button
          onClick={handleGenerateVideo}
          disabled={loading || !prompt.trim()}
          className="generate-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating Video...
            </>
          ) : (
            <>
              <span className="icon">🎥</span>
              Generate Video
            </>
          )}
        </button>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {videoResult && (
          <div className="result-container">
            <h3 className="result-title">Generated Video</h3>
            <div className="result-content">
              <pre>{JSON.stringify(videoResult, null, 2)}</pre>
            </div>

            {videoResult.url && (
              <div className="video-preview">
                <video
                  src={videoResult.url}
                  controls
                  className="video-player"
                  autoPlay
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .video-generator-container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-generator-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2.5rem;
          max-width: 700px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .video-generator-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .video-generator-subtitle {
          color: #666;
          font-size: 1rem;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .model-select {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          background: white;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .model-select:hover:not(:disabled) {
          border-color: #667eea;
        }

        .model-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .model-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .video-prompt-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: all 0.3s ease;
        }

        .video-prompt-input:hover:not(:disabled) {
          border-color: #667eea;
        }

        .video-prompt-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .video-prompt-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f5f5f5;
        }

        .generate-button {
          width: 100%;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .generate-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .generate-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .icon {
          font-size: 1.3rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .error-message {
          margin-top: 1.5rem;
          padding: 1rem;
          background: #fee;
          border-left: 4px solid #f44;
          border-radius: 8px;
          color: #c33;
          font-size: 0.95rem;
        }

        .result-container {
          margin-top: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
          border-radius: 16px;
        }

        .result-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .result-content {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          overflow-x: auto;
          margin-bottom: 1rem;
        }

        .result-content pre {
          margin: 0;
          font-size: 0.875rem;
          color: #333;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .video-preview {
          margin-top: 1rem;
        }

        .video-player {
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .video-generator-container {
            padding: 1rem;
          }

          .video-generator-card {
            padding: 1.5rem;
          }

          .video-generator-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
