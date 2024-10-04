/*

TODO:
1. Setup application to work with various microphone inputs (see GPT Log "TypeScript Azure Speech SDK")
2. Setup application to work with drop down menu
3. Test application with variables from dropdown menu (might need to set localization up with redux)
4. If everything is working set source language to default english 
5. Start working on glitches and bugs

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
    const { tarLocale, setTarLocale } = useLocale();
    // Using Redux to get the API key
    const apiKey = useSelector((state: RootState) => state.apiKey.apiKey);
    const voices = useVoices(locale, apiKey);
    const [dropdownData, setDropdownData] = useState(neuralVoiceData);
    const [shortName, setShortName] = useState('');


    const handleTarLang = (newLocale: string, newTarLocale: string) => {
        setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
        setTarLocale(newTarLocale);
    };

    const handleShortName = (newShortName: string) => {
        setShortName(newShortName);
        console.log()
    };

    useEffect(() => {
        if (voices && voices.links) {
            setDropdownData({
                ...dropdownData, // Keep the existing structure of dropdownData
                links: voices.links.map(voice => ({
                    shortName: voice.ShortName,
                    lang: voice.LocalName,
                    flag: `/icons/Flags/${voice.Locale}.svg`
                }))
            });
        }
        console.log("useEffect Locale", locale);
        console.log("useEffect tarLocale", tarLocale);
        // console.log("useEffect shortName", dropdownData.shor)
        console.log("Voices", voices);
        console.log("API Key from Redux", apiKey);

    }, [voices, locale, tarLocale]);

    useEffect(() => {
        console.log("Updated shortName:", shortName); // Correctly logs after update
      }, [shortName]);

    const startContinuousTranslation = () => {
        // Step 1: Initialize speech translation config
        const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
            apiKey as string,      // Azure Speech API key
            'eastus2' as string    // Azure Speech region
        );
    
        // Set up translation languages and voice
        speechConfig.speechRecognitionLanguage = "en-US";  // Source language (English)
        speechConfig.addTargetLanguage(tarLocale);              // Target language
        speechConfig.voiceName = shortName;     // Neural voice for Spanish
    
        // Step 2: Configure input (microphone)
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    
        // Step 3: Initialize translation recognizer
        const translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
        // Step 4: Handle recognition results (when translation is completed)
        translator.recognized = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
                const translatedText = e.result.translations.get(tarLocale);
                console.log(`Translated Text: ${translatedText}`);
                
                // Call the speech synthesis function to convert translated text to speech
                synthesizeSpeech(translatedText || "");
            }
        };
    
        // Step 5: Start continuous recognition
        translator.startContinuousRecognitionAsync(() => {
            console.log("Continuous recognition started");
        });
    
        // Speech synthesis function to output the translated text as neural speech
        const synthesizeSpeech = (text: string) => {
            // Reuse the speech config for synthesis
            const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(
                apiKey as string, 
                'eastus2' as string
            );
    
            // Set output audio configuration (default speakers)
            const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    
            // Initialize synthesizer with speech config and audio output
            const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
            // Synthesize the translated text into neural speech
            synthesizer.speakTextAsync(text, result => {
                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                    console.log("Synthesis complete.");
                } else {
                    console.error("Synthesis failed.", result.errorDetails);
                }
            });
        };
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
                handleTarLang={handleTarLang}
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
                <PlayButton 
                action={startContinuousTranslation}
                />
            </div>
        </div>

        <DropdownMenu 
            data={dropdownData} 
            handleShortName={handleShortName}
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
