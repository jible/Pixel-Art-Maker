import { blockManager } from "./blockManager.js";

const canvas = document.getElementById('canvas');
export const canvasManager = {
    canvas: canvas,
    ctx: canvas.getContext('2d', { willReadFrequently: true }),
    img: new Image(),
    originalWidth: 0,
    originalHeight: 0,

    loadImgFile(file) {
        const reader = new FileReader();
        const manager = this;
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
    
                // Call the callback if provided
                canvasManager.pixelateImage()
            };
            manager.img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    ,

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
    },

    makePaletteFromCanvas(numColors) {
        // Cleaned this up here:
        // https://chatgpt.com/share/67bd61ca-3730-8012-bc14-91c0cc62cd6d
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
    
        const maxValue = rgbToInt(255, 255, 255);
        const rangeSize = Math.floor(maxValue / numColors);
    
        // Initialize groups as dictionaries to count colors
        let groups = Array.from({ length: numColors }, () => ({}));
    
        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                const px = (y * this.canvas.width + x) * 4;
                const r = data[px];
                const g = data[px + 1];
                const b = data[px + 2];
                const value = rgbToInt(r, g, b);
    
                let index = Math.floor(value / rangeSize);
                index = Math.min(index, numColors - 1); // Prevent out-of-bounds
    
                // Convert RGB to a string for counting
                const colorKey = `${r},${g},${b}`;
                groups[index][colorKey] = (groups[index][colorKey] || 0) + 1;
            }
        }
    
        // **Find the most common color in each group**
        let palette = groups.map(group => {
            if (Object.keys(group).length === 0) return [0, 0, 0]; // Handle empty groups
    
            const mostCommon = Object.entries(group).reduce((a, b) => (b[1] > a[1] ? b : a))[0]; // Most common color
            return mostCommon.split(',').map(n => Number(n) || 0); // Ensure all values are numbers
        });
    
        return palette;
    }
    
};



// set the default image

function imagePathToFile(imagePath, fileName) {
    return fetch(imagePath)
        .then(response => response.blob())  // Fetch the image and convert to Blob
        .then(blob => {
            // Return a new File object from the Blob, with the provided fileName
            return new File([blob], fileName, { type: blob.type });
        })
        .catch(error => {
            console.error('Error loading image from path:', error);
        });
}

// Use async/await to ensure the image is loaded and passed as a File
async function setDefaultImage() {
    const defaultImg = await imagePathToFile('./default.jpg', 'default.jpg');
    canvasManager.loadImgFile(defaultImg, () => {
        canvasManager.pixelateImage(); // Ensures this runs after the image is loaded
    });
}



// From ChatGPt
function rgbToInt(r, g, b) { 
    return (r << 16) | (g << 8) | b; 
    }
    

setDefaultImage();  // Call the function to set the default image
