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

// Perform matrix addition
function addMatrices(call, callback) {
    /*
        Adds together matrices and returns the result as a protobuff

        Parameters:
          call - call from app.js gRPC client
          callback - passed to gRPC client to handle asynchronous result

        Returns:
          proto_result - protobuff of answer
    */
        console.log("Performing Addition")
        var _matrix1 = lib.toList(call.request.array1)
        var _matrix2 = lib.toList(call.request.array2)
        const N = _matrix1.length
        const M = _matrix2.length
        const P = _matrix2[0].length
       
        var result =  Array(N).fill().map(() => Array(P)); //O(n^2)
    
        for (var i = 0; i < N; i++){
            for (var j = 0; j < P; j++){
                result[i][j] = _matrix1[i][j] + _matrix2[i][j]; //O(3)
        }}
        proto_result = lib.toMessage(result)
        //console.log("Result", result)
        callback(null, proto_result);
    
        return proto_result
  
  }

  // Perform matrix multiplication
 function multiplyMatrices(call, callback) {
    /*
        Multiply together matrices and returns the result as a protobuff

        Parameters:
          call - call from app.js gRPC client
          callback - passed to gRPC client to handle asynchronous result

        Returns:
          proto_result - protobuff of answer
    */
    console.log("Performing Multiplication")
    var _matrix1 = lib.toList(call.request.array1)
    var _matrix2 = lib.toList(call.request.array2)
    const N = _matrix1.length
    const M = _matrix2.length
    const P = _matrix2[0].length
   
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
