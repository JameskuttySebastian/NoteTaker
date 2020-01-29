// Dependencies
// =============================================================
const express = require('express');
const path = require('path');
const fs = require("fs");
const util = require("util");
// Sets up the Express App
// =============================================================
var exp = express();
var PORT = process.env.PORT || 80;

// Sets up the Express app to handle data parsing
exp.use(express.urlencoded({ extended: true }));
exp.use(express.json());
exp.use(express.static(__dirname + '/public'));

//Setting variables to use file system
const writefielAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

// Routes
// =============================================================

// Route that sends the user index.html when request / (*)
exp.get("/", function(req, res) {
    // res.send("Home Page!")
    res.sendFile(path.join(__dirname, '/public/index.html'), err =>{
        if (err) {
            console.error("Could not get public/index.html file, ", err);
        }
    });
});

// Route that sends the user notes.html
exp.get("/notes", function(req, res) {
    // res.send("Notes Page!")
    res.sendFile(path.join(__dirname, '/public/notes.html'), err =>{
        if (err) {
            console.error("Could not get public/notes.html file, ", err);
        }
    });
});

//Read data and send JSON data from db.json file
exp.get("/api/notes", async (req, res) => {
    let tableData = await readFileAsync(path.join(__dirname, "./db/db.json"), "utf8");
    // console.log(JSON.parse(tableData));
    return res.json(JSON.parse(tableData));
});


//Read data and send JSON data from db.json file
exp.post("/api/notes", async (req, res) => {
    let noteToAdd = req.body;
    console.log(noteToAdd);
    let tableData = await readFileAsync(path.join(__dirname, "./db/db.json"), "utf8");
    console.log(JSON.parse(tableData));

    return res.json(noteToAdd);
});

// Starts the server to begin listening
// =============================================================
exp.listen(PORT, function() {
    console.log(`App listening on PORT ${PORT}`);
});