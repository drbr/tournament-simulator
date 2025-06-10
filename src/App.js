import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [rectangleData, setRectangleData] = useState([]);

  // Generate random numbers and colors for all rectangles and circles
  useEffect(() => {
    const data = Array.from({ length: 10 }, (_, rectangleIndex) => ({
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
    setRectangleData(data);
  }, []);

  // Function to calculate gradient color from blue (1) to orange (99)
  const getGradientColor = (normalizedValue) => {
    // Blue RGB: (0, 100, 255), Orange RGB: (255, 165, 0)
    const blue = { r: 0, g: 100, b: 255 };
    const orange = { r: 255, g: 165, b: 0 };

    const r = Math.round(blue.r + (orange.r - blue.r) * normalizedValue);
    const g = Math.round(blue.g + (orange.g - blue.g) * normalizedValue);
    const b = Math.round(blue.b + (orange.b - blue.b) * normalizedValue);

    return `rgb(${r}, ${g}, ${b})`;
  };

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tournament Simulator - Random Numbers Display</h1>
        <button
          onClick={generateNewNumbers}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#61dafb',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>
          Generate New Numbers
        </button>

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
                  <g key={circle.id}>
                    {/* Circle */}
                    <circle
                      cx={rectIndex * 100 + 45}
                      cy={60 + circleIndex * 80}
                      r={25}
                      fill={circle.color}
                      stroke="#333"
                      strokeWidth="1"
                    />

                    {/* Number text */}
                    <text
                      x={rectIndex * 100 + 45}
                      y={60 + circleIndex * 80 + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="16"
                      fontWeight="bold"
                      textShadow="1px 1px 1px rgba(0,0,0,0.5)">
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
        </div>
      </header>
    </div>
  );
}

export default App;
