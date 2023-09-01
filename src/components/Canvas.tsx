import React, { useRef, useState, useEffect } from 'react';
import useCanvas from '../hooks/useCanvas';
import useMousePosition from '../hooks/useMousePosition';

const CanvasComponent = () => {
  const parentRef = useRef(null);
  const [parentDimensions, setParentDimensions] = useState({ width: 1, height: 100 });
  const canvasDimensions = { width: parentDimensions.width, height: parentDimensions.height };
  const backgroundColor = 'lightgray';


  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        setParentDimensions({ 
          width: parentRef.current.offsetWidth,
          height: parentRef.current.offsetHeight
        });
      }
    };

    handleResize();  // Initialize the parent width
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const canvasRef = useCanvas((ctx) => {
    drawBackground(ctx)
    drawMouseCoords(ctx, mousePosition)
  }, canvasDimensions);
  

  const mousePosition = useMousePosition(canvasRef);

  const drawMouseCoords = (ctx, mousePosition) => {
    const { x, y } = mousePosition;
    ctx.fillStyle = 'red';
    ctx.fillRect(x - 5, y - 5, 10, 10);
  };

  const drawBackground = (ctx) => {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  return (
    <div ref={parentRef} className='w-full absolute top-0 bottom-0'>
      <canvas ref={canvasRef} width={canvasDimensions.width} height={canvasDimensions.height} />
    </div>
  );
};

export default CanvasComponent;
