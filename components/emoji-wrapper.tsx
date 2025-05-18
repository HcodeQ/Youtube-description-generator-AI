interface EmojiWrapperProps {
  emoji: string
}

export function EmojiWrapper({ emoji }: EmojiWrapperProps) {
  return <span className="emoji-bounce mr-2">{emoji}</span>
}
