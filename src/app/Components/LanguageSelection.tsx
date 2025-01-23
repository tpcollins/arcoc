/*

next steps: 
- use startContinuosTranslation that is marked with: usethisone
    - audio duraton is being tracked. We need to add more logs to see if we can somehow use the numbers to control when isSpeaking is set to false
        it looks like isSpeaking is being set to false too early which is causing the overlap between speaking

    - we also might need to go back to sending in string arrays to synthesizeSpeech rather than individual strings. This is in one of the commented out
        startContinuousTranslation methods

*/



// React Variables
import React, { useState, useEffect } from 'react';
// Dropdown Menu
import DropdownMenu from '../R Components/DropdownMenu';
// Use Voices and Use Locale
import { useLocale } from '@/Contexts/LocalizationContext';
import { useVoices } from '@/Custom Hooks/useVoices';
// Imports from data.js
import { targetLangData, neuralVoiceData, plyBtnData } from '../Data/Data';
// Playbutton
import PlayButton from '../R Components/PlayButton';
// Redux Variables
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
// Speech SDK
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
// API Key Cookie Storage (not working yet)
import { parse } from 'cookie';
import { GetServerSidePropsContext } from 'next';
import VolumeSlider from '../R Components/VolumeSlider';


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

const LanguageSelection: React.FC<LanguageSelectionProps> = () => {
    // Locales
    const { locale, setLocale } = useLocale();
    const { tarLocale, setTarLocale } = useLocale();

    // API Key
    const apiKey = useSelector((state: RootState) => state.apiKey.apiKey);

    // Voices
    const voices = useVoices(locale, apiKey);

    // Dropdown Data
    const [dropdownData, setDropdownData] = useState(neuralVoiceData);
    const [shortName, setShortName] = useState('');
    const [isDrpDwnDisabled, setIsDrpDwnDisabled] = useState(false);
    const requiredFields = [tarLocale, shortName]; 
    const [isPlaying, setIsPlaying] = useState(false);

    // Timeout
    const [processTimeout, setProcessTimeOut] = useState(100);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    // Translator
    let translator: SpeechSDK.TranslationRecognizer | null = null;
    
    const handleTarLang = (newLocale: string, newTarLocale: string) => {
        setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
        setTarLocale(newTarLocale);
    };

    const handleShortName = (newShortName: string) => {
        setShortName(newShortName);
        console.log()
    };

    const handleTimeoutChange = (newTimeout: number) => {
        let multTimeout = newTimeout * 200;
        setProcessTimeOut(multTimeout); // Update the parent's state
        console.log(`Process Timeout: ${processTimeout}`);
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































      
    // Original useEffect for isPlaying
    useEffect(() => {
        if (isPlaying) {
            translator = startContinuousTranslation().translator;
            setIsDrpDwnDisabled(true);
        } else if (translator) {
            translator.stopContinuousRecognitionAsync();
        }

        if (!isPlaying) {
            setIsDrpDwnDisabled(false);
        }

        return () => {
            translator?.stopContinuousRecognitionAsync();
        };
    }, [isPlaying, isDrpDwnDisabled]);

    // Most previous iteration; working most correctly
    // const startContinuousTranslation = () => {
    //     const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
    //         apiKey as string,
    //         "eastus2"
    //     );
    
    //     speechConfig.speechRecognitionLanguage = "en-US";
    //     speechConfig.addTargetLanguage(tarLocale);
    //     speechConfig.voiceName = shortName;
    
    //     const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    //     translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
    //     let sentenceQueue: string[] = []; // Store fully formed sentences
    //     let lastRecognizingText = ""; // Track interim sentence progress
    //     let currentSentenceBuffer = ""; // Temporary storage for words
    //     let isSpeaking = false; 
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    //     let sentenceTimeout: NodeJS.Timeout | null = null;
    //     const pauseThreshold = 1200; // Reduce for quicker sentence finalization
    
    //     // ✅ Process sentences one at a time
    //     const processSynthesisQueue = async () => {
    //         console.log("isSpeaking: ", isSpeaking);
            
    //         if (isSpeaking || sentenceQueue.length === 0) {
    //             console.log("🚫 processSynthesisQueue blocked - Still speaking or queue empty");
    //             return;
    //         }
    
    //         const textToSpeak = sentenceQueue.shift(); // Take the next sentence
    //         if (textToSpeak) {
    //             console.log("🗣 Speaking:", textToSpeak);
    //             await synthesizeSpeech(textToSpeak);
    //         }
    //     };
    
    //     // ✅ Synthesize speech sequentially
    //     const synthesizeSpeech = async (text: string) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close();
    //             currentSynthesizer = null;
    //         }
    
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
    //         synthConfig.speechSynthesisVoiceName = shortName;
    
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
    //         isSpeaking = true; // ✅ Lock before speaking
    //         console.log("🔒 isSpeaking set to TRUE");
    
    //         try {
    //             await new Promise<void>((resolve, reject) => {
    //                 currentSynthesizer?.speakTextAsync(
    //                     text, 
    //                     (result) => {
    //                         if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                             console.log("✅ Synthesis complete:", text);
    //                             resolve();
    //                         } else {
    //                             console.error("❌ Synthesis failed:", result.errorDetails);
    //                             reject(new Error(result.errorDetails));
    //                         }
    //                     },
    //                     (error) => {
    //                         console.error("⚠️ Error during speech synthesis:", error);
    //                         reject(error);
    //                     }
    //                 );
    //             });
    //         } catch (error) {
    //             console.error("⚠️ Error during synthesis:", error);
    //         } finally {
    //             isSpeaking = false; // ✅ Unlock IMMEDIATELY after speaking
    //             console.log("🔓 isSpeaking set to FALSE");
    
    //             if (currentSynthesizer) {
    //                 currentSynthesizer.close();
    //                 currentSynthesizer = null;
    //             }
    
    //             if (sentenceQueue.length > 0) {
    //                 console.log("🔄 More sentences detected, continuing...");
    //                 processSynthesisQueue(); // ✅ Process the next sentence immediately
    //             } else {
    //                 console.log("🗑️ SentenceQueue empty, waiting for new sentences.");
    //             }
    //         }
    //     };
    
    //     // ✅ Event: Recognizing (Interim Results)
    //     translator.recognizing = (s: SpeechSDK.TranslationRecognizer, e: SpeechSDK.TranslationRecognitionEventArgs) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             const interimTranslatedText = e.result.translations.get(tarLocale);
    
    //             if (interimTranslatedText && interimTranslatedText !== lastRecognizingText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
    
    //                 currentSentenceBuffer = interimTranslatedText;
    //                 lastRecognizingText = interimTranslatedText;
    
    //                 if (sentenceTimeout) clearTimeout(sentenceTimeout);
    //                 sentenceTimeout = setTimeout(() => {
    //                     console.log("🛑 Pause detected, finalizing:", currentSentenceBuffer);
    
    //                     // ✅ Ensure the buffer has punctuation at the end
    //                     if (!/[.!?]$/.test(currentSentenceBuffer.trim())) {
    //                         currentSentenceBuffer += "."; // Append period if missing
    //                     }
    
    //                     // ✅ Split sentences by punctuation while preserving punctuation
    //                     const finalizedSentences = currentSentenceBuffer.match(/[^.!?]+[.!?]/g);
    
    //                     if (finalizedSentences) {
    //                         finalizedSentences.forEach(sentence => {
    //                             const trimmedSentence = sentence.trim();
    //                             if (trimmedSentence) {
    //                                 sentenceQueue.push(trimmedSentence);
    //                             }
    //                         });
    //                     }
    
    //                     currentSentenceBuffer = "";
    //                     lastRecognizingText = "";
    
    //                     // ✅ Start synthesis queue only if not already speaking
    //                     if (!isSpeaking) {
    //                         processSynthesisQueue();
    //                     }
    //                 }, pauseThreshold);
    //             }
    //         }
    //     };
    
    //     translator.recognized = () => {
    //         console.log("📢 Translator recognized event fired - Processing queue");
    //         if (!isSpeaking) {
    //             processSynthesisQueue();
    //         }
    //     };
    
    //     // ✅ Event: Handle Cancellations
    //     translator.canceled = (s, e) => {
    //         console.error("❌ Translation canceled:", e.reason, "Error:", e.errorDetails);
    //     };
    
    //     // ✅ Start Continuous Recognition
    //     translator.startContinuousRecognitionAsync(
    //         () => {
    //             console.log("✅ Continuous recognition started.");
    //         },
    //         (error) => {
    //             console.error("❌ Error starting continuous recognition:", error);
    //         }
    //     );
    
    //     return { translator };
    // };








    // This one is blocking synthesis from occurring before the current synthesis is finished, however, it is taking way too long in between synthesis -
    // - and it is cutting out the last 2-3 words for some reason from the next synthesis
    
    // usethisone
    // const startContinuousTranslation = () => {
    //     const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
    //         apiKey as string,
    //         "eastus2"
    //     );
    
    //     speechConfig.speechRecognitionLanguage = "en-US";
    //     speechConfig.addTargetLanguage(tarLocale);
    //     speechConfig.voiceName = shortName;
    
    //     const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    //     translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
    //     let sentenceQueue: string[] = []; // Store fully formed sentences
    //     let lastRecognizingText = ""; // Track interim sentence progress
    //     let currentSentenceBuffer = ""; // Temporary storage for words
    //     let isSpeaking = false; 
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    //     let sentenceTimeout: NodeJS.Timeout | null = null;
    //     const pauseThreshold = 1200; // Reduce for quicker sentence finalization
    
    //     // ✅ Process sentences one at a time
    //     const processSynthesisQueue = async () => {
    //         console.log("isSpeaking: ", isSpeaking);
    //         console.log("sentenceQueue before if: ", sentenceQueue);
            
    //         if (isSpeaking || sentenceQueue.length === 0) {
    //             console.log("🚫 processSynthesisQueue blocked - Still speaking or queue empty");
    //             return;
    //         }

    //         console.log("sentenceQueue before if: ", sentenceQueue);
    //         await synthesizeSpeech(sentenceQueue);
    //     };
    
    //     // ✅ Synthesize speech sequentially & ensure full audio playback
    //     const synthesizeSpeech = async (textArray: string[]) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close();
    //             currentSynthesizer = null;
    //         }
        
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
    //         synthConfig.speechSynthesisVoiceName = shortName;
        
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    //         isSpeaking = true; // Lock speech processing
        
    //         try {
    //             for (let i = 0; i < textArray.length; i++) {
    //                 const text = textArray[i];
        
    //                 await new Promise<void>((resolve, reject) => {
    //                     currentSynthesizer?.speakTextAsync(
    //                         text,
    //                         (result) => {
    //                             if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                                 console.log("✅ Synthesis complete:", text);
        
    //                                 const audioDuration = result.audioDuration / 10000; // Convert to milliseconds
    //                                 console.log("🔊 Audio playback duration:", audioDuration, "ms");
        
    //                                 setTimeout(() => {
    //                                     console.log("⏳ Speech duration elapsed, unlocking queue.");
    //                                     resolve();
    //                                 }, audioDuration); // Wait until the audio duration completes
    //                             } else {
    //                                 console.error("❌ Synthesis failed:", result.errorDetails);
    //                                 reject(new Error(result.errorDetails));
    //                             }
    //                         },
    //                         (error) => {
    //                             console.error("⚠️ Error during speech synthesis:", error);
    //                             reject(error);
    //                         }
    //                     );
    //                 });
        
    //                 // **Clear each sentence after it has been processed**
    //                 console.log(`🗑️ Removing processed sentence from queue: "${sentenceQueue[0]}"`);
    //                 sentenceQueue.shift(); // Removes the first processed sentence
    //             }
    //         } catch (error) {
    //             console.error("⚠️ Error during synthesis:", error);
    //         } finally {
    //             setTimeout(() => {
    //                 isSpeaking = false; // Unlock speech processing AFTER audio duration
    //                 console.log("🔓 isSpeaking set to FALSE after duration.");
    //             }, 500); // Small buffer delay after speech ends
        
    //             if (currentSynthesizer) {
    //                 currentSynthesizer.close();
    //                 currentSynthesizer = null;
    //             }
    //         }
    //     };

    //         //     // ✅ Event: Recognizing (Interim Results)
    //         translator.recognizing = (s: SpeechSDK.TranslationRecognizer, e: SpeechSDK.TranslationRecognitionEventArgs) => {
    //             if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //                 const interimTranslatedText = e.result.translations.get(tarLocale);
        
    //                 if (interimTranslatedText && interimTranslatedText !== lastRecognizingText) {
    //                     console.log("🔄 Interim (Buffering):", interimTranslatedText);
        
    //                     currentSentenceBuffer = interimTranslatedText;
    //                     lastRecognizingText = interimTranslatedText;
        
    //                     if (sentenceTimeout) clearTimeout(sentenceTimeout);
    //                     sentenceTimeout = setTimeout(() => {
    //                         console.log("🛑 Pause detected, finalizing:", currentSentenceBuffer);
        
    //                         // ✅ Ensure the buffer has punctuation at the end
    //                         if (!/[.!?]$/.test(currentSentenceBuffer.trim())) {
    //                             currentSentenceBuffer += "."; // Append period if missing
    //                         }
        
    //                         // ✅ Split sentences by punctuation while preserving punctuation
    //                         const finalizedSentences = currentSentenceBuffer.match(/[^.!?]+[.!?]/g);
        
    //                         if (finalizedSentences) {
    //                             finalizedSentences.forEach(sentence => {
    //                                 const trimmedSentence = sentence.trim();
    //                                 if (trimmedSentence) {
    //                                     sentenceQueue.push(trimmedSentence);
    //                                 }
    //                             });
    //                         }
        
    //                         currentSentenceBuffer = "";
    //                         lastRecognizingText = "";
        
    //                         // ✅ Start synthesis queue only if not already speaking
    //                         if (!isSpeaking) {
    //                             processSynthesisQueue();
    //                         }
    //                     }, pauseThreshold);
    //                 }
    //             }
    //         };
        
    
    //     translator.recognized = () => {
    //         console.log("📢 Translator recognized event fired - Processing queue");
    //         if (!isSpeaking) {
    //             processSynthesisQueue();
    //         }
    //     };
    
    //     // ✅ Event: Handle Cancellations
    //     translator.canceled = (s, e) => {
    //         console.error("❌ Translation canceled:", e.reason, "Error:", e.errorDetails);
    //     };
    
    //     // ✅ Start Continuous Recognition
    //     translator.startContinuousRecognitionAsync(
    //         () => {
    //             console.log("✅ Continuous recognition started.");
    //         },
    //         (error) => {
    //             console.error("❌ Error starting continuous recognition:", error);
    //         }
    //     );
    
    //     return { translator };
    // };









    const startContinuousTranslation = () => {
        const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
            apiKey as string,
            "eastus2"
        );
    
        speechConfig.speechRecognitionLanguage = "en-US";
        speechConfig.addTargetLanguage(tarLocale);
        speechConfig.voiceName = shortName;
    
        const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
        let sentenceQueue: string[] = []; // Store fully formed sentences
        let lastRecognizingText = ""; // Track interim sentence progress
        let currentSentenceBuffer = ""; // Temporary storage for words
        let isSpeaking = false; 
        let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
        let sentenceTimeout: NodeJS.Timeout | null = null;
        const pauseThreshold = 1200; // Adjust for optimal flow
    
        // ✅ **Continuous Processing Loop**
        const processSynthesisQueue = async () => {
            if (isSpeaking || sentenceQueue.length === 0) {
                return; // Don't re-trigger if already speaking
            }
    
            isSpeaking = true; // Lock speaking
            console.log("🔄 Processing queue:", sentenceQueue);
    
            await synthesizeSpeech(sentenceQueue);
    
            isSpeaking = false; // Unlock speaking
            // sentenceQueue.length = 0; // Clears the array completely
            console.log("✅ Queue is empty, waiting for new sentences.");
        };
    
        // ✅ **Optimized Synthesis Method**
        const synthesizeSpeech = async (textArray: string[]) => {
            if (currentSynthesizer) {
                currentSynthesizer.close();
                currentSynthesizer = null;
            }
    
            const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
            synthConfig.speechSynthesisVoiceName = shortName;
    
            const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
            currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
            isSpeaking = true;
    
            try {
                for (let i = 0; i < textArray.length; i++) {
                    const text = textArray[i];
        
                    await new Promise<void>((resolve, reject) => {
                        currentSynthesizer?.speakTextAsync(
                            text,
                            (result) => {
                                if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                                    console.log("✅ Synthesis complete:", text);
        
                                    const audioDuration = result.audioDuration / 10000; // Convert to milliseconds
                                    console.log("🔊 Audio playback duration:", audioDuration, "ms");
        
                                    setTimeout(() => {
                                        console.log("⏳ Speech duration elapsed, unlocking queue.");
                                        resolve();
                                    }, audioDuration); // Wait until the audio duration completes
                                } else {
                                    console.error("❌ Synthesis failed:", result.errorDetails);
                                    reject(new Error(result.errorDetails));
                                }
                            },
                            (error) => {
                                console.error("⚠️ Error during speech synthesis:", error);
                                reject(error);
                            }
                        );
                    });
                }
            } catch (error) {
                console.error("⚠️ Error during synthesis:", error);
            }
        };
    
        // ✅ **Sentence Processing - Detecting End of Thought**
        translator.recognizing = (s: SpeechSDK.TranslationRecognizer, e: SpeechSDK.TranslationRecognitionEventArgs) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                const interimTranslatedText = e.result.translations.get(tarLocale);
    
                if (interimTranslatedText && interimTranslatedText !== lastRecognizingText) {
                    console.log("🔄 Interim (Buffering):", interimTranslatedText);
    
                    currentSentenceBuffer = interimTranslatedText;
                    lastRecognizingText = interimTranslatedText;
    
                    if (sentenceTimeout) clearTimeout(sentenceTimeout);
                    sentenceTimeout = setTimeout(() => {
                        console.log("🛑 Pause detected, finalizing:", currentSentenceBuffer);
    
                        // ✅ Ensure the buffer has punctuation at the end
                        if (!/[.!?]$/.test(currentSentenceBuffer.trim())) {
                            currentSentenceBuffer += "."; // Append period if missing
                        }
    
                        // ✅ Split sentences by punctuation while preserving punctuation
                        const finalizedSentences = currentSentenceBuffer.match(/[^.!?]+[.!?]/g);
    
                        if (finalizedSentences) {
                            finalizedSentences.forEach(sentence => {
                                const trimmedSentence = sentence.trim();
                                if (trimmedSentence) {
                                    sentenceQueue.push(trimmedSentence);
                                }
                            });
                        }
    
                        currentSentenceBuffer = "";
                        lastRecognizingText = "";
    
                        // ✅ Ensure synthesis starts only when needed
                        if (!isSpeaking) {
                            processSynthesisQueue();
                        }
                    }, pauseThreshold);
                }
            }
        };
    
        translator.recognized = () => {
            console.log("📢 Translator recognized event fired - Processing queue");
            if (!isSpeaking) {
                processSynthesisQueue();
            }
        };
    
        // ✅ Start Continuous Recognition
        translator.startContinuousRecognitionAsync(
            () => {
                console.log("✅ Continuous recognition started.");
            },
            (error) => {
                console.error("❌ Error starting continuous recognition:", error);
            }
        );
    
        return { translator };
    };    

    return (
        <>
        <div className="d-flex flex-column align-items-center mt-4">
            {/* Dropdowns */}
            <div className="d-flex justify-content-between mb-4" style={{ width: '700px' }}>
                <DropdownMenu
                    data={targetLangData}
                    handleTarLang={handleTarLang}
                    isDisabled={isDrpDwnDisabled}
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
    
            {/* <div style={{ width: '700px', marginBottom: '20px', marginTop: '20px' }}>
                <h3 className="text-center">
                    Sentence Buffer
                    <span
                        style={{
                            marginLeft: '8px',
                            cursor: 'pointer',
                            color: '#ffffff', // Lighter color for better contrast
                            fontWeight: 'bold', // Make it bold for better visibility
                            fontSize: '16px', // Slightly larger font size
                            textDecoration: 'none', // Remove underline for cleaner look
                            backgroundColor: '#007bff', // Add a background for visibility
                            padding: '2px 6px', // Add padding for a button-like effect
                            borderRadius: '50%', // Make it circular
                        }}
                        onClick={openModal}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')} // Hover effect: darker background
                        onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
                        >
                        ?
                    </span>

                </h3>

                {isModalOpen && (
                    <>

                    <div
                        style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        }}
                        onClick={closeModal}
                    />

                    <div
                    style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        zIndex: 1000,
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
                    >
                        <p
                        style={{
                            color: 'black',
                        }}
                        >
                        The Sentence Buffer allows you to adjust how much time is taken in between sentences.
                        </p>

                        <p
                        style={{
                            color: 'black',
                            paddingTop: '10px',
                        }}
                        >
                        This is mainly for faster speaking languages such as Spanish, to reduce overlap.
                        </p>
                        <div
                        className="text-center"
                        style={{
                            paddingTop: '10px',
                        }}
                        >
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={closeModal}
                            style={{ marginTop: '10px' }}
                        >
                            Close
                        </button>
                        </div>
                    </div>
                    </>
                )}
                <VolumeSlider onVolumeChange={handleTimeoutChange}/>
            </div>
            */}
    
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