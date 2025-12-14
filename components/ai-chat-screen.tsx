"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, ImageIcon, Lightbulb, Wand2, ChevronDown, Menu } from "lucide-react"
import { FloatingDots } from "./floating-dots"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  isImagePrompt?: boolean
  imageUrl?: string
}

const isImageGenerationPrompt = (text: string): boolean => {
  const imageKeywords = [
    "generate",
    "create",
    "make",
    "draw",
    "paint",
    "design",
    "image",
    "picture",
    "photo",
    "art",
    "illustration",
    "visual",
    "realistic",
    "artistic",
    "render",
    "sketch",
  ]
  const lowerText = text.toLowerCase()
  return imageKeywords.some((keyword) => lowerText.includes(keyword))
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

export function AIChatScreen() {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasStartedConversation = messages.length > 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const simulateAIResponse = (userMessage: string) => {
    const isImageRequest = isImageGenerationPrompt(userMessage)

    if (isImageRequest) {
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
      setIsTyping(true)
      setTimeout(() => {
        const aiResponses = [
          "I'd be happy to help you create that image! Let me work on generating something beautiful based on your description.",
          "Great idea! I'm processing your request and will create a stunning visual for you.",
          "Interesting concept! I'll generate an image that captures your vision perfectly.",
          "I love your creativity! Working on transforming your idea into a visual masterpiece.",
          "I'd be happy to help you with that! Let me know if you have any specific requirements.",
          "Great question! I can assist you with various creative tasks.",
          "Interesting idea! Would you like me to generate an image for you? Just describe what you'd like to see.",
          "I'm here to help! Feel free to ask me to create images or answer any questions.",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      const newMessage: Message = {
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

  const handleQuickAction = (action: string) => {
    const prompts: Record<string, string> = {
      "Generate Art": "Create an artistic abstract painting with vibrant colors",
      "Photo Realistic": "Generate a photo-realistic landscape image",
      "Get Ideas": "Suggest some creative image ideas for a portfolio",
      Enhance: "Help me enhance my creative vision",
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
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-foreground text-background rounded-br-md"
                        : "bg-white border border-border/50 text-foreground rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-sm md:text-base leading-relaxed">{message.content}</p>
                    {message.imageUrl && (
                      <div className="mt-3">
                        <img
                          src={message.imageUrl || "/placeholder.svg"}
                          alt="AI Generated"
                          className="rounded-lg w-full max-w-sm"
                        />
                      </div>
                    )}
                    <span
                      className={`text-xs mt-1 block ${
                        message.sender === "user" ? "text-background/60" : "text-muted-foreground"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              ))}

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
                  placeholder="Describe the image you want to create..."
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-base"
                />
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
                  onClick={() => handleQuickAction("Generate Art")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
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
                <button
                  type="button"
                  onClick={() => handleQuickAction("Get Ideas")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Get Ideas</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickAction("Enhance")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Enhance</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
