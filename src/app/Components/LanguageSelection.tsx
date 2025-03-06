/*

Current setup: 
- use usethisone5

All TODOs and Nice to have's are finished. Just need to keep testing it with lectures, further distances, and Spanish

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
    const [isWarmingUp, setIsWarmingUp] = useState(false); // 🔥 Move warm-up state to parent


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

    // useEffect(() => {
    //     if (!isPlaying) {
    //         console.log("🛑 Stopping transcription...");
    //         deepgramSocketRef.current?.close();
    //         setIsDrpDwnDisabled(false);
    //         return;
    //     }
    
    //     if (!deepgramSocketRef.current || deepgramSocketRef.current.readyState !== WebSocket.OPEN) {
    //         console.log("🎙️ Starting Deepgram transcription...");
    //         (async () => {
    //             deepgramSocketRef.current = await startContinuousTranslation(); // ✅ Await here
    //             setIsDrpDwnDisabled(true);
    //         })();
    //         setIsDrpDwnDisabled(true);
    //     }
    
    //     return () => {
    //         deepgramSocketRef.current?.close();
    //     };
    // }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying) {
            console.log("🛑 Stopping transcription...");
            deepgramSocketRef.current?.close();
            setIsDrpDwnDisabled(false);
            setIsWarmingUp(false); // 🔥 Ensure warm-up resets when stopped
            return;
        }
    
        if (!deepgramSocketRef.current || deepgramSocketRef.current.readyState !== WebSocket.OPEN) {
            console.log("🎙️ Starting Deepgram transcription...");
            (async () => {
                deepgramSocketRef.current = await startContinuousTranslation();
                setIsDrpDwnDisabled(true);
            })();
        }
    
        return () => {
            deepgramSocketRef.current?.close();
        };
    }, [isPlaying]);
    
    const getDeepgramToken = async () => {
        const response = await fetch("/api/deepgram");
        const data = await response.json();
        return data.token;
    };
    
    // usethisone5
    const startContinuousTranslation = async () => {
        console.log("sct is functional");

        setIsWarmingUp(true); // 🔥 Indicate warm-up has started
    
        // ✅ 1. Configure Deepgram WebSocket
        const token = await getDeepgramToken();
        const socket = new WebSocket(`wss://api.deepgram.com/v1/listen`, ["token", token]);
    
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
        let isSpeaking = false;
    
        console.log("3. state tracking working");
    
        // ✅ 4. Start Deepgram Audio Stream
        navigator.mediaDevices.getUserMedia({ audio: {
            autoGainControl: false, // 🔥 Disable browser auto gain control
            noiseSuppression: false, // 🔥 Ensure background audio is not suppressed
            echoCancellation: false, // 🔥 Prevents automatic audio processing
            latency: 0, // Reduce delay
            sampleRate: 48000, // High-quality audio capture
            channelCount: 1, // Mono for better speech recognition
        }}).then(async (stream) => {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); 

            // 🎛 Audio Context for microphone gain boost
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 3; // 🔥 Boost mic sensitivity (Adjust between 2.0 - 5.0)
            source.connect(gainNode);

            // 🎛 Web Audio API - Analyzing Microphone Input
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256; // Controls sensitivity
            source.connect(analyser);
            const canvas = document.getElementById("audioVisualizer") as HTMLCanvasElement;
            const canvasCtx = canvas.getContext("2d");

            function drawVisualizer() {
                requestAnimationFrame(drawVisualizer);
    
                if (!canvasCtx) return;
    
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(dataArray);
    
                canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
                canvasCtx.fillStyle = "rgba(255, 255, 255, 0.1)";
                canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;
    
                // 🎛 Sensitivity Adjustments
                const noiseThreshold = 15; // 🔥 Adjust this value to ignore background noise
                const smoothingFactor = 0.2; // 🔥 Smooth out fluctuations

                for (let i = 0; i < bufferLength; i++) {
                    let volume = dataArray[i];

                    // 🔥 Ignore very low-volume noise (background noise)
                    if (volume < noiseThreshold) {
                        volume = 0; 
                    } else {
                        // 🔥 Apply smoothing so bars don't jump too much
                        volume = volume * smoothingFactor + (1 - smoothingFactor) * (dataArray[i] / 2);
                    }

                    barHeight = volume;
                    canvasCtx.fillStyle = `rgb(${barHeight + 100}, 50, 150)`;
                    canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth + 2;
                }
            }
    
            drawVisualizer(); // 🔥 Start animation

            // 🎤 Generate a low-volume hum (Warm-up Packet)
            const oscillator = audioContext.createOscillator();
            const warmupGain = audioContext.createGain();
            let warmingUp = true;

            oscillator.type = "sine"; // Simple sine wave
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime); // Low frequency
            warmupGain.gain.setValueAtTime(0.01, audioContext.currentTime); // Low volume
            oscillator.connect(warmupGain);
            warmupGain.connect(audioContext.destination);

            socket.onopen = () => {
                console.log("✅ Deepgram WebSocket Connected, warming up...");
        
                // Start the hum sound (Warm-up Packet)
                oscillator.start();
                console.log("🔄 Warm-up audio started...");
        
                setTimeout(() => {
                    setIsWarmingUp(false);
                    oscillator.stop(); // Stop the warm-up sound after 2 seconds
                    warmingUp = false; // ✅ Allow real speech after warm-up
                    console.log("✅ Translator Ready.");
        
                    // 🎤 Start real transcription AFTER warm-up
                    mediaRecorder.addEventListener("dataavailable", (event) => {
                        if (!warmingUp) { // 🔥 Blocks speech during warm-up
                            socket.send(event.data);
                        }
                    });
                    mediaRecorder.start(1);
                    console.log("🎤 Recording Started.");
                }, 2000); // Let the warm-up last for 2 seconds
            };

            socket.onmessage = async (message) => {
                if (socket.readyState !== WebSocket.OPEN) return;

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
            
            const translateText = async (text: string) => {
                console.log("🌍 Translating Text:", text);
            
                try {
                    const response = await fetch("/api/translate", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ text, targetLang: tarLocale }),
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
            socket.onclose = () => {
                console.warn("⚠️ Deepgram WebSocket Closed");

                // ✅ Cleanup: Remove all event listeners when closed
                mediaRecorder.stop();
                mediaRecorder.removeEventListener('dataavailable', () => {});
                socket.onmessage = null;
                socket.onopen = null;
                socket.onerror = null;
                socket.onclose = null;
            };
        });
    
        // ✅ 5. Process Synthesis Queue (Azure TTS)
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
                    isWarmingUp={isWarmingUp} // 🔥 Pass down warm-up state
                    setIsWarmingUp={setIsWarmingUp} // 🔥 Allow toggling warm-up
                    requiredFields={requiredFields}
                    data={plyBtnData}
                />

                <canvas id="audioVisualizer" width="300" height="80" style={{ 
                    display: isPlaying ? 'block' : 'none',
                    margin: '20px auto', 
                    background: 'transparent',
                    borderRadius: '8px',
                }}></canvas>
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