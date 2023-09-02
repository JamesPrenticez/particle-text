import { useRef, useEffect } from 'react';

// const useCanvas = (draw, {width, height}) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     canvas.width = width;
//     canvas.height = height;
//     const context = canvas.getContext('2d');
//     context.clearRect(0, 0, width, height);
//     draw(context);
//   }, [draw, width, height]);

//   return canvasRef;
// };


// export default useCanvas


export default function useCanvas(draw, {width, height}) {
  const canvasRef = useRef(null);
  const frameCount = useRef(0);
  const lastUpdateTime = useRef(Date.now());
  const fps = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height
    const context = canvas.getContext('2d');
    let animationFrameId;

    const render = (timestamp) => {
      // console.log("animating")
      frameCount.current++;
    
      const now = Date.now();
      const diff = now - lastUpdateTime.current;
    
      if (diff >= 1000) {
        fps.current = frameCount.current;
        frameCount.current = 0;
        lastUpdateTime.current = now;
      }
      context.clearRect(0, 0, width, height);
      draw(context, fps.current);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  return canvasRef;
}











