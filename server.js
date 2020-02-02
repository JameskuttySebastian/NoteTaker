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
            res.sendStatus(400);
        }
    });
});

// Route that sends the user notes.html
exp.get("/notes", function(req, res) {
    // res.send("Notes Page!")
    res.sendFile(path.join(__dirname, '/public/notes.html'), err =>{
        if (err) {
            console.error("Could not get public/notes.html file, ", err);
            res.sendStatus(400);
        }
    });
});

//Read data and send JSON data from db.json file
exp.get("/api/notes", async (req, res) => {
    try{
        let noteList = await readFileAsync(path.join(__dirname, "./db/db.json"), "utf8");
        // console.log(JSON.parse(noteList));
        if(!noteList){
            noteList = '';
        }
        else{
            noteList = JSON.parse(noteList);
        }
        return res.json(noteList);
    }
    catch (e) {
        console.log('exp.get("/api/notes", async (req, res) => ' + e);
        res.sendStatus(400);
    }
});

//Read data and send JSON data from db.json file
exp.get("/api/notes/:id", async (req, res) => {
    try{
        let objectToShow  = req.params;
        //get the id of object to delete
        let idToShow = parseInt(objectToShow.id);

        let noteList = await readFileAsync(path.join(__dirname, "./db/db.json"), "utf8");
        // console.log(JSON.parse(noteList));
        if (!noteList){
            // at this point, there is nothing to delete
            noteList = [];
            return;
        }
        else{
            //prepare read json file into an array
            noteList = JSON.parse(noteList);
        }
        // find the index of note object to delete and delete
        let noteToShowIndex = noteList.findIndex(note => note.id ===idToShow);
        noteToShow = noteList[noteToShowIndex];

        return res.json(noteToShow);
    }
    catch (e) {
        console.log('exp.get("/api/notes", async (req, res) => ' + e);
        res.sendStatus(400);
    }
});

//Read data and send JSON data from db.json file
exp.post("/api/notes", async (req, res) => {
    try{
        let noteToAdd = req.body;
        //read existing notes from db and if empty, assign an empty array
        let noteList = await readFileAsync(path.join(__dirname, "./db/db.json"), "utf8");
        if (!noteList){
            noteList = [];
        }
        else{
            //parse into object array
            noteList = JSON.parse(noteList);
        }
        noteToAdd.id = noteList.length + 1;
        //add received object to array
        noteList.push(noteToAdd);
        //write back to db file
        await writefielAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(noteList));
        //return success code to client
        return res.json(200);
    }
    catch (e) {
        console.log('error : '+ e);
        res.sendStatus(400);
    }
});

//delete object from array
exp.delete("/api/notes/:id", async (req, res) => {
    try {
        let objectToDelete  = req.params;
        //get the id of object to delete
        let idToDelete = parseInt(objectToDelete.id);

        let noteList = await readFileAsync(path.join(__dirname, "./db/db.json"), "utf8");
        // console.log(JSON.parse(noteList));
        if (!noteList){
            // at this point, there is nothing to delete
            noteList = [];
            return;
        }
        else{
            //prepare read json file into an array
            noteList = JSON.parse(noteList);
        }
        // find the index of note object to delete and delete
        let noteToDeleteIndex = noteList.findIndex(note => note.id ===idToDelete);
        noteList.splice(noteToDeleteIndex, 1);

        //re-order index of notes
        for (let note of noteList) {
            note.id = noteList.indexOf(note) + 1;
        }
        // write file back to db
        await writefielAsync(path.join(__dirname, "./db/db.json"), JSON.stringify(noteList));

        // return message request was successful
        res.sendStatus(200);
    }
    catch (e) {
        console.log("Error in deleting note, ", e);
        res.sendStatus(400);
    }

});

// Starts the server to begin listening
// =============================================================
exp.listen(PORT, function() {
    console.log(`App listening on PORT ${PORT}`);
});