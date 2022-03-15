const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
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

const path1 = "/home/remi/Documents/Matrix/uploads/matrix1.txt"
const path2 = "/home/remi/Documents/Matrix/uploads/matrix2.txt"

app.get('/', async (req, res) => {
    res.write("<!DOCTYPE html><html><body><h1>Home</h1>")
    res.write("<a href='/upload-matrix'>Upload matrix</a>")
    
    if (fs.existsSync("/home/remi/Documents/Matrix/uploads/matrix1.txt") && fs.existsSync("/home/remi/Documents/Matrix/uploads/matrix1.txt")) {
        res.write("<br><a href='/multiply'>Multiply matrix</a>")
        res.write("<br><a href='/add'>Add matrix</a>")
    }

    res.write("</body></html>")
    res.end()
});

app.get('/upload-matrix', async (req, res) => {
    res.sendFile("/home/remi/Documents/Matrix/upload.html")
});

app.post('/process-upload-matrix', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            if (fs.existsSync("/home/remi/Documents/Matrix/uploads/matrix1.txt")) {
                fs.unlinkSync("/home/remi/Documents/Matrix/uploads/matrix1.txt")
            }

            if (fs.existsSync("/home/remi/Documents/Matrix/uploads/matrix2.txt")){
                fs.unlinkSync("/home/remi/Documents/Matrix/uploads/matrix2.txt") 
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
    matrix = []
    if (fs.existsSync(path)){
        var rows = fs.readFileSync(path).toString().split("\n");
        for (i in rows){
            var array = rows[i].split(" ");
            row =[]
            for (x in array){
                row.push(Number(array[x]))
            }
            matrix.push(row)
        
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
    console.log("Add")
    //console.log("10 12".split(" "))
    matrix1 = toArray(path1)
    matrix2 = toArray(path2)
    N=matrix2.length
    var result =  Array(N).fill().map(() => Array(N));

    //var result = []
    var result = matrix1
    for (i = 0; i < N; i++){
        for (j = 0; j < N; j++){
            result[i][j] = matrix1[i][j] + matrix2[i][j];
    }}

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

app.get('/multiply', async (req, res) => {
    console.log("Multiply")
    //console.log("10 12".split(" "))
    matrix1 = toArray(path1)
    matrix2 = toArray(path2)
    N = matrix1.length
    var result =  Array(N).fill().map(() => Array(N));
    for (var i = 0; i < N; i++)
    {
        for (var j = 0; j < N; j++)
        {
            result[i][j] = 0;
            for (var k = 0; k < N; k++)
            {
                result[i][j] += matrix1[i][k]*matrix2[k][j];
            }
        }
    }
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
    return "Finished"

});