import { useState, useEffect } from 'react';

const useMousePosition = (canvasRef) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const updatePosition = (x, y) => {
    setMousePosition({ x, y });
  };

  const resetPosition = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      updatePosition(x, y);
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.touches[0].clientX - rect.left;
        const y = event.touches[0].clientY - rect.top;
        updatePosition(x, y);
      }
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
      canvasRef.current.addEventListener('mouseleave', resetPosition);
      canvasRef.current.addEventListener('touchmove', handleTouchMove);
      canvasRef.current.addEventListener('touchend', resetPosition);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current.removeEventListener('mouseleave', resetPosition);
        canvasRef.current.removeEventListener('touchmove', handleTouchMove);
        canvasRef.current.removeEventListener('touchend', resetPosition);
      }
    };
  }, [canvasRef]);

  return mousePosition;
};

export default useMousePosition