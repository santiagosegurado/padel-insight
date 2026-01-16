import { useState } from 'react';

interface TrainingSession {
    id: string;
    date: string;
    startTime: string;
    endTime?: string;
    points: any[];
    duration?: number;
}

interface TrainingHistoryModalProps {
    show: boolean;
    onClose: () => void;
    trainingSessions: TrainingSession[];
    deleteTrainingSession: (id: string) => void;
}

export const TrainingHistoryModal = ({
    show,
    onClose,
    trainingSessions,
    deleteTrainingSession
}: TrainingHistoryModalProps) => {
    const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

    if (!show) return null;

    // Agrupar sesiones por fecha
    const groupedByDate = trainingSessions.reduce((acc, session) => {
        const date = session.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(session);
        return acc;
    }, {} as Record<string, TrainingSession[]>);

    const formatDuration = (startTime: string, endTime?: string) => {
        if (!endTime) return 'En progreso';
        const start = new Date(startTime).getTime();
        const end = new Date(endTime).getTime();
        const minutes = Math.floor((end - start) / 60000);
        return `${minutes} min`;
    };

    const getSessionStats = (sessions: TrainingSession[]) => {
        const allPoints = sessions.flatMap(s => s.points);
        const winners = allPoints.filter(p => p.type === 'winner').length;
        const errors = allPoints.filter(p => p.type === 'error').length;

        // Agrupar por tipo de golpe
        const byType: Record<string, number> = {};
        allPoints.forEach(p => {
            const type = p.shotType || 'Sin definir';
            byType[type] = (byType[type] || 0) + 1;
        });

        // Separar winners y errors por tipo
        const winnersByType: Record<string, number> = {};
        const errorsByType: Record<string, number> = {};

        allPoints.forEach(p => {
            const type = p.shotType || 'Sin definir';
            if (p.type === 'winner') {
                winnersByType[type] = (winnersByType[type] || 0) + 1;
            } else if (p.type === 'error') {
                errorsByType[type] = (errorsByType[type] || 0) + 1;
            }
        });

        return { total: allPoints.length, winners, errors, byType, winnersByType, errorsByType };
    };

    const getTotalDuration = (sessions: TrainingSession[]) => {
        // Si todas las sesiones tienen duración manual, sumar esas
        const manualDurations = sessions.filter(s => s.duration).map(s => s.duration!);
        if (manualDurations.length === sessions.length) {
            return manualDurations.reduce((sum, d) => sum + d, 0);
        }

        // Si no, calcular desde tiempos
        return sessions.reduce((total, s) => {
            if (s.duration) return total + s.duration; // Usar manual si existe
            const start = new Date(s.startTime).getTime();
            const end = s.endTime ? new Date(s.endTime).getTime() : Date.now();
            return total + Math.floor((end - start) / 60000);
        }, 0);
    };

    return (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-neutral-800 w-full max-w-md max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-white font-bold text-lg">Historial de Entrenamientos</h2>
                    <button onClick={onClose} className="text-white/50 hover:text-white">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {Object.keys(groupedByDate).length === 0 ? (
                        <p className="text-white/30 text-center py-8">No hay sesiones guardadas</p>
                    ) : (
                        Object.entries(groupedByDate)
                            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                            .map(([date, sessions]) => {
                                const isExpanded = expandedSessionId === date;
                                const stats = getSessionStats(sessions);
                                const totalDuration = getTotalDuration(sessions);
                                const formattedDate = new Date(date).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                });

                                return (
                                    <div key={date} className="bg-white/5 rounded-lg border border-white/5 flex flex-col overflow-hidden transition-all">
                                        <div
                                            className="p-3 flex flex-col gap-2 cursor-pointer hover:bg-white/5 transition"
                                            onClick={() => setExpandedSessionId(isExpanded ? null : date)}
                                        >
                                            <div className="flex justify-between items-center text-xs text-white/50">
                                                <span>{formattedDate}</span>
                                                <span>{sessions.length} sesión{sessions.length > 1 ? 'es' : ''}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold text-lg">{stats.total} golpes</span>
                                                    <span className="text-white/40 text-xs">
                                                        <span className="text-emerald-400">{stats.winners} W</span>
                                                        {' / '}
                                                        <span className="text-red-400">{stats.errors} E</span>
                                                        {' • '}
                                                        {totalDuration} min
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="text-xs text-white/40">
                                                {isExpanded ? '▲ Menos detalle' : '▼ Ver estadísticas'}
                                            </div>
                                        </div>

                                        {isExpanded && (
                                            <div className="bg-black/20 p-3 pt-0 text-sm border-t border-white/5">
                                                {/* Winners por tipo */}
                                                <h4 className="text-white/60 text-xs uppercase font-bold mt-3 mb-2">✅ Winners por Tipo</h4>
                                                <div className="space-y-1 mb-4">
                                                    {Object.keys(stats.winnersByType).length > 0 ? (
                                                        Object.entries(stats.winnersByType)
                                                            .sort(([, a], [, b]) => b - a)
                                                            .map(([shotType, count]) => {
                                                                const label = shotType === 'bole' ? 'Volea' : shotType === 'bande' ? 'Bandeja' : shotType;
                                                                return (
                                                                    <div key={shotType} className="flex justify-between items-center p-1 hover:bg-white/5 rounded">
                                                                        <span className="capitalize text-white/80">{label}</span>
                                                                        <span className="text-emerald-400 font-mono text-xs">{count}</span>
                                                                    </div>
                                                                );
                                                            })
                                                    ) : (
                                                        <p className="text-white/30 text-xs py-2">No hay winners registrados</p>
                                                    )}
                                                </div>

                                                {/* Errores por tipo */}
                                                <h4 className="text-white/60 text-xs uppercase font-bold mb-2">❌ Errores por Tipo</h4>
                                                <div className="space-y-1">
                                                    {Object.keys(stats.errorsByType).length > 0 ? (
                                                        Object.entries(stats.errorsByType)
                                                            .sort(([, a], [, b]) => b - a)
                                                            .map(([shotType, count]) => {
                                                                const label = shotType === 'bole' ? 'Volea' : shotType === 'bande' ? 'Bandeja' : shotType;
                                                                return (
                                                                    <div key={shotType} className="flex justify-between items-center p-1 hover:bg-white/5 rounded">
                                                                        <span className="capitalize text-white/80">{label}</span>
                                                                        <span className="text-red-400 font-mono text-xs">{count}</span>
                                                                    </div>
                                                                );
                                                            })
                                                    ) : (
                                                        <p className="text-white/30 text-xs py-2">No hay errores registrados</p>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 mt-4">
                                                    {sessions.map((session, idx) => (
                                                        <button
                                                            key={session.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`¿Eliminar sesión ${idx + 1}?`)) {
                                                                    deleteTrainingSession(session.id);
                                                                    if (sessions.length === 1) {
                                                                        setExpandedSessionId(null);
                                                                    }
                                                                }
                                                            }}
                                                            className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-xs transition"
                                                        >
                                                            Eliminar sesión {idx + 1}
                                                        </button>
                                                    ))}
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
