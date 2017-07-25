/**
 * Created by TenzinLama on 2017-03-7.
 */
let Client = require('node-rest-client').Client;
let client = new Client();
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let Posting = require('../models/posting');
let Course = require('../models/course');
let Assignment = require('../models/assignment');

let app = require('../app');


chai.use(chaiHttp);

//student/coordinator tokens and ids
let student_token;
let student_id;
let student_token2;
let student_id2;
let coordinator_token;

//===================================================
//student and TA login information

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
    },
}

//===================================================

//course and posting information
let course_id;
let posting_id;
let courseObject;
let courseObject2;

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
    ta_needed: 2
}

let startDate = new Date("January 1, 2017");
let endDate = new Date("April 30, 2017");
let newPostingBody = {
    requirements: "nothing",
    start_date: startDate,
    end_date: endDate
};

//application information
let application_id = "58d2ef8a160bdd41305fdcde";
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
//random mongoid
let assignment_id;
let assignment_body;

describe('assignments', function(){
  this.timeout(0);
  before(function(done){

    let newCourse = new Course(newCourseBody);
    newCourse.save((err, doc) => {
        if (err) throw err;
        course_id = doc._id;
        courseObject = doc;
        newPostingBody.course_id = doc._id;
        let newPosting = new Posting(newPostingBody);
        newPosting.save((err,doc)=>{
          if(err) throw err;
          posting_id = doc._id;
          client.post('http://localhost:3002/students/sign-up', student_signin_args, function(data,res){
            client.post('http://localhost:3002/students/authenticate', student_signin_args, function(data,res){
                student_token = data.user.user_token;
                newAppBody.user_id = data.user.id;
                //set the access token for the student for the application headers
                student_id = data.user.id;
                //student2 login
                client.post('http://localhost:3002/students/sign-up', student_signin_args2, function(data, res){
                  client.post('http://localhost:3002/students/authenticate', student_signin_args2, function(data,res){
                    student_token2 = data.user.user_token;
                    student_id2 = data.user.id;
                    //ta coordinator login
                    client.post('http://localhost:3002/ta-coordinators/sign-up', ta_coord_signin_args, function(data,res){
                      client.post('http://localhost:3002/ta-coordinators/authenticate', ta_coord_signin_args, function(data,res){
                        coordinator_token = data.user.user_token;
                        //make a new application
                        let application_args = {
                          data: newAppBody,
                          headers: {
                              "Content-Type": "application/json",
                              "x-access-token": student_token
                          }
                        };
                        //make an assignment
                        assignment_body = {
                          course_id,
                          ta_assignments: [{
                            student_id,
                            status: 'offer_sent',
                            posting_id,
                            application_id
                          }]
                        };
                        let newAssignment = new Assignment(assignment_body);
                        newAssignment.save((err,doc)=>{
                          if(err) throw err;
                          assignment_id = doc._id;
                          done();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });

      after((done)=>{
        Assignment.remove({}, (err)=>{
          if(err) throw err;
          Posting.remove({requirements: "nothing"},(err)=>{
            if(err) throw err;
            done();
          });
        });

      });

      it('successfully get all assignments', function(done){
        chai.request(app)
        .get('/assignment')
        .set('x-access-token', coordinator_token)
        .end(function(err,res){
          Assignment.find({}, (err,doc)=>{
            expect(doc[0]._id.toString()).to.be.equal(res.body[0]._id);
            expect(doc[0].course_id.toString()).to.be.equal(res.body[0].course_id);
            done();
          });
        });
      });

      it('should successfully create a new assignment', function(done){
        //create a new course
        let newCourse = new Course(newCourseBody2);
        newCourse.save((err,doc)=>{
          courseObject2 = doc;
          newCourseId = doc._id;
          chai.request(app)
          .post('/assignment')
          .send({
            course_id: newCourseId,
            student_id,
            posting_id,
            application_id,
          })
          .set('x-access-token', coordinator_token)
          .end(function(err,res){
            expect(res).to.have.status(200);
            expect(res.body.assignment.course._id).to.be.equal(newCourseId.toString());
            expect(res.body.assignment.ta_assignments[0].student_id).to.be.equal(student_id);
            expect(res.body.assignment.ta_assignments[0].posting_id).to.be.equal(posting_id.toString());
            //checking course
            // expect(res.body.assignment.course._id.toString()).to.be.equal(courseObject._id.toString());
            expect(res.body.assignment.course.term).to.be.equal(courseObject2.term);
            expect(res.body.assignment.course.year).to.be.equal(courseObject2.year);
            Assignment.remove({course_id: doc._id},(err)=>{
              if(err) throw err;
              done();
            });
          });
        });
      });

      it('should not allow student to create a new assignment', function(done){
        chai.request(app)
        .post('/assignment')
        .set('x-access-token', student_token)
        .end(function(err,res){
          expect(res).to.have.status(401);
          done();
        });
      });

      it('should successfully push a student to an existing assignment', function(done){
        chai.request(app)
        .post('/assignment')
        .set('x-access-token', coordinator_token)
        .send({
          course_id,
          student_id: student_id2,
          posting_id,
          application_id
        })
        .end(function(err,res){
          expect(res).to.have.status(200);
          expect(res.body.assignment.ta_assignments.length).to.be.equal(2);
          expect(res.body.assignment.course_id).to.be.equal(course_id.toString());
          expect(res.body.assignment.ta_assignments[0].student_id).to.be.equal(student_id);
          expect(res.body.assignment.ta_assignments[0].posting_id).to.be.equal(posting_id.toString());
          expect(res.body.assignment.ta_assignments[1].student_id).to.be.equal(student_id2);
          expect(res.body.assignment.ta_assignments[1].posting_id).to.be.equal(posting_id.toString());
          done();
        });
      });

      it('should return 404 if trying to assign to a non existant course', function(done){
        chai.request(app)
        .post('/assignment')
        .set('x-access-token', coordinator_token)
        .send({
          course_id: "58e3fef36abc246b4654ea66"
        })
        .end(function(err,res){
          expect(res).to.have.status(404);
          done();
        });
      });


      it('should successfully update a students assignment', function(done){
        chai.request(app)
        .put('/assignment/' + course_id)
        .set('x-access-token', coordinator_token)
        .send({
          student_id,
          status: "offer_accepted",
          notes: "note"
        })
        .end(function(err,res){
          expect(res).to.have.status(200);
          expect(res.body.assignment.ta_assignments[0].student_id).to.be.equal(student_id);
          expect(res.body.assignment.ta_assignments[0].status).to.be.equal("offer_accepted");
          expect(res.body.assignment.ta_assignments[0].notes).to.be.equal("note");
          done();
        })
      });

      it('should successfully delete a student from an assignment', function(done){
        chai.request(app)
        .delete('/assignment/' + course_id)
        .set('x-access-token', coordinator_token)
        .query({
            student_id : student_id
        })
        .end(function(err,res){
          expect(res).to.have.status(200);
          expect(res.body.assignment.ta_assignments.length).to.be.equal(1);
          expect(res.body.assignment.ta_assignments[0].student_id).to.be.equal(student_id2);
          expect(res.body.assignment.ta_assignments[0].posting_id).to.be.equal(posting_id.toString());
          done();
        })
      });

      it('should return 404 if trying to delete non existant student from assignment', function(done){
        chai.request(app)
        .delete('/assignment/' + course_id)
        .set('x-access-token', coordinator_token)
        .send({
          student_id
        })
        .end(function(err,res){
          expect(res).to.have.status(404);
          done();
        });
      });
})
