const pageElements = {
  inputs: {
    file : document.getElementById('upload'),
    blockSize : document.getElementById('blockSize'),
    blockType: document.getElementById('blockCalc'),
    addColor: document.getElementById('addColorButton'),
    removeColor: document.getElementById('removeColorButton'),
    addPalette: document.getElementById('addPaletteButton'),
  },
  holders: {
    newPaletteColor: document.getElementById('colorHolder'),
  },
  valueDisplay: {
    blockSize: document.getElementById('blockSizeValue'),
  },
  canvas: canvas,
  ctx : canvas.getContext('2d'),
}

function configurePageElements(){
  
}

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
  
  
  removeColor.addEventListener("click", ()=>{
    colorHolder.lastChild && colorHolder.removeChild(colorHolder.lastChild)
  })
  
  addColor.addEventListener("click", ()=>{
    colorHolder.appendChild(makeColorPicker())
  })
  
  
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


  // functions 

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
  
  function resetColorselection(){
    colorHolder.removeChild
    colorHolder.appendChild(makeColorPicker())
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