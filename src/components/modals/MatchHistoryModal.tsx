import { useState } from 'react';

interface Match {
    id: string;
    date: string;
    score: any;
    points: any[];
}

interface MatchHistoryModalProps {
    show: boolean;
    onClose: () => void;
    matches: Match[];
    deleteMatch: (id: string) => void;
    teamNames: { us: string; them: string };
}

export const MatchHistoryModal = ({ show, onClose, matches, deleteMatch, teamNames }: MatchHistoryModalProps) => {
    const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

    if (!show) return null;

    const getAggregatedStats = (points: any[]) => {
        const stats: Record<string, { winners: number, errors: number }> = {};
        points.forEach(p => {
            const shot = p.shotType || 'Sin definir';
            if (!stats[shot]) stats[shot] = { winners: 0, errors: 0 };
            if (p.type === 'winner') stats[shot].winners++;
            if (p.type === 'error') stats[shot].errors++;
        });
        return stats;
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-neutral-800 w-full max-w-md max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-white font-bold text-lg">Historial de Partidos</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {matches.length === 0 ? (
                        <p className="text-white/30 text-center py-8">No hay partidos guardados</p>
                    ) : (
                        matches.map(m => {
                            const stats = getAggregatedStats(m.points);
                            const isExpanded = expandedMatchId === m.id;
                            const mTeamNames = (m as any).score?.teamNames || teamNames;

                            return (
                                <div key={m.id} className="bg-white/5 rounded-lg border border-white/5 flex flex-col overflow-hidden transition-all">
                                    <div className="p-3 flex flex-col gap-2 cursor-pointer hover:bg-white/5 transition" onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}>
                                        <div className="flex justify-between items-center text-xs text-white/50">
                                            <span>{new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <button onClick={(e) => { e.stopPropagation(); deleteMatch(m.id); }} className="text-red-500 hover:text-red-400 px-2 py-1 bg-red-500/10 rounded">Eliminar</button>
                                        </div>

                                        <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                                            <div className="flex flex-col items-center w-1/3">
                                                <span className="text-blue-400 font-bold text-lg">{m.score.sets.reduce((acc: number, s: any) => acc + (s.us > s.them ? 1 : 0), 0) + (m.score.currentSet.us > 6 || (m.score.currentSet.us === 6 && m.score.currentSet.them < 5) ? 1 : 0)} sets</span>
                                                <span className="text-[10px] text-white/50 uppercase truncate max-w-full text-center">{mTeamNames.us}</span>
                                            </div>
                                            <div className="text-white/30 font-mono text-sm">VS</div>
                                            <div className="flex flex-col items-center w-1/3">
                                                <span className="text-red-400 font-bold text-lg">{m.score.sets.reduce((acc: number, s: any) => acc + (s.them > s.us ? 1 : 0), 0) + (m.score.currentSet.them > 6 || (m.score.currentSet.them === 6 && m.score.currentSet.us < 5) ? 1 : 0)} sets</span>
                                                <span className="text-[10px] text-white/50 uppercase truncate max-w-full text-center">{mTeamNames.them}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center text-xs">
                                            <div className="flex gap-2">
                                                <span className="text-emerald-400 font-bold">{m.points.filter((p: any) => p.type === 'winner').length} W</span>
                                                <span className="text-white/20">|</span>
                                                <span className="text-red-400 font-bold">{m.points.filter((p: any) => p.type === 'error').length} E</span>
                                            </div>
                                            <span className="text-white/40">{isExpanded ? '▲ Menos Detalle' : '▼ Ver Estadísticas'}</span>
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="bg-black/20 p-3 pt-0 text-sm border-t border-white/5">
                                            <h4 className="text-white/60 text-xs uppercase font-bold mt-3 mb-2">Desglose por Golpe</h4>
                                            <div className="space-y-1">
                                                {Object.entries(stats).map(([shot, counts]) => (
                                                    <div key={shot} className="flex justify-between items-center p-1 hover:bg-white/5 rounded">
                                                        <span className="capitalize text-white/80">{shot === 'bole' ? 'Volea' : shot === 'bande' ? 'Bandeja' : shot}</span>
                                                        <div className="flex gap-3 font-mono text-xs">
                                                            <span className="text-emerald-400">{counts.winners} W</span>
                                                            <span className="text-red-400">{counts.errors} E</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <h4 className="text-white/60 text-xs uppercase font-bold mt-4 mb-2">Por Mano</h4>
                                            <div className="flex gap-4">
                                                <div className="flex-1 bg-white/5 p-2 rounded text-center">
                                                    <div className="text-xs text-white/50 mb-1">DRIVE</div>
                                                    <div className="flex justify-center gap-2 text-xs font-bold">
                                                        <span className="text-emerald-400">{m.points.filter((p: any) => p.hand === 'drive' && p.type === 'winner').length}</span>
                                                        <span className="text-white/20">/</span>
                                                        <span className="text-red-400">{m.points.filter((p: any) => p.hand === 'drive' && p.type === 'error').length}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 bg-white/5 p-2 rounded text-center">
                                                    <div className="text-xs text-white/50 mb-1">REVÉS</div>
                                                    <div className="flex justify-center gap-2 text-xs font-bold">
                                                        <span className="text-emerald-400">{m.points.filter((p: any) => p.hand === 'reves' && p.type === 'winner').length}</span>
                                                        <span className="text-white/20">/</span>
                                                        <span className="text-red-400">{m.points.filter((p: any) => p.hand === 'reves' && p.type === 'error').length}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
