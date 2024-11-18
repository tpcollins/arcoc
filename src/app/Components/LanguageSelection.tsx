/*

NON-MVP TODO:
1. Setup application to work with various microphone inputs (see GPT Log "TypeScript Azure Speech SDK") 

2. API Key for translator (to translate the list of voices from their respective alphabets to english )

*/


/*

TODO:
3. Is there a way to make the target language drop down not scroll the whole page? (Save this for later if it's a big deal)
4. When there is a long pause in speaking (like when we sing) I think it's disconnecting from the Azure service. It will have to handle pauses and either reopen the connection when we start speaking again or hold it open (if it can?).
5. I think it's doing something weird where it is talking over itself. Because we aren't chunking the transcription, it is listening for several seconds, then will start talking, but sometimes it sounds like it's returning two translations at once. I'm trying to think about how you would test that - you'd have to maybe play something that's longer form, pause it, wait, play again, etc. while listening on headphones.

BUG LIST:
1BL. If page refreshes, API key does not refresh with it. Need to prompt user to go back and enter API key upon refresh -
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
        console.log("Updated shortName according to useEffect:", shortName); // Correctly logs after update
    }, [shortName]);

    // // Microsoft Translator
    // useEffect(() => {
    //     const fetchTranslations = async () => {
    //       if (voices && voices.links) {
    //         const translatorApiUrl = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en`;
    //         const apiKey = process.env.NEXT_PUBLIC_TRANSLATOR_KEY;

    //         console.log("environment key: ", process.env.NEXT_PUBLIC_TRANSLATOR_KEY);
      
    //         const translatedLinks = await Promise.all(
    //           voices.links.map(async (voice) => {
    //             // Perform the translation API request directly here
    //             const response = await fetch(translatorApiUrl, {
    //               method: 'POST',
    //               headers: {
    //                 'Ocp-Apim-Subscription-Key': apiKey || '',
    //                 'Content-Type': 'application/json',
    //                 'Ocp-Apim-Subscription-Region': 'eastus2',  // Replace with your Azure region
    //               },
    //               body: JSON.stringify([{ Text: voice.LocalName }]),  // The text to translate
    //             });
      
    //             const data = await response.json();
      
    //             // Log the translation response for debugging
    //             console.log('Translation API response for:', voice.LocalName, data);
      
    //             const translatedLang = data[0]?.translations[0]?.text || voice.LocalName;  // Use translated language, fallback to original if translation fails
      
    //             return {
    //               shortName: voice.ShortName,
    //               gender: voice.Gender,
    //               lang: translatedLang,  // Use translated language
    //               flag: `/Icons/Flags/${voice.Locale}.svg`,
    //             };
    //           })
    //         );
      
    //         setDropdownData((prevData) => ({
    //           ...prevData,
    //           links: translatedLinks,
    //         }));
    //       }
    //     };
      
    //     fetchTranslations();  // Invoke the async function
      
    //   }, [voices, locale, tarLocale]);  // Add dependencies
      

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

    // const startContinuousTranslation = () => {
    //     // Initialize speech translation config
    //     const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
    //         apiKey as string, 
    //         'eastus2' as string
    //     );
    
    //     speechConfig.speechRecognitionLanguage = "en-US";
    //     speechConfig.addTargetLanguage(tarLocale);
    //     speechConfig.voiceName = shortName;
    
    //     const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    //     translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
    //     let isSpeaking = false;
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    
    //     // Handle interim recognition results and synthesize immediately
    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             const interimTranslatedText = e.result.translations.get(tarLocale);
    //             console.log(`Interim Translated Text: ${interimTranslatedText}`);
                
    //             if (interimTranslatedText && !isSpeaking) {
    //                 isSpeaking = true;
    //                 synthesizeSpeech(interimTranslatedText);
    //             }
    //         }
    //     };
    
    //     // Handle final recognized results
    //     // translator.recognized = (s, e) => {
    //     //     if (e.result.reason === SpeechSDK.ResultReason.TranslatedSpeech) {
    //     //         const translatedText = e.result.translations.get(tarLocale);
    //     //         console.log(`Final Translated Text: ${translatedText}`);
    //     //         synthesizeSpeech(translatedText || "");
    //     //     }
    //     // };
    
    //     // Handle errors
    //     translator.canceled = (s, e) => {
    //         console.error(`Translation canceled: ${e.reason}, Error: ${e.errorDetails}`);
    //     };
    
    //     // Start continuous recognition
    //     translator.startContinuousRecognitionAsync(() => {
    //         console.log("Continuous recognition started.");
    //     });
    
    //     const synthesizeSpeech = (text: string) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close(); // Stop any ongoing synthesis
    //             currentSynthesizer = null;
    //         }
    
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(
    //             apiKey as string, 
    //             'eastus2' as string
    //         );
    //         synthConfig.speechSynthesisVoiceName = shortName;
    
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
    //         currentSynthesizer.speakTextAsync(text, 
    //             result => {
    //                 if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                     console.log("Synthesis complete.");
    //                 } else {
    //                     console.error("Synthesis failed.", result.errorDetails);
    //                 }
    //                 isSpeaking = false; // Reset flag after speaking
    //             },
    //             error => {
    //                 console.error("Error during speech synthesis:", error);
    //                 isSpeaking = false; // Reset flag on error
    //             }
    //         );
    //     };
    
    //     return translator;
    // };


    // **** We know this one is almost working. Little overlap but stops synthesizing the speech at some point
    // Updated startContinuousTranslation function
    // const startContinuousTranslation = () => {
    //     const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
    //         apiKey as string,
    //         'eastus2'
    //     );
    
    //     speechConfig.speechRecognitionLanguage = "en-US";
    //     speechConfig.addTargetLanguage(tarLocale);
    //     speechConfig.voiceName = shortName;
    
    //     const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    //     translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
    //     let synthesizedText = ""; // Track synthesized text
    //     let isSynthesizing = false; // Prevent overlapping synthesis
    //     let synthesisTimeout: NodeJS.Timeout | null = null; // Throttle for interim translations
    
    //     const synthesizeSpeech = async (text: string) => {
    //         if (!text) return;
    
    //         isSynthesizing = true;
    
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(
    //             apiKey as string,
    //             'eastus2'
    //         );
    //         synthConfig.speechSynthesisVoiceName = shortName;
    
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
    //         console.log(`[Synthesis] Starting synthesis for: ${text}`);
    
    //         return new Promise<void>((resolve) => {
    //             synthesizer.speakTextAsync(
    //                 text,
    //                 (result) => {
    //                     if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                         console.log(`[Synthesis] Synthesis complete for: ${text}`);
    //                     } else {
    //                         console.error(`[Synthesis] Synthesis failed: ${result.errorDetails}`);
    //                     }
    //                     synthesizer.close();
    //                     resolve();
    //                 },
    //                 (error) => {
    //                     console.error(`[Synthesis] Error during speech synthesis:`, error);
    //                     synthesizer.close();
    //                     resolve();
    //                 }
    //             );
    //         }).finally(() => {
    //             isSynthesizing = false;
    //         });
    //     };
    
    //     const handleTranslation = async (newText: string) => {
    //         if (!newText) return;
    
    //         // Determine the new portion to synthesize
    //         const newPortion = newText.slice(synthesizedText.length);
    
    //         if (newPortion.trim()) {
    //             synthesizedText = newText; // Update the synthesized text tracker
    //             await synthesizeSpeech(newPortion.trim());
    //         }
    //     };
    
    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             const interimText = e.result.translations.get(tarLocale);
    
    //             if (interimText && !isSynthesizing) {
    //                 // Throttle interim synthesis
    //                 if (synthesisTimeout) clearTimeout(synthesisTimeout);
    
    //                 synthesisTimeout = setTimeout(() => {
    //                     console.log(`Interim Translated Text: ${interimText}`);
    //                     handleTranslation(interimText.trim());
    //                 }, 500); // Adjust debounce as needed
    //             }
    //         }
    //     };
    
    //     translator.recognized = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             const finalText = e.result.translations.get(tarLocale);
    //             console.log(`Final Translated Text: ${finalText}`);
    
    //             if (finalText) {
    //                 handleTranslation(finalText.trim()); // Prioritize final translations
    //             }
    //         }
    //     };
    
    //     translator.canceled = (s, e) => {
    //         console.error(`Translation canceled: ${e.reason}, Error: ${e.errorDetails}`);
    //     };
    
    //     translator.startContinuousRecognitionAsync(() => {
    //         console.log("Continuous recognition started.");
    //     });
    
    //     return translator;
    // };    

    const startContinuousTranslation = () => {
        const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
            apiKey as string,
            'eastus2'
        );
    
        speechConfig.speechRecognitionLanguage = "en-US";
        speechConfig.addTargetLanguage(tarLocale);
        speechConfig.voiceName = shortName;
    
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
        let synthesizedText = ""; // Track synthesized text
        let synthesisQueue: string[] = []; // Queue to manage translations
        let isSynthesizing = false; // Prevent overlapping synthesis
        let synthesisTimeout: NodeJS.Timeout | null = null; // For throttling interim translations
    
        // Function to synthesize speech
        const synthesizeSpeech = async (text: string) => {
            if (!text) return;
    
            const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(
                apiKey as string,
                'eastus2'
            );
            synthConfig.speechSynthesisVoiceName = shortName;
    
            const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
            const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
            console.log(`[Synthesis] Starting synthesis for: ${text}`);
    
            return new Promise<void>((resolve) => {
                synthesizer.speakTextAsync(
                    text,
                    (result) => {
                        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                            console.log(`[Synthesis] Synthesis complete for: ${text}`);
                        } else {
                            console.error(`[Synthesis] Synthesis failed: ${result.errorDetails}`);
                        }
                        synthesizer.close();
                        resolve();
                    },
                    (error) => {
                        console.error(`[Synthesis] Error during speech synthesis:`, error);
                        synthesizer.close();
                        resolve(); // Ensure the queue keeps processing
                    }
                );
            });
        };
    
        // Process the queue
        const processQueue = async () => {
            if (isSynthesizing || synthesisQueue.length === 0) return;
    
            isSynthesizing = true;
            const nextText = synthesisQueue.shift(); // Get the next text in the queue
            if (nextText) {
                await synthesizeSpeech(nextText);
            }
            isSynthesizing = false;
    
            // Continue processing the queue if there are more items
            if (synthesisQueue.length > 0) {
                processQueue();
            }
        };
    
        const handleTranslation = async (newText: string) => {
            if (!newText) return;
    
            // Determine the new portion to synthesize
            const newPortion = newText.slice(synthesizedText.length);
    
            if (newPortion.trim()) {
                synthesizedText = newText; // Update the synthesized text tracker
                synthesisQueue.push(newPortion.trim()); // Add new portion to the queue
                processQueue(); // Start processing the queue
            }
        };
    
        translator.recognizing = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                const interimText = e.result.translations.get(tarLocale);
    
                if (interimText) {
                    // Throttle interim synthesis
                    if (synthesisTimeout) clearTimeout(synthesisTimeout);
    
                    synthesisTimeout = setTimeout(() => {
                        console.log(`Interim Translated Text: ${interimText}`);
                        handleTranslation(interimText.trim());
                    }, 1000); // Adjust debounce time as needed
                }
            }
        };
    
        translator.recognized = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                const finalText = e.result.translations.get(tarLocale);
                console.log(`Final Translated Text: ${finalText}`);
    
                if (finalText) {
                    handleTranslation(finalText.trim()); // Prioritize final translations
                }
            }
        };
    
        translator.canceled = (s, e) => {
            console.error(`Translation canceled: ${e.reason}, Error: ${e.errorDetails}`);
        };
    
        translator.startContinuousRecognitionAsync(() => {
            console.log("Continuous recognition started.");
        });
    
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
