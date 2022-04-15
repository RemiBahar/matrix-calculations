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
global.resultTest = ""
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
const { matrix } = require('mathjs');

var matrix1 = false;
var matrix2 = false;
var string1 = false;
var string2 = false;
var footprint = false;
var numBlockCalls = false;


string1 = fs.readFileSync(path1).toString("UTF-8")
matrix1 = string1.split("\n")
string2 = fs.readFileSync(path2).toString("UTF-8")
matrix2 = string2.split("\n")
var test = ""
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
function serverToArray(_string){
    var rows = _string.split("\n")
    var matrix = []
   
    //O(N^2)
    //var rows = file.toString().split("\n"); //O(3N^2)
    var rows = _string.split("\n");
  
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

function testFunction(matrixArray, i) {
    
    client.multiplyMatrices({array1:string1,array2:matrixArray[i]},function(err, response) {
        console.log("Received response")
        
        if(response.message.length > 0){ 
          const output = lib.responseToString(response.message, i)
              
        } 
      });

    // Should be asynchronously run
    console.log("test asynchronous", i)
    if(i < (matrixArray.length - 1)){
        testFunction(matrixArray, i+1)
      }
    
}


// Home page
app.get('/', async (req, res) => {
    /*
        Homepage for the app.
        Always shows upload link.

        Multiply and Add links are shown if matrices have been uploaded
    */
    global.resultTest = Array.from(3)
    scalingMatrix = lib.createResultMatrix(3, matrix2)
    testFunction(scalingMatrix, 0)
    //result = resultMatrix.map(testFunction)
    console.log("test", test)
  
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

app.get('/scaling', async (req, res) => {
   
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

function subMatrix(matrix, n1, n2){
    let i = 0
    let j = 0
    result = ""
    while (i < n1){
        row = matrix[i].split(" ")
        
        let addRow = ""
        while(j < n2){
            addRow += row[j] + " "
            j++;
        }
        result += addRow.trim()
        j = 0
        result += "\n"

        i++;
    }
    
    return result.trim()
       
};


app.get('/deadline/calculation/:calculation', async (req, res) => {
    const n = 2
    testMatrix1 = subMatrix(matrix1, n, n)
    testMatrix2 = subMatrix(matrix2, n, n)
    console.log("length:", matrix1.length)

    var startTime = performance.now()

    isUploaded = checkUpload()
    target = 'localhost:50051';
    var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());
 
    if (req.params["calculation"] == "add") {
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
                process: "<form action='/add' method='post'>", 
                footprint: "<label> Footprint (ms) </label><input type='text' id='footprint' value='"+footprint+"' disabled>",
                numBlockCalls: "<label> Number of block calls  </label><input type='text' id='numBlockCalls' value='"+numBlockCalls+"' disabled>"
                })
            } 
            
          });
        //console.log(footprint)
      }
    else if (req.params["calculation"] == "multiply") {
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
   

});


// Send add request 1.283s for 1000x1000, now 1.18s
app.post('/add', async (req, res) => {
    /*
        Sends gRPC request to the addMatrices function.

        Returns: HTML of response
    */
    const deadline = req.body["deadline"]
    var numServers = (numBlockCalls * footprint)/(deadline*1000)

    if(numServers >= 7){
        numServers = 8
    } else {
        numServers = math.ceil(numServers)
    }

    console.log("numServers", numServers)

    console.time('Add time:')
    isUploaded = checkUpload()
    target = 'localhost:50051';
    var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());

    client.addMatrices({array1:string1,array2:string2},function(err, response) {
      console.log("Received response")
      if(response.message.length > 0){
        const output = lib.responseToHTML(response.message)
        /*
        fs.writeFile('./views/addition.html', output, function (err) {
            if (err) throw err;
            
            res.sendFile(path.resolve('./views/addition.html'), 'UTF-8')
        });*/
        res.render('output',  { title: 'Add', uploaded: isUploaded, table:output}) 
        console.timeEnd('Add time:')     
      } else {
        res.redirect("/process-callback")
      }
      
    });
});

function convertString(){
    // Create read interface
    const readInterface = readline.createInterface({
        input: fs.createReadStream(path1),
        output: process.stdout,
        console: false
    });

    let i =0
    var returnString = ""

    readInterface.on("line", (line) => foo(line, ++i))
    const foo = (line, i) => {
        if (i < 2){
            var array = line.split(" ").slice(0, 2);; //O(N)
            returnString += array[0]
            returnString += array[1]
            returnString += "\n"   
        }
        else {
            readInterface.close();

        }
      }
    console.log(returnString)
    return returnString
    //console.log("4by4string", footprintString1)
    
};

    
// Send multiply request - 14.718s for 1000x1000. 13.760s without templating. 12.931s with console.log
app.post('/multiply', async (req, res) => {
    /*
        Sends gRPC request to the multiplyMatrices function.
params
        Returns: HTML of response
    */
    const deadline = req.body["deadline"]
    var numServers = (numBlockCalls * footprint)/(deadline*1000)

    if(numServers >= 7){
        numServers = 8
    } else {
        numServers = math.ceil(numServers)
    }

    console.log("numServers", numServers)
    //console.log("4by4", string1)
    //console.log("hello", convertString())
    console.log("footprint", footprint)
    console.time('Multiplication time:')
    isUploaded = checkUpload()
    target = 'localhost:50051';
    var client = new matrixProto.Greeter(target, grpc.credentials.createInsecure());
   
    client.multiplyMatrices({array1:string1,array2:string2},function(err, response) {
      console.log("Received response")

      if(response.message.length > 0){ 
        const output = lib.responseToHTML(response.message)
        /*
        fs.writeFile('./views/addition.html', output, function (err) {
            if (err) throw err;
            
            res.sendFile(path.resolve('./views/addition.html'), 'UTF-8')
        });*/
        res.render('output',  { title: 'Multiply', uploaded: isUploaded, table:output})
        console.timeEnd('Multiplication time:')  
      } else {
        res.redirect("/process-callback")
      }
    });
});