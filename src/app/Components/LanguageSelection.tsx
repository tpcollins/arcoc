/*

**** WHERE WE ARE AT:
Almost chunking properly. Chunks of 10 words actually works suprisingly well. It looks like prepositional languages such -
- as Spanish are still having the overlap effect but only because they are re-translating due to language barries.

I could be wrong about this and the overlap could still be because Microsoft released an incomplete product for some -
- reason, but I do think that putting a buffer before beginning translation would help the case and ensure that the -
- sentences are formatted correctly before reading them
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
        console.log(`Volume updated in parent: ${processTimeout}`);
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
    
    // *** This one defines a chunk as one word a
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
    
    //     let synthesisQueue: string[] = []; // Queue for interim translations
    //     let indexTracker = 0; // Tracks the last spoken index
    //     let isSpeaking = false; // Prevents overlapping synthesis
    //     let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    
    //     translator.recognizing = (s, e) => {
    //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
    //             const interimTranslatedText = e.result.translations.get(tarLocale);
        
    //             if (interimTranslatedText) {
    //                 console.log(`Interim Translated Text: ${interimTranslatedText}`);
    //                 const newWords = interimTranslatedText.split(" ");
        
    //                 console.log("New Words Array:", newWords, "Index Tracker:", indexTracker);
        
    //                 // Reset indexTracker if newWords length is less than indexTracker
    //                 if (newWords.length < indexTracker) {
    //                     console.log("Resetting indexTracker due to newWords length reset.");
    //                     indexTracker = 0; // Reset tracker to start fresh
    //                 }
        
    //                 // Add only new words to the queue
    //                 if (newWords.length > indexTracker) {
    //                     const wordsToSpeak = newWords.slice(indexTracker).join(" ");
    //                     synthesisQueue.push(wordsToSpeak);
    //                     console.log(`Added to queue: ${wordsToSpeak}`);
    //                     indexTracker = newWords.length; // Update the tracker
    //                     console.log(`Index tracker updated to: ${indexTracker}`);
    //                 } else {
    //                     console.log("No new words to process.");
    //                 }
        
    //                 // Process the synthesis queue
    //                 processSynthesisQueue();
    //             }
    //         }
    //     };
        
    //     const processSynthesisQueue = () => {
    //         if (isSpeaking || synthesisQueue.length === 0) return;
    
    //         const textToSpeak = synthesisQueue.shift();
    //         if (textToSpeak) {
    //             console.log(`Processing text to speak: ${textToSpeak}`);
    //             synthesizeSpeech(textToSpeak);
    //         }
    //         // indexTracker = 0;
    //     };
    
    //     const synthesizeSpeech = async (text: string) => {
    //         if (currentSynthesizer) {
    //             currentSynthesizer.close();
    //             currentSynthesizer = null;
    //         }
    
    //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(
    //             apiKey as string,
    //             "eastus2"
    //         );
    //         synthConfig.speechSynthesisVoiceName = shortName;
    
    //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //         currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    //         isSpeaking = true;

    //         try {
    //             // Ensure currentSynthesizer is initialized before using it
    //             if (!currentSynthesizer) {
    //                 const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(
    //                     apiKey as string,
    //                     "eastus2"
    //                 );
    //                 synthConfig.speechSynthesisVoiceName = shortName;

    //                 const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    //                 currentSynthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    //             }

    //             await new Promise<void>((resolve, reject) => {
    //                 if (currentSynthesizer)
    //                 currentSynthesizer?.speakTextAsync(
    //                     text,
    //                     (result) => {
    //                         if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
    //                             console.log(`Synthesis complete: ${text}`);
    //                             resolve();
    //                         } else {
    //                             console.error("Synthesis failed:", result.errorDetails);
    //                             reject(new Error(result.errorDetails));
    //                         }
    //                     },
    //                     (error) => {
    //                         console.error("Error during speech synthesis:", error);
    //                         reject(error);
    //                     }
    //                 );
    //             });
    //         } catch (error) {
    //             console.error("Error during synthesis:", error);
    //         } finally {
    //             isSpeaking = false;

    //             // Close the synthesizer after use to free resources
    //             if (currentSynthesizer) {
    //                 currentSynthesizer.close();
    //                 currentSynthesizer = null;
    //             }

    //             // Process the next item in the synthesis queue
    //             setTimeout(processSynthesisQueue, 150000000);
    //         }
    //     };
    
    //     // Handle cancellation or errors
    //     translator.canceled = (s, e) => {
    //         console.error(`Translation canceled: ${e.reason}, Error: ${e.errorDetails}`);
    //         if (e.reason === SpeechSDK.CancellationReason.Error) {
    //             console.error("Cancelling translator due to error.");
    //         }
    //     };
    
    //     // Start continuous recognition
    //     translator.startContinuousRecognitionAsync(() => {
    //         console.log("Continuous recognition started.");
    //     }, (error) => {
    //         console.error("Error starting continuous recognition:", error);
    //     });
    
    //     return { translator };
    // };









    // *** This one defines a chunk as 10 words
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
        let indexTracker = 0; // Tracks the last spoken index
        let isSpeaking = false; // Prevents overlapping synthesis
        let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
        let synthesisBuffer = ""; // Buffer for chunking words
        let bufferWordCount = 0; // Count of words in the buffer
        const bufferThreshold = 10; // Chunk size (number of words)
        let pauseTimeout: NodeJS.Timeout | null = null;
    
        // Handle interim recognition results
        translator.recognizing = (s, e) => {
            if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
                const interimTranslatedText = e.result.translations.get(tarLocale);
    
                if (interimTranslatedText) {
                    console.log(`Interim Translated Text: ${interimTranslatedText}`);
                    const newWords = interimTranslatedText.split(" ");
    
                    console.log("New Words Array:", newWords, "Index Tracker:", indexTracker);
    
                    // Reset indexTracker if newWords length is less than indexTracker
                    if (newWords.length < indexTracker) {
                        console.log("Resetting indexTracker and buffer due to newWords length reset.");
                        indexTracker = 0; // Reset tracker to start fresh
                        synthesisBuffer = ""; // Reset buffer
                        bufferWordCount = 0; // Reset buffer count
                    }
    
                    // Add only new words to the buffer
                    if (newWords.length > indexTracker) {
                        const wordsToSpeak = newWords.slice(indexTracker).join(" ");
                        synthesisBuffer += (synthesisBuffer ? " " : "") + wordsToSpeak; // Append to buffer
                        bufferWordCount += newWords.length - indexTracker; // Update buffer word count
                        indexTracker = newWords.length; // Update the tracker
                        console.log(`Buffer updated: "${synthesisBuffer}"`);
    
                        // Process the buffer if it reaches the threshold
                        if (bufferWordCount >= bufferThreshold) {
                            synthesisQueue.push(synthesisBuffer); // Push the buffer to the queue
                            console.log(`Added chunk to queue: "${synthesisBuffer}"`);
                            synthesisBuffer = ""; // Reset buffer
                            bufferWordCount = 0; // Reset word count
                            processSynthesisQueue();
                        }
    
                        // Set a timeout to flush the buffer if a pause is detected
                        if (pauseTimeout) clearTimeout(pauseTimeout);
                        pauseTimeout = setTimeout(() => {
                            flushBuffer(); // Flush buffer on pause
                        }, 1000); // 1 second pause detection
                    }
                }
            }
        };
    
        // Process the synthesis queue
        const processSynthesisQueue = () => {
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
                processSynthesisQueue();
            }
        };
    
        // Handle cancellation or errors
        translator.canceled = (s, e) => {
            console.error(`Translation canceled: ${e.reason}, Error: ${e.errorDetails}`);
            if (e.reason === SpeechSDK.CancellationReason.Error) {
                console.error("Cancelling translator due to error.");
            }
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
            <div style={{ width: '700px', marginBottom: '20px' }}>
                <VolumeSlider onVolumeChange={handleTimeoutChange}/>
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