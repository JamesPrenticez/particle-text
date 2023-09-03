import React, { useRef, useState, useEffect, useMemo } from 'react';
import useCanvas from '../hooks/useCanvas';
import useMousePosition from '../hooks/useMousePosition';

const CanvasComponent = (props) => {
  const parentRef = useRef(null);
  const [parentDimensions, setParentDimensions] = useState({ width: 1200, height: 800 });
  // const canvasDimensions = { width: parentDimensions.width, height: parentDimensions.height };
  const particlesRef = useRef([]);

  const canvasDimensions = useMemo(() => {
    return { width: parentDimensions.width, height: parentDimensions.height };
  }, [parentDimensions]);

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

    handleResize();  // Initialize the parent width
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // useEffect to convert text to particles and clear the canvas afterwards.
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      drawWrappedText(ctx);  // Step 1: Draw the text
      particlesRef.current = convertToParticles(ctx); // Step 2: Convert text to particles
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Step 3: Clear the canvas
    }
  }, [canvasDimensions]); 

  // useEffect(() => {
  //   if (canvasRef.current) {
  //     const ctx = canvasRef.current.getContext('2d', { willReadFrequently: false });
  //     particlesRef.current = convertToParticles(ctx);
  //   }
  // }, [canvasDimensions]); 

  const draw = (ctx, fps) => {
    drawBackground(ctx)
    drawMouseCoords(ctx, mousePosition)
    // drawWrappedText(ctx)
    
    if (particlesRef.current && mousePosition) {
      particlesRef.current.forEach((particle) => {
        particle.update(mousePosition);
        particle.draw(ctx);
      });
    }
  };

  const canvasRef = useCanvas(draw, canvasDimensions);
  const mousePosition = useMousePosition(canvasRef);

  const drawMouseCoords = (ctx, mousePosition) => {
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = `${16}px ${fontFamily}`;
    ctx.fillText(`X:${mousePosition.x}`, 0, 20);
    ctx.fillText(`Y:${mousePosition.y}`, 0, 40);
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
    // we only want he text for analysis then we draw pixels in its place
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) 
    // console.log(pixels.data[2])
    // console.log(ctx.canvas.height);
    for (let y = 0; y < ctx.canvas.height; y += gap){
      for (let x = 0; x < ctx.canvas.width; x += gap){
        const index = (y * ctx.canvas.width + x) * 4;
        const alpha = pixels.data[index + 3] //RGB[A]
        if (alpha > 0){
          const red = pixels.data[index];
          const green = pixels.data[index + 1];
          const blue = pixels.data[index + 2];
          const color = `rgb(${red}, ${green}, ${blue})`

          const particle = createParticle(x, y, color, gap);
          particles.push(particle);
        }
      }
    }
    return particles;
  }

  const createParticle = (orginX, orginY, color, gap) => {
    const ctx = canvasRef.current.getContext('2d');

    let x = Math.random() * ctx.canvas.width; 
    let y = 0
    let size = gap
    let dx = 0
    let dy = 0
    let vx = 0
    let vy = 0
    let force = 0 
    let angle = 0
    let distance = 0
    let friction = Math.random() * 0.6 + 0.15;
    let ease = Math.random() * 0.1 + 0.005;

    // const { mouseX, mouseY } = mousePosition;
    let mouseRadius = 1000
  
    return {
      orginX,
      orginY,
      color,
      draw: (ctx) => {
        // if(color !== color){}
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);

      },
      update: (m) => {

        if (m) {
          dx = m.x - x;
          dy = m.y - y;
          // ... rest of your code
        }
        // dx = mousePosition.x - x;
        // dy = mousePosition.y - y;
        distance = (dx * dx) + (dy * dy);
        force = -mouseRadius / distance;
        // console.log(distance)

        if(distance < mouseRadius){
          angle = Math.atan2(dy, dx);
          vx += force * Math.cos(angle);
          vy += force * Math.sin(angle);
        }

        x += (vx *= friction) + (orginX - x) * ease;
        y += (vy *= friction) + (orginY - y) * ease;

        // x += (orginX - x) * ease;
        // y += (orginY - y) * ease;
      },
    };
  };
  

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


