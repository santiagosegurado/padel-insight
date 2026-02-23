import { ShotSelector } from './ShotSelector';
import type { Point } from '../../store/matchStore';

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
    undoLastTrainingPoint,
    saveTrainingSession,
    clearTrainingSession,
    setShowTrainingHistory
}: TrainingControlsProps) => {
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
        <div className="bg-transparent md:bg-white/10 md:backdrop-blur-md md:p-3 md:rounded-xl md:shadow-lg md:border md:border-white/5 flex flex-col gap-2">
            <ShotSelector
                pointType={pointType}
                setPointType={setPointType}
                shotType={shotType}
                setShotType={setShotType}
                hand={hand}
                setHand={setHand}
            />

            <div className="mt-2 flex flex-col gap-2">
                <button onClick={undoLastTrainingPoint} className="md:hidden w-full py-2 bg-white/5 rounded text-xs text-white/50">Deshacer Último</button>
                <div className="flex gap-2 md:hidden">
                    <button onClick={() => setShowTrainingHistory(true)} className="flex-1 py-2 bg-white/5 rounded text-xs text-white/50">Historial</button>
                    <button onClick={() => setShowHeatmap(!showHeatmap)} className="flex-1 py-2 bg-white/5 rounded text-xs text-white/50">{showHeatmap ? 'Ocultar Heatmap' : 'Ver Heatmap'}</button>
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
