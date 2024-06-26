'use client';
import { TouchEvent, useCallback, useEffect, useState } from 'react';
import useSound from '../_utils/useSound';

type Position = {
  x: number;
  y: number;
};

const Game = () => {
  const [styles, setStyles] = useState<{ [key: string]: string }>({});
  const [gameSpeed, setGameSpeed] = useState(200);
  const [gameAreaSize, setGameAreaSize] = useState(400);
  const [gridSize, setGridSize] = useState(20);
  const [snake, setSnake] = useState<Position[]>([
    { x: gameAreaSize / 2, y: gameAreaSize / 2 },
  ]);
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [point, setPoint] = useState<Position | null>({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number>(0);

  const pointSound = useSound('/sounds/collect.mp3');
  const gameOverSound = useSound('/sounds/game-over.mp3');

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>): void => {
    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    e.preventDefault();
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        if (!paused) setDirection({ x: 1, y: 0 }); // right
      } else {
        if (!paused) setDirection({ x: -1, y: 0 }); // left
      }
    } else {
      if (deltaY > 0) {
        if (!paused) setDirection({ x: 0, y: 1 }); // up
      } else {
        if (!paused) setDirection({ x: 0, y: -1 }); // down
      }
    }
  };

  const createPoint = useCallback(() => {
    const newPoint = {
      x: Math.floor(Math.random() * (gameAreaSize / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (gameAreaSize / gridSize)) * gridSize,
    };
    setPoint(newPoint);
  }, [gameAreaSize, gridSize]);

  const updateSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const newHead = {
        x: prevSnake[0].x + direction.x * gridSize,
        y: prevSnake[0].y + direction.y * gridSize,
      };
      const newSnake = [newHead, ...prevSnake];
      if (point && newHead.x === point.x && newHead.y === point.y) {
        setScore(score + 1);
        pointSound();
        createPoint();
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  }, [
    direction.x,
    direction.y,
    gridSize,
    point,
    score,
    pointSound,
    createPoint,
  ]);

  const checkCollision = useCallback((): boolean => {
    const head = snake[0];
    if (
      head.x < 0 ||
      head.x >= gameAreaSize ||
      head.y < 0 ||
      head.y >= gameAreaSize
    ) {
      return true;
    }
    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  }, [gameAreaSize, snake]);

  const resetGame = useCallback(() => {
    setSnake([{ x: gameAreaSize / 2, y: gameAreaSize / 2 }]);
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setPaused(false);
    setGameOver(false);
    createPoint();
  }, [createPoint, gameAreaSize]);

  useEffect(() => {
    createPoint();
  }, [createPoint]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          event.preventDefault();
          gameOver ? resetGame() : setPaused((prevPaused) => !prevPaused);
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, gameOver, resetGame]);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      updateSnake();
      if (checkCollision()) {
        setPaused(true);
        setGameOver(true);
        gameOverSound();
      }
    }, gameSpeed);
    return () => clearInterval(interval);
  }, [updateSnake, checkCollision, paused, gameSpeed, gameOverSound]);

  useEffect(() => {
    const getStyles = async () => {
      const styleFile = (await import('../app/page.module.scss')).default;
      setStyles(styleFile);
    };
    getStyles();
  }, []);

  return (
    <main className={styles.main ? styles.main : 'hidden'}>
      <h1>Nacho{`'`}s Snake Game</h1>
      <div
        className={styles.game}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          filter: gameOver ? 'grayscale(1)' : 'drop-shadow(5px 5px 2px black)',
          width: `${gameAreaSize}px`,
          height: `${gameAreaSize}px`,
          background: `
            repeating-linear-gradient(
                0deg,
                #a6d6d880,
                #a6d6d880 ${gridSize}px,
                #ffffff80 ${gridSize}px,
                #ffffff80 ${gridSize * 2}px
              ),
              repeating-linear-gradient(
                90deg,
                #a6d6d880,
                #a6d6d880 ${gridSize}px,
                #ffffff80 ${gridSize}px,
                #ffffff80 ${gridSize * 2}px
          )
        `,
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            className={styles.snake}
            style={{
              left: segment.x + 1,
              top: segment.y + 1,
              width: `${gridSize - 2}px`,
              height: `${gridSize - 2}px`,
              zIndex: snake.length - index + 2,
            }}
          ></div>
        ))}
        <div
          key={`${point ? point.x + point.y : 'point'}`}
          className={styles.point}
          style={{
            left: point ? point.x : -(gameAreaSize / 4),
            top: point ? point.y : -(gameAreaSize / 4),
            width: `${gridSize}px`,
            height: `${gridSize}px`,
          }}
        ></div>
      </div>
      {gameOver && <p className={styles.gameOver}>Game Over</p>}
      <h2
        style={{
          color: gameOver ? '#76c442' : '',
          fontSize: gameOver ? '150%' : '125%',
        }}
      >
        Score: <span>{score}</span>
      </h2>
      {!gameOver && !(direction.x === 0 && direction.y === 0) && (
        <>
          <p className={styles.press}>
            Press {`"Space"`} to {paused ? 'resume' : 'pause'} the game
          </p>
          <button
            onClick={() => setPaused(!paused)}
            style={{
              background: '#faca3b',
            }}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        </>
      )}
      {paused && (
        <>
          <button
            onClick={resetGame}
            style={{
              background: '#7d0641',
            }}
          >
            Reset Game
          </button>
        </>
      )}
      <div className={styles.controls}>
        <p>
          Speed:
          <span>
            <i
              onClick={() => {
                const speed = gameSpeed + 50;
                if (speed <= 1000) setGameSpeed(speed);
              }}
            >
              -
            </i>
            {(200 / gameSpeed).toFixed(2)}x
            <i
              onClick={() => {
                const speed = gameSpeed - 50;
                if (speed > 0) setGameSpeed(speed);
              }}
            >
              +
            </i>
          </span>
        </p>
        <p>
          Area Size:
          <span>
            <i
              onClick={() => {
                const area = gameAreaSize - gridSize;
                if (area > 0) setGameAreaSize(area);
              }}
            >
              -
            </i>
            {(gameAreaSize / gridSize).toFixed(2)}
            <i
              onClick={() => {
                const area = gameAreaSize + gridSize;
                if (area <= 1000) setGameAreaSize(area);
              }}
            >
              +
            </i>
          </span>
        </p>
        <p>
          Grid Size:
          <span>
            <i
              onClick={() => {
                const grid = gridSize - 10;
                if (grid > 0) setGridSize(grid);
              }}
            >
              -
            </i>
            {gridSize}
            <i
              onClick={() => {
                const grid = gridSize + 10;
                if (grid <= 50) setGridSize(grid);
              }}
            >
              +
            </i>
          </span>
        </p>
      </div>
    </main>
  );
};

export default Game;
