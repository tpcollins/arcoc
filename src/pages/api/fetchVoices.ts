import { Voice } from "@/app/Data/DataDef";

export const fetchVoices = async (locale: string, apiKey: string): Promise<Voice[]> => {
  if (!apiKey) throw new Error("API key is not set.");

  const url = `https://eastus2.tts.speech.microsoft.com/cognitiveservices/voices/list`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch voices: ${errorText}`);
  }

  const voices: Voice[] = await response.json();
  return voices.filter(voice => voice.Locale === locale);
};