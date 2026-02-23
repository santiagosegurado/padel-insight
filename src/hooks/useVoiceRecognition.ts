import { useState, useEffect, useCallback, useRef } from 'react';

// Interfaces for Web Speech API (Typescript fallback)
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export interface VoiceRecognitionState {
    isListening: boolean;
    transcript: string;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    isSupported: boolean;
}

export const useVoiceRecognition = (): VoiceRecognitionState => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);
    const isEnabledRef = useRef<boolean>(false);

    // Check support on initial load
    const isSupported = typeof window !== 'undefined' &&
        (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

    useEffect(() => {
        if (!isSupported) {
            setError('Browser not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();

        // Configure recognition
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'es-ES'; // Default to Spanish for padel commands

        recognitionRef.current.onresult = (event: any) => {
            // Get the last recognized chunk
            const current = event.resultIndex;
            const t = event.results[current][0].transcript;
            setTranscript(t);
        };

        recognitionRef.current.onerror = (event: any) => {
            if (event.error === 'not-allowed') {
                setError('Microphone access denied');
                setIsListening(false);
                isEnabledRef.current = false;
            }
            // Note: we don't turn off isListening for 'no-speech' or 'network'
            // as we want it to keep trying if the user intended it to be on.
        };

        recognitionRef.current.onend = () => {
            // Resilience: If it ended automatically but the user didn't explicitly stop it, restart it.
            if (isEnabledRef.current && recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                } catch (e) {
                    console.error("Could not restart SpeechRecognition automatically", e);
                    setIsListening(false);
                    isEnabledRef.current = false;
                }
            } else {
                setIsListening(false);
            }
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [isSupported]);

    const startListening = useCallback(() => {
        setError(null);
        if (!recognitionRef.current) return;

        try {
            isEnabledRef.current = true;
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            // Might already be started
            console.warn("Speech recognition already started");
            setIsListening(true);
        }
    }, []);

    const stopListening = useCallback(() => {
        isEnabledRef.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    }, []);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        isSupported
    };
};
