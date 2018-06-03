const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { CourtCase } = require("./models/courtCase");
const { ObjectID } = require("mongodb");
const { databaseCheck } = require("./utils/databaseCheck");

const port = 5000;
const app = express();

app.use(bodyParser.json()); // Middlewear. Sets our headers to JSON.

app.get("/", (req,res) => {
  res.send({ text: "Hello from Express"})
});

app.post("/cases", (req,res) => {
    // Upon a POST method to /todos Url, get the body of the request, and get the text value. Use that to create a new ccase based on our mongo model.

    const ccase = new CourtCase({
        resource_uri: req.body.resource_uri,
        id: req.body.id,
        absolute_url: req.body.absolute_url,
        date_created: req.body.date_created,
        date_modified: req.body.date_modified,
        case_name: req.body.case_name
    });

    // Call the save method on our mongoose model to add it to the database.
    ccase.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get("/cases", (req,res) => {
    CourtCase.find().then((cases) => {
        res.send({ // By using an object, we can add other information...
            cases
        });
    }, (e) => {
        res.status(400).send(e);
    })  // Returns all Cases.
});


app.get("/cases/:case", (req,res) => {
    let id = req.params.case;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(); // Pass nothing back
    }

    CourtCase.findById(id).then((the_case) => {
        if(!the_case){
            return res.status(404).send("Not found.");
        }
        res.status(200).send({
            the_case
        });
    }, (e) => {
        res.status(400).send(e);
    })  // Returns all Cases.
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

const username = "Harrison";
/*
setInterval(() => {
    databaseCheck(username);
}, 5000)*/

// Export app for testing purposes.
module.exports = { app };