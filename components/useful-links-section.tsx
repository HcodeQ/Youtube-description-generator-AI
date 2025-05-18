"use client"
import { Link2, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmojiWrapper } from "@/components/emoji-wrapper"
import { InfoTooltip } from "@/components/info-tooltip"
import type { UsefulLink } from "@/types"

interface UsefulLinksSectionProps {
  links: UsefulLink[]
  onChange: (links: UsefulLink[]) => void
}

export function UsefulLinksSection({ links, onChange }: UsefulLinksSectionProps) {
  const addLink = () => {
    onChange([...links, { id: Date.now().toString(), title: "", url: "" }])
  }

  const removeLink = (id: string) => {
    if (links.length > 1) {
      onChange(links.filter((link) => link.id !== id))
    }
  }

  const updateLink = (id: string, field: "title" | "url", value: string) => {
    onChange(links.map((link) => (link.id === id ? { ...link, [field]: value } : link)))
  }

  return (
    <div className="space-y-3 pt-2 border-t border-gray-100">
      <label className="text-sm font-medium flex items-center gap-2">
        <EmojiWrapper emoji="🔗" />
        Useful Links
        <InfoTooltip text="Add relevant links to include in your description. Good links improve viewer engagement and SEO." />
      </label>

      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={link.id} className="flex flex-col space-y-2 p-3 bg-gray-50 rounded-md animate-fadeIn">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-500">Link {index + 1}</span>
              <button
                onClick={() => removeLink(link.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={links.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Input
                placeholder="Link title (e.g. Official Website)"
                value={link.title}
                onChange={(e) => updateLink(link.id, "title", e.target.value)}
                className="text-sm"
              />
              <div className="flex items-center gap-2">
                <Link2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <Input
                  placeholder="https://example.com"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, "url", e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        onClick={addLink}
        variant="outline"
        size="sm"
        className="w-full mt-2 border-dashed border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-300 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add another link
      </Button>
    </div>
  )
}
