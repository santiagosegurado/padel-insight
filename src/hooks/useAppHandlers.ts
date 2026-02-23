import { useCallback } from 'react';
import type { Point, ShotType, Hand } from '../store/matchStore';

interface UseAppHandlersProps {
    mode: 'stats' | 'tactics' | 'training';
    pointType: 'winner' | 'error';
    shotType: string;
    hand: string;
    trainingPoints: Point[];
    addPoint: (point: Point) => void;
    addTrainingPoint: (point: Point) => void;
    incrementScore: (team: 'us' | 'them') => void;
}

export const useAppHandlers = ({
    mode,
    pointType,
    shotType,
    hand,
    addPoint,
    addTrainingPoint,
    incrementScore
}: UseAppHandlersProps) => {
    const handleCourtClick = useCallback((e: { target: { getStage: () => { getPointerPosition: () => { x: number; y: number } | null } } }) => {
        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        if (pointerPosition) {
            const point: Point = {
                x: pointerPosition.x,
                y: pointerPosition.y,
                type: pointType,
                player: 'me' as const,
                shotType: shotType as ShotType,
                hand: hand as Hand
            };

            if (mode === 'training') {
                addTrainingPoint(point);
            } else {
                addPoint(point);
                if (pointType === 'winner') incrementScore('us');
                if (pointType === 'error') incrementScore('them');
            }
        }
    }, [mode, pointType, shotType, hand, addPoint, addTrainingPoint, incrementScore]);

    return { handleCourtClick };
};
