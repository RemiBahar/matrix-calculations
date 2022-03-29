const fs = require("fs"); // Or `import fs from "fs";` with ESM

exports.toArray=function(path){
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
    var rows = fs.readFileSync(path).toString("UTF-8").split("\n");

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

    return matrix
        
    
}

exports.validateMatrices = function(matrix1, matrix2){
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

exports.toMessage = function(array){
    return_message = []
    for (i = 0; i < array.length; i++){
        return_message.push({items:array[i]})
    }
    return {message:return_message}
}

