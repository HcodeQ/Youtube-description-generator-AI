// Types pour l'application

export interface UsefulLink {
  id: string
  title: string
  url: string
}

export interface TranscriptionSettings {
  includeTimestamps: boolean
  language: string
}

//interface définissant les champs de la réponse de notre api
export interface GeneratedDescription {
  title: string;
  resume: string;
  links: { [key: string]: string }[];
  timestamps: string;
  keywords: string;
  call_to_action: string;
  about_channel: string;
}

// Type pour les données envoyées à l'API
export interface FormData {
  video_type: string
  video_url: string
  description_tone: string
  optional_keywords: string
  transcript_format: string
  transcript: string
  languages: string[]
  translation: string
  hashtags: string
  timestamps_mode: string
  manual_timestamps: string
  useful_links: { [key: string]: string }[]
  description?: GeneratedDescription
}
