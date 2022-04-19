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
    /*
        Converts matrix string to array and performs validation. 

        Parameters:
            string [char]

        Returns:
            matrix - matrix otherwise false if matrix contains non-numeric characters or not square
    */
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
    /*
        Converts matrix string into array of numbers.

        Parameters:
            string [char] - string representation of matrix. Rows assumed to be delimited by "/n" and columns by " "

        Returns:
            matrix [[int]] - matrix
    */
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

exports.toMessage = function(array){
    /*
        Converts output from gRPC server into format suitable for protobuf.

        Parameters:
            array [[char]]

        Returns
            array [char]
    */
    return_message = []
    for (i = 0; i < array.length; i++){
        return_message.push({items:array[i]})
    }
    return {message:return_message}
}

exports.createResultMatrix = function(noNodes, matrix2){
    /*
        Divides matrix2 columns into noNodes contigous groups corresponding to each server.
        Remaining columns divided equally amonst remaining servers.

        Parameters:
            noNodes int - number of servers used in calculation
            matrix2 [[char]] - array with each row corresponding to a matrix row assumed to be delimited by " "
    */

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
    /*
        Converts gRPC response into a HTML table.

        Parameters:
            response [char] 

        Returns:
            output [char]
    */
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
    /*
        This function is mapped to the array of server numbers, resulting in a gRPC server call for each server number.

        Parameters:
            nodeNo int - server number corresponding to index of targetArray
            matrixArray [[char]] - array of columns associated with each server
            string1 [char] - matrix1
            targetArray - list of servers

        Returns:
            response.message - answer is resolved after a result is received from gRPC server
    */
    return new Promise(resolve => {
        var client = new matrixProto.Greeter(targetArray[nodeNo], grpc.credentials.createInsecure());
        client.multiplyMatrices({array1:string1,array2:matrixArray[nodeNo]},function(err, response) {
            if(response){
                console.log("Received response from server", nodeNo)
                resolve(responseToArray(response.message));    
            }  
            else if(err){
                console.log("Error calculating on server", targetArray[nodeNo])
                console.log("Err", err)
                process.exit(5)
            } 
            
            
        });
    });
}


exports.scaleAddition = function(nodeNo, matrixArray, string1, targetArray) {
    /*
        This function is mapped to the array of server numbers, resulting in a gRPC server call for each server number.

        Parameters:
            nodeNo int - server number corresponding to index of targetArray
            matrixArray [[char]] - array of columns associated with each server
            string1 [char] - matrix1
            targetArray - list of servers

        Returns:
            response.message - answer is resolved after a result is received from gRPC server
    */
    return new Promise(resolve => {
        var client = new matrixProto.Greeter(targetArray[nodeNo], grpc.credentials.createInsecure());
        client.addMatrices({array1:string1,array2:matrixArray[nodeNo]},function(err, response) {
            if(response){
                console.log("Received response from server", nodeNo)
                resolve(responseToArray(response.message));    
            }
            else if(err){
                console.log("Error calculating on server", targetArray[nodeNo])
                console.log("Err", err)
                process.exit(5)
            } 
        });
    });
}

exports.subMatrix = function(matrix, n1, n2){
    /*
        Parameters:
            matrix [[char]] - List of matrix rows. Matrix elements assumed to be delimited by " "
            n1 (int) - number of rows for subMatrix
            n2 (int) - number of columns for subMatrix

        Returns:
            subMatrix [[int]] - 2D array of matrix elements with shape (n1 x n2)
    */
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

