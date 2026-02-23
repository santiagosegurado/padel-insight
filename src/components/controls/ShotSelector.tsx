interface ShotSelectorProps {
    pointType: 'winner' | 'error';
    setPointType: (type: 'winner' | 'error') => void;
    shotType: string;
    setShotType: (type: string) => void;
    hand: string;
    setHand: (hand: string) => void;
    mode?: 'stats' | 'tactics' | 'training';
}

const SHOT_TYPES = ['saque', 'resto', 'fondo', 'bole', 'bande', 'globo', 'smash'];
const SHOT_LABELS: Record<string, string> = {
    bole: 'Volea',
    bande: 'Band'
};

export const ShotSelector = ({
    pointType,
    setPointType,
    shotType,
    setShotType,
    hand,
    setHand,
    mode = 'stats'
}: ShotSelectorProps) => {
    const isTrainingMode = mode === 'training';
    const positiveLabel = isTrainingMode ? 'Aciertos' : 'Winner';
    const negativeLabel = isTrainingMode ? 'Errores' : 'Error';

    return (
        <div className="flex flex-col gap-2">
            <div className="flex bg-black/20 p-1 rounded-lg">
                <button
                    onClick={() => setPointType('winner')}
                    className={`flex-1 py-3 md:py-1 px-3 rounded-md text-sm font-medium transition-all ${pointType === 'winner'
                            ? 'bg-emerald-500 text-white shadow'
                            : 'text-white/60 hover:text-white'
                        }`}
                >
                    {positiveLabel}
                </button>
                <button
                    onClick={() => setPointType('error')}
                    className={`flex-1 py-3 md:py-1 px-3 rounded-md text-sm font-medium transition-all ${pointType === 'error'
                            ? 'bg-red-500 text-white shadow'
                            : 'text-white/60 hover:text-white'
                        }`}
                >
                    {negativeLabel}
                </button>
            </div>

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

            <div className="grid grid-cols-4 md:grid-cols-3 gap-1">
                {SHOT_TYPES.map((st) => (
                    <button
                        key={st}
                        onClick={() => setShotType(st)}
                        className={`py-2 md:py-1 px-1 text-[10px] md:text-[10px] uppercase font-semibold rounded border transition-all ${shotType === st
                                ? 'bg-blue-500/30 border-blue-500 text-blue-200'
                                : 'bg-transparent border-white/5 text-white/40 hover:bg-white/5'
                            }`}
                    >
                        {SHOT_LABELS[st] || st}
                    </button>
                ))}
            </div>
        </div>
    );
};
