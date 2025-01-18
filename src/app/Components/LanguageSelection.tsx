// /*

// **** WHERE WE ARE AT:

/*

I am really at a loss with this at this point. I have multiple methods commented out. The uncommented one seems to be working the best

Flush buffer is the problem causing overlap, but without there are even more issues. Very unsure of what exactly needs to be done. We somehow need
to create a pause in between buffers while also making sure the language barrier fixes are in place 12-22

*/
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// NON-MVP TODO:
// 1. Setup application to work with various microphone inputs (see GPT Log "TypeScript Azure Speech SDK") 

// 2. API Key for translator (to translate the list of voices from their respective alphabets to english )

// 3. Is there a way to make the target language drop down not scroll the whole page? (Save this for later if it's a big deal)

// BUG LIST:
// 1BL. If page refreshes, API key does not refresh with it. Need to prompt user to go back and enter API key upon refresh -
// - or upon sitting on the page too long 

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


// */


// /*

// TODO:

// 4. When there is a long pause in speaking (like when we sing) I think it's disconnecting from the Azure service. It will have to handle pauses and either reopen the connection when we start speaking again or hold it open (if it can?).


// */

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

    let synthesisQueue: string[] = []; 
    let isSpeaking = false; 
    let currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
    let currentSentenceBuffer = ""; // Store current sentence being formed
    let lastRecognizedText = ""; // Store the last processed full sentence

    const punctuationMarks = /[.!?]/; // Used to detect full sentences

    // Process the synthesis queue
    const processSynthesisQueue = () => {
        if (isSpeaking || synthesisQueue.length === 0) return;

        const textToSpeak = synthesisQueue.shift(); // Get the next sentence
        if (textToSpeak) {
            console.log("Processing chunk:", textToSpeak);
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
                            console.log("Synthesis complete:", text);
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
            if (currentSynthesizer) {
                currentSynthesizer.close();
                currentSynthesizer = null;
            }
            setTimeout(processSynthesisQueue, 100); // Prevent immediate overlap
        }
    };

    let lastRecognizingText = "";
    let sentenceBuffer = "";
    let lastWordCount = 0;
    let sentenceTimeout: NodeJS.Timeout | null = null;
    const pauseThreshold = 1500; // 1.5s of no updates = sentence completed
    
    translator.recognizing = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
            const interimTranslatedText = e.result.translations.get(tarLocale);
            
            if (interimTranslatedText) {
                console.log("Interim (Buffering):", interimTranslatedText);
    
                // If the text is repeating itself due to reformulation, do nothing
                if (interimTranslatedText === lastRecognizingText) return;
                lastRecognizingText = interimTranslatedText;
    
                // Append new words to the buffer
                sentenceBuffer = interimTranslatedText;
    
                // Word count tracking
                const wordCount = sentenceBuffer.split(" ").length;
    
                // If words are not increasing, assume pause
                if (wordCount === lastWordCount) {
                    if (!sentenceTimeout) {
                        sentenceTimeout = setTimeout(() => {
                            console.log("Detected pause, pushing sentence:", sentenceBuffer);
                            
                            // Push the sentence to synthesis queue
                            synthesisQueue.push(sentenceBuffer.trim());
                            processSynthesisQueue();
                            
                            // Reset buffer
                            sentenceBuffer = "";
                            lastRecognizingText = "";
                        }, pauseThreshold);
                    }
                } else {
                    // If words are still coming in, clear timeout
                    if (sentenceTimeout) {
                        clearTimeout(sentenceTimeout);
                        sentenceTimeout = null;
                    }
                }
    
                lastWordCount = wordCount;
            }
        }
    };
    
    // Recognized for final corrections
    translator.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
            const finalizedText = e.result.translations.get(tarLocale);
    
            if (finalizedText && finalizedText !== lastRecognizingText) {
                console.log("Finalized:", finalizedText);
    
                // Push finalized sentence to synthesis queue
                synthesisQueue.push(finalizedText.trim());
                processSynthesisQueue();
            }
        }
    };
    
    

    // Handle cancellation or errors
    translator.canceled = (s, e) => {
        console.error("Translation canceled:", e.reason, "Error:", e.errorDetails);
    };

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





































