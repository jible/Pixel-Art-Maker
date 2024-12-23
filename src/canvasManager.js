import { paletteManager, addPallette, updatePalletteDropDown } from "./pallette.js";
import { blockManager } from "./blockManager.js";

const canvas = document.getElementById('canvas')
export const canvasManager = {
    canvas : canvas,
    ctx : canvas.getContext('2d'),
    img : new Image(),
    originalWidth: 0,
    originalHeight: 0,



    loadImgFile(file) {
      const reader = new FileReader();
      console.log(this.inmg)
      const manager = this
      reader.onload = function (event) {
        manager.img.onload = function () {
          // Store original image dimensions
          manager.originalWidth = manager.img.width;
          manager.originalHeight = manager.img.height;
    
          // Set the canvas size to fit the image's size (but adjust for UI)
          manager.canvas.width = manager.originalWidth;
          manager.canvas.height = manager.originalHeight;
    
          // Adjust the canvas display size (scale it to fit within the page)
          manager.canvas.style.maxWidth = '100%';
          manager.canvas.style.maxHeight = '80vh'; // Prevent overflow vertically
          manager.canvas.style.marginTop = '20px';
    
          // Draw the original image at its full size
          manager.ctx.drawImage(manager.img, 0, 0);
        };
        manager.img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    // Function to pixelate the image
    pixelateImage() {
      const blockSize = blockManager.blockSize;
      // Clear the canvas before drawing the new pixelated version
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
      // Draw the original image at full size for pixelation
      this.ctx.drawImage(this.img, 0, 0, this.originalWidth, this.originalHeight);
      const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      const data = imageData.data;
    
      // Loop through each row and delay the processing of blocks
      for (let y = 0; y < this.canvas.height; y += blockSize) {
        for (let x = 0; x < this.canvas.width; x += blockSize) {
          blockManager.currentMethod(canvas, data, x, y, blockSize);
        };
      }
    
      // Put the modified image data back to the canvas
      this.ctx.putImageData(imageData, 0, 0);
    }
}

// set the default image