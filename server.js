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

const path1 = path.resolve('./uploads/matrix1.txt')
const path2 = path.resolve('./uploads/matrix2.txt')

// Perform matrix addition
function addMatrices(call, callback) {
    /*
        Adds together matrices and returns the result as a proto
    */
    matrix1 = lib.toArray(path1) //O(n^2)
    matrix2 = lib.toArray(path2)//O(n^2)
    if(lib.validateMatrices(matrix1,matrix2)){
        console.log("Adding matrices")
        N=matrix2.length
        var result =  Array(N).fill().map(() => Array(N)); //O(n^2)

        //var result = []
        var result = matrix1
        for (i = 0; i < N; i++){
            for (j = 0; j < N; j++){
                result[i][j] = matrix1[i][j] + matrix2[i][j]; //O(3)
        }}
        proto_result = lib.toMessage(result)
        //callback(null, {message: [{items:[10,20]},{items:[30,40]}]});
        callback(null, proto_result);
    } else {
        console.log("Error adding")
        proto_result = {message:[]}
        callback(null, proto_result);
    }
    
    return proto_result
  }

  // Perform matrix multiplication
function multiplyMatrices(call, callback) {
    matrix1 = lib.toArray(path1) // O(6n^2)
    matrix2 = lib.toArray(path2) //O(6n^2)
    if(lib.validateMatrices(matrix1,matrix2)){
        console.log("Multiplying matrices")
        N = matrix1.length //O(1)
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

        proto_result = lib.toMessage(result)
        callback(null, proto_result);
    } else {
        console.log("Error multiplying")
        proto_result = {message:[]}
        callback(null, proto_result);
    }
    

  }

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(matrixProto.Greeter.service, {addMatrices: addMatrices, multiplyMatrices: multiplyMatrices});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();