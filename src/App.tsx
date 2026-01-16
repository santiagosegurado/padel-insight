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
import { ModeSelector } from './components/controls/ModeSelector';
import { StatsControls } from './components/controls/StatsControls';
import { TacticsControls } from './components/controls/TacticsControls';

function App() {
  const dimensions = useDimensions();
  const [pointType, setPointType] = useState<'winner' | 'error'>('error');
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [mode, setMode] = useState<'stats' | 'tactics'>('stats');
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
    setServingTeam
  } = useMatchStore();

  const { handleFinishMatch, handleResetMatch } = useMatchControls();

  const [showHistory, setShowHistory] = useState(false);
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
      addPoint({
        x: pointerPosition.x,
        y: pointerPosition.y,
        type: pointType,
        player: 'me',
        shotType: shotType as any,
        hand: hand as any
      });

      if (pointType === 'winner') incrementScore('us');
      if (pointType === 'error') incrementScore('them');
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
      </div>

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
    </div>
  );
}

export default App;