/*

**** WHERE WE ARE AT:
12-17 TODO:

**** View ChatGPT log "Log Chunks in Array" for a few ideas on how we can fix this issue

2. If 1 is working, test Spanish and German and fix the overlap
    NOTE: over lap is coming from sentences correcting themselves due to language barrier. For languages that are not English, might need to add -
    - more buffers between chunks or maybe even words? Not sure quite yet.

-- It seems that everything is working properly with Engish. I have tested English at 200 on the slider with 2500 on the timeout for the flush buffer. 
-- Spanish is almost there it almost sounds perfect but it still seems we are getting overlap on certain sentences due to language barrier. 
    -- Need to play around with flush buffer and slider but there might be a better way to control this. I am just unsure of it right now


Additional Comments:
flushBuffer helps much more with the buffer between sentences than the processTimeout. setting the timeout there seems to ensure the program does not talk over itself

After some additional testing it seems the program really only talks over itself when a new chunk is read. Still need to adjust the buffer and play with it to reduce the overlap but at 200 on the process timeout, it seems to be working almost perfectly (in English. Have not tested other languages yet)
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

// // React Variables
// import React, { useState, useEffect } from 'react';
// // Dropdown Menu
// import DropdownMenu from '../R Components/DropdownMenu';
// // Use Voices and Use Locale
// import { useLocale } from '@/Contexts/LocalizationContext';
// import { useVoices } from '@/Custom Hooks/useVoices';
// // Imports from data.js
// import { targetLangData, neuralVoiceData, plyBtnData } from '../Data/Data';
// // Playbutton
// import PlayButton from '../R Components/PlayButton';
// // Redux Variables
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store/store';
// // Speech SDK
// import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
// // API Key Cookie Storage (not working yet)
// import { parse } from 'cookie';
// import { GetServerSidePropsContext } from 'next';
// import VolumeSlider from '../R Components/VolumeSlider';


// export const getServerSideProps = async (context: GetServerSidePropsContext) => {
//     const { req } = context;
  
//     const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
//     console.log('Parsed Cookies:', cookies); 

//     const apiKey = cookies.apiKey;
  
//     if (!apiKey) {
//       return { redirect: { destination: '/page', permanent: false } };
//     }
  
//     return {
//       props: {
//         apiKey,
//       },
//     };
// };

// interface LanguageSelectionProps {
//     apiKey?: string;
// }

// const LanguageSelection: React.FC<LanguageSelectionProps> = () => {
//     // Locales
//     const { locale, setLocale } = useLocale();
//     const { tarLocale, setTarLocale } = useLocale();

//     // API Key
//     const apiKey = useSelector((state: RootState) => state.apiKey.apiKey);

//     // Voices
//     const voices = useVoices(locale, apiKey);

//     // Dropdown Data
//     const [dropdownData, setDropdownData] = useState(neuralVoiceData);
//     const [shortName, setShortName] = useState('');
//     const [isDrpDwnDisabled, setIsDrpDwnDisabled] = useState(false);
//     const requiredFields = [tarLocale, shortName]; 
//     const [isPlaying, setIsPlaying] = useState(false);

//     // Timeout
//     const [processTimeout, setProcessTimeOut] = useState(100);

//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const openModal = () => setIsModalOpen(true);
//     const closeModal = () => setIsModalOpen(false);
//     // Translator
//     let translator: SpeechSDK.TranslationRecognizer | null = null;
    
//     const handleTarLang = (newLocale: string, newTarLocale: string) => {
//         setLocale(newLocale);  // Update the locale in the context, which will trigger the useVoices hook
//         setTarLocale(newTarLocale);
//     };

//     const handleShortName = (newShortName: string) => {
//         setShortName(newShortName);
//         console.log()
//     };

//     const handleTimeoutChange = (newTimeout: number) => {
//         let multTimeout = newTimeout * 200;
//         setProcessTimeOut(multTimeout); // Update the parent's state
//         console.log(`Process Timeout: ${processTimeout}`);
//     };

//     // const handleErrorClick = (e: any) => {
//     //     if (isPlaying && isDrpDwnDisabled) {
//     //         e.preventDefault();
//     //         setActTransErrorMsg(true);
//     //     }
//     // };

//     useEffect(() => {
//         if (voices && voices.links) {
//             setDropdownData({
//                 ...dropdownData,
//                 links: voices.links.map(voice => ({
//                     shortName: voice.ShortName,
//                     lang: voice.LocalName,
//                     flag: `/Icons/Flags/${voice.Locale}.svg`,
//                     gender: voice.Gender,
//                 }))
//           });
      
//           // Reset the shortName only if a voice has already been selected
//           if (shortName) {
//             setShortName('');
//           }
//         }

        
//       }, [voices, locale, tarLocale]);

//     // // Microsoft Translator
//     // useEffect(() => {
//     //     const fetchTranslations = async () => {
//     //       if (voices && voices.links) {
//     //         const translatorApiUrl = `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=en`;
//     //         const apiKey = process.env.NEXT_PUBLIC_TRANSLATOR_KEY;

//     //         console.log("environment key: ", process.env.NEXT_PUBLIC_TRANSLATOR_KEY);
      
//     //         const translatedLinks = await Promise.all(
//     //           voices.links.map(async (voice) => {
//     //             // Perform the translation API request directly here
//     //             const response = await fetch(translatorApiUrl, {
//     //               method: 'POST',
//     //               headers: {
//     //                 'Ocp-Apim-Subscription-Key': apiKey || '',
//     //                 'Content-Type': 'application/json',
//     //                 'Ocp-Apim-Subscription-Region': 'eastus2',  // Replace with your Azure region
//     //               },
//     //               body: JSON.stringify([{ Text: voice.LocalName }]),  // The text to translate
//     //             });
      
//     //             const data = await response.json();
      
//     //             // Log the translation response for debugging
//     //             console.log('Translation API response for:', voice.LocalName, data);
      
//     //             const translatedLang = data[0]?.translations[0]?.text || voice.LocalName;  // Use translated language, fallback to original if translation fails
      
//     //             return {
//     //               shortName: voice.ShortName,
//     //               gender: voice.Gender,
//     //               lang: translatedLang,  // Use translated language
//     //               flag: `/Icons/Flags/${voice.Locale}.svg`,
//     //             };
//     //           })
//     //         );
      
//     //         setDropdownData((prevData) => ({
//     //           ...prevData,
//     //           links: translatedLinks,
//     //         }));
//     //       }
//     //     };
      
//     //     fetchTranslations();  // Invoke the async function
      
//     //   }, [voices, locale, tarLocale]);  // Add dependencies
      

//     // useEffect(() => {
//     //     const handleErrorClick = (e: any) => {
//     //         e.preventDefault();

//     //         setTimeout(() => {
//     //             if (!e.target.closest('#dropdown-basic')) {
//     //               setActTransErrorMsg(false);  // Hide error message
//     //             }
//     //         }, 100000);  // A small delay of 100ms to avoid instant dismissal
//     //     }; 
    
//     //     // Add event listener to the document
//     //     document.addEventListener('click', handleErrorClick);
    
//     //     console.log("actTransErrorMessage: ", actTransErrorMsg);

//     //     // Clean up the event listener on component unmount
//     //     return () => {
//     //       document.removeEventListener('click', handleErrorClick);
//     //     };
        
//     // }, []);
      
//     // Original useEffect for isPlaying
//     useEffect(() => {
//         // console.log("isPlaying: ", isPlaying);
//         if (isPlaying) {
//             translator = startContinuousTranslation().translator;
//             setIsDrpDwnDisabled(true);
//         } else if (translator) {
//             translator.stopContinuousRecognitionAsync(() => {
//                 // console.log("Continuous recognition stopped");
//             });
//         }

//         if(!isPlaying){
//             setIsDrpDwnDisabled(false);
//             // startContinuousTranslation().stopTranslation;
//         }
//         // console.log("isDrpDwnDisabled: ", isDrpDwnDisabled);

//         return () => {
//             // Ensure cleanup on unmount
//             translator?.stopContinuousRecognitionAsync();
//         };
//     }, [isPlaying, isDrpDwnDisabled]);  


//     // This one is almost perfect
//     const startContinuousTranslation = () => {
//         const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
//             apiKey as string,
//             "eastus2"
//         );
    
//         speechConfig.speechRecognitionLanguage = "en-US";
//         speechConfig.addTargetLanguage(tarLocale);
//         speechConfig.voiceName = shortName;
    
//         const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
//         translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
//         let synthesisQueue: string[] = []; // Queue for interim translations
//         let isSpeaking = false; // Prevents overlapping synthesis
//         let synthesisBuffer = ""; // Buffer for chunking words
//         const bufferThreshold = 15; // Chunk size (number of words)
//         let lastProcessedIndex = 0;
    
//         // Pause detection variables
//         let pauseTimeout: NodeJS.Timeout | null = null;
//         const pauseDetectionTimeout = 1000; // 1-second pause threshold
    
//         translator.recognizing = (s, e) => {
//             if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
//                 const interimTranslatedText = e.result.translations.get(tarLocale);
    
//                 if (interimTranslatedText) {
//                     console.log("interimTranslatedText: ", interimTranslatedText);
//                     const splitText = interimTranslatedText.split(" ");
//                     const newWords = splitText.slice(lastProcessedIndex);
    
//                     console.log("newWords calculation: ", newWords);
    
//                     if (newWords.length > 0) {
//                         console.log("New words detected:", newWords);
    
//                         // Add new words to the synthesis buffer
//                         synthesisBuffer += (synthesisBuffer ? " " : "") + newWords.join(" ");
//                         console.log("Updated synthesisBuffer:", synthesisBuffer);
    
//                         // Update lastProcessedIndex to the end of the current text
//                         lastProcessedIndex = splitText.length;
    
//                         // Check if the buffer exceeds the threshold
//                         if (synthesisBuffer.split(" ").length >= bufferThreshold) {
//                             console.log("Buffer threshold exceeded, adding to synthesis queue.");
//                             synthesisQueue.push(synthesisBuffer);
//                             synthesisBuffer = ""; // Clear buffer
//                             processSynthesisQueue();
//                         }
//                     } else {
//                         console.log("No new words detected.");
//                     }
    
//                     // Update lastProcessedIndex unconditionally to prevent getting stuck
//                     if (lastProcessedIndex > splitText.length) {
//                         // lastProcessedIndex = splitText.length;
//                         lastProcessedIndex = 0;
//                     }
    
//                     console.log("Updated lastProcessedIndex: ", lastProcessedIndex);
    
//                     // Reset pause detection timeout on new input
//                     if (pauseTimeout) clearTimeout(pauseTimeout);
//                     pauseTimeout = setTimeout(() => {
//                         flushBuffer();
//                     }, pauseDetectionTimeout);
//                 }
//             }
//         };        
    
//         const processSynthesisQueue = () => {
//             if (isSpeaking || synthesisQueue.length === 0) return;
    
//             const textToSpeak = synthesisQueue.shift(); // Get the next chunk
//             if (textToSpeak) {
//                 console.log(`Processing chunk: "${textToSpeak}"`);
    
//                 synthesizeSpeech(textToSpeak).then(() => {
//                     // Add a consistent 500ms delay before processing the next chunk
//                     isSpeaking = true;
//                     setTimeout(() => {
//                         isSpeaking = false; // Allow the next chunk to process
//                         processSynthesisQueue();
//                     }, 200); // Adjust this delay as needed
//                 });
//             }
//         };
    
//         const flushBuffer = () => {
//             if (!synthesisBuffer) return; // Nothing to flush
    
//             console.log(`Flushing buffer: "${synthesisBuffer}"`);
//             synthesisQueue.push(synthesisBuffer.trim()); // Add the buffer to the queue
//             synthesisBuffer = ""; // Clear the buffer
    
//             if (!isSpeaking) {
//                 processSynthesisQueue();
//             } else {
//                 console.log("Delaying flush until current synthesis is complete.");
//             }
//         };
    
//         const synthesizeSpeech = async (text: string): Promise<void> => {
//             const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
//             synthConfig.speechSynthesisVoiceName = shortName;
    
//             const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
//             const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
//             return new Promise<void>((resolve, reject) => {
//                 synthesizer.speakTextAsync(
//                     text,
//                     (result) => {
//                         if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
//                             console.log(`Synthesis complete: "${text}"`);
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
//         };
    
//         translator.startContinuousRecognitionAsync(() => {
//             console.log("Continuous recognition started.");
//         });
    
//         return { translator };
//     };
    
    



//     // this one attempts to create a pause between the buffer

//     // const startContinuousTranslation = () => {
//     //     const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(
//     //         apiKey as string,
//     //         "eastus2"
//     //     );
    
//     //     speechConfig.speechRecognitionLanguage = "en-US";
//     //     speechConfig.addTargetLanguage(tarLocale);
//     //     speechConfig.voiceName = shortName;
    
//     //     const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
//     //     translator = new SpeechSDK.TranslationRecognizer(speechConfig, audioConfig);
    
//     //     let synthesisQueue: string[] = []; // Queue for interim translations
//     //     let isSpeaking = false; // Prevents overlapping synthesis
//     //     let synthesisBuffer = ""; // Buffer for chunking words
//     //     const bufferThreshold = 15; // Chunk size (number of words)
//     //     let lastProcessedIndex = 0;
    
//     //     // Pause detection variables
//     //     let pauseTimeout: NodeJS.Timeout | null = null;
//     //     const pauseDetectionTimeout = 1000; // 1-second pause threshold
    
//     //     translator.recognizing = (s, e) => {
//     //         if (e.result.reason === SpeechSDK.ResultReason.TranslatingSpeech) {
//     //             const interimTranslatedText = e.result.translations.get(tarLocale);
    
//     //             if (interimTranslatedText) {
//     //                 console.log("interimTranslatedText: ", interimTranslatedText);
//     //                 const splitText = interimTranslatedText.split(" ");
//     //                 const newWords = splitText.slice(lastProcessedIndex);
    
//     //                 console.log("newWords calculation: ", newWords);
    
//     //                 if (newWords.length > 0) {
//     //                     console.log("New words detected:", newWords);
    
//     //                     // Add new words to the synthesis buffer
//     //                     synthesisBuffer += (synthesisBuffer ? " " : "") + newWords.join(" ");
//     //                     console.log("Updated synthesisBuffer:", synthesisBuffer);
    
//     //                     // Update lastProcessedIndex to the end of the current text
//     //                     lastProcessedIndex = splitText.length;
    
//     //                     // Check if the buffer exceeds the threshold
//     //                     if (synthesisBuffer.split(" ").length >= bufferThreshold) {
//     //                         console.log("Buffer threshold exceeded, adding to synthesis queue.");
//     //                         synthesisQueue.push(synthesisBuffer);
//     //                         synthesisBuffer = ""; // Clear buffer
//     //                         processSynthesisQueue();
//     //                     }
//     //                 } else {
//     //                     console.log("No new words detected.");
//     //                 }
    
//     //                 // Update lastProcessedIndex unconditionally to prevent getting stuck
//     //                 if (lastProcessedIndex > splitText.length) {
//     //                     // lastProcessedIndex = splitText.length;
//     //                     lastProcessedIndex = 0;
//     //                 }
    
//     //                 console.log("Updated lastProcessedIndex: ", lastProcessedIndex);
    
//     //                 // Reset pause detection timeout on new input
//     //                 if (pauseTimeout) clearTimeout(pauseTimeout);
//     //                 pauseTimeout = setTimeout(() => {
//     //                     flushBuffer();
//     //                 }, pauseDetectionTimeout);
//     //             }
//     //         }
//     //     };        
    
//     //     const flushBuffer = () => {
//     //         if (!synthesisBuffer) return; // Nothing to flush
        
//     //         console.log(`Flushing buffer: "${synthesisBuffer}"`);
//     //         synthesisQueue.push(synthesisBuffer.trim()); // Add the buffer to the queue
//     //         synthesisBuffer = ""; // Clear the buffer
        
//     //         // Process the synthesis queue only if not currently speaking
//     //         if (!isSpeaking) {
//     //             processSynthesisQueue();
//     //         } else {
//     //             console.log("Delaying flush until current synthesis is complete.");
//     //             // Add a listener to process the queue after the current synthesis
//     //             const intervalId = setInterval(() => {
//     //                 if (!isSpeaking) {
//     //                     clearInterval(intervalId);
//     //                     processSynthesisQueue();
//     //                 }
//     //             }, 100); // Check every 100ms if speaking has completed
//     //         }
//     //     };
        
//     //     const processSynthesisQueue = () => {
//     //         if (isSpeaking || synthesisQueue.length === 0) return;
        
//     //         const textToSpeak = synthesisQueue.shift(); // Get the next chunk
//     //         if (textToSpeak) {
//     //             console.log(`Processing chunk: "${textToSpeak}"`);
//     //             isSpeaking = true; // Prevent new synthesis from starting
//     //             synthesizeSpeech(textToSpeak)
//     //                 .then(() => {
//     //                     console.log("Synthesis completed for chunk.");
//     //                     isSpeaking = false; // Allow the next chunk to process
//     //                     processSynthesisQueue(); // Process the next chunk
//     //                 })
//     //                 .catch((error) => {
//     //                     console.error("Error during synthesis:", error);
//     //                     isSpeaking = false; // Reset state to allow retries
//     //                     processSynthesisQueue(); // Process the next chunk
//     //                 });
//     //         }
//     //     };        
    
//     //     const synthesizeSpeech = async (text: string): Promise<void> => {
//     //         const synthConfig = SpeechSDK.SpeechConfig.fromSubscription(apiKey as string, "eastus2");
//     //         synthConfig.speechSynthesisVoiceName = shortName;
    
//     //         const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
//     //         const synthesizer = new SpeechSDK.SpeechSynthesizer(synthConfig, speakerOutputConfig);
    
//     //         return new Promise<void>((resolve, reject) => {
//     //             synthesizer.speakTextAsync(
//     //                 text,
//     //                 (result) => {
//     //                     if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
//     //                         console.log(`Synthesis complete: "${text}"`);
//     //                         resolve();
//     //                     } else {
//     //                         console.error("Synthesis failed:", result.errorDetails);
//     //                         reject(new Error(result.errorDetails));
//     //                     }
//     //                 },
//     //                 (error) => {
//     //                     console.error("Error during speech synthesis:", error);
//     //                     reject(error);
//     //                 }
//     //             );
//     //         });
//     //     };
    
//     //     translator.startContinuousRecognitionAsync(() => {
//     //         console.log("Continuous recognition started.");
//     //     });
    
//     //     return { translator };
//     // };

//     return (
//         <>
//         <div className="d-flex flex-column align-items-center mt-4">
//             {/* Dropdowns */}
//             <div className="d-flex justify-content-between mb-4" style={{ width: '700px' }}>
//                 <DropdownMenu
//                     data={targetLangData}
//                     handleTarLang={handleTarLang}
//                     isDisabled={isDrpDwnDisabled}
//                     renderItem={(item) => (
//                         <div style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
//                             <img
//                                 alt="File icon"
//                                 aria-hidden
//                                 height={16}
//                                 src={item.flag}
//                                 style={{ paddingRight: '5px' }}
//                                 width={16}
//                             />
//                             {item.lang}
//                         </div>
//                     )}
//                 />
    
