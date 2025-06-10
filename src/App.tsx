import React, { useState, useReducer, useEffect } from 'react';
import './App.css';
import { ParticipantsView, RECTANGLE_COUNT } from './ParticipantsView';
import { randomCircles } from './Circle';

export const App: React.FC = () => {
  const [circles, incrementCircles] = useReducer(
    () => randomCircles(RECTANGLE_COUNT),
    randomCircles(RECTANGLE_COUNT)
  );

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
          onClick={incrementCircles}
          style={{
            ...buttonStyle,
            backgroundColor: '#ff6b6b',
            color: 'white',
          }}>
          Move Circles
        </button>
      </div>

      <div style={{ padding: '2rem 0' }}>
        <ParticipantsView circles={circles} />
      </div>
    </div>
  );
};
