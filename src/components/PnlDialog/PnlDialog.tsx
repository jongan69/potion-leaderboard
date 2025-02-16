"use client"
import { useRef, useState, useEffect } from "react"
import { Share1Icon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"

interface PnlDialogProps {
    totalInvested: number;
    totalSold: number;
    roi: number;
    tokenSymbol: string;
    tokenImage: string;
    userName: string;
}

const loadFont = async () => {
    try {
        const timeout = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Font loading timed out')), 3000)
        })
        
        await Promise.race([
            document.fonts.load('bold 48px "Inter"'),
            timeout
        ])
        
        await Promise.race([
            document.fonts.load('400 32px "Inter"'),
            timeout
        ])
    } catch (error) {
        console.error('Failed to load fonts:', error)
        // Fallback to system fonts
    }
}

const createPnlImage = async (
    canvas: HTMLCanvasElement,
    props: PnlDialogProps
) => {
    await loadFont()
    
    const ctx = canvas.getContext("2d")
    if (!ctx) {
        throw new Error("Could not get canvas context")
    }

    // Load and get background image dimensions
    const bgImage = new window.Image()
    bgImage.crossOrigin = "anonymous"
    
    try {
        await new Promise<void>((resolve) => {
            bgImage.onload = () => {
                canvas.width = bgImage.width
                canvas.height = bgImage.height
                resolve()
            }
            bgImage.onerror = () => {
                throw new Error("Failed to load background image")
            }
            bgImage.src = "/pnl-bg.png"
        })
        
        ctx.drawImage(bgImage, 0, 0)
    } catch (error) {
        console.error("Background image loading error:", error)
        throw error
    }

    // Adjust token size and position based on background dimensions
    try {
        const tokenImg = new window.Image()
        tokenImg.crossOrigin = "anonymous"
        
        await new Promise<void>((resolve) => {
            tokenImg.onload = () => {
                const size = Math.min(canvas.width, canvas.height) * 0.15
                const x = canvas.width / 2 - size / 2
                const y = canvas.height * 0.25

                ctx.save()
                ctx.beginPath()
                ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true)
                ctx.closePath()
                ctx.clip()

                ctx.drawImage(tokenImg, x, y, size, size)
                ctx.restore()
                resolve()
            }
            tokenImg.onerror = () => {
                console.warn("Failed to load token image, continuing without it")
                resolve()
            }
            tokenImg.src = props.tokenImage
        })
    } catch (error) {
        console.error("Token image loading error:", error)
    }

    // Scale text sizes relative to canvas dimensions
    const fontSize = Math.min(canvas.width, canvas.height) * 0.06 // 6% of smallest dimension
    const statsFontSize = fontSize * 0.67 // Stats are 2/3 the size of title
    
    ctx.fillStyle = "white"
    ctx.textAlign = "center"
    const centerX = canvas.width / 2

    // Title
    ctx.font = `bold ${fontSize}px "Inter"`
    ctx.fillText(
        `${props.userName}'s ${props.tokenSymbol} Stats`, 
        centerX, 
        canvas.height * 0.5 // 35% from top
    )

    // Stats
    ctx.font = `400 ${statsFontSize}px "Inter"`
    const lineHeight = fontSize * 1.2
    let currentY = canvas.height * 0.6 // Start stats at 50% from top

    // Draw stats with relative positioning
    ctx.fillText(
        `Total Invested: $${props.totalInvested.toLocaleString()}`, 
        centerX, 
        currentY
    )
    currentY += lineHeight

    ctx.fillText(
        `Total Sold: $${props.totalSold.toLocaleString()}`, 
        centerX, 
        currentY
    )
    currentY += lineHeight

    ctx.fillText(
        `ROI: ${props.roi.toFixed(2)}%`, 
        centerX, 
        currentY
    )

    try {
        const dataUrl = canvas.toDataURL("image/png")
        if (!dataUrl) {
            throw new Error("Failed to generate data URL from canvas")
        }
        return dataUrl
    } catch (error) {
        console.error("Canvas export error:", error)
        throw error
    }
}

export function PnlDialog(props: PnlDialogProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [imageUrl, setImageUrl] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
    const [bgDimensions, setBgDimensions] = useState<{ width: number; height: number } | null>(null)
    const [error, setError] = useState<string | null>(null)

    const getBackgroundImageDimensions = async () => {
        if (bgDimensions) return bgDimensions
        
        return new Promise<{ width: number; height: number }>((resolve) => {
            const img = new window.Image()
            img.onload = () => {
                const dimensions = { width: img.width, height: img.height }
                setBgDimensions(dimensions)
                resolve(dimensions)
            }
            img.onerror = () => {
                throw new Error("Failed to load background image")
            }
            img.src = "/pnl-bg.png"
        })
    }

    const generateImage = async () => {
        try {
            setIsLoading(true)
            if (!canvasRef.current) {
                throw new Error("Canvas element not found")
            }

            // Get and set image dimensions
            const dimensions = await getBackgroundImageDimensions()
            setImageDimensions(dimensions)

            const url = await createPnlImage(canvasRef.current, props)
            if (!url) {
                throw new Error("No URL returned from createPnlImage")
            }

            setImageUrl(url)
            console.log("Image generated successfully")
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error generating image:", error.message)
                setError(error.message)
            } else {
                console.error("Error generating image:", String(error))
                setError(String(error))
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenChange = async (open: boolean) => {
        if (open) {
            // Small delay to ensure canvas is mounted
            setTimeout(async () => {
                await generateImage()
            }, 0)
        }
    }

    const handleDownload = () => {
        if (imageUrl) {
            const link = document.createElement("a")
            link.href = imageUrl
            link.download = `${props.userName}-${props.tokenSymbol}-stats.png`
            link.click()
        }
    }

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl)
            }
        }
    }, [imageUrl])

    return (
        <Dialog onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline"
                    aria-label={`Share ${props.tokenSymbol} stats`}
                >
                    <Share1Icon className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>PNL Stats Card</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center">
                    <canvas ref={canvasRef} style={{ display: "none" }} />
                    <div 
                        className="relative w-full bg-gray-100 rounded-lg overflow-hidden"
                        style={{
                            aspectRatio: imageDimensions.width && imageDimensions.height 
                                ? `${imageDimensions.width} / ${imageDimensions.height}`
                                : 'auto'
                        }}
                    >
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div 
                                    className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
                                    role="status"
                                    aria-label="Loading stats image"
                                />
                            </div>
                        ) : (
                            imageUrl && (
                                <Image
                                    src={imageUrl}
                                    width={imageDimensions.width}
                                    height={imageDimensions.height}
                                    alt="PNL Stats"
                                    className="w-full h-full object-contain"
                                />
                            )
                        )}
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button
                            type="button"
                            size="sm"
                            className="px-3"
                            onClick={handleDownload}
                            disabled={!imageUrl}
                        >
                            Download Image
                        </Button>
                    </div>
                    {error && (
                        <div className="text-red-500 text-center p-4">
                            Failed to generate image: {error}
                        </div>
                    )}
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}