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

// Home page
app.get('/', async (req, res) => {
    /*
        Homepage for the app.
        Always shows upload link.

        Multiply and Add links are shown if matrices have been uploaded
    */
    res.write("<!DOCTYPE html><html><body><h1>Home</h1>")
    res.write("<a href='/upload-matrix'>Upload matrix</a>")
    
    if (fs.existsSync(path1, 'UTF-8') && fs.existsSync(path2, 'UTF-8')) {
        res.write("<br><a href='/multiply'>Multiply matrix</a>")
        res.write("<br><a href='/add'>Add matrix</a>")
    }

    res.write("</body></html>")
    res.end()
});

// Upload page
app.get('/upload-matrix', async (req, res) => {
    res.sendFile(path.resolve('./html/upload.html'), 'UTF-8')
});

app.get('/process-callback', async (req, res) => {
    /*
        Checks uploaded matrix files are in the correct format:
        1) Matrices must be square
        2) Both matrices should have the same dimension
        3) Both matrices should consist only of numbers

        If these criteria are met, user redirected to homepage.
        Otherwise an error page shows with a link to the matrix upload page.
    */
    matrix1 = fs.readFileSync(path1)
    matrix2 = fs.readFileSync(path2)
    
    m1 = lib.toArray(matrix1)
    m2 = lib.toArray(matrix2)
    if(lib.validateMatrices(matrix1,matrix2)){
        res.redirect("/");
    }
    else {
        fs.unlinkSync(path1, 'UTF-8')
        fs.unlinkSync(path2, 'UTF-8') 
        res.write("<!DOCTYPE html><html><body><h1>Error</h1>")
        res.write("Please ensure you upload two matrices which have the same dimensions, are square, contain only numbers, and use ' ' as a seperator and /n for new lines <br>")
        res.write("<a href='/upload-matrix'>Upload matrix</a>")
        res.write("</body></html>")
    }
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
            if (fs.existsSync(path1, 'UTF-8')) {
                fs.unlinkSync(path1, 'UTF-8')
            }

            if (fs.existsSync(path2, 'UTF-8')){
                fs.unlinkSync(path2, 'UTF-8') 
            }
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let matrix1 = req.files.matrix1;
            let matrix2 = req.files.matrix2;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            matrix1.mv('./uploads/matrix1.txt');
            matrix2.mv('./uploads/matrix2.txt');

            res.redirect("/process-callback")
            
        }
    } catch (err) {
        console.log("Processing error")
        res.status(500).send(err);
    }

});

// Send add request
app.get('/add', async (req, res) => {
    /*
        Sends gRPC request to the addMatrices function.

        Returns: HTML of response
    */
    target = 'localhost:50051';
    var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

    client.addMatrices({},function(err, response) {
      html = "<!DOCTYPE html><html><body><h1>Matrix Addition</h1><body>"
      html += lib.responseToHTML(response.message)
      html += "</body></html"

      fs.writeFile('./html/addition.html', html, function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.sendFile(path.resolve('./html/addition.html'), 'UTF-8')
      });

    });
});

// Send multiply request
app.get('/multiply', async (req, res) => {
    /*
        Sends gRPC request to the multiplyMatrices function.

        Returns: HTML of response
    */
    target = 'localhost:50051';
    var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

    client.multiplyMatrices({},function(err, response) {
      html = "<!DOCTYPE html><html><body><h1>Matrix Multiplication</h1><body>"
      html += lib.responseToHTML(response.message)
      html += "</body></html"

      
      fs.writeFile('./html/multiplication.html', html, function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.sendFile(path.resolve('./html/multiplication.html'), 'UTF-8')
      });
    });
});