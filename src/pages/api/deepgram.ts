import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);

export const startDeepgramTranscription = (onTextReceived: (text: string) => void) => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const deepgramSocket = deepgram.listen.live({
            punctuate: true, 
        });

        const processor = audioContext.createScriptProcessor(4096, 1, 1);
        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
            if (deepgramSocket.readyState === WebSocket.OPEN) {
                deepgramSocket.send(event.inputBuffer.getChannelData(0));
            }
        };

        deepgramSocket.on("transcriptReceived", (transcript: any) => {
            if (transcript.channel.alternatives[0]?.transcript) {
                let translatedText = transcript.channel.alternatives[0].transcript;
                console.log("📥 Deepgram Live Transcription:", translatedText);
                onTextReceived(translatedText);
            }
        });

        deepgramSocket.on("error", (error) => {
            console.error("❌ Deepgram WebSocket error:", error);
        });

        deepgramSocket.on("close", () => {
            console.log("🛑 Deepgram WebSocket closed");
        });

        return deepgramSocket;
    }).catch((error) => {
        console.error("⚠️ Error accessing microphone:", error);
    });
};
