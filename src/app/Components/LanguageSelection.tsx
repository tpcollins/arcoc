/*

NON-MVP TODO:
1. Setup application to work with various microphone inputs (see GPT Log "TypeScript Azure Speech SDK") 
^^^^^ Not going to have this in the MVP. Leaving this here so I know the chat log that it is in. Will -
- implement in later iteration

3. Need to make dropdowns unclickable when program is actively translating
    3a. Create error message for clicking on drop down toggles when translating using the isDrpDwnDisabled and isPlaying
    3b. Make error message go away when translator stops and when user clicks anywhere on screen after trying to -
    - change language or neural voice while translating

4. API Key for translator (to translate the list of voices from their respective alphabets to english )

*/


/*

TODO: BUG LISTs
BUG LIST SO FAR:

2BL. If page refreshes, API key does not refresh with it. Need to prompt user to go back and enter API key upon refresh -
- or upon sitting on the page too long 

*/

import React, { useState, useEffect } from 'react';
import DropdownMenu from '../R Components/DropdownMenu';
import { useLocale } from '@/Contexts/LocalizationContext';
import { useVoices } from '@/Custom Hooks/useVoices';
// import { useTranslation } from '@/Custom Hooks/useTranslation';
import { targetLangData, neuralVoiceData, plyBtnData } from '../Data/Data';
import PlayButton from '../R Components/PlayButton';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import { parse } from 'cookie';
import { GetServerSidePropsContext } from 'next';


export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { req } = context;
  
    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    console.log('Parsed Cookies:', cookies); 

    const apiKey = cookies.apiKey;
  
    if (!apiKey) {
      return { redirect: { destination: '/page', permanent: false } };
    }
  
    return {
      props: {
        apiKey,
      },
    };
};

interface LanguageSelectionProps {
    apiKey?: string;
}

