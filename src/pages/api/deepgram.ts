import { createClient } from "@deepgram/sdk";

const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY!);

export const transcribeLiveAudio = async (onTextReceived: (text: string) => void) => {
    const socket = deepgram.listen.live({
        punctuate: true,
        interim_results: true,
        language: "en-US", // Change based on expected input language
    });

    socket.on("open", () => {
        console.log("✅ Deepgram Connection Open");
    });

    socket.on("transcript", (data) => {
        const transcript = data.channel.alternatives[0]?.transcript;
        if (transcript) {
            console.log("🎙️ Recognized Speech:", transcript);
            onTextReceived(transcript); // Send to translation
        }
    });

    socket.on("error", (error) => {
        console.error("❌ Deepgram Error:", error);
    });

    return socket;
};
