export const blockManager = {
    blockMakerFunctions : {
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
    }
}

//------------------------------------------------------------------
// HELPERS
//----------------------------------------------------------------------
  
function setBlockColor(r, g, b, canvas, data, x, y, blockSize) {
    let color = [r, g, b];
    if (paletteManager.usePalette) {
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