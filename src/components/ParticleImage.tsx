import React, { useRef, useState, useEffect, useMemo } from 'react';
import useCanvas from '../hooks/useCanvas';
import useMousePosition from '../hooks/useMousePosition';

const ParticleImage = (props) => {
  const parentRef = useRef(null);
  const particlesRef = useRef([]);
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasDimensions = useMemo(() => {return { width: 550, height: 300 }}, []); // why this need memo?

  const backgroundColor = 'black';
  let mouseRadius = 5000

  // useEffect to convert text to particles and clear the canvas afterwards.
  useEffect(() => {
      if (canvasRef.current && imageLoaded) { // Only proceed if image has loaded
        const ctx = canvasRef.current.getContext('2d');
        particlesRef.current = convertToParticles(ctx); // Convert image to particles
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas
      }
  }, [canvasDimensions, imageLoaded]); 

    // Trigger the drawImage function, in a seperate useEffect
    useEffect(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        drawImage(ctx); // Draw the image
      }
    }, []);

  const draw = (ctx) => {
    drawBackground(ctx)

    if (particlesRef.current && mousePosition) {
      particlesRef.current.forEach((particle) => {
        particle.update(mousePosition);
        particle.draw(ctx);
      });
    }
  };

  const canvasRef = useCanvas(draw, canvasDimensions);
  const mousePosition = useMousePosition(canvasRef);

  const drawBackground = (ctx) => {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawImage = (ctx) => {
    const image = new Image();
    image.src = props.img;
    image.onload = () => {
      const x = (canvasDimensions.width - image.width) / 2;
      const y = (canvasDimensions.height - image.height) / 2;
      ctx.drawImage(image, x, y);
      setImageLoaded(true); // Image has loaded
    };
  }

  const convertToParticles = (ctx) => {
    let particles = []
    let gap = 3;
    const pixels = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    // We only want he text for analysis then we draw pixels in its place
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height) 
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
    // console.log(particles)
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
    let friction = Math.random() * 0 + 0.15;
    let ease = Math.random() * 0.1 + 0.030;
    // let friction = Math.random() * 0 + 0.15;
    // let ease = Math.random() * 0.1 + 0.005;

    return {
      orginX,
      orginY,
      color,
      draw: (ctx) => {
        // improve performance here by only setting color if its changed
        // if(color !== color){} 
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);

      },
      update: (mouse) => {
        dx = mouse.x - x;
        dy = mouse.y - y;
        distance = (dx * dx) + (dy * dy);
        force = -mouseRadius / distance;

        if(distance < mouseRadius){
          angle = Math.atan2(dy, dx);
          vx += force * Math.cos(angle);
          vy += force * Math.sin(angle);
        }

        x += (vx *= friction) + (orginX - x) * ease;
        y += (vy *= friction) + (orginY - y) * ease;

        // origional without mouse interaction
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

export default ParticleImage;


