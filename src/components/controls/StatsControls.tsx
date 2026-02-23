import { ShotSelector } from './ShotSelector';
import type { Point } from '../../store/matchStore';

interface StatsControlsProps {
    pointType: 'winner' | 'error';
    setPointType: (type: 'winner' | 'error') => void;
    shotType: string;
    setShotType: (type: string) => void;
    hand: string;
    setHand: (hand: string) => void;
    showHeatmap: boolean;
    setShowHeatmap: (show: boolean) => void;
    undoLastPoint: () => void;
    handleFinishMatch: () => void;
    handleResetMatch: () => void;
    setShowHistory: (show: boolean) => void;
    teamNames: { us: string; them: string };
    points: Point[];
}

export const StatsControls = ({
    pointType,
    setPointType,
    shotType,
    setShotType,
    hand,
    setHand,
    showHeatmap,
    setShowHeatmap,
    undoLastPoint,
    handleFinishMatch,
    handleResetMatch,
    setShowHistory,
    teamNames,
    points
}: StatsControlsProps) => {
    return (
        <div className="flex flex-col gap-3 md:w-64 max-h-[60vh] overflow-y-auto md:max-h-none md:overflow-visible">
            <div className="hidden md:block bg-white/10 backdrop-blur-md p-4 rounded-xl text-white shadow-lg border border-white/5">
                <h1 className="text-xl font-bold mb-2">Padel Insight</h1>
                <div className="flex justify-between items-center text-xs text-white/50 mb-2">
                    <span>{teamNames.us}</span>
                    <span>vs</span>
                    <span>{teamNames.them}</span>
                </div>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between gap-4">
                        <span>Winners:</span>
                        <span className="font-bold text-emerald-400">{points.filter(p => p.type === 'winner').length}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span>Errores:</span>
                        <span className="font-bold text-red-400">{points.filter(p => p.type === 'error').length}</span>
                    </div>
                </div>
            </div>

            <div className="bg-transparent md:bg-white/10 md:backdrop-blur-md md:p-3 md:rounded-xl md:shadow-lg md:border md:border-white/5 flex flex-col gap-2">
                <ShotSelector
                    pointType={pointType}
                    setPointType={setPointType}
                    shotType={shotType}
                    setShotType={setShotType}
                    hand={hand}
                    setHand={setHand}
                />

                <div className="mt-2 flex flex-col gap-2 md:hidden">
                    <button onClick={handleFinishMatch} className="w-full py-2 bg-emerald-500/20 text-emerald-200 text-xs font-bold uppercase rounded border border-emerald-500/20">Finalizar y Guardar</button>
                    <button onClick={undoLastPoint} className="w-full py-2 bg-white/5 text-white text-xs uppercase rounded">Deshacer Último</button>
                    <div className="flex gap-2">
                        <button onClick={handleResetMatch} className="flex-1 py-2 bg-red-500/10 text-red-300 text-xs uppercase rounded border border-red-500/10">Reiniciar</button>
                        <button onClick={() => setShowHistory(true)} className="flex-1 py-2 bg-white/5 text-white/50 text-xs uppercase rounded">Historial</button>
                        <button onClick={() => setShowHeatmap(!showHeatmap)} className="flex-1 py-2 bg-white/5 text-white/50 text-xs uppercase rounded">{showHeatmap ? 'Ocultar Heatmap' : 'Heatmap'}</button>
                    </div>
                </div>

                <div className="hidden md:flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
                    <button onClick={() => setShowHeatmap(!showHeatmap)} className="w-full py-1.5 px-3 text-xs uppercase border rounded border-white/30 text-white/50 hover:text-white">{showHeatmap ? 'Ocultar Heatmap' : 'Ver Heatmap'}</button>
                    <button onClick={undoLastPoint} className="w-full py-1.5 px-3 bg-white/10 text-white text-xs uppercase rounded">Deshacer</button>
                    <button onClick={handleFinishMatch} className="w-full py-2 px-3 bg-emerald-500/20 text-emerald-200 text-xs uppercase font-bold rounded border border-emerald-500/20">Finalizar y Guardar</button>
                    <div className="flex gap-2">
                        <button onClick={handleResetMatch} className="flex-1 py-1.5 bg-red-500/10 text-red-300 text-xs uppercase rounded border border-red-500/10">Reiniciar</button>
                        <button onClick={() => setShowHistory(true)} className="flex-1 py-1.5 bg-white/5 text-white/50 text-xs uppercase rounded">Historial</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
