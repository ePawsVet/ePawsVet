
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};

export default function createSorted(unsortedArray, unsortedArrayLength) {
    // Auxiliary Array
    var sortedArray = [];

    for (var j = 0; j < unsortedArrayLength; j++) {
        // if sortedArray is empty any element can be at
        // first place
        if (sortedArray.length === 0) sortedArray.push(unsortedArray[j]);
        else {
            // Perform Binary Search to find the correct
            // position of current element in the
            // new array
            var start = 0,
                end = sortedArray.length - 1;

            // let the element should be at first index
            var pos = 0;

            while (start <= end) {
                var mid = start + parseInt((end - start) / 2);

                // if unsortedArray[j] is already present in the new array
                if (sortedArray[mid].priority === unsortedArray[j].priority) {
                    // add unsortedArray[j] at mid+1. you can add it at mid
                    sortedArray.insert(Math.max(0, mid + 1), unsortedArray[j]);

                    break;
                }

                // if unsortedArray[j] is lesser than sortedArray[mid] go right side
                else if (sortedArray[mid].priority > unsortedArray[j].priority)
                    // means pos should be between start and mid-1
                    pos = end = mid - 1;
                // else pos should be between mid+1 and end
                else pos = start = mid + 1;

                // if unsortedArray[j] is the largest push it at last
                if (start > end) {
                    pos = start;
                    sortedArray.insert(Math.max(0, pos), unsortedArray[j]);

                    // here Max(0, pos) is used because sometimes
                    // pos can be negative as smallest duplicates
                    // can be present in the array
                    break;
                }
            }
        }
    }

    // Return the new generated sorted array
    return sortedArray;
}

