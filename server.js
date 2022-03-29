/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
const path = require('path');
const fs = require("fs"); // Or `import fs from "fs";` with ESM

function toMessage(array){
    return_message = []
    for (i = 0; i < array.length; i++){
        return_message.push({items:array[i]})
    }
    return {message:return_message}
}

function toArray(path){
    /*
        Converts matrix text file to a 2D array in O(6n^2) time using O(n^2) space.
        File uses " " to seperate columns and /n to seperate rows.

        To improve: calculate addition/multiplication while reading the array for O(n^2)
    */
    matrix = []
    if (fs.existsSync(path)){
        //O(N^2)
        var rows = fs.readFileSync(path).toString().split("\n"); //O(3N^2)
        //O(N^2)
        for (i in rows){
            var array = rows[i].split(" "); //O(N)
            row =[] 
            for (x in array){
                row.push(Number(array[x])) //O(1)
            }
            matrix.push(row) //O(1)
        
        }

        return matrix
        
    }
}

var PROTO_PATH = path.resolve('./helloworld.proto');

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
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
const path1 = path.resolve('./uploads/matrix1.txt')
const path2 = path.resolve('./uploads/matrix2.txt')



/*
function sayHello(call, callback) {
  callback(null, {message: 'Hello ' + call.request.name});
}
*/

function addMatrices(call, callback) {
    matrix1 = toArray(path1) //O(n^2)
    matrix2 = toArray(path2) //O(n^2)
    N=matrix2.length
    var result =  Array(N).fill().map(() => Array(N)); //O(n^2)

    //var result = []
    var result = matrix1
    for (i = 0; i < N; i++){
        for (j = 0; j < N; j++){
            result[i][j] = matrix1[i][j] + matrix2[i][j]; //O(3)
    }}
    proto_result = toMessage(result)
    //callback(null, {message: [{items:[10,20]},{items:[30,40]}]});
    callback(null, proto_result);
  }

function multiplyMatrices(call, callback) {
    matrix1 = toArray(path1) // O(6n^2)
    matrix2 = toArray(path2) //O(6n^2)
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

    proto_result = toMessage(result)
    callback(null, proto_result);
    return proto_result
  }


/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {addMatrices: addMatrices, multiplyMatrices: multiplyMatrices});
  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();