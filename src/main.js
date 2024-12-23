// ------------------------------
// IMPORT 
// -------------------------------
import { paletteManager, addPallette, updatePalletteDropDown } from "./pallette.js";
import { blockManager } from "./blockManager.js";

//------------------------------------------------------------------
// CONSTANT DECLARATIONS
//----------------------------------------------------------------------
// Get HTML elements
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let makeBlock = blockManager.makerMethods.mean;
let img = new Image();
let originalWidth, originalHeight;


const htmlElements = {
  fileUploadInput:{
    id: 'upload',
    event:'change',
    onEvent(newImg){
      const file = newImg.target.files[0];
      if (file) {
        loadImgFile(file)
      }
    },
  },
  blockSizeInputField:{
    id: 'blockSize',
    event: 'change',
    onEvent(slider){
      htmlElements.blockSizeDisplay.reference.textContent = slider.target.value;
      blockManager.blockSize = parseInt(slider.target.value)
      pixelateImage();
    },
  },
  blockSizeDisplay:{
    id: 'blockSizeValue'
  },
  blockCalculationMethodDropdown :{
    id: 'blockCalc',
    event: 'input',
    onEvent(){
      makeBlock = blockManager.makerMethods[this.reference.value];
      pixelateImage();
    },
  },
  colorHolder :{
    id: 'colorHolder'
  },
  addColor :{
    id: 'addColorButton',
    event: 'click',
    onEvent(){
      htmlElements.colorHolder.reference.appendChild(makeColorPicker())
    },
  },
  removeColor :{
    id: 'removeColorButton',
    event: 'click',
    onEvent(){
      htmlElements.colorHolder.reference.lastChild && htmlElements.colorHolder.reference.removeChild(htmlElements.colorHolder.reference.lastChild)
    },
  },
  addPaletteButton :{
    id: 'addPaletteButton',
    event: 'click',
    onEvent(){
      let colors = []
      Array.from(htmlElements.colorHolder.reference.children).forEach((child) =>{
        colors.push(hexToRgb(child.value))
      })
      let name = 'new';
      htmlElements.colorHolder.reference.innerHTML = ''
      addPallette(name, colors)
    },
  },
  usePalette: {
    id: 'usePalette',
    event: 'click',
    onEvent(){
      paletteManager.usePalette = !paletteManager.usePalette
      htmlElements.usePalette.reference.classList.toggle('highlighted')
      pixelateImage();
    },
  },
  palleteDropDown :{
    id: 'paletteSelect',
    event: 'change',
    onEvent(eventDetails){
      const selectedValue = eventDetails.target.value;
      paletteManager.current = selectedValue;
      pixelateImage();
    },
  },
}

function configureEventListeners(){
    // Using Object.keys
  Object.values(htmlElements).forEach((value) => {
    value.reference = document.getElementById(value.id)
    if (!value.event) return
    value.reference.addEventListener(value.event,(event)=>{value.onEvent(event)})
  });
}



configureEventListeners()

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
function pixelateImage() {
  const blockSize = blockManager.blockSize;
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