// Get HTML elements
const uploadInput = document.getElementById('upload');
const blockSizeInput = document.getElementById('blockSize');
const blockSizeValue = document.getElementById('blockSizeValue');
const blockCalcDropDown = document.getElementById('blockCalc');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let makeBlock = blockMakerFunctions.mean;
let img = new Image();
let originalWidth, originalHeight;

const drawingManager = {
  blockSize : blockSizeInput.value,
  drawing : false,
  current: false
}





function loadImgFile(file){
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

// Handle file upload
uploadInput.addEventListener('change', (newImg) => {
  const file = newImg.target.files[0];
  if (file) {
    loadImgFile(file)
  }
});

// Handle block size change
blockSizeInput.addEventListener('input', (slider) => {
  blockSizeValue.textContent = slider.target.value;
  if (img.src) {
    pixelateImage(parseInt(slider.target.value));
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

  // Loop through each row and delay the processing of blocks
  for (let y = 0; y < canvas.height; y += blockSize) {
    delayedRowConstruct(0, canvas.width, blockSize, (x) => {
      makeBlock(canvas, data, x, y, blockSize);
    });
  }

  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
}

// This function will construct each row with a delay
function delayedRowConstruct(startVal, max, increment, action) {
  let i = startVal;
  iterate(); // Start the iteration
  function iterate() {
    if (i >= max) {
      return; // Stop if we've reached or exceeded the max value
    }

    // Perform the action for the current 'i'
    action(i);

    // Increment and schedule the next iteration
    i += increment;
    requestAnimationFrame(iterate); // Delay until the next frame
  }
}
