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
    let colorCounts = new Map();
    let mostCommon = { count: 0, token: null };
    let newColor = { r: 0, g: 0, b: 0 };
  
    // Iterate over the block to find the most common color
    itterateBlock(canvas, data, x, y, blockSize, (px) => {
      let r = data[px * 4];      // Red
      let g = data[px * 4 + 1];  // Green
      let b = data[px * 4 + 2];  // Blue
  
      const token = tokenColor(r, g, b);
      const count = (colorCounts.get(token) || 0) + 1;
      colorCounts.set(token, count);
  
      // Update most common color dynamically
      if (count > mostCommon.count) {
        mostCommon = { count, token };
      }
    });
  
    // Decode the most common color
    newColor = undoTokenColor(mostCommon.token);
  
    setBlockColor(newColor.r,newColor.g,newColor.b, canvas, data, x, y, blockSize)
  },
  median(canvas, data, x, y, blockSize) {
    let colorCounts = new Map();
    let rs = []
    let gs = []
    let bs = []
    // Iterate over the block to find the most common color
    itterateBlock(canvas, data, x, y, blockSize, (px) => {
      rs.push( data[px * 4] );      // Red
      gs.push( data[px * 4 + 1] );   // Green
      bs.push( data[px * 4 + 2] );  // Blue
    });
    const r = getMedian(rs)
    const g = getMedian(gs)
    const b = getMedian(bs)


    setBlockColor(r,g,b, canvas, data, x, y, blockSize)
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



function getMedian(array) {
  if (!array || array.length === 0) {
      throw new Error("Array must not be empty");
  }

  // Step 1: Sort the array in ascending order
  const sortedArray = array.slice().sort((a, b) => a - b);

  const mid = Math.floor(sortedArray.length / 2);

  // Step 2: Check if the array has an odd or even length
  if (sortedArray.length % 2 === 0) {
      // If even, return the average of the two middle numbers
      return (sortedArray[mid - 1] + sortedArray[mid]) / 2;
  } else {
      // If odd, return the middle number
      return sortedArray[mid];
  }
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
