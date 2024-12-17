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
