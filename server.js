// For file handling
path = require('path');
const fs = require("fs"); // Or `import fs from "fs";` with ESM
var lib = require('./lib');

// Set-up gRPC
var PROTO_PATH = path.resolve('./proto/matrix.proto');

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

function serverToArray(string){
  var rows = string.split("\n")
  matrix = []
 
  //O(N^2)
  //var rows = file.toString().split("\n"); //O(3N^2)
  var rows = string.split("\n");

  for (i in rows){
      var array = rows[i].split(" "); //O(N)

      row =[] 
      for (x in array){
        n = Number(array[x])
        row.push(Number(array[x])) //O(1)
      }
      matrix.push(row) //O(1)

  }

  return matrix
   
}

function toList(string){
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

// Perform matrix addition
function addMatrices(call, callback) {
    /*
        Adds together matrices and returns the result as a proto
    */
    var matrix1 = serverToArray(call.request.array1)
    var matrix2 = serverToArray(call.request.array2)
    const N = matrix1.length
    var result =  Array(N).fill().map(() => Array(N)); //O(n^2)

    var result = matrix1
    for (var i = 0; i < N; i++){
        for (var j = 0; j < N; j++){
            result[i][j] = matrix1[i][j] + matrix2[i][j]; //O(3)
    }}

    proto_result = lib.toMessage(result)
    callback(null, proto_result);

    return proto_result
  }

  // Perform matrix multiplication
 function multiplyMatrices(call, callback) {
    console.log("Performing Multiplication")
    var _matrix1 = toList(call.request.array1)
    var _matrix2 = toList(call.request.array2)
    N = _matrix1.length
    M = _matrix2.length
    P = _matrix2[0].length
   
    var result =  Array(N).fill().map(() => Array(P)); //O(n^2)

    for (var i = 0; i < N; i++)
        {
            for (var j = 0; j < P; j++)
            {
                result[i][j] = 0;
                for (var k = 0; k < M; k++)
                {
                    result[i][j] += _matrix1[i][k]*_matrix2[k][j]; //O(4)
                }
            }
        }
      proto_result = lib.toMessage(result)
      //console.log("Result", result)
      callback(null, proto_result);
  
      return proto_result

  }

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  console.log("Starting server. Listening for requests on port 50051")
  var server = new grpc.Server();
  server.addService(matrixProto.Greeter.service, {addMatrices: addMatrices, multiplyMatrices: multiplyMatrices});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
