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

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () => 
  console.log(`App is listening on port ${port}.`)
);

const path1 = path.resolve('./uploads/matrix1.txt')
const path2 = path.resolve('./uploads/matrix2.txt')

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

function toHTML(A){
    string = ""
    N = A.length
    for (i = 0; i < N; i++){
        for (j = 0; j < N; j++){
            
            t = String(A[i][j])
            string.concat(t)
            console.log(string)
        }
        string.concat("<br>")
    }
    return string
}


app.get('/add', async (req, res) => {
    /*
        REST get method to add two matrices in O(7n^2) time using O(3n^2) space.
    */
    console.log("Add")
    //console.log("10 12".split(" "))
    matrix1 = toArray(path1) //O(n^2)

    matrix2 = toArray(path2) //O(n^2)
    console.dir(matrix2)
    N=matrix2.length
    var result =  Array(N).fill().map(() => Array(N)); //O(n^2)

    //var result = []
    var result = matrix1
    for (i = 0; i < N; i++){
        for (j = 0; j < N; j++){
            result[i][j] = matrix1[i][j] + matrix2[i][j]; //O(3)
    }}

    //O(n^2)
    res.write("<!DOCTYPE html><html><body><h1>Matrix Multiplication</h1><body><table>")
    for (i = 0; i < N; i++){
        res.write("<tr>")
        for (j = 0; j < N; j++){
            res.write("<td>")
            res.write(String(result[i][j]))
            res.write("</td>")
         }
         res.write("</tr>")
    }
    //console.log(toHTML(result))
    res.write("</table></body></html>")
    res.end()

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

app.get('/add3', async (req, res) => {
    var readable1 = fs.createReadStream(path1, {
        encoding: 'utf8',
        fd: null,
    });

    var readable2 = fs.createReadStream(path2, {
        encoding: 'utf8',
        fd: null,
    });

    readable1.on('readable', function() {
      var chunk;
      while (null !== (chunk1 = readable1.read(1) && null !== (chunk2 = readable2.read(1)) /* here */)) {
        console.log(chunk1, chunk2); // chunk is one byte
      }
    });
});

app.get('/add2', async (req, res) => {
    if (fs.existsSync(path1) && fs.existsSync(path2)){
        rows1 = fs.readFileSync(path1).toString().split(/\s+/) //O(n^2)
        rows2 = fs.readFileSync(path1).toString().split(/\s+/) //O(n^2)
        N=3
        n = 0
        res.write("<!DOCTYPE html><html><body><h1>Matrix Addition</h1><body><table><tr>")
        for (var i = 0; i < rows1.length; i++){
            if(n == N){
                res.write("</tr>") 
                res.write("<tr>") 
                n = 1
            }else{
                n += 1
            }
            console.log(n)
            res.write("<td>") 
            res.write(String(Number(rows1[i])+Number(rows2[i]))) 
            res.write("</td>") 
        }
        res.write("</tr></table></body></html>")
        res.end()
        return "Finished"
        
    }
        

});

app.get('/multiply', async (req, res) => {
    /*
        REST get method to multiply two matrices in O(4n^3 + 14n^2) time using O(3n^2) space.
    */
    console.log("Multiply")
    //console.log("10 12".split(" "))
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
    //O(n^2)
    res.write("<!DOCTYPE html><html><body><h1>Matrix Multiplication</h1><body><table>")
    for (i = 0; i < N; i++){
        res.write("<tr>")
        for (j = 0; j < N; j++){
            res.write("<td>")
            res.write(String(result[i][j])) //O(2)
            res.write("</td>")
         }
         res.write("</tr>")
    }
    //console.log(toHTML(result))
    res.write("</table></body></html>")
    res.end()
    return "Finished"

});