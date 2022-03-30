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
var Matrix = require('./matrix');
const calculator = require('./calculator');

var matrix1 = new Matrix(path1)
var matrix2 = new Matrix(path2)


// Perform matrix addition
function addMatrices(call, callback) {
    /*
        Adds together matrices and returns the result as a proto
    */
    if(calculator.validate(matrix1.toArray(), matrix2.toArray())){
        console.log("Adding matrices")
        proto_result = lib.toMessage(calculator.add(matrix1.toArray(),matrix2.toArray()))
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
    if(calculator.validate(matrix1.toArray(), matrix2.toArray())){
        console.log("Multiplying matrices")
        proto_result = lib.toMessage(calculator.multiply(matrix1.toArray(), matrix2.toArray()))
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
  console.log("Starting server. Listening for requests on port 50051")
  var server = new grpc.Server();
  server.addService(matrixProto.Greeter.service, {addMatrices: addMatrices, multiplyMatrices: multiplyMatrices});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();