//                 <DropdownMenu
//                     data={dropdownData}
//                     handleShortName={handleShortName}
//                     isDisabled={isDrpDwnDisabled}
//                     requiredFields={requiredFields}
//                     renderItem={(item) => (
//                         <div style={{ alignItems: 'center', display: 'flex', width: '100%' }}>
//                             <img
//                                 alt="File icon"
//                                 aria-hidden
//                                 height={16}
//                                 src={item.flag}
//                                 style={{ paddingRight: '5px' }}
//                                 width={16}
//                             />
//                             {item.lang + ' (' + item.gender + ')'}
//                         </div>
//                     )}
//                 />
//             </div>
    
//             {/* Move VolumeSlider Below */}
//             <div style={{ width: '700px', marginBottom: '20px', marginTop: '20px' }}>
//                 <h3 className="text-center">
//                     Sentence Buffer
//                     <span
//                         style={{
//                             marginLeft: '8px',
//                             cursor: 'pointer',
//                             color: '#ffffff', // Lighter color for better contrast
//                             fontWeight: 'bold', // Make it bold for better visibility
//                             fontSize: '16px', // Slightly larger font size
//                             textDecoration: 'none', // Remove underline for cleaner look
//                             backgroundColor: '#007bff', // Add a background for visibility
//                             padding: '2px 6px', // Add padding for a button-like effect
//                             borderRadius: '50%', // Make it circular
//                         }}
//                         onClick={openModal}
//                         onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')} // Hover effect: darker background
//                         onMouseLeave={(e) => (e.target.style.backgroundColor = '#007bff')}
//                         >
//                         ?
//                     </span>

