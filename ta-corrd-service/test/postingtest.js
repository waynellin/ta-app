/**
 * Created by TenzinLama on 2017-03-7.
 */
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let Client = require('node-rest-client').Client;
let client = new Client();

let Course = require('../models/course');
let Posting = require('../models/posting');

let app = require('../app');
chai.use(chaiHttp);

let newCourseBody = {
    course_code: "CSC500H1S",
    term: "Fall",
    year: "2018",
    instructor: "Danny",
    ta_needed: 5,
    tas: ["john", "dave"]
};

let newCourseBody2 = {
    course_code: "CSC600H1S",
    term: "Fall",
    year: "2018",
    instructor: "Danny",
    ta_needed: 5,
    tas: ["john", "dave"]
};

let startDate = new Date("January 1, 2017");
let endDate = new Date("April 30, 2017");
let newPostingBody = {
    requirements: "nothing",
    start_date: startDate,
    end_date: endDate
};

let courseId;
let courseObject;
let courseObject2;
let course2Id;
let postingId;

let ta_coord_signin_args = {
    headers: {
        'x-coordinator-account-key': "PROJAWOLCOORDINATORACCOUNTKEY",
        "Content-Type": "application/json"
    },
    data: {
        email: 'test',
        id: 'test',
        password: 'test',
        user_type: 'ta-coordinator'
    },
};

let student_signin_args = {
    headers: {
        "Content-Type": "application/json"
    },
    data: {
        email: 'test2',
        password: 'test2'
    },
}

let student_token;
let coordinator_token;

describe('posting', function() {
    this.timeout(0);
    before((done) => {
        //sign up for a student account and ta account
        //create a posting
        //create a course first

        let newCourse = new Course(newCourseBody);
        let newCourse2 = new Course(newCourseBody2);
        newCourse2.save((err, doc) => {
            if (err) throw err;
            course2Id = doc._id;
            courseObject2 = doc;
            newCourse.save((err, doc) => {
                if (err) throw err;
                courseId = doc._id;
                newPostingBody.course_id = doc._id;
                courseObject = doc;
                let newPosting = new Posting(newPostingBody);
                newPosting.save((err, doc) => {
                    if (err) throw err;
                    postingId = doc._id;
                    //sign up for student and ta accounts
                    //student and TA signin/authenticate
                    client.post('http://localhost:3002/students/sign-up', student_signin_args, function(data, res) {
                        client.post('http://localhost:3002/students/authenticate', student_signin_args, function(data, res) {
                            student_token = data.user.user_token;
                            //ta_coordinator sign in/authenticate
                            client.post('http://localhost:3002/ta-coordinators/sign-up', ta_coord_signin_args, function(data, res) {
                                client.post('http://localhost:3002/ta-coordinators/authenticate', ta_coord_signin_args, function(data, res) {
                                    coordinator_token = data.user.user_token;
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    after((done) => {
        //delete the posting and course
        Course.remove({
            course_code: "CSC500H1S"
        }, (err) => {
            if (err) throw err;
            Posting.remove({
                requirements: "nothing"
            }, (err) => {
                if (err) throw err;
                Course.remove({
                    course_code: "CSC600H1S"
                }, (err) => {
                    if (err) throw err;
                    done();
                });
            });
        });
    });
    it('should be able to get all postings as a ta-coordinator', (done) => {
        chai.request(app)
            .get('/posting')
            .set('x-access-token', coordinator_token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                Posting.find({}, (err,doc)=>{
                  expect(doc.length).to.be.equal(res.body.length);
                  done();
                })
            });
    });
    it('should be able to get all postings as a student', (done) => {
        chai.request(app)
            .get('/posting')
            .set('x-access-token', student_token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 200 if there is no postings', (done) => {
        chai.request(app)
            .get('/posting')
            .set('x-access-token', student_token)
            .query({
                "requirements": "everything"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should successfully create a posting', (done) => {
        new_start_date = new Date("January 1, 2018");
        new_end_date = new Date("April 30, 2018");
        data = {
            course_id: course2Id,
            requirements: "nothing",
            start_date: new_start_date,
            end_date: new_end_date
        }
        chai.request(app)
            .post('/posting')
            .set('x-access-token', coordinator_token)
            .send(data)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.posting.course_id).to.be.equal(course2Id.toString());
                expect(courseObject2._id.toString()).to.be.equal(res.body.posting.course._id.toString());
                expect(courseObject2.course_code).to.be.equal(res.body.posting.course.course_code);
                expect(courseObject2.term).to.be.equal(res.body.posting.course.term);
                done();
            });
    });

    it('should not allow student to create a posting', (done) => {
        new_start_date = new Date("January 1, 2018");
        new_end_date = new Date("April 30, 2018");
        data = {
            course_id: course2Id,
            requirements: "nothing",
            start_date: new_start_date,
            end_date: new_end_date
        }
        chai.request(app)
            .post('/posting')
            .set('x-access-token', student_token)
            .send(data)
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should return 409 if posting already exists', (done) => {
        new_start_date = new Date("January 1, 2018");
        new_end_date = new Date("April 30, 2018");
        data = {
            course_id: courseId,
            requirements: "nothing",
            start_date: new_start_date,
            end_date: new_end_date
        }
        chai.request(app)
            .post('/posting')
            .set('x-access-token', coordinator_token)
            .send(data)
            .end((err, res) => {
                expect(res).to.have.status(409);
                done();
            });
    });

    it('should return 400 if course for posting does not exists', (done) => {
        new_start_date = new Date("January 1, 2018");
        new_end_date = new Date("April 30, 2018");
        data = {
            course_id: "507f191e810c19729de860ea",
            requirements: "nothing",
            start_date: new_start_date,
            end_date: new_end_date
        }
        chai.request(app)
            .post('/posting')
            .set('x-access-token', coordinator_token)
            .send(data)
            .end((err, res) => {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should be able to get a specific posting', (done) => {
        chai.request(app)
            .get('/posting/' + postingId.toString())
            .set('x-access-token', coordinator_token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body[0].course_id).to.be.equal(courseId.toString());
                done();
            });
    });

    it('should return 404 if posting not found', (done) => {
        chai.request(app)
            .get('/posting/507f191e810c19729de860ea')
            .set('x-access-token', coordinator_token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should successfully delete a posting', (done) => {
        chai.request(app)
            .delete('/posting/' + postingId.toString())
            .set('x-access-token', coordinator_token)
            .end((err, res) => {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not allow students to delete a posting', (done) => {
        chai.request(app)
            .delete('/posting/' + postingId.toString())
            .set('x-access-token', student_token)
            .end((err, res) => {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should return 404 when trying to delete a posting that does not exist', (done) => {
        chai.request(app)
            .delete('/posting/507f191e810c19729de860ea')
            .set('x-access-token', coordinator_token)
            .end((err, res) => {
                expect(res).to.have.status(404);
                done();
            });
    });

});
