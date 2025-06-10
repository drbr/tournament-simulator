import React, { useState, useEffect } from 'react';
import './App.css';

interface Circle {
  id: string;
  number: number;
}

type CirclePosition = 'top' | 'bottom';

interface Rectangle {
  id: string;
  circles: Record<CirclePosition, Circle>;
}

function mapCircles<T>(
  circles: Record<CirclePosition, Circle>,
  fn: (circle: Circle, position: CirclePosition) => T
): T[] {
  return [fn(circles['top'], 'top'), fn(circles['bottom'], 'bottom')];
}

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

/**
 * Calculates the gradient from blue (1) to orange (99) and returns as an RGB color
 */
function getCircleColor(circleValue: number): RGBColor {
  const normalizedValue = (circleValue - 1) / 98; // Normalize to 0-1 range

  const left: RGBColor = { r: 40, g: 100, b: 255 }; // blue
  const right: RGBColor = { r: 255, g: 80, b: 0 }; // orange-red

  const r = Math.round(left.r + (right.r - left.r) * normalizedValue);
  const g = Math.round(left.g + (right.g - left.g) * normalizedValue);
  const b = Math.round(left.b + (right.b - left.b) * normalizedValue);

  return { r, g, b };
}

function toRgbString({ r, g, b }: RGBColor): string {
  return `rgb(${r}, ${g}, ${b})`;
}

function generateArray<T>(length: number, constructor: (i: number) => T): T[] {
  return Array.from({ length }, (_, i) => constructor(i));
}

function randomCircle(globalIndex: number): Circle {
  return {
    id: `circle-${globalIndex}`,
    number: Math.floor(Math.random() * 99) + 1,
  };
}

function randomRectangles(): Rectangle[] {
  return generateArray(10, (index) => ({
    id: `rectangle-${index}`,
    circles: {
      top: randomCircle(index * 2),
      bottom: randomCircle(index * 2 + 1),
    },
  }));
}

const CIRCLE_Y: Record<CirclePosition, number> = {
  top: 40,
  bottom: 120,
};

function getCircleX(rectangleIndex: number): number {
  return 45 + rectangleIndex * 100;
}

function getPositionTransform(rectangleIndex: number, circlePosition: CirclePosition): string {
  const x = getCircleX(rectangleIndex);
  const y = CIRCLE_Y[circlePosition];
  return `translate(${x}, ${y})`;
}

export const App: React.FC = () => {
  const [rectangleData, setRectangleData] = useState<Rectangle[]>([]);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);

  // Generate random numbers and colors for all rectangles and circles
  useEffect(() => {
    const data = randomRectangles();
    setRectangleData(data);
  }, []);

  const swapCircles = (): void => {
    setIsSwapped((s) => !s);
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <div className="App">
      <h1>Tournament Simulator </h1>
      <p className="body-text">
        This simulates a tournament in which there are several 1v1 matchups. After each match, the
        winner moves to the right and the loser to the left. Each player has a (1-99); the higher
        the ranking, the more likely they are to win. The question is: after many matchups, will the
        players be sorted in order of their ranking?
      </p>

      <div>
        <button
          onClick={swapCircles}
          style={{
            ...buttonStyle,
            backgroundColor: '#ff6b6b',
            color: 'white',
          }}>
          Swap Circles
        </button>
      </div>

      <div style={{ padding: '2rem 0' }}>
        <ParticipantsView rectangles={rectangleData} />
      </div>
    </div>
  );
};

const ParticipantsView: React.FC<{
  rectangles: Rectangle[];
}> = ({ rectangles }) => {
  return (
    <svg width="100%" height="160" viewBox="0 0 1000 160">
      {rectangles.map((rectangle: Rectangle, rectIndex: number) => (
        <g key={rectangle.id}>
          {/* Rectangle border */}
          <rect
            x={rectIndex * 100}
            y={0}
            width={90}
            height={160}
            fill="none"
            stroke="#333"
            strokeWidth="2"
            rx="5"
          />

          {/* Two circles in vertical column */}
          {mapCircles(rectangle.circles, (circle: Circle, circlePosition: CirclePosition) => (
            <g key={circle.id}>
              {/* Circle */}
              <circle
                cx={0}
                cy={0}
                transform={getPositionTransform(rectIndex, circlePosition)}
                r={25}
                fill={toRgbString(getCircleColor(circle.number))}
                stroke="#333"
                strokeWidth="1"
              />

              {/* Number text */}
              <text
                x={0}
                y={0}
                transform={getPositionTransform(rectIndex, circlePosition)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="16"
                fontWeight="bold"
                style={{
                  textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
                  pointerEvents: 'none',
                }}>
                {circle.number}
              </text>
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
};
