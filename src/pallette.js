//------------------------------------------------------------------
// CONSTS
//----------------------------------------------------------------------
const paleteDropDown = document.getElementById("paletteSelect");

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
    },
    {
        name: "Gameboy",
        colors: [
            [155, 188, 15],  // Light Green
            [139, 172, 15],  // Medium Green
            [48, 98, 48],    // Dark Green
            [15, 56, 15]     // Deep Green
        ]
    },
    {
        name: "Warm Retro",
        colors: [
            [219, 112, 147], // Pale Red
            [255, 182, 193], // Light Pink
            [238, 232, 170], // Light Yellow
            [205, 133, 63],  // Light Brown
            [139, 69, 19]    // Dark Brown
        ]
    },
    {
        name: "Oceanic",
        colors: [
            [0, 105, 148],   // Deep Ocean Blue
            [72, 209, 204],  // Light Aqua
            [0, 191, 255],   // Sky Blue
            [32, 178, 170],  // Sea Green
            [0, 128, 128]    // Dark Teal
        ]
    },
    {
        name: "Neon Cyberpunk",
        colors: [
            [255, 0, 255],   // Neon Magenta
            [0, 255, 255],   // Neon Cyan
            [255, 255, 0],   // Neon Yellow
            [0, 0, 0],       // Deep Black
            [128, 0, 128]    // Purple Glow
        ]
    },
    {
        name: "Firelight",
        colors: [
            [255, 69, 0],    // Bright Red
            [255, 140, 0],   // Orange Flame
            [255, 215, 0],   // Gold
            [139, 69, 19],   // Deep Brown
            [70, 130, 180]   // Ash Blue
        ]
    },
    {
        name: "Desert Sands",
        colors: [
            [237, 201, 175], // Sand Beige
            [244, 164, 96],  // Desert Orange
            [210, 180, 140], // Tan
            [160, 82, 45],   // Sienna Brown
            [128, 70, 27]    // Dark Sand
        ]
    },
    {
        name: "Candy Crush",
        colors: [
            [255, 105, 180], // Hot Pink
            [255, 182, 193], // Light Pink
            [135, 206, 235], // Sky Blue
            [255, 250, 205], // Lemon Yellow
            [144, 238, 144]  // Light Green
        ]
    },
    {
        name: "Forest Dream",
        colors: [
            [34, 139, 34],   // Forest Green
            [85, 107, 47],   // Olive Green
            [107, 142, 35],  // Light Olive
            [160, 82, 45],   // Brown Bark
            [152, 251, 152]  // Pale Green
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



// --------------------------------------
export function updatePalletteDropDown(){
    paleteDropDown.innerHTML = ''
    for (let i = 0; i < paletteManager.collection.length; i++){
        let optionElement = document.createElement('option');
        optionElement.value = i;  // Set the value to "0"
        optionElement.textContent = paletteManager.collection[i].name;  // The text displayed for the option
        paleteDropDown.appendChild(optionElement)
    }
}


export function addPallette(name,colors){
    
    paletteManager.collection.push({
        name: name,
        colors: colors
    })
    let optionElement = document.createElement('option');
    optionElement.value = paletteManager.collection.length -1 ;  // Set the value to "0"
    console.log(paletteManager.collection[paletteManager.length-1])
    optionElement.textContent = paletteManager.collection[paletteManager.collection.length-1].name;  // The text displayed for the option
    paleteDropDown.appendChild(optionElement)
} 


