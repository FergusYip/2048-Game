import React, { useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import Header from './components/Header';
import Game2048, { isSameState, updateState, GAME_STATES } from './Game2048';
import useLocalStorage from './hooks/useLocalStorage';
import { useSwipeable } from 'react-swipeable';
import Overlay from './components/Overlay';

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

  const restartGame = () => {
    setGameState(Game2048.newGame());
  };

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
      if (gameState.state !== GAME_STATES.PLAYING) {
        if (e.key === 'Enter') {
          setGameState(Game2048.newGame());
        }
        return;
      }
      setGameState((current) =>
        getNextState(e.key.replace('Arrow', ''), current)
      );
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState, setGameState]);

  // Update best score
  useEffect(() => {
    if (gameState.score > bestScore) {
      setBestScore(gameState.score);
    }
  }, [gameState, bestScore, setBestScore]);

  return (
    <div className="App" {...swipeHandlers}>
      <Header score={gameState.score} bestScore={bestScore} />
      <Board tiles={gameState.tiles} />
      <Overlay
        display={gameState.state !== GAME_STATES.PLAYING}
        title={gameState === GAME_STATES.WIN ? 'Victory' : 'Game Over'}
        subtitle="Click to restart"
        onClick={restartGame}
      />
    </div>
  );
}

export default App;
