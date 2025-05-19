"use client"

import { useEffect, useState, useRef } from "react"
import { Copy, Check, Edit2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { EmojiWrapper } from "@/components/emoji-wrapper"
import type { FormData, GeneratedDescription } from "@/types"

interface PreviewFormProps {
  data: (FormData & { description?: GeneratedDescription }) | null
  onDescriptionUpdate?: (newDescription: string) => void
}

export function PreviewForm({ data, onDescriptionUpdate }: PreviewFormProps) {
  const [generatedText, setGeneratedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Texte complet de la description générée
  const fullDescription = data?.description
    ? `
    
${data.description.resume}

${data.description.timestamps ? `${data.description.timestamps}` : ""}

${
  data.description.links && data.description.links.length > 0
    ? `
🔗 Liens utiles:
${data.description.links
  .map((link) => {
    const key = Object.keys(link)[0]
    return `- ${key}: ${link[key]}`
  })
  .join("\n")}
`
    : ""
}

${data.description.keywords ? `🔍 Mots-clés:\n${data.description.keywords}` : ""}

${data.description.call_to_action}

${data.description.about_channel}
`
    : ""

  // Simuler l'effet de streaming de texte
  useEffect(() => {
    if (!data || !fullDescription) return

    setGeneratedText("")
    setEditedText("")
    setIsComplete(false)
    setIsEditing(false)

    let index = 0
    const interval = setInterval(() => {
      if (index < fullDescription.length) {
        setGeneratedText((prev) => {
          const newText = prev + fullDescription.charAt(index)
          setEditedText(newText)
          return newText
        })
        index++

        // Faire défiler automatiquement vers le bas
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      } else {
        clearInterval(interval)
        setIsComplete(true)
      }
    }, 10) // Vitesse de l'animation

    return () => clearInterval(interval)
  }, [data, fullDescription])

  const copyToClipboard = () => {
    const textToCopy = isEditing ? editedText : generatedText
    if (!textToCopy) return
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedText(generatedText)
    // Focus the textarea after it becomes visible
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleSave = () => {
    setIsEditing(false)
    setGeneratedText(editedText)
    if (onDescriptionUpdate) {
      onDescriptionUpdate(editedText)
    }
  }

  if (!data) return null

  return (
    <Card className="w-full h-full shadow-sm border border-gray-200 overflow-hidden animate-slideIn">
      <CardHeader className="pb-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EmojiWrapper emoji="📝" />
            <h2 className="text-lg font-medium">Description Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            {isComplete && (
              <Button
                variant="outline"
                size="sm"
                onClick={isEditing ? handleSave : handleEdit}
                className="h-8 px-2 text-xs"
              >
                {isEditing ? (
                  <>
                    <Save className="h-3.5 w-3.5 mr-1" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!isComplete}
              className="h-8 px-2 text-xs"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[500px] font-mono text-sm p-4 border-0 rounded-none focus-visible:ring-0 resize-none"
          />
        ) : (
          <div ref={containerRef} className="p-4 h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
            {generatedText}
            {!isComplete && <span className="animate-pulse">▌</span>}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        {isComplete ? (
          <div className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-green-500" />
            {isEditing ? "Mode édition" : "Génération terminée"}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            Génération en cours...
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
