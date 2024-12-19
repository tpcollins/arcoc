/*

**** WHERE WE ARE AT:

I think we are good to go? Going to host this for Patrick and let him test it Sunday with his Spanish speakers. 

At some point we will need to focus on the pronounciation and hammer in the punctuation so it flows a bit better. But as far as I can tell it is still flowing incredibly well. 
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

NON-MVP TODO:
1. Setup application to work with various microphone inputs (see GPT Log "TypeScript Azure Speech SDK") 

2. API Key for translator (to translate the list of voices from their respective alphabets to english )

3. Is there a way to make the target language drop down not scroll the whole page? (Save this for later if it's a big deal)

BUG LIST:
1BL. If page refreshes, API key does not refresh with it. Need to prompt user to go back and enter API key upon refresh -
- or upon sitting on the page too long 

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


*/


/*

TODO:

4. When there is a long pause in speaking (like when we sing) I think it's disconnecting from the Azure service. It will have to handle pauses and either reopen the connection when we start speaking again or hold it open (if it can?).


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
        // console.log("isPlaying: ", isPlaying);
        if (isPlaying) {
            translator = startContinuousTranslation().translator;
            setIsDrpDwnDisabled(true);
        } else if (translator) {
            translator.stopContinuousRecognitionAsync(() => {
                // console.log("Continuous recognition stopped");
            });
        }

        if(!isPlaying){
            setIsDrpDwnDisabled(false);
            // startContinuousTranslation().stopTranslation;
        }
        // console.log("isDrpDwnDisabled: ", isDrpDwnDisabled);

        return () => {
            // Ensure cleanup on unmount
            translator?.stopContinuousRecognitionAsync();
        };
    }, [isPlaying, isDrpDwnDisabled]);  

    // This one defines a chunk as 10 words but also includes an initial buffer
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
    
        let synthesisQueue: string[] = []; // Queue for interim translations
        // let indexTracker = 0; // Tracks the last spoken index
        let isSpeaking = false; // Prevents overlapping synthesis
        let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
        let synthesisBuffer = ""; // Buffer for chunking words
        let bufferWordCount = 0; // Count of words in the buffer
        const bufferThreshold = 15; // Chunk size (number of words)
        const initialBufferTime = 2000; // 2 seconds initial buffer delay
        let initialCache: string[] = []; // Cache for initial buffering
        let isInitialBuffering = true; // Tracks whether the initial buffer is active
        let pauseTimeout: NodeJS.Timeout | null = null;

        let lastProcessedIndex = 0;
        const pauseDetectionTimeout = 2000;

        // let chunkSize = 15;
    
        // Start initial buffering timer
        setTimeout(() => {
            isInitialBuffering = false; // End initial buffering
            synthesisQueue = [...initialCache]; // Transfer cached items to the queue
            initialCache = []; // Clear the cache
            processSynthesisQueue(); // Start processing
        }, initialBufferTime);

        translator.recognizing = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                const interimTranslatedText = e.result.translations.get(tarLocale);
        
                // console.log("synthesis buffer: ", synthesisBuffer.split(" ").length);
                // console.log("buffer threshold: ", bufferThreshold);
                if (interimTranslatedText) {
                    // Extract new words since the last processed index
                    const newWords = interimTranslatedText.split(" ").slice(lastProcessedIndex);
                    if (newWords.length > 0) {
                        // console.log("Is new words.length > 0?: ", newWords.length);
                        lastProcessedIndex += newWords.length; // Update index tracker
        
                        // Add new words to the synthesis buffer
                        synthesisBuffer += (synthesisBuffer ? " " : "") + newWords.join(" ");
        
                        // Check for punctuation to finalize chunks
                        // const sentences = synthesisBuffer.match(/[^.!?]+[.!?]+/g) || [];
                        // console.log("sentences.length: ", sentences.length);
                        // if (sentences.length > 0) {
                        //     console.log("Is sentences > 0?: ", sentences.length);
                        //     sentences.forEach((sentence) => {
                        //         synthesisQueue.push(sentence.trim());
                        //         processSynthesisQueue();
                        //     });
        
                        //     // Remove processed sentences from the buffer
                        //     const lastSentenceEndIndex = sentences.reduce(
                        //         (acc, sentence) => acc + sentence.length,
                        //         0
                        //     );
                        //     synthesisBuffer = synthesisBuffer.slice(lastSentenceEndIndex).trim();
                        //     // lastProcessedIndex = 0; // Reset index tracker for new input
                        // }
                        
                        // Fallback: If buffer exceeds threshold without punctuation
                        if (synthesisBuffer.split(" ").length >= bufferThreshold) {
                            // console.log("is synthesis buffer > bufferThreshold?: ", "synthesisBuffer: ", synthesisBuffer.split(" ").length, "bufferThreshold: ", bufferThreshold)
                            synthesisQueue.push(synthesisBuffer);
                            synthesisBuffer = "";
                            // lastProcessedIndex = 0; // Reset index tracker
                            processSynthesisQueue();
                        }
                    }
        
                    // Reset pause detection timeout
                    if (pauseTimeout) clearTimeout(pauseTimeout);
                    pauseTimeout = setTimeout(() => {
                        flushBuffer();
                    }, pauseDetectionTimeout);
                }
            }
        };               
    
        // Process the synthesis queue
        const processSynthesisQueue = () => {
            // console.log("does synthesis queue.length === 0?: ", synthesisQueue.length);
            if (isSpeaking || synthesisQueue.length === 0) return;
    
            const textToSpeak = synthesisQueue.shift(); // Get the next chunk
            if (textToSpeak) {
                console.log(`Processing chunk: "${textToSpeak}"`);
                synthesizeSpeech(textToSpeak);
            }
        };
    
        // Synthesize speech
        const synthesizeSpeech = async (text: string) => {
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
                await new Promise<void>((resolve, reject) => {
                    currentSynthesizer?.speakTextAsync(
                        text,
                        (result) => {
                            if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
                                console.log(`Synthesis complete: "${text}"`);
                                resolve();
                            } else {
                                console.error("Synthesis failed:", result.errorDetails);
                                reject(new Error(result.errorDetails));
                            }
                        },
                        (error) => {
                            console.error("Error during speech synthesis:", error);
                            reject(error);
                        }
                    );
                });
            } catch (error) {
                console.error("Error during synthesis:", error);
            } finally {
                isSpeaking = false;
    
                // Close the synthesizer after use to free resources
                if (currentSynthesizer) {
                    currentSynthesizer.close();
                    currentSynthesizer = null;
                }
    
                // Process the next item in the synthesis queue
                setTimeout(processSynthesisQueue, processTimeout);
            }
        };
    
        // Flush the buffer on pauses
        const flushBuffer = () => {
            if (synthesisBuffer) {
                console.log(`Flushing buffer to queue: "${synthesisBuffer}"`);
                synthesisQueue.push(synthesisBuffer); // Push remaining buffer to queue
                synthesisBuffer = ""; // Reset buffer
                bufferWordCount = 0; // Reset word count
                lastProcessedIndex = 0;
                processSynthesisQueue();
            }
        };
        
    
        // Handle cancellation or errors
        translator.canceled = (s, e) => {
            console.error(`Translation canceled: ${e.reason}, Error: ${e.errorDetails}`);
        };
    
        // Start continuous recognition
        translator.startContinuousRecognitionAsync(() => {
            console.log("Continuous recognition started.");
        }, (error) => {
            console.error("Error starting continuous recognition:", error);
        });
    
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
    
            {/* Move VolumeSlider Below */}
            <div style={{ width: '700px', marginBottom: '20px', marginTop: '20px' }}>
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

                {/* Modal */}
                {isModalOpen && (
                    <>
                    {/* Overlay */}
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
                    {/* Modal Content */}
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
                {/* <VolumeSlider onVolumeChange={handleTimeoutChange}/> */}
            </div>
    
            {/* Play Button */}
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