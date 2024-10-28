import { useState } from 'react';

export const useTranslation = async (text: string): Promise<string> => {
    const [translatedText, setTranslatedText] = useState(text);  // Hold the translated text
    const translatorApiUrl = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en";
    const apiKey = 'YOUR_TRANSLATOR_API_KEY';  // Replace with your Translator API key
  
    const translate = async () => {
      try {
        const response = await fetch(translatorApiUrl, {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': apiKey,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Region': 'eastus2'  // Replace with your Azure region
          },
          body: JSON.stringify([{ Text: text }]),  // The text to translate
        });
  
        const data = await response.json();
        if (data[0] && data[0].translations[0]) {
          setTranslatedText(data[0].translations[0].text);  // Set the translated text
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text);  // Fallback to original text if translation fails
      }
    };
  
    await translate();  // Call the async translation function
    return translatedText;  // Return only the translated text
};
