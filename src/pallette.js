//------------------------------------------------------------------
// CONSTS
//----------------------------------------------------------------------
const palleteDropDown = document.getElementById("paletteSelect");

export const defaultPallettes = [
    {
        name: "Retro",
        colors: [
            [255, 99, 71],    // Tomato Red
            [255, 215, 0],    // Gold
            [152, 251, 152],  // Pale Green
            [138, 43, 226],   // Blue Violet
            [0, 191, 255]     // Deep Sky Blue
        ]
    },
    {
        name: "Neon",
        colors: [
            [57, 255, 20],    // Neon Green
            [255, 0, 127],    // Neon Pink
            [0, 255, 255],    // Neon Cyan
            [255, 69, 0],     // Neon Orange
            [138, 43, 226]    // Neon Purple
        ]
    },
    {
        name: "Pastel",
        colors: [
            [244, 166, 215],  // Pastel Pink
            [255, 179, 179],  // Pastel Red
            [166, 216, 247],  // Pastel Blue
            [201, 245, 163],  // Pastel Green
            [248, 244, 166]   // Pastel Yellow
        ]
    }
    // You can add more default palettes like "vintage", "summer", "fall", etc.
];

//------------------------------------------------------------------
// PALETTE MANAGER
//----------------------------------------------------------------------

export const paletteManager = {
    usePalette: false,
    current: 0,
    collection: defaultPallettes
};
// event listeners




//------------------------------------------------------------------
// PALETTE FUNCTIONS
//----------------------------------------------------------------------


// Function to find the closest color in the current palette
export function getClosestColor(color) {
    const palette = paletteManager.collection[paletteManager.current].colors;
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
}
// --------------------------------------
export function updatePalletteDropDown(){
    palleteDropDown.innerHTML = ''
    for (let i = 0; i < paletteManager.collection.length; i++){
        let optionElement = document.createElement('option');
        optionElement.value = i;  // Set the value to "0"
        optionElement.textContent = paletteManager.collection[i].name;  // The text displayed for the option
        palleteDropDown.appendChild(optionElement)
    }
}

export function addPallette(name,colors){
    
    paletteManager.collection.push({
        name: name,
        colors: colors
    })
    updatePalletteDropDown()
} 


