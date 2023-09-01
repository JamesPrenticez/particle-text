import React, { useRef, useState, useEffect } from 'react';
import useCanvas from '../hooks/useCanvas';
import useMousePosition from '../hooks/useMousePosition';

const CanvasComponent = (props) => {
  const parentRef = useRef(null);
  const hasRunConvertToParticles = useRef(false);
  const [parentDimensions, setParentDimensions] = useState({ width: 1200, height: 800 });
  const canvasDimensions = { width: parentDimensions.width, height: parentDimensions.height };

  const backgroundColor = 'black';
  const mouseColor = 'red';

  const textGradientColor1 = "#00C9FF"
  const textGradientColor2 = "#92FE9D"

  const maxTextWidth = canvasDimensions.width * 0.5

  const fontSize = 150
  const lineHeight = 150

  const fontFamily = 'Helvetica'

  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        setParentDimensions({ 
          width: parentRef.current.offsetWidth,
          height: parentRef.current.offsetHeight
        });
      }
    };

    // handleResize();  // Initialize the parent width
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const draw = (ctx, fps) => {
    drawBackground(ctx)
    drawMouseCoords(ctx, mousePosition)
    drawWrappedText(ctx)
    if (!hasRunConvertToParticles.current) {
      console.log("here")
      convertToParticles(ctx);
      hasRunConvertToParticles.current = true;
    }
  };

  const canvasRef = useCanvas(draw, canvasDimensions);
  const mousePosition = useMousePosition(canvasRef);

  const drawMouseCoords = (ctx, mousePosition) => {
    const { x, y } = mousePosition;
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = `${16}px ${fontFamily}`;
    ctx.fillText(`X:${x}`, 0, 20);
    ctx.fillText(`Y:${y}`, 0, 40);
  };

  const drawBackground = (ctx) => {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawWrappedText = (ctx) => {
    const textPostition = {x: canvasDimensions.width/2, y: canvasDimensions.height/2}
    
    const textFillGradient = ctx.createLinearGradient(0, 0, canvasDimensions.width/2, canvasDimensions.height/2)
    textFillGradient.addColorStop(0, textGradientColor1)
    textFillGradient.addColorStop(1, textGradientColor2)

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = textFillGradient;
    ctx.font = `${fontSize}px ${fontFamily}`;

    let linesArray = [];
    let lineCounter = 0;
    let line = '';
    let words = props.text.split(' ');

    for (let i = 0; i < words.length; i++){
      let testLine = line + words[i] + ' ';

      if (ctx.measureText(testLine).width > maxTextWidth) {
        line = words[i] + ' '
        lineCounter++;
      } else {
        line = testLine
      }
      linesArray[lineCounter] = line
    }

    let textHeight = lineHeight * lineCounter
    let textY = canvasDimensions.height / 2 - textHeight / 2
    
    linesArray.forEach((ele, index) => {
      ctx.fillText(ele, textPostition.x, textY + index * lineHeight);
    })
  }

  const convertToParticles = (ctx) => {
    let particles = []
    let gap = 3
    const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    console.log(pixels.data[2])
    console.log(ctx.canvas.height);
    for (let y = 0; y < ctx.canvas.height; y += gap){
      for (let x = 0; x < ctx.canvas.width; x += gap){
        const index = (y * ctx.canvas.width + x) * 4;
        const alpha = pixels.data[index + gap]
        if (alpha > 0){
          const red = pixels.data[index];
          const green = pixels.data[index + 1];
          const blue = pixels.data[index + 2];
          const color = `rbg(${red}, ${green}, ${blue})`
          console.log(color)
        }
      }
    }
  }

  return (
    <div ref={parentRef} className='w-full absolute top-0 bottom-0'>
      <canvas 
        ref={canvasRef}
        width={canvasDimensions.width} height={canvasDimensions.height}
        />
    </div>
  );
};

export default CanvasComponent;


