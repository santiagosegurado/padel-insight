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
    points: any[];
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
            {/* Desktop Only Title/Stats */}
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
                <div className="flex bg-black/20 p-1 rounded-lg">
                    <button
                        onClick={() => setPointType('winner')}
                        className={`flex-1 py-3 md:py-1 px-3 rounded-md text-sm font-medium transition-all ${pointType === 'winner'
                                ? 'bg-emerald-500 text-white shadow'
                                : 'text-white/60 hover:text-white'
                            }`}
                    >
                        Winner
                    </button>
                    <button
                        onClick={() => setPointType('error')}
                        className={`flex-1 py-3 md:py-1 px-3 rounded-md text-sm font-medium transition-all ${pointType === 'error'
                                ? 'bg-red-500 text-white shadow'
                                : 'text-white/60 hover:text-white'
                            }`}
                    >
                        Error
                    </button>
                </div>

                {/* Detailed Stats Selectors */}
                <div className="flex flex-col gap-2 mt-1">
                    {/* Hand */}
                    <div className="flex bg-black/20 p-0.5 rounded-lg">
                        {['drive', 'reves'].map((h) => (
                            <button
                                key={h}
                                onClick={() => setHand(h)}
                                className={`flex-1 py-2 md:py-1 text-xs uppercase font-bold rounded transition-all ${hand === h ? 'bg-white/20 text-white shadow' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {h}
                            </button>
                        ))}
                    </div>
                    {/* Shot Type */}
                    <div className="grid grid-cols-4 md:grid-cols-3 gap-1">
                        {['saque', 'resto', 'fondo', 'bole', 'bande', 'globo', 'smash'].map((st) => (
                            <button
                                key={st}
                                onClick={() => setShotType(st)}
                                className={`py-2 md:py-1 px-1 text-[10px] md:text-[10px] uppercase font-semibold rounded border transition-all ${shotType === st
                                        ? 'bg-blue-500/30 border-blue-500 text-blue-200'
                                        : 'bg-transparent border-white/5 text-white/40 hover:bg-white/5'
                                    }`}
                            >
                                {st === 'bole' ? 'Volea' : st === 'bande' ? 'Band' : st}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                    <button onClick={undoLastPoint} className="md:hidden w-full py-2 bg-white/5 rounded text-xs text-white/50">Deshacer Último</button>
                    <div className="flex gap-2 md:hidden">
                        <button onClick={() => setShowHistory(true)} className="flex-1 py-2 bg-white/5 rounded text-xs text-white/50">Historial</button>
                        <button onClick={() => setShowHeatmap(!showHeatmap)} className="flex-1 py-2 bg-white/5 rounded text-xs text-white/50">{showHeatmap ? 'Ocultar Heatmap' : 'Ver Heatmap'}</button>
                    </div>
                </div>

                {/* Desktop Buttons (Hidden on Mobile to use the compact layout above) */}
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
