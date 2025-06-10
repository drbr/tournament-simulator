import React, { useState, useEffect } from 'react';
import './App.css';

function generateCircleData() {
  return Array.from({ length: 10 }, (_, rectangleIndex) => ({
    id: rectangleIndex,
    circles: Array.from({ length: 2 }, (_, circleIndex) => {
      const number = Math.floor(Math.random() * 99) + 1;
      const normalizedValue = (number - 1) / 98; // Normalize to 0-1 range
      const color = getGradientColor(normalizedValue);
      return {
        id: circleIndex,
        number,
        color,
      };
    }),
  }));
}

/**
 * Calculates the gradient from blue (1) to orange (99)
 */
function getGradientColor(normalizedValue) {
  // Blue RGB: (0, 100, 255), Orange RGB: (255, 165, 0)
  const blue = { r: 0, g: 100, b: 255 };
  const orange = { r: 255, g: 165, b: 0 };

  const r = Math.round(blue.r + (orange.r - blue.r) * normalizedValue);
  const g = Math.round(blue.g + (orange.g - blue.g) * normalizedValue);
  const b = Math.round(blue.b + (orange.b - blue.b) * normalizedValue);

  return `rgb(${r}, ${g}, ${b})`;
}

function App() {
  const [rectangleData, setRectangleData] = useState([]);
  const [isSwapped, setIsSwapped] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Generate random numbers and colors for all rectangles and circles
  useEffect(() => {
    const data = generateNewNumbers();
    setRectangleData(data);
  }, []);

  const generateNewNumbers = () => {
    const data = Array.from({ length: 10 }, (_, rectangleIndex) => ({
      id: rectangleIndex,
      circles: Array.from({ length: 2 }, (_, circleIndex) => {
        const number = Math.floor(Math.random() * 99) + 1;
        const normalizedValue = (number - 1) / 98;
        const color = getGradientColor(normalizedValue);
        return {
          id: circleIndex,
          number,
          color,
        };
      }),
    }));
    setRectangleData(data);
  };

  const swapCircles = () => {
    setIsSwapped(!isSwapped);
    setAnimationKey((prev) => prev + 1); // Force re-render to trigger new animations
  };

  // Calculate initial circle position (before transform)
  const getInitialCircleY = (circleIndex) => {
    return 60 + circleIndex * 80;
  };

  // Calculate transform for swapped position
  const getSwapTransform = (circleIndex) => {
    if (isSwapped) {
      // Move first circle down by 80px, second circle up by 80px
      const translateY = circleIndex === 0 ? 80 : -80;
      return `translate(0, ${translateY})`;
    }
    return 'translate(0, 0)';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tournament Simulator - Random Numbers Display</h1>

        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={generateNewNumbers}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#61dafb',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>
            Generate New Numbers
          </button>

          <button
            onClick={swapCircles}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#ff6b6b',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              color: 'white',
            }}>
            {isSwapped ? 'Restore Positions' : 'Swap Circles'}
          </button>
        </div>

        <div style={{ padding: '20px' }}>
          <svg width="1000" height="200" viewBox="0 0 1000 200">
            {rectangleData.map((rectangle, rectIndex) => (
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
                {rectangle.circles.map((circle, circleIndex) => (
                  <g key={`${circle.id}-${animationKey}`} transform={getSwapTransform(circleIndex)}>
                    {/* SVG Animation */}
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={
                        isSwapped
                          ? circleIndex === 0
                            ? '0,0;0,80'
                            : '0,0;0,-80'
                          : circleIndex === 0
                          ? '0,80;0,0'
                          : '0,-80;0,0'
                      }
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
}

export default App;
