// IMPORTS
import {defaultPallettes} from ''


// MANAGER
const paletteManager = {
    usePalette: false,
    current: 0,
    collection: defaultPallettes,
    getClosestColor(color) {
      const palette = collection[paletteManager.current].colors;
      let closestColor = palette[0];
      let minDistance = Infinity;

      palette.forEach(paletteColor => {
          const distance = Math.sqrt(Math.pow(paletteColor[0] - color[0], 2) + 
                                    Math.pow(paletteColor[1] - color[1], 2) + 
                                    Math.pow(paletteColor[2] - color[2], 2));
          
          if (distance < minDistance) {
              closestColor = paletteColor;
              minDistance = distance;
          }
      });

      return closestColor;
  },
  // --------------------------------------
  updatePalletteDropDown(){
      palleteDropDown.innerHTML = ''
      for (let i = 0; i < paletteManager.collection.length; i++){
          let optionElement = document.createElement('option');
          optionElement.value = i;  // Set the value to "0"
          optionElement.textContent = paletteManager.collection[i].name;  // The text displayed for the option
          palleteDropDown.appendChild(optionElement)
      }
  },

  addPallette(name,colors){
      paletteManager.collection.push({
          name: name,
          colors: colors
      })
      updatePalletteDropDown()
  } 
};
