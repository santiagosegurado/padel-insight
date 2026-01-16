interface ScoreboardProps {
    score: any;
    teamNames: { us: string; them: string };
    servingTeam: 'us' | 'them';
    toggleServe: () => void;
    incrementScore: (team: 'us' | 'them') => void;
    decrementScore: (team: 'us' | 'them') => void;
    onEditNames: () => void;
    showUI: boolean;
}

export const Scoreboard = ({
    score,
    teamNames,
    servingTeam,
    toggleServe,
    incrementScore,
    decrementScore,
    onEditNames,
    showUI
}: ScoreboardProps) => {
    return (
        <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md px-2 py-2 rounded-xl border border-white/5 text-white shadow-lg flex justify-between items-center gap-4 transition-all duration-500 ease-in-out ${showUI ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0'}`}
            onClick={onEditNames}
            title="Click para editar nombres"
        >
            <div className="flex items-center gap-2 text-white/50 text-xs font-mono border-r border-white/10 pr-3">
                {score.sets.map((s: any, i: number) => (
                    <div key={i} className="flex flex-col leading-none">
                        <span>{s.us}</span>
                        <span>{s.them}</span>
                    </div>
                ))}
                {score.sets.length === 0 && <span className="opacity-50">SET 1</span>}
            </div>

            <div className="flex flex-col items-center justify-center font-bold text-lg leading-none min-w-[4rem]"
                onClick={(e) => { e.stopPropagation(); onEditNames(); }}
            >
                <span className="text-blue-400">{score.currentSet.us}</span>
                <span className="text-[10px] text-blue-300 font-semibold uppercase truncate max-w-[6rem] leading-tight">{teamNames.us}</span>
                <div className="h-4 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleServe(); }}>
                    {servingTeam === 'us' && <span className="text-xs filter drop-shadow-[0_0_2px_rgba(255,255,0,0.8)]">🥎</span>}
                </div>
            </div>

            <div className="text-white/20 text-xs py-1">-</div>

            <div className="flex flex-col items-center justify-center font-bold text-lg leading-none min-w-[4rem]"
                onClick={(e) => { e.stopPropagation(); onEditNames(); }}
            >
                <span className="text-red-400">{score.currentSet.them}</span>
                <span className="text-[10px] text-red-300 font-semibold uppercase truncate max-w-[6rem] leading-tight">{teamNames.them}</span>
                <div className="h-4 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleServe(); }}>
                    {servingTeam === 'them' && <span className="text-xs filter drop-shadow-[0_0_2px_rgba(255,255,0,0.8)]">🥎</span>}
                </div>
            </div>

            {/* Points with Manual Controls */}
            <div className="flex items-center gap-2 ml-2 bg-white/10 rounded px-2 py-1" onClick={(e) => e.stopPropagation()}>
                {/* Us Points */}
                <div className="flex flex-col items-center gap-0.5">
                    <button
                        onClick={() => incrementScore('us')}
                        className="w-full h-3 flex items-center justify-center bg-white/5 hover:bg-white/20 rounded-t text-[8px] text-emerald-400"
                    >▲</button>
                    <span className="text-blue-500 font-black text-2xl leading-none min-w-[1.5rem] text-center">{score.points.us}</span>
                    <button
                        onClick={() => decrementScore('us')}
                        className="w-full h-3 flex items-center justify-center bg-white/5 hover:bg-white/20 rounded-b text-[8px] text-red-400"
                    >▼</button>
                </div>

                <span className="text-white/10 text-xl">:</span>

                {/* Them Points */}
                <div className="flex flex-col items-center gap-0.5">
                    <button
                        onClick={() => incrementScore('them')}
                        className="w-full h-3 flex items-center justify-center bg-white/5 hover:bg-white/20 rounded-t text-[8px] text-emerald-400"
                    >▲</button>
                    <span className="text-red-500 font-black text-2xl leading-none min-w-[1.5rem] text-center">{score.points.them}</span>
                    <button
                        onClick={() => decrementScore('them')}
                        className="w-full h-3 flex items-center justify-center bg-white/5 hover:bg-white/20 rounded-b text-[8px] text-red-400"
                    >▼</button>
                </div>
            </div>
        </div>
    );
};
