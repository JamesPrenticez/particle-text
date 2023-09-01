import { useRef, useEffect } from 'react';

const useCanvas = (draw, { width, height }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, width, height);
    draw(context);
  }, [draw, width, height]);

  return canvasRef;
};


export default useCanvas
