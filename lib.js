const fs = require("fs"); // Or `import fs from "fs";` with ESM
const { result } = require("lodash");
const math = require("mathjs") 


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

exports.toList = function(string){
    var rows = string.split("\n")
    matrix = []
    
    //O(N^2)
    for (i in rows){
        var array = rows[i].split(" "); //O(N)
        
        row =[] 

        for (x in array){ 
            row.push(Number(array[x])) //O(1)
        }

        matrix.push(row) //O(1)
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

exports.responseToString = function(x, counter){
    /*
        Converts gRPC response
    */
    
    output = []
    for (i = 0; i < x.length; i++){
        addRow = ""
        for (j = 0; j < x[i].items.length; j++){
            addRow += x[i].items[j] + " "
        }
        output.push(addRow.trim())
    }
    /*
    if(counter == 0){
        global.resultTest = output
    } else {
        for (i=0; i< x.length; i++){
            global.resultTest += output[[i]
        }
    }*/
    global.resultTest[counter] = output
   
    
    console.log("global mf", global.resultTest)
}

exports.responseToFile = function(x, filename){
    output = ""
    for (i = 0; i < x.length; i++){
        addRow = ""
        for (j = 0; j < x[i].items.length; j++){
            addRow += x[i].items[j] + " "
        }
        output += addRow.trim()
        output += "\n"
    }
    fileString = fs.readFileSync(filename).toString("UTF-8")
    console.log("fileString", fileString)
    fs.writeFile(filename, output, err => {
        if (err) {
          console.error(err)
          return
        }
        //file written successfully
      })
}

exports.toMessage = function(array){
    return_message = []
    for (i = 0; i < array.length; i++){
        return_message.push({items:array[i]})
    }
    return {message:return_message}
}

exports.createResultMatrix = function(noNodes, matrix2){

    const N = matrix2.length
    const maxRows = math.floor(N/noNodes)
    const remainder = N - (noNodes * maxRows)
    const remainderRows = maxRows + remainder
    //console.log("N", N, "maxRows", "noNodes", noNodes, "remainder", remainder,  "maxRows", maxRows, "remainderRows", remainderRows)
    
    //let result = Array.from(Array(noNodes).keys())
    /*
    let stringNo = 1
    let noElems = 1
    let curString = ""
    console.log("noNodes", noNodes)

    for (i = 0; i < N; i++) {
        var array = matrix2[i].split(" "); //O(N)
        
        stringNo = 1
        noElems = 1
        curString = ""
        for (j = 0; j < N; j++){
            
            curString += array[j] + " "
            console.log(array[j], noElems)
            if((stringNo != (noNodes - 1) && noElems == maxRows) || (stringNo == (noNodes -1) && noElems == remainderRows)){
                console.log("curString", curString, "stringNo", stringNo)
                result[stringNo] += curString.trim()
                result[stringNo] += "\n"
                
                curString = ""
                noElems = 1
                stringNo ++;
            }
            noElems ++;

        }

    }
    */

    let result =Array(noNodes).fill('')
    
    //console.log("initial", result.length)
    for (i = 0; i < N; i++) {
        var array = matrix2[i].split(" "); //O(N)
        var noElems = 1
        let addResult = ""
        var stringNo = 0
        for (j = 0; j < N; j++){
            //console.log(array[j], noElems==maxRows)
            addResult += array[j]
            if((stringNo < (noNodes -1) && noElems == maxRows) || (stringNo == (noNodes -1) && noElems == remainderRows)){
                if(i < (N-1)){
                    addResult += "\n"
                }
                //console.log(result)
                result[stringNo] += addResult
                //console.log(result)

                addResult = ""
                noElems = 1
                stringNo ++;

            } 
            else {
                addResult += " "
                noElems ++;
            }
            
        }

        
    }

    return result
}