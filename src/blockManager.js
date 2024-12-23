import { blockMakerFunctions } from "./defaultBlockMakerFunctions.js"

// IMPORTS
export const blockManager = {
    blockSize : 1,
    makerMethods: blockMakerFunctions,
    currentMethod:  blockMakerFunctions.mean

}
