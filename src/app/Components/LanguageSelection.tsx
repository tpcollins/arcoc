/*

Current setup: 
- use usethisone4
- Actually working pretty well. We are comparing the sentences to be sent to finalizedSentences before we send them and it seems to work pretty well. 
The logs are not skipping or stopping and it is idenfying inconsistencies pretty easily. 
We still need to fix:
1. Sentence repeats occurring when sentences are correct (just partial sentences)
2. Getting the last sentence to process

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
    // Cleaned up and improved version of usethisone3. Setting new method under with synthesisTracker
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
    
    //     let lastProcessedIndex = 0; // ✅ Track last processed sentence        
    
    //     // ✅ **Continuous Processing Loop**
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || speechLog.length === 0) {
    //             return;
    //         }
        
    //         isSpeaking = true; // Lock speaking
    //         console.log("🔄 Processing queue:", speechLog);
        
    //         let sentencesToProcess = [...speechLog]; // Copy speechLog
    //         await synthesizeSpeech(sentencesToProcess);
        
    //         // ✅ Only remove sentences that were successfully synthesized
    //         speechLog = speechLog.slice(sentencesToProcess.length);
        
    //         isSpeaking = false; // Unlock speaking
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
    //         // isSpeaking = true;
    
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

    //     let recogLPI = 0;
    //     let recogTimeout: NodeJS.Timeout | null = null;
    //     let lastFinalSentence = "";
    //     let finalSentencesCharLength = 0;
    //     let interimTranslatedText = "";
    //     let finalizedSentences: string[] = [];
    //     let lastSentencePendingPunctuation = "";

    //     // Background processing loop
    //     setInterval(() => {
    //         if (!isSpeaking && speechLog.length > 0) {
    //             console.log("⏳ Background synthesis triggered...");
    //             processSynthesisQueue();
    //         }
        
    //         // ✅ Handle pending punctuation in the background
    //         if (lastSentencePendingPunctuation && !isUserTalking) {
    //             console.log("⚠️ Detected unfinished sentence. Adding punctuation...");
        
    //             if (!/[.!?]$/.test(lastSentencePendingPunctuation)) {
    //                 lastSentencePendingPunctuation += "."; // ✅ Append missing punctuation
    //             }
        
    //             console.log("✏️ Added punctuation:", lastSentencePendingPunctuation);
    //             speechLog.push(lastSentencePendingPunctuation);
    //             lastSentencePendingPunctuation = "";
    //             processSynthesisQueue();
    //         }
    //     }, 500); // Runs every 500ms
        
    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
        
    //             if (interimTranslatedText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
        
    //                 finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //                 console.log("Finalized Sentences before processing:", finalizedSentences);
        
    //                 if (recogTimeout) clearTimeout(recogTimeout);
    //                 recogTimeout = setTimeout(() => {
    //                     let newSentences = finalizedSentences.slice(recogLPI);
        
    //                     if (newSentences.length > 0) {
    //                         recogLPI = finalizedSentences.length;
    //                         finalSentencesCharLength = finalizedSentences.join("").length;
        
    //                         newSentences.forEach(sentence => {
    //                             let trimmedSentence = sentence.trim();
        
    //                             if (!speechLog.includes(trimmedSentence)) {
    //                                 if (/[.!?]$/.test(trimmedSentence)) {
    //                                     speechLog.push(trimmedSentence);
    //                                 } else {
    //                                     lastSentencePendingPunctuation = trimmedSentence;
    //                                 }
    //                             }
    //                         });
        
    //                         console.log("📜 Updated Speech Log:", speechLog);
    //                     }
        
    //                     processSynthesisQueue();
    //                 }, 0);
    //             }
        
    //             // if (!isUserTalking) {
    //             //     recogLPI = 0;
    //             // }
    //         }

    //         if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
    //         userSpeakingTimeout = setTimeout(() => {
    //             console.log("⏳ No speech detected for 3 seconds, checking last spoken text...");
            
    //             console.log("ITT Length: ", interimTranslatedText.length);
    //             console.log("finalSentencesCharLength: ", finalSentencesCharLength);
            
    //             if (interimTranslatedText.length > finalSentencesCharLength) {
    //                 console.log("⚠️ Detected unfinished sentence. Adding punctuation...");
            
    //                 let missingText = interimTranslatedText.substring(finalSentencesCharLength).trim();
    //                 if (!/[.!?]$/.test(missingText)) {
    //                     missingText += "."; // ✅ Append missing punctuation
    //                 }
            
    //                 console.log("✏️ Added punctuation to last sentence:", missingText);
    //                 if (!speechLog.includes(missingText)) {
    //                     speechLog.push(missingText);
    //                 }
            
    //                 finalizedSentences.push(missingText);
    //                 recogLPI = finalizedSentences.length;
    //                 finalSentencesCharLength = interimTranslatedText.length;
    //                 processSynthesisQueue();
    //             }
            
    //             // ✅ Instead of stopping recognition, restart it immediately
    //             console.log("✅ Restarting recognition to avoid missing input...");
    //             translator?.startContinuousRecognitionAsync(); 
            
    //         }, 4000);         
    //     };       

    //     // translator.recognized = () => {
    //     //     console.log("📢 Translator recognized event fired - Processing queue");
    //     //     if (!isSpeaking) {
    //     //         processSynthesisQueue();
    //     //     }
    //     // };
    
    //     // monitorSpeechLog();
    
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



    // usethisone2
    // This one is almost working perfectly but still cutting out sentences. Playground method underneath
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
    
    //     let speechLog: string[] = [];
    //     let synthesizedIndex = 0; // ✅ New variable to track synthesized sentences
    //     let isSpeaking = false;
    //     let isUserTalking = false;
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    //     let userSpeakingTimeout: NodeJS.Timeout | null = null;

    //     let speechLogTimeout: NodeJS.Timeout | null = null; // This is a temporary variable so we can check the speech log after it is done speaking
        
    //     let recogLPI = 0;
    //     let recogTimeout: NodeJS.Timeout | null = null;
    //     let finalSentencesCharLength = 0;
    //     let interimTranslatedText = "";
    //     let finalizedSentences: string[] = [];
    //     let lastSentencePendingPunctuation = "";
    //     let fSentCharLenReset = false;
        
    //     // ✅ **Force Synthesis for Each Sentence**
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || speechLog.length === 0) {
    //             return;
    //         }
        
    //         isSpeaking = true;
    //         console.log("🔄 Processing queue:", speechLog);
        
    //         while (synthesizedIndex < speechLog.length) {
    //             let sentenceToProcess = speechLog[synthesizedIndex]; // ✅ Only synthesize one at a time
    //             await synthesizeSpeech(sentenceToProcess);
    //             synthesizedIndex++; // ✅ Move index forward after synthesis
    //         }
        
    //         isSpeaking = false;
    //         console.log("✅ Queue is empty, waiting for new sentences.");
    //     };
        
    //     // ✅ **Force Synthesis for One Sentence at a Time**
    //     const synthesizeSpeech = async (text: string) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close();
    //             currentSynthesizer = null;
    //         }
        
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
    //         synthConfig.speechSynthesisVoiceName = shortName;
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
        
    //         try {
    //             await new Promise<void>((resolve, reject) => {
    //                 currentSynthesizer?.speakTextAsync(
    //                     text,
    //                     (result) => {
    //                         if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                             console.log("✅ Synthesis complete:", text);
    //                             setTimeout(() => {
    //                                 console.log("⏳ Speech duration elapsed, unlocking queue.");
    //                                 resolve();
    //                             }, result.audioDuration / 10000); // Wait until the audio duration completes
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
    //         }
    //     };
        
    //     // ✅ **Track Sentences and Handle Punctuation**
    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
        
    //             if (interimTranslatedText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //                 finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //                 console.log("Finalized Sentences before processing:", finalizedSentences);

    //                 if (fSentCharLenReset){
    //                     finalSentencesCharLength = interimTranslatedText.length;
    //                     recogLPI = 0;
    //                     fSentCharLenReset = false;
    //                 }
        
    //                 if (recogTimeout) clearTimeout(recogTimeout);
    //                 recogTimeout = setTimeout(() => {
    //                     let newSentences = finalizedSentences.slice(recogLPI);
    //                     if (newSentences.length > 0) {
    //                         recogLPI = finalizedSentences.length;
    //                         finalSentencesCharLength = finalizedSentences.join("").length;
        
    //                         newSentences.forEach(sentence => {
    //                             let trimmedSentence = sentence.trim();
    //                             if (!speechLog.includes(trimmedSentence)) {
    //                                 if (/[.!?]$/.test(trimmedSentence)) {
    //                                     speechLog.push(trimmedSentence);
    //                                 } else {
    //                                     lastSentencePendingPunctuation = trimmedSentence;
    //                                 }
    //                             }
    //                         });
        
    //                         console.log("📜 Updated Speech Log:", speechLog);
    //                     }
        
    //                     processSynthesisQueue(); // ✅ Immediately process synthesis
    //                 }, 0);
    //             }

    //             if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
    //             userSpeakingTimeout = setTimeout(() => {
    //                 console.log("⏳ No speech detected for 3 seconds, checking last spoken text...");
    //                 console.log("ITT Length:", interimTranslatedText.length);
    //                 console.log("finalSentencesCharLength:", finalSentencesCharLength);
            
    //                 if (interimTranslatedText.length > finalSentencesCharLength) {
    //                     fSentCharLenReset = true;
    //                     console.log("⚠️ Detected unfinished sentence. Adding punctuation...");
    //                     let missingText = interimTranslatedText.substring(finalSentencesCharLength).trim();
    //                     if (!/[.!?]$/.test(missingText)) {
    //                         missingText += "."; // ✅ Append missing punctuation
    //                     }
            
    //                     console.log("✏️ Added punctuation to last sentence:", missingText);
    //                     if (!speechLog.includes(missingText)) {
    //                         speechLog.push(missingText);
    //                     }
            
    //                     finalizedSentences.push(missingText);
    //                     finalSentencesCharLength = interimTranslatedText.length;
    //                     // recogLPI = finalizedSentences.length;
    //                     // console.log("recog LPI after reset in UST: ", recogLPI);
    //                     processSynthesisQueue();
    //                 }
            
    //                 isUserTalking = false;
    //             }, 4000);
    //         }
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






    // usethisone3
    // Playground method for usethisone3 BUT we know that this processSynthesisQueue and synthesizeSpeech does not stop the translator so we 
    // are going to try some new things under this one so we can come back to this if it need be
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

    //     const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
    //     synthConfig.speechSynthesisVoiceName = shortName;
    //     const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //     const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
    //     let speechLog: string[] = [];
    //     let synthesizedIndex = 0; // ✅ New variable to track synthesized sentences
    //     let isSpeaking = false;
    //     let isUserTalking = false;
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    //     let userSpeakingTimeout: NodeJS.Timeout | null = null;

    //     let speechLogTimeout: NodeJS.Timeout | null = null; // This is a temporary variable so we can check the speech log after it is done speaking
        
    //     let recogLPI = 0;
    //     let recogTimeout: NodeJS.Timeout | null = null;
    //     let finalSentencesCharLength = 0;
    //     let interimTranslatedText = "";
    //     let finalizedSentences: string[] = [];
    //     let lastSentencePendingPunctuation = "";
    //     let fSentCharLenReset = false;
        
    //     // ✅ **Force Synthesis for Each Sentence**
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || speechLog.length === 0) {
    //             return;
    //         }
        
    //         isSpeaking = true;
    //         console.log("🔄 Processing queue:", speechLog);
        
    //         // ✅ Get sentences that haven't been synthesized yet
    //         let sentencesToProcess = speechLog.slice(synthesizedIndex);
            
    //         // ✅ Process each sentence asynchronously
    //         for (const sentence of sentencesToProcess) {
    //             await synthesizeSpeech(sentence);
    //             synthesizedIndex++; // ✅ Move index forward **immediately**
    //         }
        
    //         isSpeaking = false;
    //         console.log("✅ Queue is empty, waiting for new sentences.");
    //     };        
        
    //     // ✅ **Force Synthesis for One Sentence at a Time**
    //     const synthesizeSpeech = async (text: string) => {
    //         try {
    //             await new Promise<void>((resolve, reject) => {
    //                 synthesizer.speakTextAsync(
    //                     text,
    //                     (result) => {
    //                         if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                             console.log("✅ Synthesis complete:", text);
    //                             setTimeout(() => {
    //                                 console.log("⏳ Speech duration elapsed, unlocking queue.");
    //                                 resolve();
    //                             }, result.audioDuration / 10000); // Wait until the audio duration completes
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
    //         }
    //     };
        
    //     // ✅ **Track Sentences and Handle Punctuation**
    //     // translator.recognizing = (s, e) => {
    //     //     if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //     //         interimTranslatedText = e.result.translations.get(tarLocale);
    //     //         isUserTalking = true;
        
    //     //         if (interimTranslatedText) {
    //     //             console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //     //             finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //     //             console.log("Finalized Sentences before processing:", finalizedSentences);
        
    //     //             if (fSentCharLenReset) {
    //     //                 finalSentencesCharLength = interimTranslatedText.length;
    //     //                 recogLPI = 0;
    //     //                 fSentCharLenReset = false;
    //     //             }
        
    //     //             let newSentences = finalizedSentences.slice(recogLPI);
    //     //             if (newSentences.length > 0) {
    //     //                 recogLPI = finalizedSentences.length;
    //     //                 finalSentencesCharLength = finalizedSentences.join("").length;
        
    //     //                 newSentences.forEach(sentence => {
    //     //                     let trimmedSentence = sentence.trim();
    //     //                     if (!speechLog.includes(trimmedSentence)) {
    //     //                         if (/[.!?]$/.test(trimmedSentence)) {
    //     //                             speechLog.push(trimmedSentence);
    //     //                         } else {
    //     //                             lastSentencePendingPunctuation = trimmedSentence;
    //     //                         }
    //     //                     }
    //     //                 });
        
    //     //                 console.log("📜 Updated Speech Log:", speechLog);
    //     //             }
        
    //     //             // ✅ Use setTimeout only ONCE, not on every recognition event
    //     //             if (!recogTimeout) {
    //     //                 recogTimeout = setTimeout(() => {
    //     //                     processSynthesisQueue(); // ✅ Process sentences after 2 seconds
    //     //                     recogTimeout = null; // Reset timeout so it can trigger again
    //     //                 }, 2000);
    //     //             }
    //     //         }
    //     //     }
    //     // };

    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
        
    //             if (interimTranslatedText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //                 finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //                 console.log("Finalized Sentences before processing:", finalizedSentences);

    //                 // if (fSentCharLenReset){
    //                 //     finalSentencesCharLength = interimTranslatedText.length;
    //                 //     recogLPI = 0;
    //                 //     fSentCharLenReset = false;
    //                 // }
        
    //                 if (recogTimeout) clearTimeout(recogTimeout);
    //                 recogTimeout = setTimeout(() => {
    //                     let newSentences = finalizedSentences.slice(recogLPI);
    //                     if (newSentences.length > 0) {
    //                         recogLPI = finalizedSentences.length;
    //                         finalSentencesCharLength = finalizedSentences.join("").length;
        
    //                         newSentences.forEach(sentence => {
    //                             let trimmedSentence = sentence.trim();
    //                             if (!speechLog.includes(trimmedSentence)) {
    //                                 if (/[.!?]$/.test(trimmedSentence)) {
    //                                     speechLog.push(trimmedSentence);
    //                                 } else {
    //                                     lastSentencePendingPunctuation = trimmedSentence;
    //                                 }
    //                             }
    //                         });
        
    //                         console.log("📜 Updated Speech Log:", speechLog);
    //                     }
        
    //                     processSynthesisQueue(); // ✅ Immediately process synthesis
    //                 }, 1000);
    //             }
    //         }
    //     }
    
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






    // usethisone4
    // Working pretty well, notes at top
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

        const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
        synthConfig.speechSynthesisVoiceName = shortName;
        const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
        let speechLog: string[] = [];
        let synthesizedIndex = 0; // ✅ New variable to track synthesized sentences
        let isSpeaking = false;
        let isUserTalking = false;
        let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
        let userSpeakingTimeout: NodeJS.Timeout | null = null;

        let speechLogTimeout: NodeJS.Timeout | null = null; // This is a temporary variable so we can check the speech log after it is done speaking
        
        let recogLPI = 0;
        let recogTimeout: NodeJS.Timeout | null = null;
        let finalSentencesCharLength = 0;
        let interimTranslatedText = "";
        let finalizedSentences: string[] = [];
        let lastSentencePendingPunctuation = "";
        let fSentCharLenReset = false;
        
        let clearLastSentenceTimeout: NodeJS.Timeout | null = null;

        // ✅ Only send sentences when we have at least 2 finalized sentences
        const processSynthesisQueue = async () => {
            if (isSpeaking || speechLog.length === 0) return;

            isSpeaking = true;
            console.log("🔄 Processing queue:", speechLog);

            while (synthesizedIndex < speechLog.length) {
                let sentenceToProcess = speechLog[synthesizedIndex]; // ✅ Process one sentence at a time
                await synthesizeSpeech(sentenceToProcess);
                synthesizedIndex++;
            }

            isSpeaking = false;
            console.log("✅ Queue is empty, waiting for new sentences.");
        };

        // ✅ Force-send the last remaining sentence if silence is detected
        // const scheduleSentenceCleanup = () => {
        //     if (clearLastSentenceTimeout) clearTimeout(clearLastSentenceTimeout);

        //     clearLastSentenceTimeout = setTimeout(() => {
        //         if (!isUserTalking && finalizedSentences.length > 0) {
        //             let lastSentence = finalizedSentences[finalizedSentences.length - 1];
        //             console.log("⏳ No speech detected, sending last sentence:", lastSentence);

        //             if (!speechLog.includes(lastSentence)) {
        //                 speechLog.push(lastSentence);
        //                 processSynthesisQueue();
        //             }
        //         }
        //     }, 4000); // ✅ Wait 4 seconds before forcing synthesis
        // };         
        
        // ✅ **Force Synthesis for One Sentence at a Time**
        const synthesizeSpeech = async (text: string) => {
            try {
                await new Promise<void>((resolve, reject) => {
                    synthesizer.speakTextAsync(
                        text,
                        (result) => {
                            if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                                console.log("✅ Synthesis complete:", text);
                                setTimeout(() => {
                                    console.log("⏳ Speech duration elapsed, unlocking queue.");
                                    resolve();
                                }, result.audioDuration / 10000); // Wait until the audio duration completes
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
            } catch (error) {
                console.error("⚠️ Error during synthesis:", error);
            }
        };
        
       // ✅ **Track Sentences and Handle Punctuation**
       translator.recognizing = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                interimTranslatedText = e.result.translations.get(tarLocale);
                isUserTalking = true;
        
                if (clearLastSentenceTimeout) {
                    console.log("❌ Canceling sentence cleanup due to new speech...");
                    clearTimeout(clearLastSentenceTimeout);
                }
        
                if (interimTranslatedText) {
                    console.log("🔄 Interim (Buffering):", interimTranslatedText);
                    let updatedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
                    console.log("Finalized Sentences before processing:", updatedSentences);
        
                    // ✅ Step 1: Track previous speechLog to detect changes
                    let previousSpeechLog = [...speechLog];
        
                    updatedSentences.forEach((sentence, index) => {
                        let trimmedSentence = sentence.trim();
        
                        // ✅ Step 2: Check if this sentence already exists in speechLog
                        let existingIndex = speechLog.findIndex((s) => s.startsWith(trimmedSentence));
        
                        if (existingIndex !== -1) {
                            // 🔄 **Sentence was corrected by Azure—update it in-place**
                            console.log(`🔄 Azure corrected sentence at index ${existingIndex}, updating...`);
                            speechLog[existingIndex] = trimmedSentence;
                        } else if (!speechLog.includes(trimmedSentence)) {
                            // 📜 **Sentence is new—add to log**
                            console.log("📜 Adding new sentence to Speech Log:", trimmedSentence);
                            speechLog.push(trimmedSentence);
                        }
                    });
        
                    // ✅ Step 3: Process synthesis queue only if speechLog changed
                    if (JSON.stringify(speechLog) !== JSON.stringify(previousSpeechLog)) {
                        processSynthesisQueue();
                    }
        
                    // scheduleSentenceCleanup();
                }
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