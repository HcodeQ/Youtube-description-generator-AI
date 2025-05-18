"use client"
import { useState, useEffect } from "react"
import { FileText, Languages, Youtube } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DescriptionForm } from "@/components/description-form"
import { TranscriptionForm } from "@/components/transcription-form"
import { PreviewForm } from "@/components/preview-form"
import type {FormData } from "@/types"

export function YoutubeDescriptionGenerator() {
  const [videoUrl, setVideoUrl] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedData, setGeneratedData] = useState<FormData | null>(null)
  const [isSliding, setIsSliding] = useState(false)

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url)
  }
  const handleGenerateStart = () => {
    setIsGenerating(true)
    setIsSliding(true)
    // Déclencher l'animation de glissement avant d'afficher la prévisualisation
    setTimeout(() => {
      setShowPreview(true)
    }, 400) // Attendre que l'animation de glissement soit presque terminée
  }

  const handleGenerateComplete = (data: FormData) => {
    setGeneratedData(data)
    setIsGenerating(false)
  }

  // Réinitialiser l'état de sliding une fois l'animation terminée
  useEffect(() => {
    if (isSliding && showPreview) {
      const timer = setTimeout(() => {
        setIsSliding(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isSliding, showPreview])

  return (
    <div
      className={`w-full max-w-[1200px] transition-all duration-500 ease-in-out flex ${showPreview ? "justify-between" : "justify-center"}`}
    >
      {/* Conteneur pour le formulaire principal avec animation */}
      <div
        className={`transition-all duration-500 ease-in-out ${showPreview ? "w-full lg:w-1/2" : "w-full max-w-2xl"} ${
          isSliding ? "animate-slide-left" : ""
        }`}
      >
        <Card className="shadow-sm border border-gray-200 overflow-hidden h-full">
          <CardHeader className="pb-0 border-b-0">
            <div className="flex items-center gap-2 mb-2">
              <Youtube className="h-5 w-5 text-red-500" />
              <h1 className="text-xl font-medium">YouTube Assistant</h1>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description Generator
                </TabsTrigger>
                <TabsTrigger value="transcription" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Transcription
                </TabsTrigger>
              </TabsList>

              <div className="border-t border-gray-100 pt-4">
                <TabsContent value="description" className="mt-0">
                  <DescriptionForm
                    onVideoUrlChange={handleVideoUrlChange}
                    videoUrl={videoUrl}
                    onGenerateStart={handleGenerateStart}
                    onGenerateComplete={handleGenerateComplete}
                  />
                </TabsContent>

                <TabsContent value="transcription" className="mt-0">
                  <TranscriptionForm
                    onVideoUrlChange={handleVideoUrlChange}
                    videoUrl={videoUrl}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Prévisualisation avec animation d'apparition */}
      {showPreview && (
        <div className="w-full lg:w-1/2 ml-6 transition-all duration-500 animate-slide-in">
          <PreviewForm data={generatedData} />
        </div>
      )}
    </div>
  )
}
