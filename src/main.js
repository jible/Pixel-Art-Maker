// ------------------------------
// IMPORT 
// -------------------------------
import { paletteManager, addPallette, updatePalletteDropDown } from "./pallette.js";
import { blockMakerFunctions } from "./blockMakerFunctions.js";

//------------------------------------------------------------------
// CONSTANT DECLARATIONS
//----------------------------------------------------------------------
// Get HTML elements
const uploadInput = document.getElementById('upload');
const blockSizeInput = document.getElementById('blockSize');
const blockSizeValue = document.getElementById('blockSizeValue');
const blockCalcDropDown = document.getElementById('blockCalc');
const colorHolder = document.getElementById('colorHolder')
const addColor = document.getElementById('addColorButton')
const removeColor = document.getElementById('removeColorButton')
const canvas = document.getElementById('canvas');
const addPaletteButton = document.getElementById('addPaletteButton')
const ctx = canvas.getContext('2d');
const usePalette =  document.getElementById('usePalette')
let makeBlock = blockMakerFunctions.mean;
let img = new Image();
let originalWidth, originalHeight;
const palleteDropDown = document.getElementById("paletteSelect");

const drawingManager = {
  blockSize: blockSizeInput.value,
  drawing: false,
  current: false
}

//------------------------------------------------------------------
// EVENT LISTENERS
//----------------------------------------------------------------------
usePalette.addEventListener("click", ()=>{
  paletteManager.usePalette = !paletteManager.usePalette
  usePalette.classList.toggle('highlighted')
  pixelateImage(parseInt(blockSizeValue.textContent));
})

addPaletteButton.addEventListener("click", ()=>{
  let colors = []
  Array.from(colorHolder.children).forEach((child) =>{
    colors.push(hexToRgb(child.value))
  })
  let name = 'new';
  colorHolder.innerHTML = ''
  addPallette(name, colors)
})

function hexToRgb(hex) {
  // Remove the "#" at the beginning of the hex string if it's there
  hex = hex.replace(/^#/, '');

  // Parse the hex string into its red, green, and blue components
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Return the RGB values as an array
  return [r, g, b];
}

removeColor.addEventListener("click", ()=>{
  colorHolder.lastChild && colorHolder.removeChild(colorHolder.lastChild)
})

addColor.addEventListener("click", ()=>{
  colorHolder.appendChild(makeColorPicker())
})
function makeColorPicker(){
  const colorPicker = document.createElement('input');
  colorPicker.type = 'color';

  colorPicker.value = getRandomColor();  // Set default color to random
  return(colorPicker)
}

function getRandomColor() {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 is #FFFFFF in decimal
  return `#${randomColor.padStart(6, '0')}`;  // Ensures the hex code is always 6 digits (e.g., #ff0033)
}

palleteDropDown.addEventListener("change", function(event){
  const selectedValue = event.target.value;
  paletteManager.current = selectedValue;
  pixelateImage(parseInt(blockSizeValue.textContent));
})

uploadInput.addEventListener('change', (newImg) => {
  const file = newImg.target.files[0];
  if (file) {
    loadImgFile(file)
  }
});

// Update slider value display
blockSizeInput.addEventListener('input', (slider) => {
  blockSizeValue.textContent = slider.target.value;
});

// Apply pixelation only when slider interaction ends
blockSizeInput.addEventListener('change', (slider) => {
  if (img.src) {
    pixelateImage(parseInt(slider.target.value));
  }
});

// Handle calc method change
blockCalcDropDown.addEventListener('input', () => {
  makeBlock = blockMakerFunctions[blockCalcDropDown.value];
  pixelateImage(parseInt(blockSizeValue.textContent));
});

//------------------------------------------------------------------
// MAIN FUNCTIONS
//----------------------------------------------------------------------

// Function to load image from file input
function loadImgFile(file) {
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
    for (let x = 0; x < canvas.width; x += blockSize) {
      makeBlock(canvas, data, x, y, blockSize);
    };
  }

  // Put the modified image data back to the canvas
  ctx.putImageData(imageData, 0, 0);
}

// main operations


updatePalletteDropDown();