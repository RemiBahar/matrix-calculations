const fs = require("fs"); // Or `import fs from "fs";` with ESM

exports.toArray = function(string){
    var rows = string.split("\n")
    matrix = []
    
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
    
    //console.log("matrix:", matrix)
    return matrix
     
}

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