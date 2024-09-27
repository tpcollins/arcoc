import { Voice } from "@/app/Data/DataDef";
import { DropdownData } from "@/app/Data/DataDef";

export const fetchVoices = async (locale: string, apiKey: string): Promise<DropdownData<Voice>> => {
    if (!apiKey) throw new Error("API key is not set.");

    const url = 'https://eastus2.tts.speech.microsoft.com/cognitiveservices/voices/list';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-Type': 'application/json'
        }
    });

    const voices: Voice[] = await response.json();
    const filteredVoices = voices.filter(voice => voice.Locale === locale);

    // Transform to DropdownData
    return {
        btnDrpDwnTxt: "Select a Voice",
        links: filteredVoices.map(voice => ({
            LocalName: voice.LocalName,
            Gender: voice.Gender,
            Locale: voice.Locale,
            SampleRateHertz: voice.SampleRateHertz,
            WordsPerMinute: voice.WordsPerMinute,
            lang: voice.LocalName, 
            flag: `/icons/Flags/${voice.Locale}.svg`

        })),
        config: {
            displayText: "LocalName",
            renderItemText: "LocalName"
        }
    };
};
