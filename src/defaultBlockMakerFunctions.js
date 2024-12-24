import { paletteManager } from "./pallette.js";

export const blockMakerFunctions = {
    mean(canvas, data, x, y, blockSize) {
        let r = 0, g = 0, b = 0, count = 0;
        itterateBlock(canvas, data, x, y, blockSize, (px) => {
            count++;
            r += data[px * 4];        // Red
            g += data[px * 4 + 1];    // Green
            b += data[px * 4 + 2];    // Blue
        });
  
        // Calculate average color for the block
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
  
        setBlockColor(r, g, b, canvas, data, x, y, blockSize);
    },
    mode(canvas, data, x, y, blockSize) {
        // Use a single object to count RGB values efficiently
        const colorCounts = {};
        let mostCommon = { count: 0, r: 0, g: 0, b: 0 };
  
        // Iterate over the block to count colors
        itterateBlock(canvas, data, x, y, blockSize, (px) => {
            const r = data[px * 4];      // Red
            const g = data[px * 4 + 1];  // Green
            const b = data[px * 4 + 2];  // Blue
  
            // Create a unique index for each RGB combination
            const token = (r << 16) | (g << 8) | b; // Pack RGB into a single integer
  
            // Update frequency map
            colorCounts[token] = (colorCounts[token] || 0) + 1;
  
            // Track the most common color dynamically
            if (colorCounts[token] > mostCommon.count) {
                mostCommon = { count: colorCounts[token], r, g, b };
            }
        });
  
        // Set the block color to the most common one
        setBlockColor(mostCommon.r, mostCommon.g, mostCommon.b, canvas, data, x, y, blockSize);
    },
    median(canvas, data, x, y, blockSize) {
        let rs = [];
        let gs = [];
        let bs = [];
  
        // Collect RGB values from the block
        itterateBlock(canvas, data, x, y, blockSize, (px) => {
            rs.push(data[px * 4]);      // Red
            gs.push(data[px * 4 + 1]);  // Green
            bs.push(data[px * 4 + 2]);  // Blue
        });
  
        // Compute the median for each color
        const r = quickMedian(rs);
        const g = quickMedian(gs);
        const b = quickMedian(bs);
  
        // Set the block color
        setBlockColor(r, g, b, canvas, data, x, y, blockSize);
    }
};


// Function to find the closest color in the current palette
function getClosestColor(color) {
    const palette = paletteManager.current.colors;
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

//------------------------------------------------------------------
// GENERAL BLOCK HELPERS
//----------------------------------------------------------------------



function setBlockColor(r, g, b, canvas, data, x, y, blockSize) {
    let color = [r, g, b];
    if (paletteManager.current.name != 'None') {
        color = getClosestColor(color);
    }

    itterateBlock(canvas, data, x, y, blockSize, (px) => {
        data[px * 4] = color[0];      // Set red
        data[px * 4 + 1] = color[1];  // Set green
        data[px * 4 + 2] = color[2];  // Set blue
    });
}


function itterateBlock(canvas, data, x, y, blockSize, callback){
    // Loop through each pixel in the block
    for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
            const px = (y + by) * canvas.width + (x + bx);
            if (px < data.length / 4) {
                callback(px);
            }
        }
    }
}


//--------------------------------------------------------
// MATH OPPERATION HELPERS
//--------------------------------------------------------



function quickMedian(array) {
    if (!array || array.length === 0) {
        throw new Error("Array must not be empty");
    }

    const mid = Math.floor(array.length / 2);

    // Use Quickselect to find the k-th smallest element
    return quickSelect(array, mid);
}


function quickSelect(array, k) {
    let left = 0;
    let right = array.length - 1;

    while (left < right) {
        const pivotIndex = partition(array, left, right);

        if (pivotIndex === k) {
            return array[pivotIndex];
        } else if (pivotIndex < k) {
            left = pivotIndex + 1;
        } else {
            right = pivotIndex - 1;
        }
    }

    return array[left];
}


function partition(array, left, right) {
    const pivot = array[right];
    let i = left;

    for (let j = left; j < right; j++) {
        if (array[j] < pivot) {
            [array[i], array[j]] = [array[j], array[i]];
            i++;
        }
    }

    [array[i], array[right]] = [array[right], array[i]];
    return i;
}

