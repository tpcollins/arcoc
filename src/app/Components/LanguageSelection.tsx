/*

Current setup: 
- use usethisone3. Brought back the monitorlog. seems to be a lot smoother. Punctuation seems to be adding properly (at least from the minimal testing 
we have done). However, still having issue with it not triggering the speech log send after finalizedSentences has one sentence.

Might need to:
    1. Try playing with a count setting again to force it to go ahead and push to the speechlog before pausing
    2. Try relying on just finalizedSentences 
    3. Try adjusting timer



    - Adjusting timer worked a lot better. might just need to take it off entirely

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
    // Issues:
    // Mostly working, sentences are sending off properly. Issue is just with the last sentence not recieving punctuation. Since this method seems -
    // - pretty full proof as of now, I am going to only attempt new things in usethisone4
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
    
    //     const monitorSpeechLog = () => {
    //         console.log("🛠 monitorSpeechLog started");
        
    //         setInterval(() => {
    //             // console.log("🔄 monitorSpeechLog checking...");
        
    //             // console.log("🔍 Checking synthLog length:", synthLog.length);
    //             // console.log("🔍 Last processed index:", lastProcessedIndex);
        
    //             if (speechLog.length > lastProcessedIndex) {
    //                 // console.log("⚡ Processing new speech log entries...");
        
    //                 for (let i = lastProcessedIndex; i < speechLog.length; i++) {
    //                     const sentence = speechLog[i];
    //                     if (!sentenceQueue.includes(sentence)) {
    //                         sentenceQueue.push(sentence);
    //                     }
    //                 }
        
    //                 lastProcessedIndex = speechLog.length; // ✅ Update processed index
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
    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             let interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
        
    //             if (interimTranslatedText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //                 console.log("ITT Length: ", interimTranslatedText.length);
        
    //                 const finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g);
    //                 console.log("Finalized Sentences before processing: ", finalizedSentences);
        
    //                 if (finalizedSentences && finalizedSentences.length >= 1) {
    //                     // ✅ Only process sentences that come after the last processed index
    //                     if (recogTimeout) clearTimeout(recogTimeout);

    //                     recogTimeout = setTimeout(() => {
    //                         let newSentences = finalizedSentences.slice(recogLPI);
    //                         if (newSentences.length > 0) {
    //                             recogLPI = finalizedSentences.length; // ✅ Update lastProcessedIndex
    //                             newSentences.forEach(sentence => {
    //                                 speechLog.push(sentence);
    //                             });
    //                         }else{
    //                             recogLPI = 0;
    //                         }
    //                     }, 1000);
        
    //                     console.log("📜 Updated Speech Log:", speechLog);
    //                     console.log("recogLPI: ", recogLPI);
        
    //                     // ✅ If speechLog reaches 4 sentences, process batch
    //                     if (speechLog.length >= 1) {
    //                         console.log("✅ Speech log reached threshold, triggering batch...");
    //                         // synthLog.push(...speechLog); // ✅ Send first 3
    //                         // console.log("📤 Sending batch:", synthLog);
    //                         processSynthesisQueue();
    //                     }

    //                 }
    //             }
    //         }
        
    //         if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
    //         userSpeakingTimeout = setTimeout(() => {
    //             isUserTalking = false;
    //             console.log("⏳ No speech detected for 3 seconds, sending remaining sentences...");
    //             if (speechLog.length > 0) {
    //                 processSynthesisQueue();
    //             }
    //         }, 3000);
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





    // usethisone2
    // Has all the different recognizer variations
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
    
    //     // const monitorSpeechLog = () => {
    //     //     console.log("🛠 monitorSpeechLog started");
        
    //     //     setInterval(() => {
    //     //         console.log("🔄 monitorSpeechLog checking...");
        
    //     //         // console.log("🔍 Checking speechLog length before send off:", synthLog.length);
    //     //         // console.log("🔍 Last processed index:", lastProcessedIndex);
        
    //     //         if (speechLog.length > lastProcessedIndex) {
    //     //             // console.log("⚡ Processing new speech log entries...");
        
    //     //             for (let i = lastProcessedIndex; i < speechLog.length; i++) {
    //     //                 const sentence = speechLog[i];
    //     //                 if (!sentenceQueue.includes(sentence)) {
    //     //                     sentenceQueue.push(sentence);
    //     //                 }
    //     //             }
                    
                    
    //     //             lastProcessedIndex = speechLog.length; // ✅ Update processed index
    //     //             // console.log(" ");
    //     //             // console.log("🔍 Checking speechLog length after send off:", synthLog.length);
    //     //             console.log("🔍 Last processed index:", lastProcessedIndex);
    //     //             processSynthesisQueue(); // ✅ Trigger synthesis queue
    //     //         }
    //     //     }, 2000); // ✅ Check every 2 seconds
    //     // };
        
    
    //     // ✅ **Continuous Processing Loop**
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || speechLog.length === 0) {
    //             return; // Don't re-trigger if already speaking
    //         }

    //         if (speechLog.length > lastProcessedIndex) {
    //             // console.log("⚡ Processing new speech log entries...");

    //             for (let i = lastProcessedIndex; i < speechLog.length; i++) {
    //                 const sentence = speechLog[i];
    //                 if (!sentenceQueue.includes(sentence)) {
    //                     sentenceQueue.push(sentence);
    //                 }
    //             }
    //         }
            
            
    //         lastProcessedIndex = speechLog.length; // ✅ Update processed index

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

    //     // This one does not use finalizedSentencesCharLength so it is sending the entire interim log but it is not clogging (unless we remove timeout)
    //     // let recogLPI = 0;
    //     // let recogTimeout: NodeJS.Timeout | null = null;
    //     // let lastInterimText = ""; // ✅ Store last interim recognized text

    //     // translator.recognizing = (s, e) => {
    //     //     if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //     //         let interimTranslatedText = e.result.translations.get(tarLocale);
    //     //         isUserTalking = true;

    //     //         if (interimTranslatedText) {
    //     //             console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //     //             console.log("ITT Length: ", interimTranslatedText.length);
                    
    //     //             lastInterimText = interimTranslatedText; // ✅ Save latest text (even if it lacks punctuation)

    //     //             let finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //     //             console.log("Finalized Sentences before processing: ", finalizedSentences);

    //     //             if (recogTimeout) clearTimeout(recogTimeout);
    //     //             recogTimeout = setTimeout(() => {
    //     //                 let newSentences = finalizedSentences.slice(recogLPI);
    //     //                 if (newSentences.length > 0) {
    //     //                     recogLPI = finalizedSentences.length; // ✅ Update lastProcessedIndex

    //     //                     newSentences.forEach(sentence => {
    //     //                         speechLog.push(sentence.trim());
    //     //                         processSynthesisQueue();
    //     //                     });

    //     //                     console.log("📜 Updated Speech Log:", speechLog);
    //     //                     console.log("recogLPI: ", recogLPI);
    //     //                 }

    //     //                 // ✅ If speechLog reaches threshold, process batch
    //     //                 // if (speechLog.length >= 1) {
    //     //                 //     console.log("✅ Speech log reached threshold, triggering batch...");
    //     //                 //     processSynthesisQueue();
    //     //                 // }
    //     //             }, 1000); // ✅ Small delay before processing
    //     //         }
    //     //     }

    //     //     if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
    //     //     userSpeakingTimeout = setTimeout(() => {
    //     //         isUserTalking = false;
    //     //         console.log("⏳ No speech detected for 3 seconds, checking last spoken text...");

    //     //         if (lastInterimText && !/[.!?]$/.test(lastInterimText.trim())) {
    //     //             lastInterimText += "."; // ✅ Ensure punctuation
    //     //             console.log("✏️ Added punctuation to last sentence:", lastInterimText);
    //     //             speechLog.push(lastInterimText.trim());
    //     //         }

    //     //         if (speechLog.length > 0) {
    //     //             console.log("📢 Processing final batch...");
    //     //             processSynthesisQueue();
    //     //         }
    //     //     }, 3000);
    //     // };

    //     // This one does use finalizedSentencesCharLength and does not send the entire interimlog but it is clogging
    //     let recogLPI = 0;
    //     let recogTimeout: NodeJS.Timeout | null = null;
    //     let lastFinalSentence = ""; // ✅ Track last finalized sentence to avoid duplicates
    //     let finalSentencesCharLength = 0; // ✅ Track character count of finalized sentences
    //     let interimTranslatedText = ""
    //     let finalizedSentences: string[] = [];

    //     // translator.recognizing = (s, e) => {
    //     //     if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //     //         interimTranslatedText = e.result.translations.get(tarLocale);
    //     //         isUserTalking = true;

    //     //         if (interimTranslatedText) {
    //     //             console.log("🔄 Interim (Buffering):", interimTranslatedText);

    //     //             finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //     //             console.log("Finalized Sentences before processing: ", finalizedSentences);

    //     //             if (recogTimeout) clearTimeout(recogTimeout);
    //     //             recogTimeout = setTimeout(() => {
    //     //                 let newSentences = finalizedSentences.slice(recogLPI);
    //     //                 if (newSentences.length > 0) {
    //     //                     recogLPI = finalizedSentences.length; // ✅ Update lastProcessedIndex
    //     //                     finalSentencesCharLength = finalizedSentences.join("").length; // ✅ Update char length

    //     //                     newSentences.forEach(sentence => {
    //     //                         let trimmedSentence = sentence.trim();

    //     //                         // ✅ Ensure we don't push duplicates
    //     //                         if (trimmedSentence) {
    //     //                             speechLog.push(trimmedSentence);
    //     //                             lastFinalSentence = trimmedSentence; // ✅ Store last pushed sentence

    //     //                             if (speechLog.length >= 1) {
    //     //                                 console.log("✅ Speech log reached threshold, triggering batch...");
    //     //                                 processSynthesisQueue();
    //     //                             }
    //     //                         }
    //     //                     });

    //     //                     console.log("📜 Updated Speech Log:", speechLog);
    //     //                     console.log("recogLPI: ", recogLPI);
    //     //                 }

    //     //                 // ✅ If speechLog reaches threshold, process batch
    //     //                 if (speechLog.length >= 1) {
    //     //                     console.log("✅ Speech log reached threshold, triggering batch...");
    //     //                     processSynthesisQueue();
    //     //                 }
    //     //             }, 1000); // ✅ Small delay before processing
    //     //         }
    //     //     }

    //     //     // ✅ Handle case where last sentence is missing punctuation
    //     //     if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
    //     //     userSpeakingTimeout = setTimeout(() => {
    //     //         isUserTalking = false;
    //     //         console.log("⏳ No speech detected for 3 seconds, checking last spoken text...");

    //     //         console.log("ITT Length: ", interimTranslatedText.length);
    //     //         console.log("finalSentencesCharLength: ", finalSentencesCharLength);

    //     //         if (interimTranslatedText.length > finalSentencesCharLength) {
    //     //             console.log("⚠️ Detected unfinished sentence. Adding punctuation...");

    //     //             let missingText = interimTranslatedText.substring(finalSentencesCharLength).trim();
    //     //             if (!/[.!?]$/.test(missingText)) {
    //     //                 missingText += "."; // ✅ Append missing punctuation
    //     //             }

    //     //             console.log("✏️ Added punctuation to last sentence:", missingText);
    //     //             speechLog.push(missingText);
    //     //             recogLPI = finalizedSentences.length;
    //     //             console.log("recogLPI: ", recogLPI);
    //     //         }

    //     //         if (speechLog.length > 0) {
    //     //             console.log("📢 Processing final batch...");
    //     //             processSynthesisQueue();
    //     //         }
    //     //     }, 3000);
    //     // };

    //     // This is the same one as above but it sets recogLPI to 0
    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
        
    //             if (interimTranslatedText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
        
    //                 finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //                 console.log("Finalized Sentences before processing: ", finalizedSentences);
        
    //                 if (recogTimeout) clearTimeout(recogTimeout);
    //                 recogTimeout = setTimeout(() => {
    //                     let newSentences = finalizedSentences.slice(recogLPI);
    //                     if (newSentences.length > 0) {
    //                         recogLPI = finalizedSentences.length; // ✅ Update lastProcessedIndex
    //                         finalSentencesCharLength = finalizedSentences.join("").length; // ✅ Update char length
        
    //                         newSentences.forEach(sentence => {
    //                             let trimmedSentence = sentence.trim();
        
    //                             // ✅ Ensure we don't push duplicates
    //                             if (trimmedSentence !== lastFinalSentence) {
    //                                 speechLog.push(trimmedSentence);
    //                                 lastFinalSentence = trimmedSentence; // ✅ Store last pushed sentence
        
    //                                 if (speechLog.length >= 1) {
    //                                     console.log("✅ Speech log reached threshold, triggering batch...");
    //                                     processSynthesisQueue();
    //                                 }
    //                             }
    //                         });
        
    //                         console.log("📜 Updated Speech Log:", speechLog);
    //                         console.log("recogLPI: ", recogLPI);
    //                     }
        
    //                     // ✅ If speechLog reaches threshold, process batch
    //                     if (speechLog.length >= 1) {
    //                         console.log("✅ Speech log reached threshold, triggering batch...");
    //                         processSynthesisQueue();
    //                     }
    //                 }, 1000); // ✅ Small delay before processing
    //             }
    //             if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
    //                 userSpeakingTimeout = setTimeout(() => {
    //                     isUserTalking = false;
    //                     console.log("⏳ No speech detected for 3 seconds, checking last spoken text...");
                
    //                     console.log("ITT Length: ", interimTranslatedText.length);
    //                     console.log("finalSentencesCharLength: ", finalSentencesCharLength);
                
    //                     if (interimTranslatedText.length > finalSentencesCharLength) {
    //                         console.log("⚠️ Detected unfinished sentence. Adding punctuation...");
                
    //                         let missingText = interimTranslatedText.substring(finalSentencesCharLength).trim();
    //                         if (!/[.!?]$/.test(missingText)) {
    //                             missingText += "."; // ✅ Append missing punctuation
    //                         }
                
    //                         console.log("✏️ Added punctuation to last sentence:", missingText);
    //                         speechLog.push(missingText);
    //                         finalizedSentences.push(missingText); // ✅ Add to finalized sentences
    //                         recogLPI = finalizedSentences.length; // ✅ Ensure next recog cycle skips it
    //                         finalSentencesCharLength = interimTranslatedText.length; // ✅ Reset char count
    //                         processSynthesisQueue();
    //                     }
                
    //                     // if (speechLog.length > 0) {
    //                     //     console.log("📢 Processing final batch...");
    //                     //     processSynthesisQueue();
    //                     // }
                
    //                     // ✅ Reset recogLPI to avoid stale indices
    //                     recogLPI = 0;
    //                     finalSentencesCharLength = 0;
    //                     interimTranslatedText = ""; // ✅ Reset interim log
    //                     finalizedSentences = []; // ✅ Reset finalized sentences array
                
    //                 }, 1500);
    //             };
    //         }
        
    //         // ✅ Handle case where last sentence is missing punctuation
    //     //     if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
    //     //     userSpeakingTimeout = setTimeout(() => {
    //     //         isUserTalking = false;
    //     //         console.log("⏳ No speech detected for 3 seconds, checking last spoken text...");
        
    //     //         console.log("ITT Length: ", interimTranslatedText.length);
    //     //         console.log("finalSentencesCharLength: ", finalSentencesCharLength);
        
    //     //         if (interimTranslatedText.length > finalSentencesCharLength) {
    //     //             console.log("⚠️ Detected unfinished sentence. Adding punctuation...");
        
    //     //             let missingText = interimTranslatedText.substring(finalSentencesCharLength).trim();
    //     //             if (!/[.!?]$/.test(missingText)) {
    //     //                 missingText += "."; // ✅ Append missing punctuation
    //     //             }
        
    //     //             console.log("✏️ Added punctuation to last sentence:", missingText);
    //     //             speechLog.push(missingText);
    //     //             finalizedSentences.push(missingText); // ✅ Add to finalized sentences
    //     //             recogLPI = finalizedSentences.length; // ✅ Ensure next recog cycle skips it
    //     //             finalSentencesCharLength = interimTranslatedText.length; // ✅ Reset char count
    //     //             processSynthesisQueue();
    //     //         }
        
    //     //         // if (speechLog.length > 0) {
    //     //         //     console.log("📢 Processing final batch...");
    //     //         //     processSynthesisQueue();
    //     //         // }
        
    //     //         // ✅ Reset recogLPI to avoid stale indices
    //     //         recogLPI = 0;
    //     //         finalSentencesCharLength = 0;
    //     //         interimTranslatedText = ""; // ✅ Reset interim log
    //     //         finalizedSentences = []; // ✅ Reset finalized sentences array
        
    //     //     }, 1500);
    //     // };

    //     translator.recognized = () => {
    //         console.log("📢 Translator recognized event fired - Processing queue");
    //         if (!isSpeaking) {
    //             processSynthesisQueue();
    //         }
    //     };
    
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





    // usethisone3
    // Has all the different recognizer variations
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
    
        let lastProcessedIndex = 0; // ✅ Track last processed sentence        
    
        // ✅ **Continuous Processing Loop**
        const processSynthesisQueue = async () => {
            if (isSpeaking || speechLog.length === 0) {
                return;
            }
        
            isSpeaking = true; // Lock speaking
            console.log("🔄 Processing queue:", speechLog);
        
            let sentencesToProcess = [...speechLog]; // Copy speechLog
            speechLog = []; // Clear speechLog to avoid duplication
        
            await synthesizeSpeech(sentencesToProcess);
        
            isSpeaking = false; // Unlock speaking
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
            // isSpeaking = true;
    
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

        let recogLPI = 0;
        let recogTimeout: NodeJS.Timeout | null = null;
        let lastFinalSentence = ""; // ✅ Track last finalized sentence to avoid duplicates
        let finalSentencesCharLength = 0; // ✅ Track character count of finalized sentences
        let interimTranslatedText = ""
        let finalizedSentences: string[] = [];

        // Background processing loop
        setInterval(() => {
            if (!isSpeaking && speechLog.length > 0) {
                console.log("⏳ Background synthesis triggered...");
                processSynthesisQueue();
            }
        }, 500);  // Runs every 500ms


        // This is the same one as above but it sets recogLPI to 0
        translator.recognizing = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                interimTranslatedText = e.result.translations.get(tarLocale);
                isUserTalking = true;
        
                if (interimTranslatedText) {
                    console.log("🔄 Interim (Buffering):", interimTranslatedText);
        
                    finalizedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
                    console.log("Finalized Sentences before processing: ", finalizedSentences);
        
                    if (recogTimeout) clearTimeout(recogTimeout);
                    recogTimeout = setTimeout(() => {
                        let newSentences = finalizedSentences.slice(recogLPI);
                        if (newSentences.length > 0) {
                            recogLPI = finalizedSentences.length; // ✅ Update lastProcessedIndex
                            finalSentencesCharLength = finalizedSentences.join("").length; // ✅ Update char length
        
                            newSentences.forEach(sentence => {
                                let trimmedSentence = sentence.trim();
                                if (trimmedSentence !== lastFinalSentence) {
                                    speechLog.push(trimmedSentence);
                                    lastFinalSentence = trimmedSentence; // ✅ Store last pushed sentence
                                }
                            });
        
                            console.log("📜 Updated Speech Log:", speechLog);
                        }
                    }, 500); // ✅ Small delay before processing
                }
            }

            if (userSpeakingTimeout) clearTimeout(userSpeakingTimeout);
                userSpeakingTimeout = setTimeout(() => {
                isUserTalking = false;
                console.log("⏳ No speech detected for 3 seconds, checking last spoken text...");
        
                console.log("ITT Length: ", interimTranslatedText.length);
                console.log("finalSentencesCharLength: ", finalSentencesCharLength);
        
                if (interimTranslatedText.length > finalSentencesCharLength) {
                    console.log("⚠️ Detected unfinished sentence. Adding punctuation...");
        
                    let missingText = interimTranslatedText.substring(finalSentencesCharLength).trim();
                    if (!/[.!?]$/.test(missingText)) {
                        missingText += "."; // ✅ Append missing punctuation
                    }
        
                    console.log("✏️ Added punctuation to last sentence:", missingText);
                    speechLog.push(missingText);
                    finalizedSentences.push(missingText); // ✅ Add to finalized sentences
                    recogLPI = finalizedSentences.length; // ✅ Ensure next recog cycle skips it
                    finalSentencesCharLength = interimTranslatedText.length; // ✅ Reset char count
                    processSynthesisQueue();
                }
        
                // if (speechLog.length > 0) {
                //     console.log("📢 Processing final batch...");
                //     processSynthesisQueue();
                // }
        
                // ✅ Reset recogLPI to avoid stale indices
                recogLPI = 0;
                finalSentencesCharLength = 0;
                interimTranslatedText = ""; // ✅ Reset interim log
                finalizedSentences = []; // ✅ Reset finalized sentences array
    
            }, 1500);
        };       

        translator.recognized = () => {
            console.log("📢 Translator recognized event fired - Processing queue");
            if (!isSpeaking) {
                processSynthesisQueue();
            }
        };
    
        // monitorSpeechLog();
    
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