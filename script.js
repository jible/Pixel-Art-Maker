// Get HTML elements
const uploadInput = document.getElementById('upload');
const blockSizeInput = document.getElementById('blockSize');
const blockSizeValue = document.getElementById('blockSizeValue');
const blockCalcDropDown = document.getElementById('blockCalc');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function itterateBlock(canvas, data, x,y, blockSize, callback){
    // Loop through each pixel in the block
    for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
          const px = (y + by) * canvas.width + (x + bx);
          if (px < data.length / 4) {
            callback(px)
          }
        }
    }
}


const blockMakerFunctions = {
    mean(canvas,data,x,y, blockSize){
        let r = 0, g = 0, b = 0, count = 0;
        itterateBlock(canvas,data,x,y,blockSize, (px)=>{
            count ++
            r += data[px * 4];        // Red
            g += data[px * 4 + 1];    // Green
            b += data[px * 4 + 2];    // Blue
        })

        // Calculate average color for the block
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        itterateBlock(canvas,data,x,y,blockSize,(px) =>{
            data[px * 4] = r;        // Set red
            data[px * 4 + 1] = g;    // Set green
            data[px * 4 + 2] = b;    // Set blue
        })
    },
    median(canvas,data,x,y, blockSize){
        let colors = newMap()
        let count = 0;

        // itterate through each tile
        for (let j = 0; j < blockSize; j++){
            for (let i = 0; i < blockSize; i++){
                const px = (y + j) * canvas.width + (x + i);
                if ((x + i) < canvas.width && (y + j) < canvas.height) {
                    if (px < data.length / 4) {
                        let r = data[px * 4];      // Red
                        let g = data[px * 4 + 1];  // Green
                        let b = data[px * 4 + 2];  // Blue
                        count++;
                        const token = tokenColor(r,g,b);
                        colors.set(token,colors[token]? colors[token] + 1 : 1)
                    }
                }
                
                
            }
        }
        let mostCommon = {}
        colors.forEach((value, key) => {
            if ( !mostCommon.ammount || value > mostCommon.ammount){
                mostCommon.ammount = value
                mostCommon.token = key
            }
        });
        const newColor = undoTokenColor(mostCommon.token)
        

         // itterate through each tile
         for (let j = 0; j < blockSize; j++){
            for (let i = 0; i < blockSize; i++){
                const px = (y + j) * canvas.width + (x + i);
                if ((x + i) < canvas.width && (y + j) < canvas.height) {
                    if (px < data.length / 4) {
                        data[px * 4] = newColor.r;      // Red
                        data[px * 4 + 1] = newColor.g;  // Green
                        data[px * 4 + 2] = newColor.b;  // Blue
                      }
                }
                
                
            }
        }
    }
}

function tokenColor(r, g, b) {
    return `${r},${g},${b}`;
}


function undoTokenColor(token) {
    const values = token.split(',');  // Split the string by commas
    const r = parseInt(values[0], 10);  // Convert to integers
    const g = parseInt(values[1], 10);
    const b = parseInt(values[2], 10);
    
    return { r, g, b };  // Return an object with r, g, and b properties
}


let makeBlock = blockMakerFunctions.mean;
// Variables for image and pixelation
let img = new Image();
let originalWidth, originalHeight;

// Handle file upload
uploadInput.addEventListener('change', (newImg) => {
  const file = newImg.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      img.onload = function() {
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
});

// Handle block size change
blockSizeInput.addEventListener('input', (e) => {
  blockSizeValue.textContent = e.target.value;
  if (img.src) {
    pixelateImage(parseInt(e.target.value));
  }
});


//Handle calc method change
blockCalcDropDown.addEventListener('input', ()=>{
    makeBlock = blockMakerFunctions[blockCalcDropDown.value]
    pixelateImage(parseInt(blockSizeValue.textContent));
})



// Function to pixelate the image
function pixelateImage(blockSize) {
  // Clear the canvas before drawing the new pixelated version
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the original image at full size for pixelation
  ctx.drawImage(img, 0, 0, originalWidth, originalHeight);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < canvas.height; y+=blockSize){
    for (let x = 0; x < canvas.width; x+=blockSize){
        makeBlock(canvas, data, x,y, blockSize)
    }
  }

  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
}
