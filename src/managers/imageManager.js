export const imageManager ={
    img: new Image(),
    originalWidth, 
    originalHeight,
  
    loadImgFile(file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        img.onload = function () {
          // Store original image dimensions
          originalWidth = img.width;
          originalHeight = img.height;
    
          // Set the canvas size to fit the image's size (but adjust for UI)
          canvas.width = originalWidth;
          canvas.height = originalHeight;
    
          // Adjust the canvas display size (scale it to fit within the page)
          canvas.style.maxWidth = '100%';
          canvas.style.maxHeight = '80vh'; // Prevent overflow vertically
          canvas.style.marginTop = '20px';
    
          // Draw the original image at its full size
          ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }