import { paletteManager, addPalette as addPalette, updatePalletteDropDown } from "./pallette.js";
import { blockManager } from "./blockManager.js";
import { canvasManager } from "./canvasManager.js";


const htmlElements = {
  fileUploadInput:{
    id: 'upload',
    event:'change',
    onEvent(newImg){
      const file = newImg.target.files[0];
      if (file) {
        canvasManager.loadImgFile(file)
      }
    },
  },
  blockSizeInputField:{
    id: 'blockSize',
    event: 'change',
    onEvent(slider){
      htmlElements.blockSizeDisplay.reference.textContent = slider.target.value;
      blockManager.blockSize = parseInt(slider.target.value)
      canvasManager.pixelateImage();
    },
  },
  blockSizeDisplay:{
    id: 'blockSizeValue'
  },
  blockCalculationMethodDropdown :{
    id: 'blockCalc',
    event: 'input',
    onEvent(){
        blockManager.currentMethod = blockManager.makerMethods[this.reference.value];
      canvasManager.pixelateImage();
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
      if(colors.length == 0) return
      let name = htmlElements.paletteNamer.reference.value;
      htmlElements.colorHolder.reference.innerHTML = ''
      for (let i = 0; i <6; i++){
        htmlElements.colorHolder.reference.appendChild(makeColorPicker())
      }
      addPalette(name, colors)
    },
  },
  palleteDropDown :{
    id: 'paletteSelect',
    event: 'change',
    onEvent(eventDetails){
      const selectedValue = eventDetails.target.value;
      paletteManager.current = paletteManager.collection[selectedValue];
      canvasManager.pixelateImage();
    },
  },
  paletteNamer:{
    id: 'paletteName'
  }

}

function setCustomPalette(){
  paletteManager.current = paletteManager.uiPalette
  canvasManager.pixelateImage()
}


function updateUIPalette(){
  let colors = []
  Array.from(htmlElements.colorHolder.reference.children).forEach((child) =>{
    colors.push(hexToRgb(child.value))
  })
  if(colors.length == 0) return // fails if no colors
  let name = htmlElements.paletteNamer.reference.value;
  paletteManager.uiPalette = {name:name, colors:colors}
}


export function configureHTMLElements(){
    // Using Object.keys
  Object.values(htmlElements).forEach((value) => {
    value.reference = document.getElementById(value.id)
    if (!value.event) return
    value.reference.addEventListener(value.event,(event)=>{value.onEvent(event)})
  });

  for (let i = 0; i <6; i++){
    htmlElements.colorHolder.reference.appendChild(makeColorPicker())
  }
  updateUIPalette()
  htmlElements.blockSizeInputField.reference.value = blockManager.blockSize
  htmlElements.blockSizeDisplay.reference.textContent = blockManager.blockSize


}


// ------------------------------------------
// HELPER FUNCTIONS 
// -----------------------------------------
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
    colorPicker.classList.add('color-picker')

  
    colorPicker.value = getRandomColor();  // Set default color to random
    return(colorPicker)
  }
  
  function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // 16777215 is #FFFFFF in decimal
    return `#${randomColor.padStart(6, '0')}`;  // Ensures the hex code is always 6 digits (e.g., #ff0033)
  }

