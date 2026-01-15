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

interface MatchState {
    points: Point[];
    score: Score;
    teamNames: { us: string; them: string };
    servingTeam: 'us' | 'them';
    matches: SavedMatch[]; // History
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

            setServingTeam: (team) => set({ servingTeam: team })
        }),
        {
            name: 'padel-insight-storage', // unique name
        }
    )
);

