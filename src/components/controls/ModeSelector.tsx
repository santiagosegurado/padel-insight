interface ModeSelectorProps {
    mode: 'stats' | 'tactics' | 'training';
    setMode: (mode: 'stats' | 'tactics' | 'training') => void;
}

export const ModeSelector = ({ mode, setMode }: ModeSelectorProps) => {
    return (
        <div className="grid grid-cols-2 gap-1 md:w-64">
            <button
                onClick={() => setMode('stats')}
                className={`py-3 md:py-2 px-2 rounded-lg text-xs md:text-sm font-bold transition-all ${mode === 'stats' ? 'bg-blue-600 text-white shadow' : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
            >
                STATS
            </button>
            {/* COACH MODE - Comentado temporalmente */}
            {/* <button
                onClick={() => setMode('tactics')}
                className={`py-3 md:py-2 px-2 rounded-lg text-xs md:text-sm font-bold transition-all ${mode === 'tactics' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
            >
                COACH
            </button> */}
            <button
                onClick={() => setMode('training')}
                className={`py-3 md:py-2 px-2 rounded-lg text-xs md:text-sm font-bold transition-all ${mode === 'training' ? 'bg-emerald-600 text-white shadow' : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
            >
                TRAIN
            </button>
        </div>
    );
};
