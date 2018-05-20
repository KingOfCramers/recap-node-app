const express = require("express");
const bodyParser = require("body-parser");
const { mongoose } = require("./db/mongoose");
const { CourtCase } = require("./models/courtCase");

const port = 3000;
const app = express();

app.use(bodyParser.json()); // Middlewear. Sets our headers to JSON.

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


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

// Export app for testing purposes.
module.exports = { app };