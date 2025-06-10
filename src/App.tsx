import React, { useState, useEffect } from 'react';
import './App.css';

// Type definitions
interface Circle {
  id: number;
  number: number;
  color: string;
}

interface Rectangle {
  id: number;
  circles: Circle[];
}

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

/**
 * Calculates the gradient from blue (1) to orange (99)
 */
function getGradientColor(normalizedValue: number): string {
  // Blue RGB: (0, 100, 255), Orange RGB: (255, 165, 0)
  const blue: RGBColor = { r: 0, g: 100, b: 255 };
  const orange: RGBColor = { r: 255, g: 165, b: 0 };

  const r = Math.round(blue.r + (orange.r - blue.r) * normalizedValue);
  const g = Math.round(blue.g + (orange.g - blue.g) * normalizedValue);
  const b = Math.round(blue.b + (orange.b - blue.b) * normalizedValue);

  return `rgb(${r}, ${g}, ${b})`;
}

function generateCircleData(): Rectangle[] {
  return Array.from(
    { length: 10 },
    (_, rectangleIndex): Rectangle => ({
      id: rectangleIndex,
      circles: Array.from({ length: 2 }, (_, circleIndex): Circle => {
        const number = Math.floor(Math.random() * 99) + 1;
        const normalizedValue = (number - 1) / 98; // Normalize to 0-1 range
        const color = getGradientColor(normalizedValue);
        return {
          id: circleIndex,
          number,
          color,
        };
      }),
    })
  );
}

const App: React.FC = () => {
  const [rectangleData, setRectangleData] = useState<Rectangle[]>([]);
  const [isSwapped, setIsSwapped] = useState<boolean>(false);
  const [animationKey, setAnimationKey] = useState<number>(0);

  // Generate random numbers and colors for all rectangles and circles
  useEffect(() => {
    const data = generateCircleData();
    setRectangleData(data);
  }, []);

  const generateNewNumbers = (): void => {
    const data = generateCircleData();
    setRectangleData(data);
  };

  const swapCircles = (): void => {
    setIsSwapped(!isSwapped);
    setAnimationKey((prev) => prev + 1); // Force re-render to trigger new animations
  };

  // Calculate initial circle position (before transform)
  const getInitialCircleY = (circleIndex: number): number => {
    return 60 + circleIndex * 80;
  };

  // Calculate transform for swapped position
  const getSwapTransform = (circleIndex: number): string => {
    if (isSwapped) {
      // Move first circle down by 80px, second circle up by 80px
      const translateY = circleIndex === 0 ? 80 : -80;
      return `translate(0, ${translateY})`;
    }
    return 'translate(0, 0)';
  };

  const getAnimationValues = (circleIndex: number): string => {
    if (isSwapped) {
      return circleIndex === 0 ? '0,0;0,80' : '0,0;0,-80';
    } else {
      return circleIndex === 0 ? '0,80;0,0' : '0,-80;0,0';
    }
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
      <header className="App-header">
        <h1>Tournament Simulator - Random Numbers Display</h1>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={generateNewNumbers}
            style={{
              ...buttonStyle,
              marginRight: '10px',
              backgroundColor: '#61dafb',
            }}>
            Generate New Numbers
          </button>

          <button
            onClick={swapCircles}
            style={{
              ...buttonStyle,
              backgroundColor: '#ff6b6b',
              color: 'white',
            }}>
            {isSwapped ? 'Restore Positions' : 'Swap Circles'}
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <svg width="1000" height="200" viewBox="0 0 1000 200">
            {rectangleData.map((rectangle: Rectangle, rectIndex: number) => (
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
                  <g key={`${circle.id}-${animationKey}`} transform={getSwapTransform(circleIndex)}>
                    {/* SVG Animation */}
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={getAnimationValues(circleIndex)}
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
                      fill={circle.color}
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

        <div style={{ marginTop: '20px', color: '#888', fontSize: '14px' }}>
          <p>Blue circles = numbers closer to 1 | Orange circles = numbers closer to 99</p>
          <p>Click "Swap Circles" to see smooth SVG animation between positions!</p>
        </div>
      </header>
    </div>
  );
};

export default App;
