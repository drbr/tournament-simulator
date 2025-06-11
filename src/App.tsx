import React, { useReducer } from 'react';
import './App.css';
import { ParticipantsView } from './ParticipantsView';
import { Circle, initRandomCircles } from './Circle';
import { playMatch } from './tournament';

export const RECTANGLE_COUNT = 10;

function circlesReducer(prevCircles: readonly Circle[], _: void): readonly Circle[] {
  return playMatch(prevCircles, RECTANGLE_COUNT);
}

export const App: React.FC = () => {
  const [circles, shuffleCircles] = useReducer(circlesReducer, initRandomCircles(RECTANGLE_COUNT));

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
          onClick={shuffleCircles}
          style={{
            ...buttonStyle,
            backgroundColor: '#ff6b6b',
            color: 'white',
          }}>
          Move Circles
        </button>
      </div>

      <div style={{ padding: '2rem 0' }}>
        <ParticipantsView circles={circles} rectangleCount={RECTANGLE_COUNT} />
      </div>
    </div>
  );
};
