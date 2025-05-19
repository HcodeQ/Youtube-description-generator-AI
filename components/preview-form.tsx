"use client"

import { useEffect, useState, useRef } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { EmojiWrapper } from "@/components/emoji-wrapper"
import type { FormData, GeneratedDescription } from "@/types"

interface PreviewFormProps {
  data: (FormData & { description?: GeneratedDescription }) | null
}

export function PreviewForm({ data }: PreviewFormProps) {
  const [generatedText, setGeneratedText] = useState("")
  const [isComplete, setIsComplete] = useState(false)
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
    setIsComplete(false)

    let index = 0
    const interval = setInterval(() => {
      if (index < fullDescription.length) {
        setGeneratedText((prev) => prev + fullDescription.charAt(index))
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
    if (!generatedText) return
    navigator.clipboard.writeText(generatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="p-4 h-[500px] overflow-y-auto font-mono text-sm whitespace-pre-wrap">
          {generatedText}
          {!isComplete && <span className="animate-pulse">▌</span>}
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        {isComplete ? (
          <div className="flex items-center gap-1">
            <Check className="h-3.5 w-3.5 text-green-500" />
            Génération terminée
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