//                 </h3>

//                 {/* Modal */}
//                 {isModalOpen && (
//                     <>
//                     {/* Overlay */}
//                     <div
//                         style={{
//                         position: 'fixed',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//                         zIndex: 999,
//                         }}
//                         onClick={closeModal}
//                     />
//                     {/* Modal Content */}
//                     <div
//                     style={{
//                         position: 'fixed',
//                         top: '50%',
//                         left: '50%',
//                         transform: 'translate(-50%, -50%)',
//                         backgroundColor: 'white',
//                         padding: '20px',
//                         border: '1px solid #ccc',
//                         borderRadius: '8px',
//                         zIndex: 1000,
//                     }}
//                     onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the modal
//                     >
//                         <p
//                         style={{
//                             color: 'black',
//                         }}
//                         >
//                         The Sentence Buffer allows you to adjust how much time is taken in between sentences.
//                         </p>

//                         <p
//                         style={{
//                             color: 'black',
//                             paddingTop: '10px',
//                         }}
//                         >
//                         This is mainly for faster speaking languages such as Spanish, to reduce overlap.
//                         </p>
//                         <div
//                         className="text-center"
//                         style={{
//                             paddingTop: '10px',
//                         }}
//                         >
//                         <button
//                             type="button"
//                             className="btn btn-danger"
//                             onClick={closeModal}
//                             style={{ marginTop: '10px' }}
//                         >
//                             Close
//                         </button>
//                         </div>
//                     </div>
//                     </>
//                 )}
//                 <VolumeSlider onVolumeChange={handleTimeoutChange}/>
//             </div>
    
//             {/* Play Button */}
//             <div>
//                 <PlayButton
//                     isPlaying={isPlaying}
//                     setIsPlaying={setIsPlaying}
//                     requiredFields={requiredFields}
//                     data={plyBtnData}
//                 />
//             </div>
//         </div>
//     </>    
//   );
// };

// export default LanguageSelection; 
