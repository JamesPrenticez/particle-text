import { Array2D } from './universe'
import React from 'react'

export type RGBA = {
    r: number
    g: number
    b: number
    a: number
}


export function getImageData(src: string) {
  var image = new Image();
  image.crossOrigin = "Anonymous";
  let p = new Promise<Array2D<RGBA>>((resolve, reject) => {
    image.onload = function() {
      let canvas = document.createElement("canvas");
      canvas.width = image.width
      canvas.height = image.height

      let context = canvas.getContext("2d");
      if (!context) {
          return reject(new Error('Could not get canvas context')) 
      }
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

      let imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          .data;
  
      context.clearRect(0, 0, canvas.width, canvas.height);

      let pixels: RGBA[][] = [];
      let i = 0;
      while (i < imageData.length - 1) {
        let x = (i / 4) % canvas.width;
        let y = Math.floor(i / 4 / canvas.width);
        if (!pixels[y]) {
            pixels[y] = []
        }
        pixels[y][x] = {
          r: imageData[i],
          g: imageData[i + 1],
          b: imageData[i + 2],
          a: imageData[i + 3]
        }
        i += 4;
      }
      resolve(new Array2D(pixels));
    };
    image.onerror = reject;
  });
  image.src = src;
  return p;
}
