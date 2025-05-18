"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmojiWrapper } from "@/components/emoji-wrapper"
import type { FormData, TranscriptionSettings } from "@/types"

interface TranscriptionFormProps {
  onVideoUrlChange: (url: string) => void
  videoUrl: string
}

export function TranscriptionForm({ onVideoUrlChange, videoUrl}: TranscriptionFormProps) {
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [settings, setSettings] = useState<TranscriptionSettings>({
    includeTimestamps: true,
    language: "auto",
  })
  const [responseData, setResponseData] = useState<FormData | null>(null)

  const handleTranscribe = async () => {
    setIsTranscribing(true)

    // Préparer les données du formulaire
    const formData: FormData = {
      video_url: videoUrl,
      video_type: "",
      description_tone: "",
      optional_keywords: "",
      hashtags: "",
      timestamps_mode: settings.includeTimestamps ? "automatique" : "aucun",
      manual_timestamps: "",
      transcript_format: "CHUNKS",
      transcript: '',
      translation: '',
      languages: settings.language === "auto" ? ["fr", "en"] : [settings.language],
      useful_links: [],
    }

    /* try {
      // Simuler l'envoi des données
      const response = await submitTranscriptionData(formData)
      setResponseData(response)
      console.log("Données envoyées:", formData)
      console.log("Réponse reçue:", response)
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error)
    } finally {
      setIsTranscribing(false)
    } */
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="video-url-trans" className="text-sm font-medium flex items-center">
          <EmojiWrapper emoji="🔗" />
          Video URL
        </label>
        <Input
          id="video-url-trans"
          placeholder="https://www.youtube.com/watch?v=..."
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          className="w-full transition-all duration-200 focus:ring-2 focus:ring-red-200"
        />

      </div>

      <div className="border border-gray-100 rounded-md overflow-hidden">
        <div className="flex w-full items-center justify-between p-4 text-sm font-medium bg-gray-50">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span>Transcription Settings</span>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="include-timestamps" className="text-sm flex items-center gap-2">
              <EmojiWrapper emoji="⏱️" />
              Include timestamps
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
              <input
                type="checkbox"
                id="include-timestamps"
                name="include-timestamps"
                className="sr-only"
                checked={settings.includeTimestamps}
                onChange={() =>
                  setSettings({
                    ...settings,
                    includeTimestamps: !settings.includeTimestamps,
                  })
                }
              />
              <label
                htmlFor="include-timestamps"
                className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                  settings.includeTimestamps ? "bg-red-500" : ""
                }`}
              >
                <span
                  className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in ${
                    settings.includeTimestamps ? "translate-x-4" : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="language" className="text-sm flex items-center gap-2">
              <EmojiWrapper emoji="🌐" />
              Language
            </label>
            <Select
              value={settings.language}
              onValueChange={(value) =>
                setSettings({
                  ...settings,
                  language: value,
                })
              }
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {responseData && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200 animate-fadeIn">
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <EmojiWrapper emoji="✅" />
            Données envoyées avec succès
          </h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}

      <div className="pt-2">
        <Button
          onClick={handleTranscribe}
          disabled={!videoUrl || isTranscribing}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-md transition-all duration-200"
        >
          {isTranscribing ? "Transcription en cours..." : "Get Transcription"}
        </Button>
      </div>
    </div>
  )
}
