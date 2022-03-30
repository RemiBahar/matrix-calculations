const fs = require("fs"); // Or `import fs from "fs";` with ESM
class Matrix {
    constructor(path) {
      this.path = path;
    }
    

    // Handle uploading of matrix file
    upload(file) {
        // Delete matrix file if exists
        if (fs.existsSync(this.path, 'UTF-8')) {
            fs.unlinkSync(this.path, 'UTF-8')
        }

        file.mv(this.path);
    }

    // Convert matrix file to 2D array
    toArray(){
        /*
            Converts matrix text file to a 2D array in O(6n^2) time using O(n^2) space.
            File uses " " to seperate columns and /n to seperate rows.
    
            The file must meet the following criteria: 
            1) Contains only numbers
            2) Is a square matrix
    
            If the file meets the requirements, a 2D array is returned.
            Otherwise false is returned.
        */
        var matrix = []
       
        //O(N^2)
        //var rows = file.toString().split("\n"); //O(3N^2)
        var rows = fs.readFileSync(this.path).toString("UTF-8").split("\n");
        
        for (let i in rows){
            var array = rows[i].split(" "); //O(N)
    
            //Check if matrix square
            if (array.length == rows.length){
                var row =[] 
                for (let x in array){
                    var n = Number(array[x])
    
                    if (!isNaN(n)) {
                        row.push(Number(array[x])) //O(1)
                    }
                    else {
                        console.log("Matrix contains non-numeric characters")
                        return false
                    }
                }
                matrix.push(row) //O(1)
            }
            else {
                console.log("Matrix is not square")
                return false
            }
        
        }
        this.array = matrix
        return matrix   
        
    }


  }

  module.exports = Matrix