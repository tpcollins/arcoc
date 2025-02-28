import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

export const startAzureSynthesis = (apiKey: string, tarLocale: string, voiceLocale: string) => {
    if (!apiKey || !tarLocale || !voiceLocale) {
        console.error("Missing API Key or locales");
        return;
    }

    const speechConfig = SpeechSDK.SpeechTranslationConfig.fromSubscription(apiKey, "eastus2");
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.addTargetLanguage(tarLocale);
    speechConfig.voiceName = voiceLocale;

    const speakerOutputConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, speakerOutputConfig);

    const synthesizeSpeech = async (text: string) => {
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

    console.log("✅ Azure Speech Synthesis started with:", { apiKey, tarLocale, voiceLocale });
};