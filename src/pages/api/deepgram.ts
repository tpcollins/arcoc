import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.DEEPGRAM_API_KEY!);

export const startDeepgramTranscription = (onTextReceived: (text: string) => void) => {
    const deepgramSocket = deepgram.listen.live({
        punctuate: true,
        translate: "en", // Change based on user preference
    });

    deepgramSocket.on("transcriptReceived", (transcript: any) => {
        if (transcript?.channel?.alternatives[0]?.transcript) {
            let translatedText = transcript.channel.alternatives[0].transcript;
            console.log("🔄 Deepgram Live Translation:", translatedText);
            onTextReceived(translatedText); // Send back to main logic
        }
    });

    return deepgramSocket;
};