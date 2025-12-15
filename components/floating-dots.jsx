"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export function FloatingDots() {
    const [dots, setDots] = useState([])
    const containerRef = useRef(null)
    const animationRef = useRef(undefined)
    const dotsRef = useRef([])

    // Initialize dots
    useEffect(() => {
        const generateDots = () => {
            const newDots = []
            const numDots = 60

            for (let i = 0; i < numDots; i++) {
                const x = Math.random() * window.innerWidth
                const y = Math.random() * window.innerHeight
                newDots.push({
                    id: i,
                    x,
                    y,
                    baseX: x,
                    baseY: y,
                    size: Math.random() * 4 + 2,
                    velocityX: (Math.random() - 0.5) * 0.5,
                    velocityY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.4 + 0.2,
                })
            }
            dotsRef.current = newDots
            setDots(newDots)
        }

        generateDots()

        const handleResize = () => generateDots()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Floating animation
    useEffect(() => {
        const animate = () => {
            dotsRef.current = dotsRef.current.map((dot) => {
                const newX = dot.x + dot.velocityX
                const newY = dot.y + dot.velocityY

                // Gentle return to base position
                const returnForce = 0.001
                dot.velocityX += (dot.baseX - dot.x) * returnForce
                dot.velocityY += (dot.baseY - dot.y) * returnForce

                // Add slight random movement
                dot.velocityX += (Math.random() - 0.5) * 0.02
                dot.velocityY += (Math.random() - 0.5) * 0.02

                // Damping
                dot.velocityX *= 0.99
                dot.velocityY *= 0.99

                return {
                    ...dot,
                    x: newX,
                    y: newY,
                }
            })

            setDots([...dotsRef.current])
            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [])

    // Handle click to scatter dots
    const handleClick = useCallback((e) => {
        const clickX = e.clientX
        const clickY = e.clientY
        const scatterRadius = 200
        const scatterForce = 15

        dotsRef.current = dotsRef.current.map((dot) => {
            const dx = dot.x - clickX
            const dy = dot.y - clickY
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < scatterRadius) {
                const angle = Math.atan2(dy, dx)
                const force = ((scatterRadius - distance) / scatterRadius) * scatterForce

                return {
                    ...dot,
                    velocityX: dot.velocityX + Math.cos(angle) * force,
                    velocityY: dot.velocityY + Math.sin(angle) * force,
                }
            }
            return dot
        })
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 cursor-pointer" onClick={handleClick}>
            {dots.map((dot) => (
                <div
                    key={dot.id}
                    className="absolute rounded-full bg-foreground/30 transition-none"
                    style={{
                        left: dot.x,
                        top: dot.y,
                        width: dot.size,
                        height: dot.size,
                        opacity: dot.opacity,
                        transform: "translate(-50%, -50%)",
                    }}
                />
            ))}
        </div>
    )
}
