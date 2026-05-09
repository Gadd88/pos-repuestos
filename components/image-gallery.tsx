"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="neo-card p-8 text-center">
        <div className="w-full h-48 bg-muted border-2 border-border flex items-center justify-center">
          <span className="text-muted-foreground">No image available</span>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <>
      <div className="neo-card p-4 space-y-4">
        <div className="relative">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${productName} - Imagen ${currentIndex + 1}`}
            width={400}
            height={300}
            className="w-full h-64 object-cover border-2 border-border cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />

          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 neo-button bg-background/90"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 neo-button bg-background/90"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 justify-center">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 border-2 border-border transition-all duration-200 ${
                  index === currentIndex ? "bg-primary" : "bg-background hover:bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal for full-size image */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`${productName} - Full size`}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 neo-button bg-background"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <X className="w-4 h-4" />
            </Button>

            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 neo-button bg-background/90"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 neo-button bg-background/90"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
