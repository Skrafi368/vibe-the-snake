import React, { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

interface SnakeGameProps {
  setScore: React.Dispatch<React.SetStateAction<number>>;
}

export default function SnakeGame({ setScore }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  // Game State Refs
  const snakeRef = useRef(INITIAL_SNAKE);
  const directionRef = useRef(INITIAL_DIRECTION);
  const foodRef = useRef({ x: 15, y: 15 });
  const speedRef = useRef(INITIAL_SPEED);
  const animationFrameIdRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 0, y: -1 };
    foodRef.current = spawnFood();
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  }, [setScore]);

  const spawnFood = () => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE))
      };
      const onSnake = snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) return newFood;
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
    }
    
    const keyMap: Record<string, { x: number, y: number }> = {
      ArrowUp: { x: 0, y: -1 },
      ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 },
      ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 },
      s: { x: 0, y: 1 },
      a: { x: -1, y: 0 },
      d: { x: 1, y: 0 }
    };
    
    if (keyMap[e.key]) {
      const newDir = keyMap[e.key];
      const currentDir = directionRef.current;
      if (newDir.x !== 0 && currentDir.x !== 0) return;
      if (newDir.y !== 0 && currentDir.y !== 0) return;
      
      directionRef.current = newDir;
    }
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#050505'; // dark bg
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for(let i=0; i<=CANVAS_WIDTH/GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, CANVAS_HEIGHT);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(CANVAS_WIDTH, i * GRID_SIZE);
        ctx.stroke();
    }

    // Food (Neon Pink)
    ctx.fillStyle = '#ff007a';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff007a';
    ctx.beginPath();
    ctx.arc(foodRef.current.x * GRID_SIZE + GRID_SIZE/2, foodRef.current.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Snake (Neon Cyan)
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f2ff';
    snakeRef.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00f2ff';
      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });
    
    ctx.shadowBlur = 0;
  }, []);

  const changeScore = useCallback((scoreIncrease: number) => {
     setScore(s => {
         const ns = s + scoreIncrease;
         speedRef.current = Math.max(50, INITIAL_SPEED - Math.floor(ns / 5) * 10);
         return ns;
     });
  }, [setScore]);

  const update = useCallback(() => {
    const head = { ...snakeRef.current[0] };
    const direction = directionRef.current;
    
    head.x += direction.x;
    head.y += direction.y;

    if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE || head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }
    for (let segment of snakeRef.current) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameOver(true);
        setIsPlaying(false);
        return;
      }
    }

    snakeRef.current.unshift(head);

    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      changeScore(1);
      foodRef.current = spawnFood();
    } else {
      snakeRef.current.pop();
    }
  }, [changeScore]);

  const loop = useCallback((time: number) => {
    if (!isPlaying) return;
    
    const secondsSinceLastRender = (time - lastRenderTimeRef.current) / 1000;
    if (secondsSinceLastRender < speedRef.current / 1000) {
      animationFrameIdRef.current = requestAnimationFrame(loop);
      return;
    }
    
    lastRenderTimeRef.current = time;
    update();
    
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) draw(ctx);
    }
    
    if (isPlaying) {
      animationFrameIdRef.current = requestAnimationFrame(loop);
    }
  }, [isPlaying, draw, update]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isPlaying) {
      animationFrameIdRef.current = requestAnimationFrame(loop);
    }
    return () => {
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [isPlaying, loop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) draw(ctx);
    }
  }, [draw]);

  return (
    <div className="relative overscroll-none w-full h-full" style={{touchAction: "none"}}>
      <canvas 
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="bg-transparent focus:outline-none w-full h-full object-contain"
        tabIndex={0}
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050505]/80 backdrop-blur-sm z-20">
          <div className="text-center">
            {gameOver && <h2 className="text-[#ff007a] font-bold text-3xl mb-4 drop-shadow-[0_0_10px_rgba(255,0,122,0.8)] tracking-widest uppercase">GAME OVER</h2>}
            <button 
              onClick={(e) => { e.currentTarget.blur(); resetGame(); const c = canvasRef.current; if (c) c.focus(); }}
              className="px-6 py-3 bg-transparent border border-[#00f2ff] text-[#00f2ff] text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#00f2ff] hover:text-black transition-all shadow-[0_0_10px_rgba(0,242,255,0.4)] focus:outline-none"
            >
              {gameOver ? 'INITIALIZE GAME' : 'INITIALIZE GAME'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
