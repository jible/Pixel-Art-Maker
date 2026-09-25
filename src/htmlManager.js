import { paletteManager, addPalette as addPalette, updatePalletteDropDown } from "./pallette.js";
import { blockManager } from "./blockManager.js";
import { canvasManager } from "./canvasManager.js";
import { cropManager } from "./cropManager.js";


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
  exportImage:{
    id:"export",
    event: "click",
    onEvent(){
      // Shrink the cropped area so each block becomes a single pixel
      const blockSize = blockManager.blockSize
      const source = canvasManager.canvas
      const sourceData = canvasManager.ctx.getImageData(0, 0, source.width, source.height).data
      const { col0, row0, col1, row1 } = cropManager.getBlockRect()
      const exportCanvas = document.createElement('canvas')
      exportCanvas.width = col1 - col0
      exportCanvas.height = row1 - row0
      const exportCtx = exportCanvas.getContext('2d')
      const exportImageData = exportCtx.createImageData(exportCanvas.width, exportCanvas.height)

      for (let y = 0; y < exportCanvas.height; y++) {
        for (let x = 0; x < exportCanvas.width; x++) {
          // Every pixel in a block is the same colour, so sample its top-left pixel
          const sourcePx = (((row0 + y) * blockSize) * source.width + (col0 + x) * blockSize) * 4
          const exportPx = (y * exportCanvas.width + x) * 4
          for (let i = 0; i < 4; i++) {
            exportImageData.data[exportPx + i] = sourceData[sourcePx + i]
          }
        }
      }
      exportCtx.putImageData(exportImageData, 0, 0)

      const dataURL = exportCanvas.toDataURL('image/png')
      const link = document.createElement('a');
      link.href = dataURL
      link.download = "pixelated.png"
      link.click()
    }
  },
  blockSizeInputField:{
    id: 'blockSize',
    event: 'change',
    onEvent(slider){
      blockManager.blockSize = parseInt(slider.target.value)
      canvasManager.pixelateImage();
    },
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
  },
  getPaletteFromCanvas:{
    id: 'getCanvasPalette',
    event: 'click',
    onEvent(){
      console.log( canvasManager.makePaletteFromCanvas(10) )
    }
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

