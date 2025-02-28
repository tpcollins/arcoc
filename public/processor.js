class DeepgramProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
        if (inputs[0].length > 0) {
            this.port.postMessage(inputs[0][0]); // Send audio buffer to main thread
        }
        return true; // Keep the processor alive
    }
}

registerProcessor("deepgram-processor", DeepgramProcessor);
