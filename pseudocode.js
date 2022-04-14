
function createScalingMatrix(noNodes, matrix2){
    const N = matrix2.length
    const maxRows = math.floor(N/noNodes)
    const remainder = N - (noNodes * maxRows)
    const remainderRows = maxRows + remainde

    let result = Array.from(Array(noNodes).keys())

    let stringNo = 1
    let noElems = 1
    let curString = ""

    for (i = 0; i < N; i++) {
        var array = matrix[i].split(" "); //O(N)
        for (j = 0; j < N; j++){
            curString += array[j] + " "
            if((stringNo != noNodes && noElems == maxRows) || (stringNo == noNodes && noElems == remainderRows)){
                result[stringNo] += curString.trim()
                result[stringNo] += "\n"
                
                curString = ""
                noElems = 1
                stringNo ++;
            }
            noElems ++;

        }

    }

    return result
}

// Update result array
function updateResult(result, response) {
    for (i = 0; i < response.length; i++) {
        result[i].push(col.items)
    }

    return result 
}