exports.add = function(matrix1, matrix2){
    const N = matrix1.length
    var result =  Array(N).fill().map(() => Array(N)); //O(n^2)

    var result = matrix1
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            result[i][j] = matrix1[i][j] + matrix2[i][j]; //O(3)
    }}

    return result
}

exports.multiply = function(matrix1, matrix2){

    const N = matrix1.length //O(1)
    var result =  Array(N).fill().map(() => Array(N)); //O(n^2)

    //O(4n^3)
    for (var i = 0; i < N; i++)
        {
            for (var j = 0; j < N; j++)
            {
                result[i][j] = 0;
                for (var k = 0; k < N; k++)
                {
                    result[i][j] += matrix1[i][k]*matrix2[k][j]; //O(4)
                }
            }
        }

        return result
}

exports.validate = function(matrix1, matrix2){
    /*
        Checks to see if each matrix file is in the correct format using toArray.
        Performs a further check to see if each matrix has the same dimension.

        If the matrices meet the requirements, true is returned.
        Otherwise false is returned.
    */
    if (matrix1 != false && matrix2 != false && matrix1.length == matrix2.length){
        //console.log(matrix1, matrix2)
        return true
    }
    else {
        console.log("Matrices have different dimensions")
        return false
    }
    
}