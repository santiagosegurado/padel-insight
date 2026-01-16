interface TacticsControlsProps {
    dimensions: { width: number; height: number };
    setTokens: (fn: (prev: any[]) => any[]) => void;
}

export const TacticsControls = ({ dimensions, setTokens }: TacticsControlsProps) => {
    return (
        <div className="bg-transparent md:bg-white/10 md:backdrop-blur-md md:p-3 md:rounded-xl md:shadow-lg md:border md:border-white/5 md:w-64">
            <div className="text-white">
                <p className="text-sm font-bold mb-2">Panel Táctico</p>
                <p className="text-xs text-white/60 mb-3">Arrastra fichas. (Stats pausadas)</p>
                <button
                    onClick={() => setTokens(prev => prev.map((t, i) => ({
                        ...t,
                        x: (dimensions.width / 2) + (i * 40) - 80,
                        y: dimensions.height / 2
                    })))}
                    className="w-full py-2 bg-white/10 rounded text-xs uppercase font-bold hover:bg-white/20"
                >
                    Reset Fichas
                </button>
            </div>
        </div>
    );
};
