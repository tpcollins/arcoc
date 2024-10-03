/*

TODO:
1. Prep volume button component to accept necessary translation variables
2. Test application with new inputs
3. Test application with variables from dropdown menu (might need to set localization up with redux)
4. If everything is working set source language to default english 

*/

import React, { useState, useEffect } from 'react';
import DropdownMenu from '../R Components/DropdownMenu';
import { useLocale } from '@/Contexts/LocalizationContext';
import { useVoices } from '@/Custom Hooks/useVoices';
import { sourceLangData, targetLangData, neuralVoiceData } from '../Data/Data';
import PlayButton from '../R Components/PlayButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

const LanguageSelection = () => {
        const { locale, setLocale } = useLocale();
        // Using Redux to get the API key
        const apiKey = useSelector((state: RootState) => state.apiKey.apiKey);
        const voices = useVoices(locale, apiKey);
        const [dropdownData, setDropdownData] = useState(neuralVoiceData);
        const [translation, setTranslation] = useState<string>("");
        const [isLoading, setIsLoading] = useState<boolean>(false);


        const handleTarLangChange = (newLocale: string) => {
            setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
        };

        useEffect(() => {
            if (voices && voices.links) {
                setDropdownData({
                ...dropdownData, // Keep the existing structure of dropdownData
                links: voices.links.map(voice => ({
                    lang: voice.LocalName,
                    flag: `/icons/Flags/${voice.Locale}.svg`
                }))
                });
            }
            console.log("useEffect Locale", locale);
            console.log("Voices", voices);
            console.log("API Key from Redux", apiKey);
            }, [voices, locale]);

        const startContinuousTranslation = () => {
            const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
                apiKey as string,
                'eastus2' as string
        );

            speechConfig.speechRecognitionLanguage = "en-US"; // From language
            speechConfig.addTargetLanguage("es"); // To language
            speechConfig.voiceName = "es-ES-AlvaroNeural"; // Neural voice

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
            const translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);

            translator.recognized = (s, e) => {
                if (e.result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
                    const translatedText = e.result.translations.get("es");
                    synthesizeSpeech(translatedText || "");
                }
        };

        const synthesizeSpeech = (text: string) => {
            const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
                process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY as string,
                process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION as string
            );

            const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
            const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

            // Synthesize translated text to speech with neural voice
            synthesizer.speakTextAsync(text, result => {
                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    console.log("Synthesis complete.");
                }
                setIsLoading(false);
            });
        };

        translator.startContinuousRecognitionAsync(() => {
            console.log("Continuous recognition started");
        });
    };

  return (
    <>
      <DropdownMenu 
        data={sourceLangData} 
        renderItem={(item) => (
            <div
            style={{
                alignItems: 'center', 
                display: 'flex', 
                width: '100%'
            }}
            >
                <img 
                alt="File icon"
                aria-hidden
                height={16}
                src={item.flag}
                style={{paddingRight: '5px'}}
                width={16}
                />
                {item.lang}
            </div>
            )}
        />

        <div className="d-flex flex-column align-items-center">
            <DropdownMenu
                data={targetLangData}
                handleTarLangChange={handleTarLangChange}
                renderItem={(item) => (
                    <div style={{ 
                        alignItems: 'center',
                        display: 'flex',
                        width: '100%' }}>
                        <img
                            alt="File icon"
                            aria-hidden
                            height={16}
                            src={item.flag}
                            style={{ paddingRight: '5px' }}
                            width={16}
                        />
                        {item.lang}
                    </div>
                )}
            />

            <div className="mt-4">
                <PlayButton />
            </div>
        </div>

        <DropdownMenu 
            data={dropdownData} 
            renderItem={(item) => (
                <div
                style={{
                    alignItems: 'center', 
                    display: 'flex', 
                    width: '100%'
                }}
                >
                    <img 
                        
                    alt="File icon"
                    aria-hidden
                    height={16}
                    src={item.flag}
                    style={{paddingRight: '5px'}}
                    width={16}
                    />
                    {item.lang}
                </div>
            )}
        />
    </>
  );
};

export default LanguageSelection;
