const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

app.set('view engine', 'pug')

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));

const fs = require("fs"); // Or `import fs from "fs";` with ESM
const { result } = require('lodash');
var AddResult = 0

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

const path1 = path.resolve('./uploads/matrix1.txt')
const path2 = path.resolve('./uploads/matrix2.txt')

var PROTO_PATH = path.resolve('./helloworld.proto');

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
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

target = 'localhost:50051';
var client = new hello_proto.Greeter(target, grpc.credentials.createInsecure());

var dir = './html';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

app.get('/', async (req, res) => {
    res.write("<!DOCTYPE html><html><body><h1>Home</h1>")
    res.write("<a href='/upload-matrix'>Upload matrix</a>")
    
    if (fs.existsSync(path1, 'UTF-8') && fs.existsSync(path2, 'UTF-8')) {
        res.write("<br><a href='/multiply'>Multiply matrix</a>")
        res.write("<br><a href='/add'>Add matrix</a>")
    }

    res.write("</body></html>")
    res.end()
});

app.get('/upload-matrix', async (req, res) => {
    res.sendFile(path.resolve('./upload.html'), 'UTF-8')
});

app.post('/process-upload-matrix', async (req, res) => {
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
            matrix1.mv('./uploads/' + matrix1.name);
            matrix2.mv('./uploads/' + matrix2.name);

            res.redirect("/");
        }
    } catch (err) {
        res.status(500).send(err);
    }

});

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

  app.get('/add', async (req, res) => {
    target = 'localhost:50051';
    var client = new hello_proto.Greeter(target, grpc.credentials.createInsecure());

    client.addMatrices({},function(err, response) {
      html = "<!DOCTYPE html><html><body><h1>Matrix Addition</h1><body>"
      html += responseToHTML(response.message)
      html += "</body></html"

      fs.writeFile('./html/addition.html', html, function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.sendFile(path.resolve('./html/addition.html'), 'UTF-8')
      });

    });
});

function read(filePath) {
    const readableStream = fs.createReadStream(filePath, 'utf8');

    readableStream.on('error', function (error) {
        console.log(`error: ${error.message}`);
    })

    readableStream.on('data', (chunk) => {
        console.log("h:",chunk);
    })
}

app.get('/multiply', async (req, res) => {
    target = 'localhost:50051';
    var client = new hello_proto.Greeter(target, grpc.credentials.createInsecure());

    client.multiplyMatrices({},function(err, response) {
      html = "<!DOCTYPE html><html><body><h1>Matrix Multiplication</h1><body>"
      html += responseToHTML(response.message)
      html += "</body></html"

      
      fs.writeFile('./html/multiplication.html', html, function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.sendFile(path.resolve('./html/multiplication.html'), 'UTF-8')
      });
    });
});