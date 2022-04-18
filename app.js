// Set-up express app
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const readline = require('readline');
const math = require("mathjs")

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// enable files upload
/** This is a description of the foo function. */
app.use(fileUpload({
    createParentPath: true
}));

// view engine setup
//app.set('html', path.join(__dirname, 'html'));
app.set('view engine', 'pug');
app.use(express.json());

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
const { matrix, e } = require('mathjs');

var matrix1 = false;
var matrix2 = false;
var string1 = false;
var string2 = false;
var footprint = false;
var numBlockCalls = false;

checkUpload = function(reload){
    returnVal = false
    if (fs.existsSync(path1, 'UTF-8') && fs.existsSync(path2, 'UTF-8')) {
        returnVal = true
        if( !matrix1|| !matrix2 || !string1 || !string2){
            string1 = fs.readFileSync(path1).toString("UTF-8")
            matrix1 = string1.split("\n")
            string2 = fs.readFileSync(path2).toString("UTF-8")
            matrix2 = string2.split("\n")
        }
    }
    return returnVal
}

targetArray = fs.readFileSync("./servers.txt").toString("UTF-8").split("\n")
console.log(targetArray)



// Home page
app.get('/', async (req, res) => {
    /*
        Homepage for the app.
        Always shows upload link.

        Multiply and Add links are shown if matrices have been uploaded
    */
    res.render('index',  { title: 'Home', uploaded: checkUpload()})
});

// Upload page
app.get('/upload-matrix', async (req, res) => {
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

                        matrix1 = string1.split("\n")
                        matrix2 = string2.split("\n")

                        redirect = "/"
                    }

                } 

            }
            res.redirect(redirect)
        }
    } catch (err) {
        console.log("Processing error")
        res.status(500).send(err);
    }

});

// Deadline page
app.get('/deadline/calculation/:calculation', async (req, res) => {
   if(checkUpload(reload=true)){
        console.log("test", matrix1.length, matrix2.length)
        const n = 2
        testMatrix1 = lib.subMatrix(matrix1, n, n)
        testMatrix2 = lib.subMatrix(matrix2, n, n)
        console.log("length:", matrix1.length)

        var startTime = performance.now()

        isUploaded = checkUpload()
        target = 'localhost:50051';
        var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());
    
        if (req.params["calculation"] == "add") {
            var client = new matrixProto.Greeter(targetArray[0], grpc.credentials.createInsecure()); 		
            client.addMatrices({array1:testMatrix1,array2:testMatrix2},function(err, response) {
                    console.log("Received response")
                    if(response.message.length > 0){
                    var output = lib.responseToHTML(response.message)
                    var endTime = performance.now()
                    footprint = endTime - startTime
                    numBlockCalls = matrix1.length**2/n**2

                    res.render('deadline',  
                        { title: 'Deadline', 
                        uploaded: checkUpload(), 
                        process: "<form action='/add' method='post'>", 
                        footprint: "<label> Footprint (ms) </label><input type='text' id='footprint' value='"+footprint+"' disabled>",
                        numBlockCalls: "<label> Number of block calls  </label><input type='text' id='numBlockCalls' value='"+numBlockCalls+"' disabled>"
                        })
                    } 
                    
                });
            //console.log(footprint)
        }
        else if (req.params["calculation"] == "multiply") {
            var client = new matrixProto.Greeter(targetArray[0], grpc.credentials.createInsecure()); 		
            client.multiplyMatrices({array1:testMatrix1,array2:testMatrix2},function(err, response) {
                    console.log("Received response")
                    if(response.message.length > 0){
                    var output = lib.responseToHTML(response.message)
                    var endTime = performance.now()
                    footprint = endTime - startTime
                    numBlockCalls = matrix1.length**2/n**2

                    res.render('deadline',  
                        { title: 'Deadline', 
                        uploaded: checkUpload(), 
                        process: "<form action='/multiply' method='post'>", 
                        footprint: "<label> Footprint (ms) </label><input type='text' id='footprint' value='"+footprint+"' disabled>",
                        numBlockCalls: "<label> Number of block calls  </label><input type='text' id='numBlockCalls' value='"+numBlockCalls+"' disabled>"
                        })
                    } 
                    
                });
            
            //console.log(footprint)
        }
        else {
            res.render('error',  { title: 'Error', uploaded: checkUpload()})
        }

   }
    

});


// Send multiply request - 14.718s for 1000x1000. 13.760s without templating. 12.931s with console.log
app.post(["/multiply", "/add"], async (req, res) => {
    /*
        Sends gRPC request to the multiplyMatrices function.
params
        Returns: HTML of response
    */
    console.log()
    const deadline = req.body["deadline"]
    var numServers = (numBlockCalls * (footprint/1000))/(deadline*1000)

    if(numServers >= targetArray.length){
        numServers = 8
    } else {
        numServers = math.ceil(numServers)
    }
    console.log("numServers", numServers)
    console.log("footprint", footprint)
    console.time('Multiplication time:')
    isUploaded = checkUpload()
    scalingMatrix = lib.createResultMatrix(numServers, matrix2)

    var startTime = performance.now()
    
    numArray = Array.from(Array(numServers).keys())

    if(req.originalUrl == "/add"){
        console.log("Adding matrices")
        var title= "Add"
        var promises = numArray.map(function(x) { return lib.scaleAddition(x, scalingMatrix, string1, targetArray); })
    } else if(req.originalUrl == "/multiply"){
        console.log("Multiplying matrices")
        var title = "Multiply"
        var promises = numArray.map(function(x) { return lib.scaleMultiplication(x, scalingMatrix, string1, targetArray); })
    }

    Promise.all(promises).then(function(results) { 
        
        output = "<!DOCTYPE html><html><body><table><thead><tr><th>#</th>"

        for(j=0; j < results[0].length; j++){
        output += "<th>" + j + "</th>"
        }
        output += "</tr></thead><tbody>"

        for(i=0; i < results[0].length; i++){
            output += "<tr><th scope='row'>"+i+"</th>"

            for(j=0; j < results.length; j++){
                output += results[j][i]
            }
            output += "</tr>"
        }

        output += "</tbody></table></body></html>"
        
        res.render('output',  { title: title, uploaded: true, table:output}) 
        var endTime = performance.now()
        console.log("Finished.Time taken:", endTime - startTime)
    });
   
});