"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, ImageIcon, Lightbulb, Wand2, ChevronDown, Menu, Search, ThumbsUp, ThumbsDown } from "lucide-react"
import { FloatingDots } from "./floating-dots"

// Helper function to detect if prompt is for image generation
const isImageGenerationPrompt = (text) => {
    const imageKeywords = [
        'generate', 'create', 'draw', 'make', 'design',
        'image', 'picture', 'photo', 'illustration', 'artwork'
    ]
    const lowerText = text.toLowerCase()
    return imageKeywords.some(keyword => lowerText.includes(keyword))
}

// Helper function to detect if prompt is for VIDEO generation
const isVideoGenerationPrompt = (text) => {
    const videoKeywords = [
        'video', 'clip', 'animate', 'talking', 'explain in video',
        'generate video', 'create video', 'make video', 'video about'
    ]
    const lowerText = text.toLowerCase()
    return videoKeywords.some(keyword => lowerText.includes(keyword))
}

// Helper function to detect if prompt is for semantic search
const isSemanticSearchPrompt = (text) => {
    const searchKeywords = [
        'search', 'find', 'look for', 'what is', 'explain',
        'tell me about', 'how does', 'why', 'when', 'where'
    ]
    const lowerText = text.toLowerCase()
    return searchKeywords.some(keyword => lowerText.includes(keyword))
}

function ImageSkeleton() {
    return (
        <div className="w-full max-w-sm">
            <div className="relative aspect-square rounded-xl bg-gradient-to-br from-secondary via-muted to-secondary overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
                    <div className="w-12 h-12 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-muted-foreground/40 animate-pulse" />
                    </div>
                    <div className="space-y-2 w-full">
                        <div className="h-2 bg-muted-foreground/10 rounded-full w-3/4 mx-auto animate-pulse" />
                        <div
                            className="h-2 bg-muted-foreground/10 rounded-full w-1/2 mx-auto animate-pulse"
                            style={{ animationDelay: "150ms" }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground/60 animate-pulse">Generating your image...</p>
                </div>
            </div>
        </div>
    )
}

function SearchSkeleton() {
    return (
        <div className="space-y-3 w-full">
            <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-muted-foreground/60 animate-pulse" />
                <p className="text-sm text-muted-foreground/60 animate-pulse">Searching knowledge base...</p>
            </div>
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-secondary/30 rounded-lg space-y-2">
                    <div className="h-3 bg-muted-foreground/10 rounded w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    <div className="h-3 bg-muted-foreground/10 rounded w-4/5 animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                </div>
            ))}
        </div>
    )
}

