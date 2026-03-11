import { TextToSpeechView } from "@/features/text-to-speech/views/text-to-speech-view"
import { Metadata } from "next"

export const metadata: Metadata = { title: "Text to Speech" }

const TextToSpeechPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ text?: string; voiceId?: string }>
}) => {
  const { text, voiceId } = await searchParams

  return <TextToSpeechView />
}

export default TextToSpeechPage
