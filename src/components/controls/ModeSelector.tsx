interface ModeSelectorProps {
    mode: 'stats' | 'tactics';
    setMode: (mode: 'stats' | 'tactics') => void;
}

export const ModeSelector = ({ mode, setMode }: ModeSelectorProps) => {
    return (
        <div className="flex gap-1 md:w-64">
            <button
                onClick={() => setMode('stats')}
                className={`flex-1 py-3 md:py-2 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'stats' ? 'bg-blue-600 text-white shadow' : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
            >
                STATS
            </button>
            <button
                onClick={() => setMode('tactics')}
                className={`flex-1 py-3 md:py-2 px-4 rounded-lg text-sm font-bold transition-all ${mode === 'tactics' ? 'bg-purple-600 text-white shadow' : 'bg-white/5 text-white/50 hover:text-white'
                    }`}
            >
                COACH
            </button>
        </div>
    );
};
