'use client';

import { useState } from 'react';
import { getGoogleVeoService } from '@/lib/google-veo-service';

/**
 * Video Generator Component following the workflow:
 * User Input → Backend API → LLM Video Director → Script Approval → Video Generation → Final MP4
 */
export default function VideoGenerator() {
  const [userInput, setUserInput] = useState('');
  const [workflowStep, setWorkflowStep] = useState('input'); // 'input' | 'generating-script' | 'approval' | 'generating-video' | 'complete'
  const [generatedScript, setGeneratedScript] = useState(null);
  const [editedScript, setEditedScript] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [scriptDescription, setScriptDescription] = useState('');
  const [videoResult, setVideoResult] = useState(null);
  const [error, setError] = useState(null);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? '' : 'http://localhost:8000');

  // Step 1 & 2: User Input → Backend API → LLM Video Director
  const handleGenerateScript = async () => {
    if (!userInput.trim()) {
      setError('Please enter a video description or topic');
      return;
    }

    setWorkflowStep('generating-script');
    setError(null);
    setGeneratedScript(null);
    setVideoResult(null);

    try {
      // Call backend API to generate script using LLM Video Director
      const response = await fetch(`${API_URL ? API_URL + '/api' : '/api'}/generate-script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: userInput })
      });

      if (!response.ok) {
        throw new Error(`Failed to generate script: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedScript(data.script);
      setEditedScript(data.script);
      setVideoPrompt(data.video_prompt || data.script);
      setScriptDescription(data.description || '');
      setWorkflowStep('approval');
    } catch (err) {
      setError(err.message || 'Failed to generate script');
      setWorkflowStep('input');
    }
  };

  // Step 3: Script Approval (Human-in-the-loop)
  const handleApproveScript = async () => {
    if (!editedScript.trim()) {
      setError('Script cannot be empty');
      return;
    }

    setWorkflowStep('generating-video');
    setError(null);
    setVideoResult(null);

    try {
      // Step 4: Video Generation Engine (SVD/Google Veo)
      const veoService = await getGoogleVeoService();

      if (!veoService) {
        throw new Error('Google Veo service not available. Please check your API key configuration.');
      }

      // Use the edited script as the video prompt
      const prompt = editedScript.length > 500 
        ? `${editedScript.substring(0, 500)}...` 
        : editedScript;

      console.log('🎥 Generating video with prompt:', prompt);
      const { error: videoError, output } = await veoService.generateWithVeo3(prompt);

      if (videoError) {
        throw new Error(videoError);
      }

      setVideoResult(output);
      setWorkflowStep('complete');
    } catch (err) {
      setError(err.message || 'Failed to generate video');
      setWorkflowStep('approval');
    }
  };

  const handleRejectScript = () => {
    setWorkflowStep('input');
    setGeneratedScript(null);
    setEditedScript('');
    setVideoPrompt('');
    setScriptDescription('');
  };

  const handleStartOver = () => {
    setWorkflowStep('input');
    setUserInput('');
    setGeneratedScript(null);
    setEditedScript('');
    setVideoPrompt('');
    setScriptDescription('');
    setVideoResult(null);
    setError(null);
  };

  return (
    <div className="video-generator-container">
      <div className="video-generator-card">
        <h2 className="video-generator-title">
          🎬 AI Video Generator
        </h2>
        <p className="video-generator-subtitle">
          Generate videos using AI: Input → LLM Director → Approval → Generation
        </p>

        {/* Workflow Progress Indicator */}
        <div className="workflow-progress">
          <div className={`progress-step ${workflowStep === 'input' || workflowStep === 'generating-script' ? 'active' : workflowStep === 'approval' || workflowStep === 'generating-video' || workflowStep === 'complete' ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Input</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${workflowStep === 'generating-script' ? 'active' : workflowStep === 'approval' || workflowStep === 'generating-video' || workflowStep === 'complete' ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">LLM Director</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${workflowStep === 'approval' ? 'active' : workflowStep === 'generating-video' || workflowStep === 'complete' ? 'completed' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Approval</span>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${workflowStep === 'generating-video' ? 'active' : workflowStep === 'complete' ? 'completed' : ''}`}>
            <span className="step-number">4</span>
            <span className="step-label">Generation</span>
          </div>
        </div>

        {/* Step 1: User Input */}
        {workflowStep === 'input' && (
          <div className="step-container">
            <div className="form-group">
              <label htmlFor="user-input" className="form-label">
                What video would you like to create?
              </label>
              <textarea
                id="user-input"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe your video topic or idea... (e.g., Explain quantum computing, A day in the life of a developer, etc.)"
                className="video-prompt-input"
                rows={5}
              />
            </div>
            <button
              onClick={handleGenerateScript}
              disabled={!userInput.trim()}
              className="generate-button"
            >
              <span className="icon">✨</span>
              Generate Script with AI Director
            </button>
          </div>
        )}

        {/* Step 2: Generating Script */}
        {workflowStep === 'generating-script' && (
          <div className="step-container">
            <div className="loading-state">
              <div className="spinner-large"></div>
              <h3>🎭 LLM Video Director is creating your script...</h3>
              <p>This may take a few seconds</p>
            </div>
          </div>
        )}

        {/* Step 3: Script Approval (Human-in-the-loop) */}
        {workflowStep === 'approval' && generatedScript && (
          <div className="step-container">
            <div className="approval-section">
              <h3 className="section-title">📝 Generated Script (Review & Edit)</h3>
              {scriptDescription && (
                <div className="script-description">
                  <strong>Concept:</strong> {scriptDescription}
                </div>
              )}
              <textarea
                value={editedScript}
                onChange={(e) => setEditedScript(e.target.value)}
                className="script-editor"
                rows={10}
                placeholder="Edit the script as needed..."
              />
              <div className="approval-actions">
                <button
                  onClick={handleApproveScript}
                  className="approve-button"
                >
                  <span className="icon">✅</span>
                  Approve & Generate Video
                </button>
                <button
                  onClick={handleRejectScript}
                  className="reject-button"
                >
                  <span className="icon">↩️</span>
                  Reject & Start Over
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Generating Video */}
        {workflowStep === 'generating-video' && (
          <div className="step-container">
            <div className="loading-state">
              <div className="spinner-large"></div>
              <h3>🎥 Generating video with Google Veo...</h3>
              <p>This may take 30-60 seconds</p>
            </div>
          </div>
        )}

        {/* Step 5: Complete - Show Video */}
        {workflowStep === 'complete' && videoResult && (
          <div className="step-container">
            <div className="result-container">
              <h3 className="result-title">✅ Video Generated Successfully!</h3>
              <div className="video-preview">
                <video
                  src={videoResult}
                  controls
                  className="video-player"
                  autoPlay
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              <button
                onClick={handleStartOver}
                className="start-over-button"
              >
                <span className="icon">🔄</span>
                Create Another Video
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
            {workflowStep === 'approval' && (
              <button
                onClick={handleRejectScript}
                className="error-retry-button"
              >
                Start Over
              </button>
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
          max-width: 800px;
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

        .workflow-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f5f7fa;
          border-radius: 12px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e0e0e0;
          color: #999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .progress-step.active .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .progress-step.completed .step-number {
          background: #10b981;
          color: white;
        }

        .step-label {
          font-size: 0.75rem;
          color: #666;
          font-weight: 600;
          text-align: center;
        }

        .progress-step.active .step-label {
          color: #667eea;
        }

        .progress-line {
          flex: 1;
          height: 2px;
          background: #e0e0e0;
          margin: 0 0.5rem;
        }

        .step-container {
          margin-top: 1rem;
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

        .video-prompt-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .video-prompt-input:hover:not(:disabled) {
          border-color: #667eea;
        }

        .video-prompt-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .generate-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .loading-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .spinner-large {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(102, 126, 234, 0.2);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state h3 {
          color: #333;
          margin-bottom: 0.5rem;
        }

        .loading-state p {
          color: #666;
        }

        .approval-section {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .section-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
        }

        .script-description {
          background: white;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          color: #555;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .script-editor {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          min-height: 200px;
          margin-bottom: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .script-editor:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .approval-actions {
          display: flex;
          gap: 1rem;
        }

        .approve-button {
          flex: 1;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .approve-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
        }

        .reject-button {
          flex: 1;
          padding: 1rem 2rem;
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
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

        .reject-button:hover {
          background: #e5e7eb;
          border-color: #d1d5db;
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

        .error-retry-button {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f44;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .result-container {
          margin-top: 1rem;
        }

        .result-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .video-preview {
          margin-bottom: 1.5rem;
        }

        .video-player {
          width: 100%;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .start-over-button {
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
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .start-over-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
        }

        .icon {
          font-size: 1.3rem;
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

          .workflow-progress {
            flex-wrap: wrap;
          }

          .step-label {
            font-size: 0.65rem;
          }

          .approval-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
