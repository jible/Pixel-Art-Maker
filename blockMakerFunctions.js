function itterateBlock(canvas, data, x,y, blockSize, callback){
    // Loop through each pixel in the block
    for (let by = 0; by < blockSize; by++) {
        for (let bx = 0; bx < blockSize; bx++) {
          const px = (y + by) * canvas.width + (x + bx);
          if (px < data.length / 4) {
            callback(px)
          }
        }
    }
}


const blockMakerFunctions = {
  mean(canvas,data,x,y, blockSize){
      let r = 0, g = 0, b = 0, count = 0;
      itterateBlock(canvas,data,x,y,blockSize, (px)=>{
          count ++
          r += data[px * 4];        // Red
          g += data[px * 4 + 1];    // Green
          b += data[px * 4 + 2];    // Blue
      })

      // Calculate average color for the block
      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      setBlockColor(r,g,b, canvas, data, x, y, blockSize)
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
}
,
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



// function getLuminosity(r, g, b) {
//   return 0.21 * r + 0.72 * g + 0.07 * b;
// }



function setBlockColor(r,g,b, canvas, data, x, y, blockSize){
    itterateBlock(canvas, data, x, y, blockSize, (px) => {
        data[px * 4] = r;      // Set red
        data[px * 4 + 1] = g;  // Set green
        data[px * 4 + 2] = b;  // Set blue
      });
}



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


function tokenColor(r, g, b) {
    return `${r},${g},${b}`;
}


function undoTokenColor(token) {
    const values = token.split(',');  // Split the string by commas
    const r = parseInt(values[0], 10);  // Convert to integers
    const g = parseInt(values[1], 10);
    const b = parseInt(values[2], 10);
    
    return { r, g, b };  // Return an object with r, g, and b properties
}
