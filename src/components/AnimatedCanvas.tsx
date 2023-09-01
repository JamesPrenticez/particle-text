import { useEffect, useRef, useState } from 'react';

interface Point2D {
  x: number;
  y: number;
}

export default function Test() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cursorPosition, setCursorPosition] = useState<Point2D>({ x: 0, y: 0 });

  useEffect(() => {
    requestAnimationFrame(renderFrame);
  }, [cursorPosition]);

  function renderFrame(): void {
    const context = canvasRef.current?.getContext('2d');
    if (context != null) {
      clearBackground(context);
      drawCircle(context, cursorPosition);
      convertToParticles(context)
    }
  }

  function clearBackground(context: CanvasRenderingContext2D): void {
    const { width, height } = context.canvas;
    context.rect(0, 0, width, height);
    context.fillStyle = 'black';
    context.fill();
  }

  function drawCircle(context: CanvasRenderingContext2D, position: Point2D): void {
    context.beginPath();
    context.arc(position.x, position.y, 10, 0, Math.PI * 2);
    context.fillStyle = 'red';
    context.fill();
  }

  function handleMouseMoved(event: React.MouseEvent<Element, MouseEvent>): void {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const canvasBoundingRect = canvas.getBoundingClientRect();
    const cursorXPos = event.clientX - canvasBoundingRect.left;
    const cursorYPos = event.clientY - canvasBoundingRect.top;
    setCursorPosition({ x: cursorXPos, y: cursorYPos });
  }

  const convertToParticles = (ctx: CanvasRenderingContext2D) => {
    const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    console.log(pixels)
  }

  return (
    <div className="App">
      <h1>React - Interactive Canvas Demo</h1>
      <canvas ref={canvasRef} height={480} width={720} onMouseMove={handleMouseMoved}>
        Oops! Your browser doesn't support the canvas component.
      </canvas>
    </div>
  );
}

//https://javascript.plainenglish.io/smooth-animations-for-interactive-html-canvas-simulations-with-react-b6fc1109ecd7