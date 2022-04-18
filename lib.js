const fs = require("fs"); // Or `import fs from "fs";` with ESM
const { result } = require("lodash");
const math = require("mathjs") 
// Set-up gRPC
const path = require('path');
var PROTO_PATH = path.resolve('./proto/matrix.proto');

var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
    });
var matrixProto = grpc.loadPackageDefinition(packageDefinition).matrix;

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

function responseToArray(response){
    output = []
    for (i = 0; i < response.length; i++){
        addRow = ""
        for (j = 0; j < response[i].items.length; j++){
            addRow += "<td>" + response[i].items[j] + "</td>"
        }
        output.push(addRow.trim())
    } 
    return output
}

exports.scaleMultiplication = function(nodeNo, matrixArray, string1, targetArray) {
    return new Promise(resolve => {
        var client = new matrixProto.Greeter(targetArray[nodeNo], grpc.credentials.createInsecure());
        client.multiplyMatrices({array1:string1,array2:matrixArray[nodeNo]},function(err, response) {
            if(response.message.length > 0){
                console.log("Received response from server", nodeNo)
                resolve(responseToArray(response.message));    
            } 
        });
    });
}

exports.scaleAddition = function(nodeNo, matrixArray, string1, targetArray) {
    return new Promise(resolve => {
        var client = new matrixProto.Greeter(targetArray[nodeNo], grpc.credentials.createInsecure());
        client.addMatrices({array1:string1,array2:matrixArray[nodeNo]},function(err, response) {
            if(response.message.length > 0){
                console.log("Received response from server", nodeNo)
                resolve(responseToArray(response.message));    
            } 
        });
    });
}

exports.subMatrix = function(matrix, n1, n2){
    //console.log("matrix", matrix)
    let i = 0
    let j = 0
    var result = ""
    while (i < n1){
        row = matrix[i].split(" ")
        
        let addRow = ""
        while(j < n2){
            addRow += row[j] + " "
            j++;
        }
        result += addRow.trim()
        j = 0
        result += "\n"

        i++;
    }
    
    return result.trim()
       
};

