"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export function ImageUpload({ value, onChange, label = "PRODUCT IMAGE" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [manualUrl, setManualUrl] = useState(value)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)
      setUploadError("")

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          onChange(result.data.url)
          setManualUrl(result.data.url)
        } else {
          setUploadError(result.error || "FALLA AL SUBIR IMAGEN")
        }
      } catch (error) {
        setUploadError("Fallo al subir imagen. Intenta de nuevo")
      } finally {
        setIsUploading(false)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleManualUrlChange = (url: string) => {
    setManualUrl(url)
    onChange(url)
  }

  const clearImage = () => {
    onChange("")
    setManualUrl("")
  }

  return (
    <div className="space-y-4">
      <Label className="neo-heading text-sm" style={{ fontFamily: "var(--font-montserrat)" }}>
        {label}
      </Label>

      {value ? (
        <div className="neo-card p-4 space-y-4">
          <div className="relative">
            <Image
              src={value || "/placeholder.svg"}
              alt="Product preview"
              width={200}
              height={150}
              className="w-full h-48 object-cover border-2 border-border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={clearImage}
              className="absolute top-2 right-2 neo-button font-bold"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground break-all">{value}</p>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`neo-card p-8 border-dashed cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-primary bg-primary/5 shadow-[6px_6px_0px_0px_theme(colors.primary)]"
              : "hover:shadow-[6px_6px_0px_0px_theme(colors.border)]"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center space-y-4">
            {isUploading ? (
              <>
                <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
                <div>
                  <p className="neo-heading text-lg" style={{ fontFamily: "var(--font-montserrat)" }}>
                    UPLOADING...
                  </p>
                  <p className="text-sm text-muted-foreground">Please wait while we upload your image</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  {isDragActive ? (
                    <Upload className="w-12 h-12 text-primary" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="neo-heading text-lg" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {isDragActive ? "AGREGA IMAGEN AQUI" : "ARRASTRA Y SUELTA LA IMAGEN AQUI"}
                  </p>
                  <p className="text-sm text-muted-foreground">o toca para buscar • PNG, JPG, WEBP up to 5MB</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {uploadError && (
        <div className="neo-card p-3 bg-destructive/10 border-destructive text-destructive text-sm">{uploadError}</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="manual-url" className="neo-heading text-sm" style={{ fontFamily: "var(--font-montserrat)" }}>
          O INGRESA LA URL DE LA IMAGEN
        </Label>
        <div className="flex gap-2">
          <Input
            id="manual-url"
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="neo-button flex-1"
            placeholder="https://drive.com/image.jpg"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleManualUrlChange(manualUrl)}
            className="neo-button font-bold bg-transparent"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            USAR URL
          </Button>
        </div>
      </div>
    </div>
  )
}
