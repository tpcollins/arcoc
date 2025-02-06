/*

next steps: 
- use startContinuosTranslation that is marked with: usethisone


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

    // usethisone
    // uhhh so this one seems to be working all of the sudden? It does not stop speaking as the lpi and synthlog length seem to be properly updated. 

    // ONLY ISSUE: Azure is still piecing sentences together all stupid and if you do not take unnatural pauses it will repeat sentences and/or parts 
    // - of sentenes that have already been spoken
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
    //     let speechLog: string[] = [];
    //     let synthLog: string[] = [];
    //     let lastRecognizingText = ""; // Track interim sentence progress
    //     let currentSentenceBuffer = ""; // Temporary storage for words
    //     let isSpeaking = false; 
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    //     let sentenceTimeout: NodeJS.Timeout | null = null;
    //     const pauseThreshold = 1100; // Adjust for optimal flow

    //     let lastProcessedIndex = 0; // ✅ Track last processed sentence

    //     const monitorSpeechLog = () => {
    //         setInterval(() => {
    //             console.log("synthLog.length: ", synthLog.length);
    //             console.log("lastProcessedIndex: ", lastProcessedIndex);
    //             if (!isSpeaking && synthLog.length > lastProcessedIndex) {
    //                 console.log("🛠 Processing new speech log entries...");
        
    //                 // ✅ Process only NEW sentences
    //                 for (let i = lastProcessedIndex; i < synthLog.length; i++) {
    //                     const sentence = synthLog[i];
    //                     if (!sentenceQueue.includes(sentence)) {
    //                         sentenceQueue.push(sentence);
    //                     }
    //                 }
        
    //                 lastProcessedIndex = synthLog.length; // ✅ Update processed index
    //                 processSynthesisQueue(); // ✅ Trigger synthesis queue
    //             }
    //         }, 2000); // ✅ Check every 2 seconds
    //     };

    
    //     // ✅ **Continuous Processing Loop**
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || sentenceQueue.length === 0) {
    //             return; // Don't re-trigger if already speaking
    //         }
    
    //         isSpeaking = true; // Lock speaking
    //         console.log("🔄 Processing queue:", sentenceQueue);
    
    //         await synthesizeSpeech(sentenceQueue);
    
    //         isSpeaking = false; // Unlock speaking
    //         sentenceQueue.length = 0; // Clears the array completely
    //         console.log("✅ Queue is empty, waiting for new sentences.");
    //     };
    
    //     // ✅ **Optimized Synthesis Method**
    //     const synthesizeSpeech = async (textArray: string[]) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close();
    //             currentSynthesizer = null;
    //         }
    
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
    //         synthConfig.speechSynthesisVoiceName = shortName;
    
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    //         isSpeaking = true;
    
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
    //             }
    //         } catch (error) {
    //             console.error("⚠️ Error during synthesis:", error);
    //         }
    //     };

    //     // ✅ Capture Recognized Text - Only Formatting, No Synthesis
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

    //                     // ✅ Ensure punctuation
    //                     if (!/[.!?]$/.test(currentSentenceBuffer.trim())) {
    //                         currentSentenceBuffer += ".";
    //                     }

    //                     // ✅ Store sentences in a log instead of synthesizing immediately
    //                     const finalizedSentences = currentSentenceBuffer.match(/[^.!?]+[.!?]/g);
    //                     if (finalizedSentences) {
    //                         finalizedSentences.forEach(sentence => {
    //                             const trimmedSentence = sentence.trim();
    //                             if (trimmedSentence) {
    //                                 speechLog.push(trimmedSentence); // ✅ Add to speech log
    //                                 synthLog.push(trimmedSentence);  // ✅ Append to synthLog instead of replacing
    //                             }
    //                         });
    //                     }

    //                     console.log("📜 Speech Log Updated:", speechLog);
    //                     speechLog = []; // ✅ Clear speechLog but NOT synthLog
    //                     currentSentenceBuffer = "";
    //                     lastRecognizingText = "";

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
    
    //     monitorSpeechLog();

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

    // Playground method with automated sentence sending
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
    
    //     let sentenceQueue: string[] = [];
    //     let speechLog: string[] = [];
    //     let synthLog: string[] = [];
    //     let lastRecognizingText = "";
    //     let currentSentenceBuffer = "";
    //     let isSpeaking = false; 
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    //     let sentenceTimeout: NodeJS.Timeout | null = null;
    //     let batchTimeout: NodeJS.Timeout | null = null; // NEW Timeout for speech log batch
    //     const pauseThreshold = 1000;
    //     const batchSize = 3; // Number of sentences to send at a time
    //     let isUserTalking = false;
    
    //     let lastProcessedIndex = 0; 
    
    //     const monitorSpeechLog = () => {
    //         setInterval(() => {
    //             if (!isSpeaking && synthLog.length > lastProcessedIndex) {
    //                 console.log("🛠 Processing new speech log entries...");
    
    //                 for (let i = lastProcessedIndex; i < synthLog.length; i++) {
    //                     const sentence = synthLog[i];
    //                     if (!sentenceQueue.includes(sentence)) {
    //                         sentenceQueue.push(sentence);
    //                     }
    //                 }
    
    //                 lastProcessedIndex = synthLog.length; 
    //                 processSynthesisQueue(); 
    //             }
    //         }, 2000);
    //     };
    
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || sentenceQueue.length === 0) return;
    
    //         isSpeaking = true;
    //         console.log("🔄 Processing queue:", sentenceQueue);
    
    //         await synthesizeSpeech(sentenceQueue);
    
    //         isSpeaking = false;
    //         sentenceQueue.length = 0; 
    //         console.log("✅ Queue is empty, waiting for new sentences.");
    //     };
    
    //     const synthesizeSpeech = async (textArray: string[]) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close();
    //             currentSynthesizer = null;
    //         }
    
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
    //         synthConfig.speechSynthesisVoiceName = shortName;
    
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    //         isSpeaking = true;
    
    //         try {
    //             for (let i = 0; i < textArray.length; i++) {
    //                 const text = textArray[i];
    
    //                 await new Promise<void>((resolve, reject) => {
    //                     currentSynthesizer?.speakTextAsync(
    //                         text,
    //                         (result) => {
    //                             if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                                 console.log("✅ Synthesis complete:", text);
    
    //                                 const audioDuration = result.audioDuration / 10000;
    //                                 console.log("🔊 Audio playback duration:", audioDuration, "ms");
    
    //                                 setTimeout(() => {
    //                                     console.log("⏳ Speech duration elapsed, unlocking queue.");
    //                                     resolve();
    //                                 }, audioDuration);
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
    //             }
    //         } catch (error) {
    //             console.error("⚠️ Error during synthesis:", error);
    //         }
    //     };
    
    //     translator.recognizing = (s: SpeechSDK.TranslationRecognizer, e: SpeechSDK.TranslationRecognitionEventArgs) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             const interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
    
    //             if (interimTranslatedText && interimTranslatedText !== lastRecognizingText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //                 currentSentenceBuffer = interimTranslatedText;
    //                 lastRecognizingText = interimTranslatedText;
    
    //                 if (sentenceTimeout) clearTimeout(sentenceTimeout);
    //                 sentenceTimeout = setTimeout(() => {
    //                     console.log("🛑 Pause detected, finalizing:", currentSentenceBuffer);
    
    //                     if (!/[.!?]$/.test(currentSentenceBuffer.trim())) {
    //                         currentSentenceBuffer += ".";
    //                     }
    
    //                     const finalizedSentences = currentSentenceBuffer.match(/[^.!?]+[.!?]/g);
    //                     if (finalizedSentences) {
    //                         finalizedSentences.forEach(sentence => {
    //                             const trimmedSentence = sentence.trim();
    //                             if (trimmedSentence) {
    //                                 speechLog.push(trimmedSentence);
    //                             }
    //                         });
    //                     }
    
    //                     console.log("📜 Speech Log Updated:", speechLog);
    
    //                     // ✅ Send the first `batchSize` sentences if enough have accumulated
    //                     if (speechLog.length >= batchSize) {
    //                         synthLog.push(...speechLog.splice(0, batchSize));
    //                         console.log("🚀 Sending batch to synthLog:", synthLog);
    //                     }
    
    //                     // ✅ If there's a pause for 3 seconds, send remaining sentences
    //                     if (batchTimeout) clearTimeout(batchTimeout);
    //                     batchTimeout = setTimeout(() => {
    //                         if (speechLog.length > 0 && !isUserTalking) {
    //                             console.log("isUserTalking: ,", isUserTalking);
    //                             console.log("⏳ Timeout reached, sending remaining sentences.");
    //                             synthLog.push(...speechLog.splice(0, speechLog.length));
    //                         }
    //                     }, 3000);
    
    //                     currentSentenceBuffer = "";
    //                     lastRecognizingText = "";
    //                 }, pauseThreshold);
    //             }
    //         }else{
    //             isUserTalking = false;
    //         }
    //     };
    
    //     translator.recognized = () => {
    //         console.log("📢 Translator recognized event fired - Processing queue");
    //         if (!isSpeaking) {
    //             processSynthesisQueue();
    //         }
    //     };
    
    //     monitorSpeechLog();
    
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














    // usethisone2
    // this method is properly sending the sentences off and the timeout is sending off properly but we still need to fix the way that azure is appending sentences -
    // - because we are still getting repeats
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
    //     let speechLog: string[] = [];
    //     let synthLog: string[] = [];
    //     let lastRecognizingText = ""; // Track interim sentence progress
    //     let currentSentenceBuffer = ""; // Temporary storage for words
    //     let isSpeaking = false;
    //     let isUserTalking = false; // ✅ Tracks if user is actively speaking
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    //     let sentenceTimeout: NodeJS.Timeout | null = null;
    //     let batchTimeout: NodeJS.Timeout | null = null; // ✅ New timeout for batch processing
    //     let userSpeakingTimeout: NodeJS.Timeout | null = null;
    //     const pauseThreshold = 1000; // Adjust for optimal flow
    
    //     let lastProcessedIndex = 0; // ✅ Track last processed sentence
    
    //     const monitorSpeechLog = () => {
    //         setInterval(() => {
    //             if (!isSpeaking && synthLog.length > lastProcessedIndex) {
    //                 console.log("🛠 Processing new speech log entries...");
    
    //                 // ✅ Process only NEW sentences
    //                 for (let i = lastProcessedIndex; i < synthLog.length; i++) {
    //                     const sentence = synthLog[i];
    //                     if (!sentenceQueue.includes(sentence)) {
    //                         sentenceQueue.push(sentence);
    //                     }
    //                 }
    
    //                 lastProcessedIndex = synthLog.length; // ✅ Update processed index
    //                 processSynthesisQueue(); // ✅ Trigger synthesis queue
    //             }
    //         }, 2000); // ✅ Check every 2 seconds
    //     };
    
    //     // ✅ **Continuous Processing Loop**
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || sentenceQueue.length === 0) {
    //             return; // Don't re-trigger if already speaking
    //         }
    
    //         isSpeaking = true; // Lock speaking
    //         console.log("🔄 Processing queue:", sentenceQueue);
    
    //         await synthesizeSpeech(sentenceQueue);
    
    //         isSpeaking = false; // Unlock speaking
    //         sentenceQueue.length = 0; // Clears the array completely
    //         console.log("✅ Queue is empty, waiting for new sentences.");
    //     };
    
    //     // ✅ **Optimized Synthesis Method**
    //     const synthesizeSpeech = async (textArray: string[]) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close();
    //             currentSynthesizer = null;
    //         }
    
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
    //         synthConfig.speechSynthesisVoiceName = shortName;
    
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    //         isSpeaking = true;
    
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
    //             }
    //         } catch (error) {
    //             console.error("⚠️ Error during synthesis:", error);
    //         }
    //     };
    
    //     // ✅ Capture Recognized Text - Only Formatting, No Synthesis
    //     translator.recognizing = (s: SpeechSDK.TranslationRecognizer, e: SpeechSDK.TranslationRecognitionEventArgs) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             const interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
    
    //             if (interimTranslatedText && interimTranslatedText !== lastRecognizingText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //                 currentSentenceBuffer = interimTranslatedText;
    //                 lastRecognizingText = interimTranslatedText;
    
    //                 if (sentenceTimeout) clearTimeout(sentenceTimeout);
    //                 sentenceTimeout = setTimeout(() => {
    //                     console.log("🛑 Pause detected, finalizing:", currentSentenceBuffer);
    
    //                     // ✅ Ensure punctuation
    //                     if (!/[.!?]$/.test(currentSentenceBuffer.trim())) {
    //                         currentSentenceBuffer += ".";
    //                     }
    
    //                     // ✅ Store sentences in a log instead of synthesizing immediately
    //                     const finalizedSentences = currentSentenceBuffer.match(/[^.!?]+[.!?]/g);
    //                     if (finalizedSentences) {
    //                         finalizedSentences.forEach(sentence => {
    //                             const trimmedSentence = sentence.trim();
    //                             if (trimmedSentence) {
    //                                 speechLog.push(trimmedSentence); // ✅ Add to speech log
    //                             }
    //                         });
    //                     }
    
    //                     console.log("📜 Speech Log Updated:", speechLog);
    
    //                     // ✅ **Send only 3 sentences when speechLog reaches 4**
    //                     if (speechLog.length >= 4) {
    //                         synthLog.push(...speechLog.splice(0, 3)); // ✅ Send first 3 sentences
    //                         console.log("📤 Sending batch:", synthLog);
    //                     }
    
    //                     // ✅ Start batch timeout for remaining sentences
    //                     if (batchTimeout) clearTimeout(batchTimeout);
    //                     batchTimeout = setTimeout(() => {
    //                         if (!isUserTalking && speechLog.length > 0) {
    //                             console.log("🕒 Timeout reached, sending remaining sentences.");
    //                             synthLog.push(...speechLog.splice(0, speechLog.length)); // ✅ Send remaining sentences
    //                         }
    //                     }, 3000);
    
    //                     currentSentenceBuffer = "";
    //                     lastRecognizingText = "";
    //                 }, pauseThreshold);
    //             }
    //         }
    //         if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout); // ✅ Reset timeout on new speech
            
    //         // ✅ Delayed reset for `isUserTalking`
    //         userSpeakingTimeout = setTimeout(() => {
    //             isUserTalking = false;
    //             console.log("⏳ No speech detected for 3 seconds, setting isUserTalking to false.");
    //         }, 3000); // ✅ Waits 3 seconds before resetting
    //     };
    
    //     translator.recognized = () => {
    //         console.log("📢 Translator recognized event fired - Processing queue");
    //         if (!isSpeaking) {
    //             processSynthesisQueue();
    //         }
    //     };
    
    //     monitorSpeechLog();
    
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
        let speechLog: string[] = [];
        let synthLog: string[] = [];
        let lastRecognizingText = ""; // Track interim sentence progress
        let currentSentenceBuffer = ""; // Temporary storage for words
        let isSpeaking = false;
        let isUserTalking = false; // ✅ Tracks if user is actively speaking
        let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
        let sentenceTimeout: NodeJS.Timeout | null = null;
        let batchTimeout: NodeJS.Timeout | null = null; // ✅ New timeout for batch processing
        let userSpeakingTimeout: NodeJS.Timeout | null = null;
        const pauseThreshold = 1600; // Adjust for optimal flow
    
        let lastProcessedIndex = 0; // ✅ Track last processed sentence
    
        const monitorSpeechLog = () => {
            setInterval(() => {
                if (!isSpeaking && synthLog.length > lastProcessedIndex) {
                    console.log("🛠 Processing new speech log entries...");
    
                    // ✅ Process only NEW sentences
                    for (let i = lastProcessedIndex; i < synthLog.length; i++) {
                        const sentence = synthLog[i];
                        if (!sentenceQueue.includes(sentence)) {
                            sentenceQueue.push(sentence);
                        }
                    }
    
                    lastProcessedIndex = synthLog.length; // ✅ Update processed index
                    processSynthesisQueue(); // ✅ Trigger synthesis queue
                }
            }, 2000); // ✅ Check every 2 seconds
        };
    
        // ✅ **Continuous Processing Loop**
        const processSynthesisQueue = async () => {
            if (isSpeaking || sentenceQueue.length === 0) {
                return; // Don't re-trigger if already speaking
            }
    
            isSpeaking = true; // Lock speaking
            console.log("🔄 Processing queue:", sentenceQueue);
    
            await synthesizeSpeech(sentenceQueue);
    
            isSpeaking = false; // Unlock speaking
            sentenceQueue.length = 0; // Clears the array completely
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

        let lastSentSentence = ""; // ✅ Track last sentence sent

        translator.recognizing = (s: SpeechSDK.TranslationRecognizer, e: SpeechSDK.TranslationRecognitionEventArgs) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                const interimTranslatedText = e.result.translations.get(tarLocale);
                isUserTalking = true;
        
                if (interimTranslatedText && interimTranslatedText !== lastRecognizingText) {
                    // console.log("🔄 Interim (Buffering):", interimTranslatedText);
                    // frog
                    currentSentenceBuffer = interimTranslatedText;
                    lastRecognizingText = interimTranslatedText;
        
                    // ✅ Immediately add interim text to speechLog
                    let interimSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g);
                    if (interimSentences) {
                        interimSentences.forEach(sentence => {
                            const trimmedSentence = sentence.trim();
                            
                            // ✅ Prevent duplicates
                            if (trimmedSentence && (!speechLog.length || speechLog[speechLog.length - 1] !== trimmedSentence)) {
                                speechLog.push(trimmedSentence);
                            }
                        });
                    }
        
                    console.log("📜 Speech Log Updated:", speechLog);
        
                    // ✅ Process batch independently of pauses
                    while (speechLog.length >= 4) {
                        sendBatch();
                    }
        
                    // ✅ Keep pauseThreshold for sentence formatting
                    if (sentenceTimeout) clearTimeout(sentenceTimeout);
                    sentenceTimeout = setTimeout(() => {
                        console.log("🛑 Pause detected, finalizing:", currentSentenceBuffer);
        
                        if (!/[.!?]$/.test(currentSentenceBuffer.trim())) {
                            currentSentenceBuffer += ".";
                        }
        
                        const finalizedSentences = currentSentenceBuffer.match(/[^.!?]+[.!?]/g);
                        if (finalizedSentences) {
                            finalizedSentences.forEach(sentence => {
                                const trimmedSentence = sentence.trim();
                                
                                if (trimmedSentence && (!speechLog.length || speechLog[speechLog.length - 1] !== trimmedSentence)) {
                                    speechLog.push(trimmedSentence);
                                }
                            });
                        }
        
                        console.log("📜 Speech Log Updated (Finalized):", speechLog);
                        currentSentenceBuffer = "";
                        lastRecognizingText = "";
                    }, pauseThreshold);
                }
            }
        
            if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
        
            userSpeakingTimeout = setTimeout(() => {
                isUserTalking = false;
                console.log("⏳ No speech detected for 3 seconds, sending remaining sentences.");
                processRemainingBatch();
            }, 3000);
        };
        
        // ✅ Extracted batch processing logic
        const sendBatch = () => {
            console.log("🚀 Sending batch...");
            
            // ✅ Extract and format batch of sentences
            let batch = speechLog.splice(0, 3).map(sentence => sentence.trim());
        
            // ✅ Ensure punctuation at end of each sentence
            batch = batch.map(sentence => {
                return /[.!?]$/.test(sentence) ? sentence : sentence + ".";
            });
        
            // ✅ Filter out last sentence sent (prevents duplication)
            batch = batch.filter(sentence => sentence !== lastSentSentence);
            lastSentSentence = batch[batch.length - 1] || ""; // ✅ Store last sentence sent
        
            // ✅ Push formatted batch to synthLog
            synthLog.push(...batch);
            console.log("📤 Batch sent:", synthLog);
            
            // ✅ Trigger synthesis
            processSynthesisQueue();
        };        
        
        // ✅ Process remaining sentences after timeout
        const processRemainingBatch = () => {
            if (!isUserTalking && speechLog.length > 0) {
                console.log("🕒 Timeout reached, sending remaining sentences.");
                let remainingBatch = speechLog.splice(0, speechLog.length);
        
                remainingBatch = remainingBatch.filter(sentence => sentence !== lastSentSentence);
                lastSentSentence = remainingBatch[remainingBatch.length - 1] || "";
        
                synthLog.push(...remainingBatch);
                processSynthesisQueue();
            }
        };
        
        translator.recognized = () => {
            console.log("📢 Translator recognized event fired - Processing queue");
            if (!isSpeaking) {
                processSynthesisQueue();
            }
        };
    
        monitorSpeechLog();
    
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