"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { EmojiWrapper } from "@/components/emoji-wrapper"
import { InfoTooltip } from "@/components/info-tooltip"
import { UsefulLinksSection } from "@/components/useful-links-section"
import type { FormData, UsefulLink } from "@/types"

interface DescriptionFormProps {
  onVideoUrlChange: (url: string) => void
  videoUrl: string
  onGenerateStart: () => void
  onGenerateComplete: (data: FormData) => void
}

export function DescriptionForm({
  onVideoUrlChange,
  videoUrl,
  onGenerateStart,
  onGenerateComplete,
}: DescriptionFormProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [parametersOpen, setParametersOpen] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [timestampsAuto, setTimestampsAuto] = useState(false)
  const [usefulLinks, setUsefulLinks] = useState<UsefulLink[]>([{ title: "", url: "" }])
  const [videoType, setVideoType] = useState<string>("")
  const [descriptionTone, setDescriptionTone] = useState<string>("")
  const [optionalKeywords, setOptionalKeywords] = useState<string>("")
  const [hashtags, setHashtags] = useState<string>("")
  const [manualTimestamps, setManualTimestamps] = useState<string>("")
  const [language, setLanguage] = useState<string>("fr")
  const [translation, setTranslation] = useState<string>("fr")

  const handleGenerate = async () => {
    setIsGenerating(true)
    onGenerateStart()

    // Préparer les données du formulaire
    const formData: FormData = {
      video_type: videoType || "Tutoriel",
      video_url: videoUrl,
      description_tone: descriptionTone || "based on the transcript tone",
      optional_keywords: optionalKeywords,
      transcript_format: "CHUNKS",
      transcript: "",
      languages: [language],
      translation: translation,
      hashtags: hashtags,
      timestamps_mode: timestampsAuto ? "automatique" : "manuel",
      manual_timestamps: manualTimestamps,
      useful_links: usefulLinks.filter((link) => link.title && link.url).map((link) => ({ [link.title]: link.url })),
    }

    try {
      const res = await fetch('http://127.0.0.1:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      
      if (data.error) {
        console.error('Erreur:', data.error)
      } else {
        // créer un nouvel objet avec les données initiaux et la description
        const updatedData = {
          ...formData,
          description: data
        }
        onGenerateComplete(updatedData)
      }
    } catch (error) {
      console.error('erreur :', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="video-type" className="text-sm font-medium flex items-center">
            <EmojiWrapper emoji="🎬" />
            Video type
            <InfoTooltip text="Select 'Based on video content' to automatically detect the type of your video from its content." />
          </label>
          <Select value={videoType} onValueChange={setVideoType}>
            <SelectTrigger id="video-type" className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutorial">Tutorial</SelectItem>
              <SelectItem value="vlog">Vlog</SelectItem>
              <SelectItem value="review">Product review</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="event">Event Recap</SelectItem>
              <SelectItem value="based_on_content" className="border-t border-gray-100 mt-1 pt-1">
                <div className="flex items-center">
                  <span>Based on video content</span>
                  <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Auto
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="description-tone" className="text-sm font-medium flex items-center">
            <EmojiWrapper emoji="🎭" />
            Description tone
            <InfoTooltip text="Select 'Tone based on video' to automatically analyze and match the tone of your video content." />
          </label>
          <Select value={descriptionTone} onValueChange={setDescriptionTone}>
            <SelectTrigger id="description-tone" className="w-full">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seo">SEO-optimized</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="based_on_video" className="border-t border-gray-100 mt-1 pt-1">
                <div className="flex items-center">
                  <span>Tone based on video</span>
                  <span className="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Auto
                  </span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="video-url-desc" className="text-sm font-medium flex items-center">
          <EmojiWrapper emoji="🔗" />
          Video URL
        </label>
        <Input
          id="video-url-desc"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-red-200"
        />
      </div>

      <Collapsible
        open={parametersOpen}
        onOpenChange={setParametersOpen}
        className="border border-gray-100 rounded-md overflow-hidden"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <EmojiWrapper emoji="🔍" />
            <span>Optional keywords</span>
          </div>
          {parametersOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 border-t border-gray-100">
          <Textarea
            placeholder="Entrez des mots-clés séparés par des virgules pour améliorer le SEO"
            className="resize-none"
            value={optionalKeywords}
            onChange={(e) => setOptionalKeywords(e.target.value)}
          />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        open={advancedOpen}
        onOpenChange={setAdvancedOpen}
        className="border border-gray-100 rounded-md overflow-hidden"
      >
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-sm font-medium hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-2">
            <EmojiWrapper emoji="⚙️" />
            <span>Advanced SEO Settings</span>
          </div>
          {advancedOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-2 border-t border-gray-100 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <EmojiWrapper emoji="#️⃣" />
              Hashtags
            </label>
            <Input
              placeholder="Entrez des hashtags séparés par des espaces"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium flex items-center gap-2">
                <EmojiWrapper emoji="🌍" />
                Langue de la vidéo
                <InfoTooltip text="Sélectionnez la langue principale de la vidéo." />
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Sélectionner la langue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                  <SelectItem value="es">Espagnol</SelectItem>
                  <SelectItem value="de">Allemand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="translation" className="text-sm font-medium flex items-center gap-2">
                <EmojiWrapper emoji="🔄" />
                Langue de traduction
                <InfoTooltip text="Sélectionnez la langue dans laquelle vous souhaitez traduire la transcription." />
              </label>
              <Select value={translation} onValueChange={setTranslation}>
                <SelectTrigger id="translation" className="w-full">
                  <SelectValue placeholder="Sélectionner la traduction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">Anglais</SelectItem>
                  <SelectItem value="es">Espagnol</SelectItem>
                  <SelectItem value="de">Allemand</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <EmojiWrapper emoji="⏱️" />
              Timestamps
            </label>

            <div className="flex items-center space-x-4 mb-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="manual-timestamps"
                  name="timestamps-option"
                  value="manual"
                  checked={!timestampsAuto}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  onChange={() => setTimestampsAuto(false)}
                />
                <label htmlFor="manual-timestamps" className="ml-2 text-sm text-gray-600">
                  Saisir manuellement
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="auto-timestamps"
                  name="timestamps-option"
                  value="auto"
                  checked={timestampsAuto}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  onChange={() => setTimestampsAuto(true)}
                />
                <label htmlFor="auto-timestamps" className="ml-2 text-sm text-gray-600">
                  Générer automatiquement
                </label>
              </div>
            </div>

            {timestampsAuto ? (
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-500 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-red-500" />
                Les timestamps seront générés automatiquement à partir du contenu de la vidéo
              </div>
            ) : (
              <Textarea
                placeholder="00:00 Introduction&#10;01:23 Premier point&#10;05:45 Conclusion"
                className="resize-none h-24"
                value={manualTimestamps}
                onChange={(e) => setManualTimestamps(e.target.value)}
              />
            )}
          </div>

          <UsefulLinksSection links={usefulLinks} onChange={setUsefulLinks} />
        </CollapsibleContent>
      </Collapsible>

      <div className="pt-2">
        <Button
          onClick={handleGenerate}
          disabled={!videoUrl || isGenerating}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-md transition-all duration-200"
        >
          {isGenerating ? "Génération en cours..." : "Generate description"}
        </Button>
      </div>
    </div>
  )
}
