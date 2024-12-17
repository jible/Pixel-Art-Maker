// IMPORTS
import {blockManager} from ''
import {paletteManager} from ''
import {imageManager} from ''

// MANAGER

export const overHeadManager = {
    canvas: document.getElementById('canvas'),
    ctx: canvas.getContext('2d'),
    imageManager: imageManager,
    blockManager: blockManager,
    paletteManager: paletteManager,
  
  
    // Function to pixelate the image
    pixelateImage(blockSize) {
      // Clear the canvas before drawing the new pixelated version
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw the original image at full size for pixelation
      ctx.drawImage(img, 0, 0, originalWidth, originalHeight);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
  
      for (let y = 0; y < canvas.height; y += blockSize) {
        for (let x = 0; x < canvas.width; x += blockSize) {
          makeBlock(canvas, data, x, y, blockSize);
        };
      }
  
      ctx.putImageData(imageData, 0, 0);
    },
  }