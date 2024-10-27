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
    
    const filteredVoices = voices
    .filter(voice => voice.Locale === locale)
    .reduce((acc: Voice[], voice) => {
        // Check if there's already a male and a female voice in the array
        const hasMale = acc.some(v => v.Gender === 'Male');
        const hasFemale = acc.some(v => v.Gender === 'Female');
        
        // If the voice matches the needed gender and there's not already one, add it
        if ((voice.Gender === 'Male' && !hasMale) || (voice.Gender === 'Female' && !hasFemale)) {
          acc.push(voice);
        }
        
        return acc;
      }, []);

    // Transform to DropdownData
    return {
        btnDrpDwnTxt: "Select a Voice",
        links: filteredVoices.map(voice => ({
            LocalName: voice.LocalName,
            ShortName: voice.ShortName,
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