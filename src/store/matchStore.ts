import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ShotType = 'resto' | 'fondo' | 'volea' | 'bandeja' | 'saque' | 'globo' | 'smash';
export type Hand = 'drive' | 'reves';

interface Point {
    x: number;
    y: number;
    type: 'winner' | 'error';
    player: 'me' | 'partner' | 'opponent';
    shotType?: ShotType;
    hand?: Hand;
}

interface Score {
    sets: { us: number; them: number }[];
    currentSet: { us: number; them: number };
    points: { us: string; them: string };
}

interface SavedMatch {
    id: string;
    date: string;
    score: Score;
    points: Point[];
}

interface TrainingSession {
    id: string;
    date: string;        // YYYY-MM-DD para agrupar por día
    startTime: string;   // ISO timestamp de inicio
    endTime?: string;    // ISO timestamp de fin
    points: Point[];     // Mismos puntos que en partido
    duration?: number;   // Duración en minutos (manual)
}

interface MatchState {
    points: Point[];
    score: Score;
    teamNames: { us: string; them: string };
    servingTeam: 'us' | 'them';
    matches: SavedMatch[];
    // Training
    trainingSessions: TrainingSession[];
    trainingPoints: Point[];
    trainingStartTime: string;
    addPoint: (point: Point) => void;
    incrementScore: (winner: 'us' | 'them') => void;
    decrementScore: (team: 'us' | 'them') => void;
    undoLastPoint: () => void;
    finishMatch: () => void;
    resetMatch: () => void;
    deleteMatch: (id: string) => void;
    setTeamNames: (names: { us: string; them: string }) => void;
    toggleServe: () => void;
    setServingTeam: (team: 'us' | 'them') => void;
    // Training actions
    addTrainingPoint: (point: Point) => void;
    saveTrainingSession: (duration?: number) => void;
    clearTrainingSession: () => void;
    deleteTrainingSession: (id: string) => void;
    undoLastTrainingPoint: () => void;
}

const POINTS_SEQUENCE = ["0", "15", "30", "40"];
const getInitialScore = (): Score => ({
    sets: [],
    currentSet: { us: 0, them: 0 },
    points: { us: "0", them: "0" }
});

export const useMatchStore = create<MatchState>()(
    persist(
        (set) => ({
            points: [],
            score: getInitialScore(),
            teamNames: { us: 'Nosotros', them: 'Ellos' },
            servingTeam: 'us',
            matches: [],
            // Training
            trainingSessions: [],
            trainingPoints: [],
            trainingStartTime: new Date().toISOString(),

            addPoint: (point) => set((state) => ({ points: [...state.points, point] })),

            incrementScore: (winner) => set((state) => {
                const score = {
                    ...state.score,
                    currentSet: { ...state.score.currentSet },
                    points: { ...state.score.points }
                };

                const currentPoints = score.points;
                const opponent = winner === 'us' ? 'them' : 'us';
                let newServingTeam = state.servingTeam;

                // Golden Point Logic (No Ad)
                if (currentPoints[winner] === "40") {
                    // Won the Game
                    score.points = { us: "0", them: "0" };
                    score.currentSet[winner]++;

                    // Switch Serve
                    newServingTeam = newServingTeam === 'us' ? 'them' : 'us';

                    // MVP Simplified Set Win: First to 6
                    if (score.currentSet[winner] >= 6 && score.currentSet[winner] - score.currentSet[opponent] >= 2) {
                        score.sets = [...score.sets, { ...score.currentSet }];
                        score.currentSet = { us: 0, them: 0 };
                    }
                } else {
                    // Normal Point Increment
                    const currentIndex = POINTS_SEQUENCE.indexOf(currentPoints[winner]);
                    score.points[winner] = POINTS_SEQUENCE[currentIndex + 1];
                }

                return { score, servingTeam: newServingTeam };
            }),

            decrementScore: (team) => set((state) => {
                const score = {
                    ...state.score,
                    points: { ...state.score.points }
                };
                const currentPoint = score.points[team];
                const index = POINTS_SEQUENCE.indexOf(currentPoint);

                if (index > 0) {
                    score.points[team] = POINTS_SEQUENCE[index - 1];
                }

                return { score };
            }),

            undoLastPoint: () => set((state) => ({ points: state.points.slice(0, -1) })),

            finishMatch: () => set((state) => {
                const newMatch: SavedMatch = {
                    id: crypto.randomUUID(),
                    date: new Date().toISOString(),
                    score: state.score,
                    points: state.points
                };

                return {
                    matches: [newMatch, ...state.matches],
                    points: [],
                    score: getInitialScore()
                };
            }),

            resetMatch: () => set({ points: [], score: getInitialScore() }),

            deleteMatch: (id) => set((state) => ({ matches: state.matches.filter(m => m.id !== id) })),

            setTeamNames: (names) => set({ teamNames: names }),

            toggleServe: () => set((state) => ({ servingTeam: state.servingTeam === 'us' ? 'them' : 'us' })),

            setServingTeam: (team) => set({ servingTeam: team }),

            // Training actions
            addTrainingPoint: (point) => set((state) => ({
                trainingPoints: [...state.trainingPoints, point]
            })),

            saveTrainingSession: (duration) => set((state) => {
                if (state.trainingPoints.length === 0) return state;

                const now = new Date();
                const dateOnly = now.toISOString().split('T')[0]; // YYYY-MM-DD

                const newSession: TrainingSession = {
                    id: crypto.randomUUID(),
                    date: dateOnly,
                    startTime: state.trainingStartTime,
                    endTime: now.toISOString(),
                    points: state.trainingPoints,
                    duration: duration
                };

                return {
                    trainingSessions: [newSession, ...state.trainingSessions],
                    trainingPoints: [],
                    trainingStartTime: new Date().toISOString()
                };
            }),

            clearTrainingSession: () => set({
                trainingPoints: [],
                trainingStartTime: new Date().toISOString()
            }),

            deleteTrainingSession: (id) => set((state) => ({
                trainingSessions: state.trainingSessions.filter(s => s.id !== id)
            })),

            undoLastTrainingPoint: () => set((state) => ({
                trainingPoints: state.trainingPoints.slice(0, -1)
            }))
        }),
        {
            name: 'padel-insight-storage', // unique name
        }
    )
);

