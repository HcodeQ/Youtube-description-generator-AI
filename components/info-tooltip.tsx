"use client"

import { useState } from "react"
import { Info } from "lucide-react"

interface InfoTooltipProps {
  text: string
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="relative inline-block ml-1">
      <Info
        className="h-4 w-4 text-gray-400 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div className="absolute z-10 w-64 p-2 text-xs bg-gray-800 text-white rounded shadow-lg -left-32 bottom-6 animate-fadeIn">
          {text}
          <div className="absolute w-2 h-2 bg-gray-800 transform rotate-45 left-1/2 -ml-1 -bottom-1"></div>
        </div>
      )}
    </div>
  )
}