export function AIChatScreen() {
    const [inputValue, setInputValue] = useState("")
    const [messages, setMessages] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [isGeneratingImage, setIsGeneratingImage] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [mode, setMode] = useState("search") // "search" or "video"
    const [feedbackGiven, setFeedbackGiven] = useState({}) // Track feedback per message
    const [showFeedbackInput, setShowFeedbackInput] = useState({}) // Show improvement input
    const [improvementText, setImprovementText] = useState({}) // Store improvement suggestions
    const [isGeneratingVideo, setIsGeneratingVideo] = useState({}) // Track video generation per message
    const [videoUrls, setVideoUrls] = useState({}) // Store video URLs per message
    const messagesEndRef = useRef(null)

    // API URL from environment variable
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

    const hasStartedConversation = messages.length > 0

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleFeedback = async (messageId, rating, query) => {
        // Mark as given
        setFeedbackGiven(prev => ({ ...prev, [messageId]: rating }))

        // If thumbs down, show input for improvement
        if (rating === 'down') {
            setShowFeedbackInput(prev => ({ ...prev, [messageId]: true }))
        } else {
            // If thumbs up, send immediately
            await sendFeedbackToBackend(messageId, rating, query, null)
        }
    }

    const handleImprovementSubmit = async (messageId, query) => {
        const improvement = improvementText[messageId]
        if (improvement && improvement.trim()) {
            await sendFeedbackToBackend(messageId, 'down', query, improvement)
            setShowFeedbackInput(prev => ({ ...prev, [messageId]: false }))
        }
    }

    const sendFeedbackToBackend = async (messageId, rating, query, improvement) => {
        try {
            await fetch(`${API_URL}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: query,
                    result_id: messageId,
                    clicked: true,
                    rating: rating === 'up' ? 5 : 1,
                    improvement: improvement
                })
            })
        } catch (error) {
            console.error('Failed to send feedback:', error)
        }
    }

    const handleGenerateVideo = async (messageId, script) => {
        console.log('🎬 Starting video generation for message:', messageId)
        console.log('📝 Script:', script)
        setIsGeneratingVideo(prev => ({ ...prev, [messageId]: true }))

        try {
            console.log('📡 Sending request to backend...')
            // Call backend to generate video
            const response = await fetch(`${API_URL}/api/generate-video`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    script: script,
                    avatar: 'professional_woman'
                })
            })

            console.log('📨 Response status:', response.status)
            console.log('📨 Response OK:', response.ok)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            console.log('✅ Response data:', data)

            if (data.status === 'success') {
                // Video is ready immediately
                const videoUrl = `${API_URL}${data.video_url}`
                console.log('🎥 Video URL:', videoUrl)
                setVideoUrls(prev => ({ ...prev, [messageId]: videoUrl }))
                setIsGeneratingVideo(prev => ({ ...prev, [messageId]: false }))
                console.log('✨ Video state updated successfully!')
            } else {
                console.error('❌ Video generation failed:', data.message)
                throw new Error(data.message || 'Video generation failed')
            }

        } catch (error) {
            console.error('💥 Video generation error:', error)
            setIsGeneratingVideo(prev => ({ ...prev, [messageId]: false }))
            alert(`Failed to generate video: ${error.message}`)
        }
    }

    const simulateAIResponse = async (userMessage) => {
        // Check mode: if video mode, generate video directly
        if (mode === "video") {
            // In video mode, search first but don't show results, just generate video
            const aiMessage = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content: `Generating video for: "${userMessage}"`,
                sender: 'ai',
                timestamp: new Date(),
                isVideoGeneration: true
            }
            setMessages(prev => [...prev, aiMessage])

            try {
                // First, search to get the top result
                const response = await fetch(`${API_URL}/api/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: userMessage, top_k: 1 })
                })

                const data = await response.json()

                if (data.results && data.results.length > 0) {
                    // Use the top result's document as the script
                    const script = data.results[0].document
                    await handleGenerateVideo(aiMessage.id, script)
                } else {
                    // No results found
                    setMessages(prev => [...prev, {
                        id: Date.now().toString(),
                        content: "I couldn't find relevant information for video generation. Try a different query!",
                        sender: "ai",
                        timestamp: new Date(),
                    }])
                }
            } catch (error) {
                console.error('Video generation error:', error)
                setMessages(prev => [...prev, {
                    id: Date.now().toString(),
                    content: "Sorry, I encountered an error while generating the video.",
                    sender: "ai",
                    timestamp: new Date(),
                }])
            }
            return
        }

        // Check in order of priority: IMAGE, then SEARCH
        const isImageRequest = isImageGenerationPrompt(userMessage)
        const isSearchRequest = !isImageRequest && isSemanticSearchPrompt(userMessage)

        if (isImageRequest) {
            // Image Generation
            setIsGeneratingImage(true)
            setTimeout(() => {
                setIsGeneratingImage(false)
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        content: "Here's the image I generated based on your description!",
                        sender: "ai",
                        timestamp: new Date(),
                        isImagePrompt: true,
                        imageUrl: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(userMessage)}`,
                    },
                ])
            }, 3000)
        } else if (isSearchRequest) {
            // Semantic Search
            setIsSearching(true)
            try {
                const response = await fetch(`${API_URL}/api/search`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: userMessage, top_k: 5 })
                })

                const data = await response.json()
                setIsSearching(false)

                if (data.results && data.results.length > 0) {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            content: `Found ${data.results.length} relevant results:`,
                            sender: "ai",
                            timestamp: new Date(),
                            searchResults: data.results,
                            isSearch: true,
                        },
                    ])
                } else {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: Date.now().toString(),
                            content: "I couldn't find relevant information in my knowledge base. Try rephrasing your question!",
                            sender: "ai",
                            timestamp: new Date(),
                        },
                    ])
                }
            } catch (error) {
                setIsSearching(false)
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        content: "Sorry, I'm having trouble connecting to my knowledge base. Make sure the backend server is running!",
                        sender: "ai",
                        timestamp: new Date(),
                    },
                ])
            }
        } else if (isImageRequest) {
            // Image Generation
            setIsGeneratingImage(true)
            setTimeout(() => {
                setIsGeneratingImage(false)
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        content: "Here's the image I generated based on your description!",
                        sender: "ai",
                        timestamp: new Date(),
                        isImagePrompt: true,
                        imageUrl: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(userMessage)}`,
                    },
                ])
            }, 3000)
        } else {
            // General response
            setIsTyping(true)
            setTimeout(() => {
                const aiResponses = [
                    "I can help you search my knowledge base or generate images! Just ask me a question or describe an image you'd like.",
                    "You can ask me about technology topics, or request image generation by describing what you want to create.",
                    "I'm here to help! I can search for information or generate images based on your descriptions.",
                ]
                const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]

                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        content: randomResponse,
                        sender: "ai",
                        timestamp: new Date(),
                    },
                ])
                setIsTyping(false)
            }, 1500)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (inputValue.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                content: inputValue,
                sender: "user",
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, newMessage])
            simulateAIResponse(inputValue)
            setInputValue("")
        }
    }

    const handleQuickAction = (action) => {
        const prompts = {
            "Search AI": "What is artificial intelligence?",
            "Search Quantum": "Explain quantum computing",
            "Generate Art": "Create an artistic abstract painting with vibrant colors",
            "Photo Realistic": "Generate a photo-realistic landscape image",
        }
        setInputValue(prompts[action] || action)
    }

    return (
        <div className="relative h-screen bg-[#fafafa] overflow-hidden flex flex-col">
            {/* Floating Dots Background */}
            <FloatingDots />

            <nav className="relative z-30 w-full px-4 py-3">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between bg-white/80 backdrop-blur-md rounded-full px-6 py-3 shadow-sm border border-border/30">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-background" />
                            </div>
                            <span className="font-semibold text-lg text-foreground">ArtifyAI</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-6">
                            <button className="flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground transition-colors">
                                Features
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="flex items-center gap-1 text-sm text-foreground hover:text-muted-foreground transition-colors">
                                Explore
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button className="text-sm text-foreground hover:text-muted-foreground transition-colors">Pricing</button>
                        </div>

                        {/* Auth Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            <button className="text-sm text-foreground hover:text-muted-foreground transition-colors">Sign In</button>
                            <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity">
                                Get Started for Free
                                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors">
                            <Menu className="w-5 h-5 text-foreground" />
                        </button>
                    </div>
                </div>
            </nav>

            {!hasStartedConversation ? (
                <>
                    {/* Main Content - Welcome Screen */}
                    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-32 -mt-16">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                Transform your ideas into
                            </h1>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-muted-foreground mt-2">
                                stunning visuals with AI
                            </h2>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Chat Messages Area */}
                    <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-4 pb-48">
                        <div className="max-w-3xl mx-auto space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.sender === "user"
                                            ? "bg-foreground text-background rounded-br-md"
                                            : "bg-white border border-border/50 text-foreground rounded-bl-md shadow-sm"
                                            }`}
                                    >
                                        <p className="text-sm md:text-base leading-relaxed">{message.content}</p>

                                        {/* Direct Video Generation Result */}
                                        {message.isVideoGeneration && (
                                            <div className="mt-4 space-y-3">
                                                {isGeneratingVideo[message.id] && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                                            <span>Generating AI video... (10-15 seconds)</span>
                                                        </div>
                                                        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                                                        </div>
                                                    </div>
                                                )}

                                                {videoUrls[message.id] && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Video ready!
                                                        </div>
                                                        <video
                                                            src={videoUrls[message.id]}
                                                            controls
                                                            className="w-full rounded-lg shadow-lg"
                                                            autoPlay
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Search Results */}
                                        {message.searchResults && (
                                            <div className="mt-3 space-y-2">
                                                {message.searchResults.map((result, idx) => {
                                                    const relevance = result.distance
                                                        ? Math.max(0, (1 - result.distance) * 100)
                                                        : 85;

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="p-3 bg-secondary/10 rounded-lg border border-border/30 hover:border-border/60 transition-colors"
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <span className="text-xs font-semibold text-foreground">
                                                                    Result #{idx + 1}
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    <div className="h-1.5 bg-border rounded-full w-16 overflow-hidden">
                                                                        <div
                                                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                                                            style={{ width: `${relevance}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {relevance.toFixed(0)}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-foreground leading-relaxed">
                                                                {result.document}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {/* Image Results */}
                                        {message.imageUrl && (
                                            <div className="mt-3">
                                                <img
                                                    src={message.imageUrl || "/placeholder.svg"}
                                                    alt="AI Generated"
                                                    className="rounded-lg w-full max-w-sm"
                                                />
                                            </div>
                                        )}

                                        {/* Message-level Feedback (only for AI messages) */}
                                        {message.sender === "ai" && !feedbackGiven[message.id] && (
                                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
                                                <span className="text-xs text-muted-foreground">Was this helpful?</span>
                                                <button
                                                    onClick={() => handleFeedback(message.id, 'up', message.content)}
                                                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                                                    title="Thumbs up"
                                                >
                                                    <ThumbsUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleFeedback(message.id, 'down', message.content)}
                                                    className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                                                    title="Thumbs down"
                                                >
                                                    <ThumbsDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Show improvement input when thumbs down is clicked */}
                                        {showFeedbackInput[message.id] && (
                                            <div className="mt-3 pt-3 border-t border-border/20 space-y-2">
                                                <p className="text-xs text-muted-foreground">What could we improve?</p>
                                                <textarea
                                                    value={improvementText[message.id] || ''}
                                                    onChange={(e) => setImprovementText(prev => ({ ...prev, [message.id]: e.target.value }))}
                                                    placeholder="Tell us how we can make this better..."
                                                    className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/20 bg-background resize-none"
                                                    rows="2"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleImprovementSubmit(message.id, message.content)}
                                                        disabled={!improvementText[message.id]?.trim()}
                                                        className="px-3 py-1 bg-foreground text-background rounded-md text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                                    >
                                                        Submit Feedback
                                                    </button>
                                                    <button
                                                        onClick={() => setShowFeedbackInput(prev => ({ ...prev, [message.id]: false }))}
                                                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-xs font-medium hover:bg-secondary/80 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Feedback confirmation */}
                                        {feedbackGiven[message.id] && !showFeedbackInput[message.id] && (
                                            <div className="mt-3 pt-3 border-t border-border/20">
                                                <div className="flex items-center gap-2">
                                                    {feedbackGiven[message.id] === 'up' ? (
                                                        <ThumbsUp className="w-3.5 h-3.5 text-green-600" />
                                                    ) : (
                                                        <ThumbsDown className="w-3.5 h-3.5 text-red-600" />
                                                    )}
                                                    <span className="text-xs text-muted-foreground">
                                                        Thanks for your feedback!
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Video Generation Section (only for search results) */}
                                        {message.searchResults && message.searchResults.length > 0 && (
                                            <div className="mt-4 pt-3 border-t border-border/20">
                                                {!videoUrls[message.id] && !isGeneratingVideo[message.id] && (
                                                    <button
                                                        onClick={() => {
                                                            // Use only the TOP result (most relevant)
                                                            const topResult = message.searchResults[0]
                                                            const script = topResult.document

                                                            console.log('📜 Generated script:', script)
                                                            handleGenerateVideo(message.id, script)
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Generate Video Explanation
                                                    </button>
                                                )}

                                                {isGeneratingVideo[message.id] && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                                                            <span>Generating AI video... (10-15 seconds)</span>
                                                        </div>
                                                        <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                                                        </div>
                                                    </div>
                                                )}

                                                {videoUrls[message.id] && (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Video ready!
                                                        </div>
                                                        <video
                                                            src={videoUrls[message.id]}
                                                            controls
                                                            className="w-full rounded-lg shadow-lg"
                                                            autoPlay
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}




                                        <span
                                            className={`text-xs mt-1 block ${message.sender === "user" ? "text-background/60" : "text-muted-foreground"
                                                }`}
                                        >
                                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isSearching && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-border/50 rounded-2xl rounded-bl-md px-4 py-4 shadow-sm max-w-[80%]">
                                        <SearchSkeleton />
                                    </div>
                                </div>
                            )}

                            {isGeneratingImage && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-border/50 rounded-2xl rounded-bl-md px-4 py-4 shadow-sm">
                                        <ImageSkeleton />
                                    </div>
                                </div>
                            )}

                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-1">
                                            <span
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            />
                                            <span
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            />
                                            <span
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                                style={{ animationDelay: "300ms" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </>
            )}

            {/* Input Box at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-6 pt-4 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white rounded-2xl shadow-lg border border-border/50 p-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={mode === "search" ? "Ask a question or describe an image to create..." : "Enter a topic for video generation..."}
                                    className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                                />
                                {/* Mode Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => setMode(mode === "search" ? "video" : "search")}
                                    className={`p-2 rounded-lg transition-all ${mode === "video"
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                        }`}
                                    title={mode === "search" ? "Switch to Video Mode" : "Switch to Search Mode"}
                                >
                                    {mode === "search" ? (
                                        <Search className="w-5 h-5" />
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    type="submit"
                                    className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-40"
                                    disabled={!inputValue.trim()}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Quick Action Chips */}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => handleQuickAction("Search AI")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span>Search AI</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAction("Search Quantum")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Quantum</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAction("Generate Art")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                                >
                                    <Wand2 className="w-3.5 h-3.5" />
                                    <span>Generate Art</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleQuickAction("Photo Realistic")}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                                >
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    <span>Photo Realistic</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
