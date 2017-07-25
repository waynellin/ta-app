let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let Client = require('node-rest-client').Client;
let client = new Client();
let app = require('../app');
let Application = require('../models/application');
chai.use(chaiHttp);

let newAppBody = {
    student_number: "3",
    first_name: "Tenzin",
    last_name: "Lama",
    phone_number: "444-4444",
    email: "tenzin@gmail.com",
    program: "Computer Science",
    year_of_study: "2017",
    department:"computer science",
    department_explain: "department explain",
    work_status: "working",
    work_status_explain: "explination",
    student_status: "student",
    student_status_explain: "explination",
    course_taken: ["CSC301", "CSC302"],
    previous_assignments: ["CSC428", "csc400"]
};
let application_id;
let coordinator_token;
let student_token;
let student_token2;
let student_id;
let student_id2;

describe('ApplicantService', function() {
    this.timeout(0);
    before(function(done) {
        //sign up for 3 accounts. 2 students and 1 ta
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
        let student_signin_args2 = {
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                email: 'test3',
                password: 'test'
            }
        }
        //student signin/authenticate
        client.post('http://localhost:3002/students/sign-up', student_signin_args, function(data, res) {
            client.post('http://localhost:3002/students/authenticate', student_signin_args, function(data, res) {
                student_token = data.user.user_token;
                newAppBody.user_id = data.user.id;
                student_id = data.user.id;
                //ta_coordinator sign in/authenticate
                client.post('http://localhost:3002/ta-coordinators/sign-up', ta_coord_signin_args, function(data, res) {
                    client.post('http://localhost:3002/ta-coordinators/authenticate', ta_coord_signin_args, function(data, res) {
                        coordinator_token = data.user.user_token;
                        client.post('http://localhost:3002/students/sign-up', student_signin_args2, function(data, res) {
                            client.post('http://localhost:3002/students/authenticate', student_signin_args2, function(data, res) {
                                student_token2 = data.user.user_token;
                                student_id2 = data.user.id;
                                //create an application using the id of the first student
                                let newApp = new Application(newAppBody);
                                newApp.save((err, doc) => {
                                    if (err) throw err;
                                    application_id = doc._id;
                                    done();
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    after(function(done) {
        Application.remove({
            _id: application_id
        }, function(err) {
            if (err) throw err;
        });
        done();
    });

    it('should return status 200 when finding all application as a TA', function(done) {
        chai.request(app)
            .get('/application')
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should return status 401 when getting all applications as a student', function(done) {
        chai.request(app)
            .get('/application')
            .set('x-access-token', student_token2)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });


    it('should return status 404 if no application found', function(done) {
        chai.request(app)
            .get('/application')
            .query({
                user: 0
            })
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should successfully update an application', function(done) {
        chai.request(app)
            .post('/application')
            .set('x-access-token', student_token)
            .send(newAppBody)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not allow another student to modify someone elses application', function(done){
      chai.request(app)
          .post('/application')
          .set('x-access-token', student_token2)
          .send(newAppBody)
          .end(function(err, res) {
              expect(res).to.have.status(401);
              done();
          });
    });

    it('should successfully apply to a new posting', function(done) {
        let newAppBody2 = {
            user_id: student_id2,
            student_number: "4",
            first_name: "Tenzin",
            last_name: "Lama",
            phone_number: "444-4444",
            email: "tenzin@gmail.com",
            program: "Computer Science",
            year_of_study: "2017",
            department: "computer science",
            department_explain: "department explain",
            work_status: "working",
            work_status_explain: "explination",
            student_status: "student",
            student_status_explain: "explination",
        }
        chai.request(app)
            .post('/application')
            .send(newAppBody2)
            .set('x-access-token', student_token2)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                Application.remove({user_id: student_id2}, function(err) {
                    if (err) throw err;
                })
                done();
            })
    });


    it('should return 404 if no such application found by id', function(done) {
        chai.request(app)
            .get('/application/0')
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return 200 if application found by id', function(done) {
        chai.request(app)
            .get('/application/' + application_id.toString())
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not allow student to look up another students application', function(done) {
        chai.request(app)
            .get('/application/' + application_id.toString())
            .set('x-access-token', student_token2)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });

    it('should return 404 if app not found when trying to put', function(done) {
        chai.request(app)
            .put('/application/' + '5349b4ddd2781d08c09890f3')
            .send({})
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(404);
                done();
            });
    });

    it('should return 200 if successfully deleted', function(done) {
        chai.request(app)
            .delete('/application/' + application_id)
            .set('x-access-token', coordinator_token)
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('should not allow student to delete another students application', function(done) {
        chai.request(app)
            .delete('/application/' + application_id)
            .set('x-access-token', student_token2)
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });

});
