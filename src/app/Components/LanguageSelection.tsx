/*

Current setup: 
- use usethisone5

Deepgram is working very well. The only big issue is that when it first starts off, it seems to have some trouble processing the first packet. Words are
getting cut out once synthesis starts. However, every packet after that (although we have only tested sending 2 more packets after the initial one that
messes up) seems to work fine.

I think we need to add a warmup packet to run through the translator while it starts

Minor issue:
    - It does seem to mess up the speech just a little bit when it is continuous. No huge issues but would be good to get it fixed. I can
    see this being an issue once we try and test it with spanish
 
*/




// React Variablesf
import React, { useState, useEffect, useRef } from 'react';
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
// Deepgram
import { createClient } from "@deepgram/sdk";


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
    // Deepgram Socket
    // const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);
    // const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);
    
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
    const deepgramSocketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!isPlaying) {
            console.log("🛑 Stopping transcription...");
            deepgramSocketRef.current?.close();
            setIsDrpDwnDisabled(false);
            return;
        }
    
        if (!deepgramSocketRef.current || deepgramSocketRef.current.readyState !== WebSocket.OPEN) {
            console.log("🎙️ Starting Deepgram transcription...");
            deepgramSocketRef.current = startContinuousTranslation();
            setIsDrpDwnDisabled(true);
        }
    
        return () => {
            deepgramSocketRef.current?.close();
        };
    }, [isPlaying, isDrpDwnDisabled]);
    

    // usethisone5
    const startContinuousTranslation = () => {
        console.log("sct is functional");
    
        // ✅ 1. Configure Deepgram WebSocket
        const socket = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!]);
        // const socket = new WebSocket('wss://api.deepgram.com/v1/listen', ['token', process.env.DEEPGRAM_API_KEY!]);
    
        console.log("1. socket declared");
    
        // ✅ 2. Configure Azure Speech Synthesis (For TTS)
        const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey, "eastus2");
        synthConfig.speechSynthesisVoiceName = shortName;
        const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
        const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);

        const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(apiKey, "eastus2");
        speechConfig.speechRecognitionLanguage = "en-US";
        speechConfig.addTargetLanguage(tarLocale);
        speechConfig.voiceName = shortName;
    
        console.log("2. synth configured")
    
        // ✅ 3. State Tracking
        let speechLog: string[] = [];
        let isSpeaking = false;
        let lastProcessedIndex = 0;
    
        console.log("3. state tracking working");
    
        // ✅ 4. Start Deepgram Audio Stream
        navigator.mediaDevices.getUserMedia({ audio: true }).then(async (stream) => {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); 
    
            socket.onopen = () => {
                mediaRecorder.addEventListener('dataavailable', (event) => {
                    socket.send(event.data);
                });
                mediaRecorder.start(1);
            };

            // socket.onopen = () => {
            //     console.log("✅ WebSocket Connected, warming up...");
            
            //     // Send 1 second of silence to "wake up" Deepgram
            //     const silence = new Uint8Array(16000).fill(0);
            //     socket.send(silence);
            
            //     setTimeout(() => {
            //         console.log("🎤 Recording Started");
            //         mediaRecorder.start(1); // Start recording immediately after warm-up
            
            //         mediaRecorder.addEventListener("dataavailable", (event) => {
            //             socket.send(event.data);
            //         });
            //     }, 1000); // Give Deepgram 1 second to process the silence
            // };

            socket.onmessage = async (message) => {
                const received = JSON.parse(message.data);
                const transcript = received.channel.alternatives[0]?.transcript;
            
                if (transcript) {
                    console.log("🔄 Live Translation (Before Azure Translation):", transcript);
            
                    try {
                        // 🔹 Step 1: Translate text using Azure Translator
                        const translatedText = await translateText(transcript); // Ensure tarLocale is correct
            
                        console.log(`🌍 Translated to ${tarLocale}:`, translatedText);
            
                        // 🔹 Step 2: Send translated text to Azure Speech Synthesis
                        processSynthesisQueue(translatedText);
                    } catch (error) {
                        console.error("❌ Translation Error:", error);
                    }
                }
            };
            
            const transKey = process.env.NEXT_PUBLIC_TRANS_KEY as string;
            const translateText = async (text: string) => {
                console.log("🌍 Translating Text:", text);
            
                // const endpoint = process.env.NEXT_PUBLIC_TRANS_KEY;
                const url = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=${tarLocale}`;
                console.log(url);
            
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Ocp-Apim-Subscription-Key": transKey,
                            "Ocp-Apim-Subscription-Region": "eastus2",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify([{ text }]),
                    });
            
                    const data = await response.json();
                    console.log("🔄 Translation API Response:", data);
            
                    if (data?.[0]?.translations?.[0]?.text) {
                        console.log("✅ Translated Text:", data[0].translations[0].text);
                        return data[0].translations[0].text;
                    } else {
                        console.error("❌ No translation found in response");
                        return text; // Fail-safe: return original text if translation fails
                    }
                } catch (error) {
                    console.error("⚠️ Translation Error:", error);
                    return text;
                }
            };            
    
            socket.onerror = (err) => console.error("❌ Deepgram WebSocket Error:", err);
            socket.onclose = () => console.warn("⚠️ Deepgram WebSocket Closed");
        });
    
        // ✅ 5. Process Synthesis Queue (Azure TTS)
        // const processSynthesisQueue = async () => {
        //     console.log("5. PSQ");
        //     if (isSpeaking || lastProcessedIndex >= speechLog.length) return;
    
        //     isSpeaking = true;
        //     console.log("🔄 Processing queue:", speechLog.slice(lastProcessedIndex));
    
        //     while (lastProcessedIndex < speechLog.length) {
        //         let sentenceToProcess = speechLog[lastProcessedIndex];
        //         await synthesizeSpeech(sentenceToProcess);
        //         lastProcessedIndex++;
        //     }
    
        //     isSpeaking = false;
        //     console.log("✅ Queue is empty, waiting for new sentences.");
        // };

        const processSynthesisQueue = async (translatedText: string) => {
            console.log("5. PSQ");
        
            if (isSpeaking) return; // Prevent overlapping speech
        
            isSpeaking = true;
            console.log("🔄 Processing queue:", translatedText);
        
            await synthesizeSpeech(translatedText);
        
            isSpeaking = false;
            console.log("✅ Queue is empty, waiting for new sentences.");
        };        
    
        // ✅ 6. Azure Speech Synthesizer
        const synthesizeSpeech = async (text: string) => {
            console.log("6. SS");
            return new Promise<void>((resolve, reject) => {
                synthesizer.speakTextAsync(
                    text,
                    (result) => {
                        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                            console.log("✅ Synthesis complete:", text);
                            resolve();
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
        };
    
        console.log("✅ Continuous translation started with Deepgram & Azure.");
        return socket;
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




// usethisone4
    // Playground for usethisone3
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
    //     let isSpeaking = false;
    //     let isUserTalking = false;
    //     let lastProcessedIndex = 0;  // ✅ Tracks which sentences have been spoken
        
        
    //     const processSynthesisQueue = async () => {
    //         if (isSpeaking || lastProcessedIndex >= speechLog.length) return;
        
    //         isSpeaking = true;
    //         console.log("🔄 Processing queue:", speechLog.slice(lastProcessedIndex));
        
    //         while (lastProcessedIndex < speechLog.length) {
    //             let sentenceToProcess = speechLog[lastProcessedIndex]; // ✅ Process one sentence at a time
    //             await synthesizeSpeech(sentenceToProcess);
    //             lastProcessedIndex++; // ✅ Move index forward immediately
    //         }
        
    //         isSpeaking = false;
    //         console.log("✅ Queue is empty, waiting for new sentences.");
    //     };
        
    //     // ✅ **Force Synthesis for One Sentence at a Time**
    //     const synthesizeSpeech = async (text: string) => {
    //         return new Promise<void>((resolve, reject) => {
    //             synthesizer.speakTextAsync(
    //                 text,
    //                 (result) => {
    //                     if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                         console.log("✅ Synthesis complete:", text);
    //                         resolve();
    //                     } else {
    //                         console.error("❌ Synthesis failed:", result.errorDetails);
    //                         reject(new Error(result.errorDetails));
    //                     }
    //                 },
    //                 (error) => {
    //                     console.error("⚠️ Error during speech synthesis:", error);
    //                     reject(error);
    //                 }
    //             );
    //         });
    //     };    

    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             let interimTranslatedText = e.result.translations.get(tarLocale);
    //             isUserTalking = true;
        
    //             if (interimTranslatedText) {
    //                 console.log("🔄 Interim (Buffering):", interimTranslatedText);
    //                 console.log("🔄 Interim Length:", interimTranslatedText.length);
    //                 let updatedSentences = interimTranslatedText.match(/[^.!?]+[.!?]/g) || [];
    //                 // console.log("Finalized Sentences before processing:", updatedSentences);
        
    //                 // 🔹 **STEP 1: Ensure we are processing in cycles of 4**
    //                 while (updatedSentences.length >= 4) {
    //                     let sentencesToSend = updatedSentences.splice(0, 2); // ✅ Take first 2 sentences
        
    //                     sentencesToSend.forEach((sentence) => {
    //                         let trimmedSentence = sentence.trim();
        
    //                         if (!speechLog.includes(trimmedSentence)) {
    //                             speechLog.push(trimmedSentence);
    //                             // console.log("📜 Added to Speech Log:", trimmedSentence);
    //                         }
    //                     });

    //                     processSynthesisQueue();
    //                 }
    //             }
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
    //                             // setTimeout(() => {
    //                             //     console.log("⏳ Speech duration elapsed, unlocking queue.");
    //                             //     resolve();
    //                             // }, result.audioDuration / 10000); // Wait until the audio duration completes
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