// const LanguageSelection: React.FC<LanguageSelectionProps> = ({ apiKey }) => {
const LanguageSelection: React.FC<LanguageSelectionProps> = () => {
    // Locales
    const { locale, setLocale } = useLocale();
    const { tarLocale, setTarLocale } = useLocale();

    // API Key
    const apiKey = useSelector((state: RootState) => state.apiKey.apiKey); // Using Redux to get the API key

    // Voices
    const voices = useVoices(locale, apiKey);

    // Dropdown Data
    const [dropdownData, setDropdownData] = useState(neuralVoiceData);
    const [shortName, setShortName] = useState('');
    const [isDrpDwnDisabled, setIsDrpDwnDisabled] = useState(false);
    const requiredFields = [tarLocale, shortName]; 
    const [isPlaying, setIsPlaying] = useState(false);
    // const [actTransErrorMsg, setActTransErrorMsg] = useState(false);

    // Translator
    let translator: SpeechSDK.TranslationRecognizer;
    
    const handleTarLang = (newLocale: string, newTarLocale: string) => {
        setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
        setTarLocale(newTarLocale);
    };

    const handleShortName = (newShortName: string) => {
        setShortName(newShortName);
        console.log()
    };

    // const handleErrorClick = (e: any) => {
    //     if (isPlaying && isDrpDwnDisabled) {
    //         e.preventDefault();
    //         setActTransErrorMsg(true);
    //     }
    // };

    useEffect(() => {
        if (voices && voices.links) {
            setDropdownData({
                ...dropdownData,
                links: voices.links.map(voice => ({
                    shortName: voice.ShortName,
                    lang: voice.LocalName,
                    flag: `/Icons/Flags/${voice.Locale}.svg`,
                    gender: voice.Gender,
                }))
          });
      
          // Reset the shortName only if a voice has already been selected
          if (shortName) {
            setShortName('');
          }
        }

        
      }, [voices, locale, tarLocale]);

    useEffect(() => {
        console.log("Updated shortName:", shortName); // Correctly logs after update
    }, [shortName]);

    // Microsoft Translator
    useEffect(() => {
        const fetchTranslations = async () => {
          if (voices && voices.links) {
            const translatorApiUrl = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en`;
            const apiKey = process.env.NEXT_PUBLIC_TRANSLATOR_KEY;

            console.log("environment key: ", process.env.NEXT_PUBLIC_TRANSLATOR_KEY);
      
            const translatedLinks = await Promise.all(
              voices.links.map(async (voice) => {
                // Perform the translation API request directly here
                const response = await fetch(translatorApiUrl, {
                  method: 'POST',
                  headers: {
                    'Ocp-Apim-Subscription-Key': apiKey || '',
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Region': 'eastus2',  // Replace with your Azure region
                  },
                  body: JSON.stringify([{ Text: voice.LocalName }]),  // The text to translate
                });
      
                const data = await response.json();
      
                // Log the translation response for debugging
                console.log('Translation API response for:', voice.LocalName, data);
      
                const translatedLang = data[0]?.translations[0]?.text || voice.LocalName;  // Use translated language, fallback to original if translation fails
      
                return {
                  shortName: voice.ShortName,
                  gender: voice.Gender,
                  lang: translatedLang,  // Use translated language
                  flag: `/Icons/Flags/${voice.Locale}.svg`,
                };
              })
            );
      
            setDropdownData((prevData) => ({
              ...prevData,
              links: translatedLinks,
            }));
          }
        };
      
        fetchTranslations();  // Invoke the async function
      
      }, [voices, locale, tarLocale]);  // Add dependencies
      

    // useEffect(() => {
    //     const handleErrorClick = (e: any) => {
    //         e.preventDefault();

    //         setTimeout(() => {
    //             if (!e.target.closest('#dropdown-basic')) {
    //               setActTransErrorMsg(false);  // Hide error message
    //             }
    //         }, 100000);  // A small delay of 100ms to avoid instant dismissal
    //     }; 
    
    //     // Add event listener to the document
    //     document.addEventListener('click', handleErrorClick);
    
    //     console.log("actTransErrorMessage: ", actTransErrorMsg);

    //     // Clean up the event listener on component unmount
    //     return () => {
    //       document.removeEventListener('click', handleErrorClick);
    //     };
        
    // }, []);
      

    useEffect(() => {
        console.log("isPlaying: ", isPlaying);
        if (isPlaying) {
            translator = startContinuousTranslation();
            setIsDrpDwnDisabled(true);
        } else if (translator) {
            translator.stopContinuousRecognitionAsync(() => {
                console.log("Continuous recognition stopped");
            });
        }

        if(!isPlaying){
            setIsDrpDwnDisabled(false);
        }
        console.log("isDrpDwnDisabled: ", isDrpDwnDisabled);

        return () => {
            // Ensure cleanup on unmount
            translator?.stopContinuousRecognitionAsync();
        };
    }, [isPlaying, isDrpDwnDisabled]);

    // useEffect(() => {
    //     console.log("api key: ", apiKey)
    // }, [apiKey]);

    const startContinuousTranslation = () => {   
        // Step 1: Initialize speech translation config
        const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
            apiKey as string,      // Azure Speech API key
            'eastus2' as string    // Azure Speech region
        );

        // Set up translation languages and voice
        speechConfig.speechRecognitionLanguage = "en-US";  // Source language (English)
        speechConfig.addTargetLanguage(tarLocale);              // Target language
        speechConfig.voiceName = shortName;     // Neural voice

        // Step 2: Configure input (microphone)
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();

        // Step 3: Initialize translation recognizer
        translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);

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

        return translator;
    };

    return (
    <>
        <div className="d-flex flex-column align-items-center mt-4">
            <div className="d-flex justify-content-between mb-4" style={{ width: '700px' }}>

                {/* {actTransErrorMsg && (
                    <div 
                    className={`alertMessage ${actTransErrorMsg ? 'show' : ''}`}
                    style={{
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}  
                    >
                        You cannot change your target language or neural voice while actively translating
                    </div>
                )} */}

                {/* {apiKey && <p>Your API Key is: {apiKey}</p>} */}


                <DropdownMenu
                    data={targetLangData}
                    handleTarLang={handleTarLang}
                    isDisabled={isDrpDwnDisabled}
                    // actTransClick={handleErrorClick}
                    renderItem={(item) => (
                        <div style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
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

                <DropdownMenu
                    data={dropdownData} 
                    handleShortName={handleShortName}
                    isDisabled={isDrpDwnDisabled}
                    requiredFields={requiredFields}
                    // actTransClick={handleErrorClick}
                    renderItem={(item) => (
                        <div style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
                            <img
                                alt="File icon"
                                aria-hidden
                                height={16}
                                src={item.flag}
                                style={{ paddingRight: '5px' }}
                                width={16}
                            />
                            {item.lang + ' (' + item.gender + ')'}
                        </div>
                    )}
                />
            </div>

            <div>
                <PlayButton
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                requiredFields={requiredFields}
                data={plyBtnData}
                />
            </div>
            
        </div>
    </>
  );
};

export default LanguageSelection;
