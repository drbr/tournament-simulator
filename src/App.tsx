import React, { useReducer } from 'react';
import './App.css';
import { ParticipantsView } from './ParticipantsView';
import { Circle, initRandomCircles } from './Circle';
import { playMatch } from './tournament';

export const RECTANGLE_COUNT = 10;

type GameState = Readonly<{
  iterationCount: number;
  circles: readonly Circle[];
}>;

const initialState: GameState = {
  iterationCount: 0,
  circles: initRandomCircles(RECTANGLE_COUNT),
};

function circlesReducer(prev: GameState, _: void): GameState {
  return {
    iterationCount: prev.iterationCount + 1,
    circles: playMatch(prev.circles, RECTANGLE_COUNT),
  };
}

export const App: React.FC = () => {
  const [state, iterateGame] = useReducer(circlesReducer, initialState);

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
      <p>
        This simulates a tournament in which there are several 1v1 matchups. After each match, the
        winner moves to the right and the loser to the left. Each player has a ranking (1-99); the
        higher the ranking, the more likely they are to win. The question is: after enough matchups,
        will the players be sorted in order of their ranking?
      </p>

      <div>
        <button
          onClick={iterateGame}
          style={{
            ...buttonStyle,
            backgroundColor: '#ff6b6b',
            color: 'white',
          }}>
          Move Circles
        </button>
      </div>
      <p>Iterations: {state.iterationCount}</p>

      <div style={{ padding: '1rem 0' }}>
        <ParticipantsView circles={state.circles} rectangleCount={RECTANGLE_COUNT} />
      </div>
    </div>
  );
};
