import { useState, useEffect } from 'react';
import TacticalCourt from './components/TacticalCourt';
import { useMatchStore } from './store/matchStore';
import { useDimensions } from './hooks/useDimensions';
import { useMatchControls } from './hooks/useMatchControls';
import { UIToggleButton } from './components/ui/UIToggleButton';
import { Scoreboard } from './components/ui/Scoreboard';
import { CoinTossModal } from './components/modals/CoinTossModal';
import { TeamNameEditModal } from './components/modals/TeamNameEditModal';
import { MatchHistoryModal } from './components/modals/MatchHistoryModal';
import { TrainingHistoryModal } from './components/modals/TrainingHistoryModal';
import { ModeSelector } from './components/controls/ModeSelector';
import { StatsControls } from './components/controls/StatsControls';
import { TacticsControls } from './components/controls/TacticsControls';

function App() {
  const dimensions = useDimensions();
  const [pointType, setPointType] = useState<'winner' | 'error'>('error');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mode, setMode] = useState<'stats' | 'tactics' | 'training'>('stats');
  const [shotType, setShotType] = useState<string>('fondo');
  const [hand, setHand] = useState<string>('drive');

  const {
    points,
    score,
    matches,
    teamNames,
    setTeamNames,
    addPoint,
    incrementScore,
    decrementScore,
    undoLastPoint,
    deleteMatch,
    servingTeam,
    toggleServe,
    setServingTeam,
    // Training
    trainingSessions,
    trainingPoints,
    addTrainingPoint,
    saveTrainingSession,
    clearTrainingSession,
    deleteTrainingSession,
    undoLastTrainingPoint
  } = useMatchStore();

  const { handleFinishMatch, handleResetMatch } = useMatchControls();

  const [showHistory, setShowHistory] = useState(false);
  const [showTrainingHistory, setShowTrainingHistory] = useState(false);
  const [showUI, setShowUI] = useState(true);
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [editingNames, setEditingNames] = useState(false);

  const [tokens, setTokens] = useState([
    { id: 'p1', x: 0, y: 0, color: '#3b82f6', label: 'A1' },
    { id: 'p2', x: 0, y: 0, color: '#3b82f6', label: 'A2' },
    { id: 'p3', x: 0, y: 0, color: '#ef4444', label: 'B1' },
    { id: 'p4', x: 0, y: 0, color: '#ef4444', label: 'B2' },
    { id: 'ball', x: 0, y: 0, color: '#facc15', radius: 6 },
  ]);

  useEffect(() => {
    const cx = dimensions.width / 2;
    const cy = dimensions.height / 2;
    setTokens(prev => prev.map((t, i) => {
      if (t.x === 0 && t.y === 0) {
        return { ...t, x: cx + (i * 40) - 80, y: cy };
      }
      return t;
    }));
  }, [dimensions]);

  const handleCourtClick = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition) {
      const point = {
        x: pointerPosition.x,
        y: pointerPosition.y,
        type: pointType,
        player: 'me' as const,
        shotType: shotType as any,
        hand: hand as any
      };

      if (mode === 'training') {
        // Modo entrenamiento: solo agregar punto sin score
        console.log('🎾 Agregando punto training:', point);
        addTrainingPoint(point);
        console.log('📊 Training points actuales:', trainingPoints.length + 1);
      } else {
        // Modo stats: agregar punto y actualizar score
        addPoint(point);
        if (pointType === 'winner') incrementScore('us');
        if (pointType === 'error') incrementScore('them');
      }
    }
  };

  const handleTokenDragEnd = (id: string, x: number, y: number) => {
    setTokens(prev => prev.map(t => t.id === id ? { ...t, x, y } : t));
  };

  const onFinishMatch = () => {
    if (handleFinishMatch()) {
      setMode('stats');
    }
  };

  const onResetMatch = () => {
    if (handleResetMatch()) {
      setMode('stats');
    }
  };

  const onSaveTraining = () => {
    if (trainingPoints.length === 0) {
      alert('Registra al menos un golpe antes de guardar');
      return;
    }

    const durationInput = prompt('¿Cuántos minutos entrenaste?', '30');
    if (durationInput === null) return; // Usuario canceló

    const duration = parseInt(durationInput);
    if (isNaN(duration) || duration <= 0) {
      alert('Por favor ingresa un número válido de minutos');
      return;
    }

    saveTrainingSession(duration);
    alert(`Sesión guardada: ${trainingPoints.length} golpes en ${duration} minutos`);
  };

  const onClearTraining = () => {
    if (trainingPoints.length > 0 && confirm('¿Reiniciar sesión? Se perderán los golpes registrados.')) {
      clearTrainingSession();
    } else if (trainingPoints.length === 0) {
      clearTrainingSession();
    }
  };

  return (
    <div className="relative w-full h-screen bg-neutral-900 overflow-hidden font-sans">
      <UIToggleButton showUI={showUI} onToggle={() => setShowUI(!showUI)} />

      <CoinTossModal
        show={showCoinToss}
        onClose={() => setShowCoinToss(false)}
        teamNames={teamNames}
        setServingTeam={setServingTeam}
      />

      {!showCoinToss && score.sets.length === 0 && score.currentSet.us === 0 && score.currentSet.them === 0 && score.points.us === "0" && score.points.them === "0" && (
        <button
          onClick={() => setShowCoinToss(true)}
          className={`absolute top-[7.5rem] left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md hover:bg-yellow-400/20 transition-all ${showUI ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          Sorteo Saque 🪙
        </button>
      )}

      <TeamNameEditModal
        show={editingNames}
        onClose={() => setEditingNames(false)}
        teamNames={teamNames}
        setTeamNames={setTeamNames}
      />

      <MatchHistoryModal
        show={showHistory}
        onClose={() => setShowHistory(false)}
        matches={matches}
        deleteMatch={deleteMatch}
        teamNames={teamNames}
      />

      <TrainingHistoryModal
        show={showTrainingHistory}
        onClose={() => setShowTrainingHistory(false)}
        trainingSessions={trainingSessions}
        deleteTrainingSession={deleteTrainingSession}
      />

      {mode !== 'training' && (
        <Scoreboard
          score={score}
          teamNames={teamNames}
          servingTeam={servingTeam}
          toggleServe={toggleServe}
          incrementScore={incrementScore}
          decrementScore={decrementScore}
          onEditNames={() => setEditingNames(true)}
          showUI={showUI}
        />
      )}

      <div className={`fixed bottom-0 left-0 w-full md:absolute md:top-4 md:left-4 md:w-auto md:bottom-auto z-20 flex flex-col md:flex-col gap-3 p-4 md:p-0 bg-neutral-900/95 md:bg-transparent border-t md:border-none border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none pb-8 md:pb-0 safe-area-pb transition-all duration-500 ease-in-out ${showUI ? 'translate-y-0 md:translate-x-0 opacity-100' : 'translate-y-[120%] md:translate-x-[-120%] opacity-0'}`}>
        <ModeSelector mode={mode} setMode={setMode} />

        {mode === 'stats' && (
          <StatsControls
            pointType={pointType}
            setPointType={setPointType}
            shotType={shotType}
            setShotType={setShotType}
            hand={hand}
            setHand={setHand}
            showHeatmap={showHeatmap}
            setShowHeatmap={setShowHeatmap}
            undoLastPoint={undoLastPoint}
            handleFinishMatch={onFinishMatch}
            handleResetMatch={onResetMatch}
            setShowHistory={setShowHistory}
            teamNames={teamNames}
            points={points}
          />
        )}

        {mode === 'tactics' && (
          <TacticsControls dimensions={dimensions} setTokens={setTokens} />
        )}

        {mode === 'training' && (
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
              <button onClick={undoLastTrainingPoint} className="md:hidden w-full py-2 bg-white/5 rounded text-xs text-white/50">Deshacer Último</button>
              <div className="flex gap-2 md:hidden">
                <button onClick={() => setShowTrainingHistory(true)} className="flex-1 py-2 bg-white/5 rounded text-xs text-white/50">Historial</button>
                <button onClick={() => setShowHeatmap(!showHeatmap)} className="flex-1 py-2 bg-white/5 rounded text-xs text-white/50">{showHeatmap ? 'Ocultar Heatmap' : 'Ver Heatmap'}</button>
              </div>
            </div>

            {/* Desktop Buttons (Hidden on Mobile to use the compact layout above) */}
            <div className="hidden md:flex flex-col gap-2 mt-2 pt-2 border-t border-white/10">
              <button onClick={() => setShowHeatmap(!showHeatmap)} className="w-full py-1.5 px-3 text-xs uppercase border rounded border-white/30 text-white/50 hover:text-white">{showHeatmap ? 'Ocultar Heatmap' : 'Ver Heatmap'}</button>
              <button onClick={undoLastTrainingPoint} className="w-full py-1.5 px-3 bg-white/10 text-white text-xs uppercase rounded">Deshacer</button>
              <button onClick={onSaveTraining} className="w-full py-2 px-3 bg-emerald-500/20 text-emerald-200 text-xs uppercase font-bold rounded border border-emerald-500/20">Finalizar y Guardar</button>
              <div className="flex gap-2">
                <button onClick={onClearTraining} className="flex-1 py-1.5 bg-red-500/10 text-red-300 text-xs uppercase rounded border border-red-500/10">Reiniciar</button>
                <button onClick={() => setShowTrainingHistory(true)} className="flex-1 py-1.5 bg-white/5 text-white/50 text-xs uppercase rounded">Historial</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <TacticalCourt
        width={dimensions.width}
        height={dimensions.height}
        points={mode === 'training' ? trainingPoints : points}
        tokens={tokens}
        mode={mode}
        showHeatmap={showHeatmap}
        onCourtClick={mode !== 'tactics' ? handleCourtClick : undefined}
        onTokenDragEnd={handleTokenDragEnd}
      />
    </div>
  );
}

export default App;
