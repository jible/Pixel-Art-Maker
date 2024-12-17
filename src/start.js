// ---------------------------------------------
// IMPORTS
// ---------------------------------------------

import { overHeadManager } from "./managers/overHeadManager.js";
import { configureButtons } from "./configurePageElements.js";
const imageUpdated = new CustomEvent("imageUpdated");
//
// START
//

function start(){
    // updatePalletteDropDown();
    document.addEventListener("imageUpdated", () => {
        overHeadManager.pixelateImage()
    });
    configureButtons();
}






start();