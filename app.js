//Set-up express app
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

// For handling files
app.use(fileUpload({
    createParentPath: true
}));

const fs = require("fs"); // Or `import fs from "fs";` with ESM

const path1 = path.resolve('./uploads/matrix1.txt')
const path2 = path.resolve('./uploads/matrix2.txt')

var dir = './html';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// For gRPC
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

// Convert protocol message to HTML
function responseToHTML(x){
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

// Homepage
app.get('/', async (req, res) => {
    res.write("<!DOCTYPE html><html><body><h1>Home</h1>")
    res.write("<a href='/upload-matrix'>Upload matrix</a>")
    
    // Display Add and Multiply matrix links if matrix files uploaded
    if (fs.existsSync(path1, 'UTF-8') && fs.existsSync(path2, 'UTF-8')) {
        res.write("<br><a href='/multiply'>Multiply matrix</a>")
        res.write("<br><a href='/add'>Add matrix</a>")
    }

    res.write("</body></html>")
    res.end()
});

// Upload matrix page
app.get('/upload-matrix', async (req, res) => {
    res.sendFile(path.resolve('./html/upload.html'), 'UTF-8')
});

// Process matrix file uploads
app.post('/process-upload-matrix', async (req, res) => {
    try {
        // Check for file upload request
        if(!req.files) {
            res.send({
                status: false,
                message: 'No files requested to be uploaded'
            });
        } else {
            // Check if previous files uploaded. New files will overwrite previous files.
            if (fs.existsSync(path1, 'UTF-8')) {
                fs.unlinkSync(path1, 'UTF-8')
            }

            if (fs.existsSync(path2, 'UTF-8')){
                fs.unlinkSync(path2, 'UTF-8') 
            }
 
            let matrix1 = req.files.matrix1;
            let matrix2 = req.files.matrix2;
            
            //Use the mv() method to place the file in uploads directory 
            matrix1.mv('./uploads/' + matrix1.name);
            matrix2.mv('./uploads/' + matrix2.name);

            res.redirect("/");
        }
    } catch (err) {
        res.status(500).send(err);
    }

});

  // Handles matrix addition requests
  app.get('/add', async (req, res) => {
    if (fs.existsSync(path1, 'UTF-8') && fs.existsSync(path2, 'UTF-8')) {
        console.log("Performing addition")

        target = 'localhost:50051';
        var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

        client.addMatrices({},function(err, response) {
            html = "<!DOCTYPE html><html><body><h1>Matrix Addition</h1><body>"
            html += responseToHTML(response.message)
            html += "</body></html"

            fs.writeFile('./html/addition.html', html, function (err) {
                if (err) throw err;
                res.sendFile(path.resolve('./html/addition.html'), 'UTF-8')
            });

        });

    } else {
        console.log("Unable to add - no matrix files uploaded")
        res.redirect("/");
    }

    
});

// Handle matrix multiplication requests
app.get('/multiply', async (req, res) => {
    if (fs.existsSync(path1, 'UTF-8') && fs.existsSync(path2, 'UTF-8')) {
        console.log("Performing multiplication")
        target = 'localhost:50051';
        var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

        client.multiplyMatrices({},function(err, response) {
            html = "<!DOCTYPE html><html><body><h1>Matrix Multiplication</h1><body>"
            html += responseToHTML(response.message)
            html += "</body></html"

            
            fs.writeFile('./html/multiplication.html', html, function (err) {
                if (err) throw err;
                res.sendFile(path.resolve('./html/multiplication.html'), 'UTF-8')
            });
            });
    } else {
        console.log("Unable to multiply - no matrix files uploaded")
        res.redirect("/");
    }
});