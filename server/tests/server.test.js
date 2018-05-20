const expect = require("expect");
const supertest = require("supertest");

const { app } = require("../server.js");
const { CourtCase } = require("../models/courtCase");

// Dummy data of todos.
const cases = [{
            id: 91573,
            absolute_url: "/docket/91573/kelly-v-morse/",
            date_created: "2014-10-30T06:30:40.548624Z",
            date_modified: "2014-10-30T06:30:40.548624Z",
            resource_uri: "https://www.courtlistener.com/api/rest/v3/dockets/91573/?format=json",
            case_name: "Kelly v. Morse"
        }]

// This function runs before every test case.
beforeEach((done) => {
    CourtCase.remove({}).then(() => {  // Empties database.
        return CourtCase.insertMany(cases) // Inserts dummy data (to ensure GET requests works).
        }).then(() => done());
});

describe("POST /cases", () => {
    it("Should POST a new courtCase", (done) => {
        const newCase = {
            id: 001,
            absolute_url: "url",
            date_created: "created",
            date_modified: "modified",
            resource_uri: "uri",
            case_name: "name"
        }

        // Using supertest...
        supertest(app)
            .post("/cases") // Post request to the /todos URL
            .send(newCase)
            .expect(200)
            .expect((res) => {
                expect(res.body.id).toBeA('number');
                expect(res.body.date_created).toBeA('string')
                expect(res.body.date_modified).toBeA('string')
                expect(res.body.resource_uri).toBeA('string')
                expect(res.body.case_name).toBeA('string')
            })
            .end((err, res) => {
                if (err){
                   return done(err);
                }
                CourtCase.find({id: newCase.id}).then((cases) => {
                    expect(cases.length).toBe(1);
                    expect(cases[0].id).toBe(newCase.id);
                    expect(cases[0].absolute_url).toBe(newCase.absolute_url);
                    expect(cases[0].date_created).toBe(newCase.date_created);
                    expect(cases[0].date_modified).toBe(newCase.date_modified);
                    expect(cases[0].resource_uri).toBe(newCase.resource_uri);
                    expect(cases[0].case_name).toBe(newCase.case_name);
                    done(); // Call done to end the checks.
                }).catch((e) => done(e));
            }) // Instead of passing done, we use a function
    });

    it("Should not POST courtCase with invalid body data", (done) => {
        supertest(app)
            .post("/cases")
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                CourtCase.find().then((cases) => {
                    expect(cases.length).toBe(1);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe("GET /cases", () => {
    it("Should GET all cases", (done) => {
        supertest(app)
            .get("/cases")
            .expect(200)
            .expect((res) => {
                expect(res.body.cases.length).toBe(1);
            })
            .end(done);
    })
})