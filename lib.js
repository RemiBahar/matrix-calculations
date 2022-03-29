exports.toArray=function(file){
    /*
        Converts matrix text file to a 2D array in O(6n^2) time using O(n^2) space.
        File uses " " to seperate columns and /n to seperate rows.

        The file must meet the following criteria: 
        1) Contains only numbers
        2) Is a square matrix

        If the file meets the requirements, a 2D array is returned.
        Otherwise false is returned.
    */
    matrix = []
   
    //O(N^2)
    //var rows = file.toString().split("\n"); //O(3N^2)
    var rows = file.toString("UTF-8").split("\n");
    console.log(rows)
    //O(N^2)
    for (i in rows){
        var array = rows[i].split(" "); //O(N)

        //Check if matrix square
        if (array.length == rows.length){
            row =[] 
            for (x in array){
                n = Number(array[x])

                if (!isNaN(n)) {
                    row.push(Number(array[x])) //O(1)
                }
                else {
                    console.log("Matrix contains non-numeric characters")
                    return false
                }
            }
            matrix.push(row) //O(1)
        }
        else {
            console.log("Matrix is not square")
            return false
        }
    
    }
    console.log(matrix)
    console.log("end")
    return matrix
        
    
}

exports.validateMatrices = function(file1, file2){
    /*
        Checks to see if each matrix file is in the correct format using toArray.
        Performs a further check to see if each matrix has the same dimension.

        If the matrices meet the requirements, true is returned.
        Otherwise false is returned.
    */
    m1 = exports.toArray(file1)
    
    m2 = exports.toArray(file2)
    //console.log(m2)

    if (m1 != false && m2 != false && m1.length == m2.length){
        console.log(m1, m2)
        return true
    }
    else {
        console.log("Matrices have different dimensions")
        return false
    }
    
};

exports.responseToHTML = function(x){
    /*
        Converts gRPC response
    */
    output = "<table>"
    for (i = 0; i < x.length; i++){
        output += "<tr>"
        for (j = 0; j < x[i].items.length; j++){
            output += "<td>" + x[i].items[j] + "</td>"
        }
        output += "</tr>"
    }
    output += "</table>"

    return output
}

