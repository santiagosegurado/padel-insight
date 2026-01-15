import { useState, useEffect } from 'react';
import TacticalCourt from './components/TacticalCourt';
import { useMatchStore } from './store/matchStore';

function App() {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [pointType, setPointType] = useState<'winner' | 'error'>('error');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mode, setMode] = useState<'stats' | 'tactics'>('stats');

  // New State for Detailed Stats
  const [shotType, setShotType] = useState<string>('fondo'); // Default generic
  const [hand, setHand] = useState<string>('drive');

  const { points, score, matches, teamNames, setTeamNames, addPoint, incrementScore, decrementScore, undoLastPoint, finishMatch, deleteMatch, resetMatch, servingTeam, toggleServe, setServingTeam } = useMatchStore();

  const [showHistory, setShowHistory] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [coinSpinning, setCoinSpinning] = useState(false);
  const [editingNames, setEditingNames] = useState(false);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Initial Tokens Configuration
  const [tokens, setTokens] = useState([
    { id: 'p1', x: 0, y: 0, color: '#3b82f6', label: 'A1' }, // Player A1 (Blue)
    { id: 'p2', x: 0, y: 0, color: '#3b82f6', label: 'A2' }, // Player A2 (Blue)
    { id: 'p3', x: 0, y: 0, color: '#ef4444', label: 'B1' }, // Player B1 (Red)
    { id: 'p4', x: 0, y: 0, color: '#ef4444', label: 'B2' }, // Player B2 (Red)
    { id: 'ball', x: 0, y: 0, color: '#facc15', radius: 6 }, // Ball (Yellow)
  ]);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Center tokens on init/resize just for a reasonable starting point
  useEffect(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    setTokens(prev => prev.map((t, i) => {
      // If already moved from 0,0 keep it? For MVP let's reset on resize or first load if 0,0
      if (t.x === 0 && t.y === 0) {
        return { ...t, x: cx + (i * 40) - 80, y: cy };
      }
      return t;
    }));
  }, [dimensions]);

  const handleCourtClick = (e: any) => {
    // If clicking on court in heatmap mode, we still log points at precise location
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition) {
      // 1. Log Point Visual
      addPoint({
        x: pointerPosition.x,
        y: pointerPosition.y,
        type: pointType,
        player: 'me',
        shotType: shotType as any, // Cast to any or import type if available
        hand: hand as any
      });

      // 2. Update Score
      // Winner = Us, Error = Them
      if (pointType === 'winner') incrementScore('us');
      if (pointType === 'error') incrementScore('them');
    }
  };

  const handleTokenDragEnd = (id: string, x: number, y: number) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
  };

  // Helper to aggregate stats
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

  const handleFinishMatch = () => {
    if (confirm("¿Terminar partido y guardar estadísticas?")) {
      finishMatch();
      setMode('stats'); // Reset to stats mode
      alert("Partido guardado y nueva partida comenzada.");
    }
  };

  const handleResetMatch = () => {
    if (confirm("¿Estás seguro de reiniciar el partido actual? Se perderán los datos no guardados.")) {
      // We use the resetMatch from store (already imported but need to expose it if not)
      // Check if resetMatch is destructured from store
      // It wasn't in previous step, need to add it to destructuring
      resetMatch();
      setMode('stats');
    }
  };


  return (
    <div className="relative w-full h-screen bg-neutral-900 overflow-hidden font-sans">

      {/* UI Toggle Button */}
      <button
        onClick={() => setShowUI(!showUI)}
        className="absolute top-4 right-4 z-50 p-2 bg-white/10 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-white/20 transition shadow-lg border border-white/5"
        title={showUI ? "Ocultar Interfaz" : "Mostrar Interfaz"}
      >
        {showUI ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>

      {/* Coin Toss Modal */}
      {showCoinToss && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-neutral-800 w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6 text-center">
            <h3 className="text-white font-bold text-xl mb-6">Sorteo de Saque</h3>

            <div className="flex justify-center mb-8 relative h-24">
              <div className={`w-24 h-24 rounded-full border-4 border-yellow-400 flex items-center justify-center text-4xl bg-yellow-400/20 text-yellow-400 transition-all duration-[3000ms] ${coinSpinning ? 'animate-[spin_0.5s_linear_infinite]' : ''}`}>
                {coinSpinning ? '🪙' : '⚖️'}
              </div>
            </div>

            {!coinSpinning ? (
              <button
                onClick={() => {
                  setCoinSpinning(true);
                  setTimeout(() => {
                    setCoinSpinning(false);
                    const winner = Math.random() > 0.5 ? 'us' : 'them';
                    setServingTeam(winner);
                    setShowCoinToss(false);
                    alert(`¡Empiezan ${winner === 'us' ? teamNames.us : teamNames.them}!`);
                  }, 2000);
                }}
                className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition text-lg"
              >
                Lanzar Moneda
              </button>
            ) : (
              <p className="text-yellow-400 font-mono animate-pulse">Lanzando...</p>
            )}

            {!coinSpinning && (
              <button onClick={() => setShowCoinToss(false)} className="mt-4 text-white/50 text-sm hover:text-white">Cancelar</button>
            )}
          </div>
        </div>
      )}

      {/* Start Coin Toss Button (Only visible if 0-0 and no points) */}
      {!showCoinToss && score.sets.length === 0 && score.currentSet.us === 0 && score.currentSet.them === 0 && score.points.us === "0" && score.points.them === "0" && (
        <button
          onClick={() => setShowCoinToss(true)}
          className={`absolute top-[7.5rem] left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md hover:bg-yellow-400/20 transition-all ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          Sorteo Saque 🪙
        </button>
      )}

      {/* Name Edit Modal */}
      {editingNames && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-neutral-800 w-full max-w-sm rounded-2xl border border-white/10 shadow-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-4 text-center">Editar Nombres de Equipo</h3>
            <div className="space-y-4">
              <div>
                <label className="text-blue-400 text-xs font-bold uppercase block mb-1">Tu Pareja (Nosotros)</label>
                <input
                  type="text"
                  value={teamNames.us}
                  onChange={(e) => setTeamNames({ ...teamNames, us: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-red-400 text-xs font-bold uppercase block mb-1">Rivales (Ellos)</label>
                <input
                  type="text"
                  value={teamNames.them}
                  onChange={(e) => setTeamNames({ ...teamNames, them: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <button onClick={() => setEditingNames(false)} className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold transition">Guardar</button>
            </div>
          </div>
        </div>
      )
      }

      {/* History Modal */}
      {
        showHistory && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-neutral-800 w-full max-w-md max-h-[80vh] rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-white font-bold text-lg">Historial de Partidos</h2>
                <button onClick={() => setShowHistory(false)} className="text-white/50 hover:text-white">✕</button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {matches.length === 0 ? (
                  <p className="text-white/30 text-center py-8">No hay partidos guardados</p>
                ) : (
                  matches.map(m => {
                    const stats = getAggregatedStats(m.points);
                    const isExpanded = expandedMatchId === m.id;
                    // Handle legacy matches without teamNames
                    const mTeamNames = (m as any).score?.teamNames || teamNames; // Fallback to current if missing in history (TODO: Add to save match)

                    return (
                      <div key={m.id} className="bg-white/5 rounded-lg border border-white/5 flex flex-col overflow-hidden transition-all">
                        {/* Match Header Summary */}
                        <div className="p-3 flex flex-col gap-2 cursor-pointer hover:bg-white/5 transition" onClick={() => setExpandedMatchId(isExpanded ? null : m.id)}>
                          <div className="flex justify-between items-center text-xs text-white/50">
                            <span>{new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <button onClick={(e) => { e.stopPropagation(); deleteMatch(m.id); }} className="text-red-500 hover:text-red-400 px-2 py-1 bg-red-500/10 rounded">Eliminar</button>
                          </div>

                          <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                            <div className="flex flex-col items-center w-1/3">
                              <span className="text-blue-400 font-bold text-lg">{m.score.sets.reduce((acc, s) => acc + (s.us > s.them ? 1 : 0), 0) + (m.score.currentSet.us > 6 || (m.score.currentSet.us === 6 && m.score.currentSet.them < 5) ? 1 : 0)} sets</span>
                              <span className="text-[10px] text-white/50 uppercase truncate max-w-full text-center">{mTeamNames.us}</span>
                            </div>
                            <div className="text-white/30 font-mono text-sm">VS</div>
                            <div className="flex flex-col items-center w-1/3">
                              <span className="text-red-400 font-bold text-lg">{m.score.sets.reduce((acc, s) => acc + (s.them > s.us ? 1 : 0), 0) + (m.score.currentSet.them > 6 || (m.score.currentSet.them === 6 && m.score.currentSet.us < 5) ? 1 : 0)} sets</span>
                              <span className="text-[10px] text-white/50 uppercase truncate max-w-full text-center">{mTeamNames.them}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <div className="flex gap-2">
                              <span className="text-emerald-400 font-bold">{m.points.filter(p => p.type === 'winner').length} W</span>
                              <span className="text-white/20">|</span>
                              <span className="text-red-400 font-bold">{m.points.filter(p => p.type === 'error').length} E</span>
                            </div>
                            <span className="text-white/40">{isExpanded ? '▲ Menos Detalle' : '▼ Ver Estadísticas'}</span>
                          </div>
                        </div>

                        {/* Expanded Details */}
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

                            {/* Simple Hand Breakdown */}
                            <h4 className="text-white/60 text-xs uppercase font-bold mt-4 mb-2">Por Mano</h4>
                            <div className="flex gap-4">
                              <div className="flex-1 bg-white/5 p-2 rounded text-center">
                                <div className="text-xs text-white/50 mb-1">DRIVE</div>
                                <div className="flex justify-center gap-2 text-xs font-bold">
                                  <span className="text-emerald-400">{m.points.filter(p => p.hand === 'drive' && p.type === 'winner').length}</span>
                                  <span className="text-white/20">/</span>
                                  <span className="text-red-400">{m.points.filter(p => p.hand === 'drive' && p.type === 'error').length}</span>
                                </div>
                              </div>
                              <div className="flex-1 bg-white/5 p-2 rounded text-center">
                                <div className="text-xs text-white/50 mb-1">REVÉS</div>
                                <div className="flex justify-center gap-2 text-xs font-bold">
                                  <span className="text-emerald-400">{m.points.filter(p => p.hand === 'reves' && p.type === 'winner').length}</span>
                                  <span className="text-white/20">/</span>
                                  <span className="text-red-400">{m.points.filter(p => p.hand === 'reves' && p.type === 'error').length}</span>
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
        )
      }

      {/* HUD Layer */}
      {/* Scoreboard - Always Top */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-md px-2 py-2 rounded-xl border border-white/5 text-white shadow-lg flex justify-between items-center gap-4 transition-all duration-500 ease-in-out ${showUI ? 'translate-y-0 opacity-100' : '-translate-y-[200%] opacity-0'}`}
        onClick={() => setEditingNames(true)}
        title="Click para editar nombres"
      >
        <div className="flex items-center gap-2 text-white/50 text-xs font-mono border-r border-white/10 pr-3">
          {score.sets.map((s, i) => (
            <div key={i} className="flex flex-col leading-none">
              <span>{s.us}</span>
              <span>{s.them}</span>
            </div>
          ))}
          {score.sets.length === 0 && <span className="opacity-50">SET 1</span>}
        </div>
        <div className="flex flex-col items-center justify-center font-bold text-lg leading-none min-w-[4rem]"
          onClick={(e) => { e.stopPropagation(); setEditingNames(true); }}
        >
          <span className="text-blue-400">{score.currentSet.us}</span>
          <span className="text-[10px] text-blue-300 font-semibold uppercase truncate max-w-[6rem] leading-tight">{teamNames.us}</span>
          <div className="h-4 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleServe(); }}>
            {servingTeam === 'us' && <span className="text-xs filter drop-shadow-[0_0_2px_rgba(255,255,0,0.8)]">🥎</span>}
          </div>
        </div>
        <div className="text-white/20 text-xs py-1">-</div>
        <div className="flex flex-col items-center justify-center font-bold text-lg leading-none min-w-[4rem]"
          onClick={(e) => { e.stopPropagation(); setEditingNames(true); }}
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

      {/* Controls - Bottom on Mobile, Left on Desktop */}
      <div className={`fixed bottom-0 left-0 w-full md:absolute md:top-4 md:left-4 md:w-auto md:bottom-auto z-20 flex flex-col md:flex-col gap-3 p-4 md:p-0 bg-neutral-900/95 md:bg-transparent border-t md:border-none border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none pb-8 md:pb-0 safe-area-pb transition-all duration-500 ease-in-out ${showUI ? 'translate-y-0 md:translate-x-0 opacity-100' : 'translate-y-[120%] md:translate-x-[-120%] opacity-0'}`}>

        {/* Mode Switcher */}
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

        {/* Stats Controls */}
        {mode === 'stats' && (
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
                <div className="flex gap-2">
                  <button onClick={handleResetMatch} className="flex-1 py-2 bg-red-500/10 text-red-300 rounded text-xs font-bold border border-red-500/10">Reiniciar</button>
                  <button onClick={handleFinishMatch} className="flex-[2] py-2 bg-emerald-500/20 text-emerald-200 rounded text-xs font-bold border border-emerald-500/20">Finalizar</button>
                </div>
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
        )}

        {/* Tactics Controls Mobile/Desktop */}
        {mode === 'tactics' && (
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
        )}
      </div>

      {/* Tactic Board */}
      <TacticalCourt
        width={dimensions.width}
        height={dimensions.height}
        points={points}
        tokens={tokens}
        mode={mode}
        showHeatmap={showHeatmap}
        onCourtClick={handleCourtClick}
        onTokenDragEnd={handleTokenDragEnd}
      />
    </div >
  );
}
export default App;
