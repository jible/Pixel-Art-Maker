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