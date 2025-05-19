import { YoutubeDescriptionGenerator } from "@/components/youtube-description-generator"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <YoutubeDescriptionGenerator />
    </main>
  )
}
