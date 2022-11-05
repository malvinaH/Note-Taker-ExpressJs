const fs = require("fs");
const express = require("express");
const path = require("path");
const dbJson = require("./db/db.json")

const app = express();
const PORT = process.env.PORT || 3001;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// routes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    const dataNotes = fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8");
    const parseNotes = JSON.parse(dataNotes);
    res.json(parseNotes);
});

app.post("/api/notes", (req, res) => {
    const dataNotes = fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8");
    const parseNotes = JSON.parse(dataNotes);
    req.body.id = uuidv1()
    parseNotes.push(req.body);

    fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(parseNotes), "utf-8");
    res.json("You have successfully added a note!");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.delete("/api/notes/:id", function (req, res) {
    let deletedNote = parseInt(req.params.id);

    for (let i = 0; i < dbJson.length; i++) {
        if (deletedNote === dbJson[i].id) {
            dbJson.splice(i, 1);

            let noteJson = JSON.stringify(dbJson, null, 2);
            fs.writeFile("./db/db.json", noteJson, function (err) {
                if (err) throw err;
                console.log("Note successfully deleted!");
                res.json(dbJson);
            });
        }
    }
});

app.listen(PORT, () => console.log(`Listening on ${PORT}!`));