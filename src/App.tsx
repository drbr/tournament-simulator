import React, { useEffect, useReducer, useState } from 'react';
import './App.css';
import { ParticipantsView } from './ParticipantsView';
import { Circle, initRandomCircles } from './Circle';
import { playMatch } from './tournament';

const RECTANGLE_COUNT = 10;
const ANIMATION_TIME_MILLISECONDS = 300;
const AUTO_PLAY_INTERVAL = 350;

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
  const [autoPlay, setAutoPlay] = useState(false);
  const [state, iterateGame] = useReducer(circlesReducer, initialState);

  useEffect(() => {
    if (autoPlay) {
      iterateGame();
      const interval = setInterval(iterateGame, AUTO_PLAY_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [autoPlay, iterateGame]);

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    minWidth: '8rem',
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

      <div style={{ display: 'flex', gap: '2rem' }}>
        <button
          onClick={iterateGame}
          style={{
            ...buttonStyle,
            backgroundColor: '#ff6b6b',
            color: 'white',
            display: autoPlay ? 'none' : 'initial',
          }}>
          Play One Match
        </button>
        <button
          onClick={() => setAutoPlay(true)}
          style={{
            ...buttonStyle,
            backgroundColor: '#00A070',
            color: 'white',
            display: autoPlay ? 'none' : 'initial',
          }}>
          Auto Play
        </button>
        <button
          onClick={() => setAutoPlay(false)}
          style={{
            ...buttonStyle,
            backgroundColor: '#00A070',
            color: 'white',
            display: autoPlay ? 'initial' : 'none',
          }}>
          Stop
        </button>
      </div>
      <p>Iterations: {state.iterationCount}</p>

      <div style={{ padding: '1rem 0' }}>
        <ParticipantsView
          circles={state.circles}
          rectangleCount={RECTANGLE_COUNT}
          animationTimeMilliseconds={ANIMATION_TIME_MILLISECONDS}
        />
      </div>
    </div>
  );
};
