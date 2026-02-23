import { useEffect, useState } from 'react';
import { ShotSelector } from './ShotSelector';
import type { Point, Hand, ShotType } from '../../store/matchStore';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { parseVoiceCommand } from '../../utils/voiceCommandParser';

interface TrainingControlsProps {
    pointType: 'winner' | 'error';
    setPointType: (type: 'winner' | 'error') => void;
    shotType: string;
    setShotType: (type: string) => void;
    hand: string;
    setHand: (hand: string) => void;
    showHeatmap: boolean;
    setShowHeatmap: (show: boolean) => void;
    trainingPoints: Point[];
    addTrainingPoint: (point: Point) => void;
    undoLastTrainingPoint: () => void;
    saveTrainingSession: (duration: number) => void;
    clearTrainingSession: () => void;
    setShowTrainingHistory: (show: boolean) => void;
}

export const TrainingControls = ({
    pointType,
    setPointType,
    shotType,
    setShotType,
    hand,
    setHand,
    showHeatmap,
    setShowHeatmap,
    trainingPoints,
    addTrainingPoint,
    undoLastTrainingPoint,
    saveTrainingSession,
    clearTrainingSession,
    setShowTrainingHistory
}: TrainingControlsProps) => {
    // Audio feedback for voice command
    const [audioContext] = useState(() => new (window.AudioContext || (window as any).webkitAudioContext)());

    const playSuccessBeep = () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High pitch beep
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };

    const {
        isSupported,
        isListening,
        startListening,
        stopListening,
        transcript
    } = useVoiceRecognition();

    useEffect(() => {
        console.log('Transcript:', transcript);
        if (!transcript) return;

        const parsedCommand = parseVoiceCommand(transcript);
        if (parsedCommand.isValid) {
            const newPoint: Point = {
                type: parsedCommand.pointType || 'error',
                x: 0,
                y: 0,
                player: 'me',
                hand: (parsedCommand.hand as Hand) || 'drive',
                shotType: (parsedCommand.shotType as ShotType) || 'fondo',
                isTraining: true,
                timestamp: Date.now()
            };
            addTrainingPoint(newPoint);
            playSuccessBeep();
        }
    }, [transcript, addTrainingPoint]);

    const handleToggleVoice = () => {
        if (audioContext.state === 'suspended') {
            // Need user interaction to unlock audio context in some browsers
            audioContext.resume();
        }
        if (isListening) stopListening();
        else startListening();
    };

    const handleSaveTraining = () => {
        if (trainingPoints.length === 0) {
            alert('Registra al menos un golpe antes de guardar');
            return;
        }

        const durationInput = prompt('¿Cuántos minutos entrenaste?', '30');
        if (durationInput === null) return;

        const duration = parseInt(durationInput);
        if (isNaN(duration) || duration <= 0) {
            alert('Por favor ingresa un número válido de minutos');
            return;
        }

        saveTrainingSession(duration);
        alert(`Sesión guardada: ${trainingPoints.length} golpes en ${duration} minutos`);
    };

    const handleClearTraining = () => {
        if (trainingPoints.length > 0 && confirm('¿Reiniciar sesión? Se perderán los golpes registrados.')) {
            clearTrainingSession();
        } else if (trainingPoints.length === 0) {
            clearTrainingSession();
        }
    };

    return (
        <div className="bg-transparent md:bg-white/10 md:backdrop-blur-md md:p-3 md:rounded-xl md:shadow-lg md:border md:border-white/5 flex flex-col gap-2 relative">
            {isSupported && (
                <button
                    onClick={handleToggleVoice}
                    className={` w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-1.5 rounded-full md:rounded shadow-lg border flex items-center justify-center gap-2 transition-all text-xs font-bold uppercase ${isListening
                        ? 'bg-red-500/20 md:bg-red-500/80 border-red-500 text-red-500 md:text-white animate-pulse'
                        : 'bg-neutral-800 md:bg-neutral-800 border-white/20 text-white/50 hover:text-white'
                        }`}
                    title="Modo Voz"
                >
                    <span className="text-lg">🎤</span>
                    <span className="hidden md:inline">{isListening ? 'Escuchando' : 'Voz'}</span>
                </button>
            )}

            <ShotSelector
                pointType={pointType}
                setPointType={setPointType}
                shotType={shotType}
                setShotType={setShotType}
                hand={hand}
                setHand={setHand}
                mode="training"
            />

            <div className="mt-2 flex flex-col gap-2 md:hidden">
                <button onClick={handleSaveTraining} className="w-full py-2 bg-emerald-500/20 text-emerald-200 text-xs font-bold uppercase rounded border border-emerald-500/20">Finalizar y Guardar</button>
                <button onClick={undoLastTrainingPoint} className="w-full py-2 bg-white/5 text-white text-xs uppercase rounded">Deshacer Último</button>
                <div className="flex gap-2">
                    <button onClick={handleClearTraining} className="flex-1 py-2 bg-red-500/10 text-red-300 text-xs uppercase rounded border border-red-500/10">Reiniciar</button>
                    <button onClick={() => setShowTrainingHistory(true)} className="flex-1 py-2 bg-white/5 text-white/50 text-xs uppercase rounded">Historial</button>
                    <button onClick={() => setShowHeatmap(!showHeatmap)} className="flex-1 py-2 bg-white/5 text-white/50 text-xs uppercase rounded">{showHeatmap ? 'Ocultar Heatmap' : 'Heatmap'}</button>
                </div>
            </div>

            <div className="hidden md:flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
                <button onClick={() => setShowHeatmap(!showHeatmap)} className="w-full py-1.5 px-3 text-xs uppercase border rounded border-white/30 text-white/50 hover:text-white">{showHeatmap ? 'Ocultar Heatmap' : 'Ver Heatmap'}</button>
                <button onClick={undoLastTrainingPoint} className="w-full py-1.5 px-3 bg-white/10 text-white text-xs uppercase rounded">Deshacer</button>
                <button onClick={handleSaveTraining} className="w-full py-2 px-3 bg-emerald-500/20 text-emerald-200 text-xs uppercase font-bold rounded border border-emerald-500/20">Finalizar y Guardar</button>
                <div className="flex gap-2">
                    <button onClick={handleClearTraining} className="flex-1 py-1.5 bg-red-500/10 text-red-300 text-xs uppercase rounded border border-red-500/10">Reiniciar</button>
                    <button onClick={() => setShowTrainingHistory(true)} className="flex-1 py-1.5 bg-white/5 text-white/50 text-xs uppercase rounded">Historial</button>
                </div>
            </div>
        </div>
    );
};
