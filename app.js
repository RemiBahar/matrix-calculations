// Set-up express app

const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

// enable files upload
/** This is a description of the foo function. */
app.use(fileUpload({
    createParentPath: true
}));

// view engine setup
//app.set('html', path.join(__dirname, 'html'));
app.set('view engine', 'pug');

// Compile the source code
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

// Set-up gRPC

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

target = 'localhost:50051';
var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

// Define application structure

const fs = require("fs"); // Or `import fs from "fs";` with ESM

var dir = './html';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const path1 = path.resolve('./uploads/matrix1.txt')
const path2 = path.resolve('./uploads/matrix2.txt')


// Extra functions
const lib = require('./lib');

var matrix1 = false;
var matrix2 = false;
var string1 = false;
var string2 = false;

checkUpload = function(){
    returnVal = false
    if (fs.existsSync(path1, 'UTF-8') && fs.existsSync(path2, 'UTF-8')) {
        returnVal = true
        if(matrix1 == false || matrix2 == false || string1 == false || string2 == false){
            string1 = fs.readFileSync(path1).toString("UTF-8")
            matrix1 = string1.split("\n")
            string2 = fs.readFileSync(path2).toString("UTF-8")
            matrix2 = string2.split("\n")
        }
    }
    return returnVal

    
}
// Home page
app.get('/', async (req, res) => {
    /*
        Homepage for the app.
        Always shows upload link.

        Multiply and Add links are shown if matrices have been uploaded
    */
    res.render('layout',  { title: 'Home', uploaded: checkUpload()})
});

// Upload page
app.get('/upload-matrix', async (req, res) => {
    res.sendFile(path.resolve('./html/upload.html'), 'UTF-8')
    res.render('upload',  { title: 'Upload', uploaded: checkUpload()})
});

// Error page       else {
            
        
app.get('/process-callback', async (req, res) => {
    res.render('error',  { title: 'Error', uploaded: false})
});

// Upload matrices
app.post('/process-upload-matrix', async (req, res) => {
    /*
        Uploads matrix files.

        If no files are sent in the request an error message is sent.
        Otherwise, calls the process-call back function.
    */
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            string1 = req.files.matrix1.data.toString("UTF-8")
            var array1 = lib.toArray(string1)
            var redirect = "/process-callback"
           
            if(array1 != false){
                string2 = req.files.matrix2.data.toString("UTF-8")
                var array2 = lib.toArray(string2)
                if(array2 != false){
                    if (array1.length % 2 === 0  && array1.length == array2.length){
                        if (fs.existsSync(path1, 'UTF-8')) {
                            fs.unlinkSync(path1, 'UTF-8')
                        }

                        if (fs.existsSync(path2, 'UTF-8')) {
                            fs.unlinkSync(path2, 'UTF-8')
                        }
                        console.log("Uploading")
                        req.files.matrix1.mv(path1);
                        req.files.matrix2.mv(path2);

                        matrix1 = array1
                        matrix2 = array2

                        redirect = "/"
                    }

                } 

            }

            //matrix1.upload(req.files.matrix1)
            //matrix2.upload(req.files.matrix2)
            
            res.redirect(redirect)
            
        }
    } catch (err) {
        console.log("Processing error")
        res.status(500).send(err);
    }

});

// Send add request 1.283s for 1000x1000
app.get('/add', async (req, res) => {
    /*
        Sends gRPC request to the addMatrices function.

        Returns: HTML of response
    */
    console.time('codezup')
    isUploaded = checkUpload()
    target = 'localhost:50051';
    var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

    client.addMatrices({array1:string1,array2:string2},function(err, response) {
      console.log("Received response")
      if(response.message.length > 0){
        res.render('output',  { title: 'Add', uploaded: isUploaded, table:lib.responseToHTML(response.message)}) 
        console.timeEnd('codezup')     
      } else {
        res.redirect("/process-callback")
      }

    });
});

// Send multiply request - 14.718s for 1000x1000
app.get('/multiply', async (req, res) => {
    /*
        Sends gRPC request to the multiplyMatrices function.

        Returns: HTML of response
    */
    console.time('codezup')
    isUploaded = checkUplomultiplyad()
    target = 'localhost:50051';
    var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

    client.multiplyMatrices({array1:string1,array2:string2},function(err, response) {
      console.log("Received response")
      if(response.message.length > 0){ 
        res.render('output',  { title: 'Multiply', uploaded: isUploaded, table:lib.responseToHTML(response.message)})
        console.timeEnd('codezup')   
      } else {
        res.redirect("/process-callback")
      }
    });
});