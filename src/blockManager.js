import { blockMakerFunctions } from "./defaultBlockMakerFunctions.js"

// IMPORTS
export const blockManager = {
    blockSize : 25,
    makerMethods: blockMakerFunctions,
    currentMethod:  blockMakerFunctions.lazy

}
