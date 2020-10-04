import React, { useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import ScoreCard from './components/ScoreCard';
import Game2048, { isSameState, updateState, GAME_STATES } from './Game2048';
import useLocalStorage from './hooks/useLocalStorage';
import { useSwipeable } from 'react-swipeable';

function App() {
  const [gameState, setGameState] = useLocalStorage(
    'gameState',
    Game2048.newGame()
  );
  const [bestScore, setBestScore] = useLocalStorage('bestScore', 0);
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setGameState((current) => getNextState('up', current)),
    onSwipedDown: () =>
      setGameState((current) => getNextState('down', current)),
    onSwipedLeft: () =>
      setGameState((current) => getNextState('left', current)),
    onSwipedRight: () =>
      setGameState((current) => getNextState('right', current)),
  });

  const getNextState = (direction, current) => {
    let result = current;
    switch (direction.toLowerCase()) {
      case 'up':
        result = Game2048.nextUpState(result);
        break;
      case 'down':
        result = Game2048.nextDownState(result);
        break;
      case 'left':
        result = Game2048.nextLeftState(result);
        break;
      case 'right':
        result = Game2048.nextRightState(result);
        break;
      default:
        return current;
    }

    if (isSameState(current, result)) {
      return current;
    }
    result = Game2048.insertRandom(result);
    result = updateState(result);
    return result;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // if (gameState !== GAME_STATES.PLAYING) {
      //   if (e.key === 'Enter') {
      //     setTiles(Game2048.newGame());
      //     setGameState(GAME_STATES.PLAYING);
      //   }
      //   return;
      // }
      setGameState((current) =>
        getNextState(e.key.replace('Arrow', ''), current)
      );
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [setGameState]);

  // Update best score
  useEffect(() => {
    if (gameState.score > bestScore) {
      setBestScore(gameState.score);
    }
  }, [gameState, bestScore, setBestScore]);

  return (
    <div className="App" {...swipeHandlers}>
      <header>
        <div className="header">
          <h1>2048</h1>
          <div className="score-container">
            <ScoreCard score={gameState.score} label="score" />
            <ScoreCard score={bestScore} label="best" />
          </div>
        </div>
      </header>
      <Board
        tiles={gameState.tiles}
        blur={gameState.state !== GAME_STATES.PLAYING}
      />
      {/* {gameState !== GAME_STATES.PLAYING && (
        <div id="overlay">
          <h1>{gameState === GAME_STATES.WIN ? 'Victory' : 'Game Over'}</h1>
          <p>Press Enter to restart</p>
        </div>
      )} */}
    </div>
  );
}

export default App;
