/**
 * Created by TenzinLama on 2017-03-7.
//  */
let Client = require('node-rest-client').Client;
let client = new Client();
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let app = require('../app');
let Course = require('../models/course');
let Config = require('../config');

chai.use(chaiHttp);

let newCourseBody = {
    course_code: "CSC500H1S",
    term: "Fall",
    year: "2018",
    instructor: "Danny",
    ta_needed: 5,
    tas: ["john", "dave"]
};
let newCourseBodyFull = {
    course_code: "CSC600H1S",
    term: "Fall",
    year: "2018",
    instructor: "Danny",
    ta_needed: 2,
    tas: ["john", "dave"]
}
let _id;
let _idFull;
let coordinator_token;
let student_token;
describe('course', function() {
    this.timeout(0);
    before(function(done) {

        let newCourse = new Course(newCourseBody);
        newCourse.save((err, doc) => {
            if (err) throw err;
            _id = doc._id;
        });
        let newCourse2 = new Course(newCourseBodyFull);
        newCourse2.save((err, doc) => {
            if (err) throw err;
            _idFull = doc._id
        });

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
        //student signin/authenticate
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
    after(function(done) {
        Course.remove({
            course_code: "CSC500H1S"
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

    it('should return 401 if no token', function(done) {
        chai.request(app)
            .get('/course')
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should return status 200 for finding all courses', function(done) {
        chai.request(app)
            .get('/course')
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 200 for finding a specific course', function(done) {
        chai.request(app)
            .get('/course')
            .set('x-access-token', coordinator_token)
            .query({
                course_code: "CSC500H1S"
            })
            .end(function(err, res) {
                expect(res.body[0].course_code).to.be.equal("CSC500H1S");
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 404 if no course found', function(done) {
        chai.request(app)
            .get('/course')
            .set('x-access-token', coordinator_token)
            .query({
                course_code: "CSC999"
            })
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });
    it('should successfully create a new course', function(done) {
        let newCourseBody2 = {
            course_code: "CSC5001H1S",
            term: "Summer",
            year: "2018",
            ta_needed: 5
        };
        chai.request(app)
            .post('/course')
            .set('x-access-token', coordinator_token)
            .send(newCourseBody2)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body.course.course_code).to.be.equal(newCourseBody2.course_code);
                Course.remove({
                    _id: res.body.course._id
                }, (err) => {
                    if (err) throw err;
                });
                done();
            });
    });
    it('should not allow student to create new course', function(done) {
        let newCourseBody2 = {
            course_code: "CSC5001H1S",
            term: "Summer",
            year: "2018",
            ta_needed: 5
        };
        chai.request(app)
            .post('/course')
            .set('x-access-token', student_token)
            .send(newCourseBody2)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should not allow creating a course that already exists', function(done) {
        chai.request(app)
            .post('/course')
            .set('x-access-token', coordinator_token)
            .send(newCourseBody)
            .end(function(err, res) {
                expect(res).to.have.status(409);
                done();
            });
    });

    it('should not allow creating a course with invalid term', function(done) {
        chai.request(app)
            .post('/course')
            .set('x-access-token', coordinator_token)
            .send({
                course_code: "CSC5002",
                year: "2018",
                term: "Random",
                ta_needed: 5
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });

    it('should not allow creating a course with more tas than tas needed', function(done) {
        chai.request(app)
            .post('/course')
            .set('x-access-token', coordinator_token)
            .send({
                course_code: "csc5000",
                year: "2018",
                term: "Fall",
                ta_needed: 1,
                tas: ["hi", "bye"]
            })
            .end(function(err, res) {
                expect(res).to.have.status(400);
                done();
            });
    });
    it('should successfully add a TA to a course', function(done) {
        chai.request(app)
            .post('/course/ta')
            .set('x-access-token', coordinator_token)
            .send({
                course_id: _id,
                student_id: "5"
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.body.course.tas).to.be.deep.equal(["john", "dave",
                    "5"
                ]);
                done();
            });

    });

    it('should not add TA to a course that already has TAs needed', function(done) {

        chai.request(app)
            .post('/course/ta')
            .set('x-access-token', coordinator_token)
            .send({
                course_id: _idFull,
                student_id: "6"
            })
            .end(function(err, res) {
                expect(res).to.have.status(409);
                done();
            });
    });

    it('should not add student if student already assigned to the same course', function(done) {
        chai.request(app)
            .post('/course/ta')
            .set('x-access-token', coordinator_token)
            .send({
                course_id: _idFull,
                student_id: "dave"
            })
            .end(function(err, res) {
                expect(res).to.have.status(409);
                done();
            });
    });
    it('should not add a ta to a course that does not exist', function(done) {
        chai.request(app)
            .post('/course/ta')
            .set('x-access-token', coordinator_token)
            .send({
                course_id: "5349b4ddd2781d08c09890f3",
                student_id: "dd"
            })
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should not allow student to add ta', function(done) {
        chai.request(app)
            .post('/course/ta')
            .set('x-access-token', student_token)
            .send({
                course_id: "5349b4ddd2781d08c09890f3",
                student_id: "dd"
            })
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should successfully find a course', function(done) {
        chai.request(app)
            .get('/course/' + _id)
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res.body.course.course_code).to.be.equal(newCourseBody.course_code)
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return 404 if course not found', function(done) {
        chai.request(app)
            .get('/course/' + "5349b4ddd2781d08c09890f3")
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });
});
