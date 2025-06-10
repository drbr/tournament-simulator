import React, { useState, useEffect } from 'react';
import './App.css';

interface Circle {
  id: string;
  number: number;
}

interface Rectangle {
  id: string;
  circles: Circle[];
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

  const left: RGBColor = { r: 0, g: 100, b: 255 }; // blue
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

function randomCircle(index: number): Circle {
  return {
    id: `circle-${index}`,
    number: Math.floor(Math.random() * 99) + 1,
  };
}

function randomRectangles(): Rectangle[] {
  return generateArray(10, (index) => ({
    id: `rectangle-${index}`,
    circles: generateArray(2, randomCircle),
  }));
}

function getInitialCircleY(circleIndex: number): number {
  return 60 + circleIndex * 80;
}

// Calculate transform for swapped position
function getSwapTransform(circleIndex: number, isSwapped: boolean): string {
  if (isSwapped) {
    // Move first circle down by 80px, second circle up by 80px
    const translateY = circleIndex === 0 ? 80 : -80;
    return `translate(0, ${translateY})`;
  }
  return 'translate(0, 0)';
}

function getAnimationValues(circleIndex: number, isSwapped: boolean): string {
  if (isSwapped) {
    return circleIndex === 0 ? '0,0;0,80' : '0,0;0,-80';
  } else {
    return circleIndex === 0 ? '0,80;0,0' : '0,-80;0,0';
  }
}

export const App: React.FC = () => {
  const [rectangleData, setRectangleData] = useState<Rectangle[]>([]);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Generate random numbers and colors for all rectangles and circles
  useEffect(() => {
    const data = randomRectangles();
    setRectangleData(data);
  }, []);

  const swapCircles = (): void => {
    setIsSwapped(!isSwapped);
    setAnimationKey((prev) => prev + 1); // Force re-render to trigger new animations
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
      <p className="body-text">This simulates a tournament in which </p>

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
      <ParticipantsView
        rectangles={rectangleData}
        isSwapped={isSwapped}
        animationKey={animationKey}
      />
    </div>
  );
};

const ParticipantsView: React.FC<{
  rectangles: Rectangle[];
  isSwapped: boolean;
  animationKey: number;
}> = ({ rectangles, isSwapped, animationKey }) => {
  return (
    <div style={{ padding: '20px' }}>
      <svg width="1000" height="200" viewBox="0 0 1000 200">
        {rectangles.map((rectangle: Rectangle, rectIndex: number) => (
          <g key={rectangle.id}>
            {/* Rectangle border */}
            <rect
              x={rectIndex * 100}
              y={20}
              width={90}
              height={160}
              fill="none"
              stroke="#333"
              strokeWidth="2"
              rx="5"
            />

            {/* Two circles in vertical column */}
            {rectangle.circles.map((circle: Circle, circleIndex: number) => (
              <g
                key={`${circle.id}-${animationKey}`}
                transform={getSwapTransform(circleIndex, isSwapped)}>
                {/* SVG Animation */}
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={getAnimationValues(circleIndex, isSwapped)}
                  dur="0.8s"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.4,0,0.2,1"
                  keyTimes="0;1"
                />

                {/* Circle */}
                <circle
                  cx={rectIndex * 100 + 45}
                  cy={getInitialCircleY(circleIndex)}
                  r={25}
                  fill={toRgbString(getCircleColor(circle.number))}
                  stroke="#333"
                  strokeWidth="1"
                />

                {/* Number text */}
                <text
                  x={rectIndex * 100 + 45}
                  y={getInitialCircleY(circleIndex)}
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
    </div>
  );
};
