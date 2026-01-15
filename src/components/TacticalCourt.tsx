import React from 'react';
import { Stage, Layer, Rect, Line, Circle, Text, Group } from 'react-konva';

interface Point {
    x: number;
    y: number;
    type: 'winner' | 'error';
}

interface Token {
    id: string;
    x: number;
    y: number;
    color: string;
    label?: string;
    radius?: number;
}

interface TacticalCourtProps {
    width: number;
    height: number;
    points?: Point[];
    tokens?: Token[];
    showHeatmap?: boolean;
    mode?: 'stats' | 'tactics';
    onCourtClick?: (e: any) => void;
    onTokenDragEnd?: (id: string, x: number, y: number) => void;
}

const TacticalCourt: React.FC<TacticalCourtProps> = ({
    width,
    height,
    points = [],
    tokens = [],
    showHeatmap = false,
    mode = 'stats',
    onCourtClick,
    onTokenDragEnd
}) => {
    // Padel Court is 10m x 20m
    // We scale it to fit the width/height provided
    const scale = Math.min(width / 10, height / 20);

    const courtWidth = 10 * scale;
    const courtHeight = 20 * scale;

    // Center the court
    const offsetX = (width - courtWidth) / 2;
    const offsetY = (height - courtHeight) / 2;

    // Key measurements (in meters)


    // Back wall to net = 10m. Service line is at 6.95m from net -> 3.05m from back wall.
    // Let's approximate for visual simplicity: 3m from back wall.

    return (
        <Stage width={width} height={height}>
            <Layer>
                {/* Background */}
                <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill="#1e1e1e"
                />

                {/* Court Floor */}
                <Rect
                    x={offsetX}
                    y={offsetY}
                    width={courtWidth}
                    height={courtHeight}
                    fill="#4a90e2" // Blue court
                    stroke="white"
                    strokeWidth={2}
                    onClick={mode === 'stats' ? onCourtClick : undefined}
                    onTap={mode === 'stats' ? onCourtClick : undefined}
                />

                {/* Net (Middle) */}
                <Line
                    points={[
                        offsetX, offsetY + (courtHeight / 2),
                        offsetX + courtWidth, offsetY + (courtHeight / 2)
                    ]}
                    stroke="white"
                    strokeWidth={2}
                    dash={[5, 5]} // Net visual
                />

                {/* Service Lines (Top side) */}
                <Line
                    points={[
                        offsetX, offsetY + (3 * scale),
                        offsetX + courtWidth, offsetY + (3 * scale)
                    ]}
                    stroke="white"
                    strokeWidth={1}
                />
                {/* Center Service Line (Top) */}
                <Line
                    points={[
                        offsetX + (courtWidth / 2), offsetY + (3 * scale),
                        offsetX + (courtWidth / 2), offsetY + (courtHeight / 2)
                    ]}
                    stroke="white"
                    strokeWidth={1}
                />

                {/* Service Lines (Bottom side) */}
                <Line
                    points={[
                        offsetX, offsetY + (17 * scale),
                        offsetX + courtWidth, offsetY + (17 * scale)
                    ]}
                    stroke="white"
                    strokeWidth={1}
                />
                {/* Center Service Line (Bottom) */}
                <Line
                    points={[
                        offsetX + (courtWidth / 2), offsetY + (17 * scale),
                        offsetX + (courtWidth / 2), offsetY + (courtHeight / 2)
                    ]}
                    stroke="white"
                    strokeWidth={1}
                />

                {/* Render Points (Only in Stats Mode) */}
                {mode === 'stats' && points.map((p, i) => {
                    if (showHeatmap) {
                        return (
                            <Circle
                                key={i}
                                x={p.x}
                                y={p.y}
                                radius={40 * (scale / 25)} // Scale radius with court
                                fill={p.type === 'winner' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}
                                blurRadius={20}
                                listening={false}
                            />
                        )
                    }

                    return (
                        <Circle
                            key={i}
                            x={p.x}
                            y={p.y}
                            radius={6}
                            fill={p.type === 'winner' ? '#10b981' : '#ef4444'} // Emerald-500 or Red-500
                            stroke="white"
                            strokeWidth={1}
                            shadowBlur={5}
                            shadowColor="black"
                            listening={false} // So clicks pass through to the court
                        />
                    )
                })}

                {/* Render Tokens (Only in Tactics Mode) */}
                {mode === 'tactics' && tokens.map((token) => (
                    <Group
                        key={token.id}
                        x={token.x}
                        y={token.y}
                        draggable
                        onDragEnd={(e) => {
                            if (onTokenDragEnd) {
                                onTokenDragEnd(token.id, e.target.x(), e.target.y());
                            }
                        }}
                    >
                        <Circle
                            radius={token.radius || 12}
                            fill={token.color}
                            stroke="white"
                            strokeWidth={2}
                            shadowColor="black"
                            shadowBlur={5}
                            shadowOpacity={0.3}
                        />
                        {token.label && (
                            <Text
                                text={token.label}
                                fontSize={10}
                                fill="white"
                                fontStyle="bold"
                                align="center"
                                verticalAlign="middle"
                                offsetX={5}
                                offsetY={5}
                            />
                        )}
                    </Group>
                ))}
            </Layer>
        </Stage>
    );
};
export default TacticalCourt;
