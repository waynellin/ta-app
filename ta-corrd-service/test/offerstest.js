/**
 * Created by TenzinLama on 2017-03-7.
 */
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let Client = require('node-rest-client').Client;
let client = new Client();
let Offer = require('../models/offers');
let Course = require('../models/course');
let Posting = require('../models/posting');
let app = require('../app');
chai.use(chaiHttp);

let student_token;
let coordinator_token;

let newCourseBody = {
    course_code: "CSC500H1S",
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
    }
};

let student_signin_args = {
    headers: {
        "Content-Type": "application/json"
    },
    data: {
        email: 'test2',
        password: 'test2'
    }
}

let courseObject;
let applicationObject;

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
let student_id;

let offerBody = {};
let offerObject;

describe('offers', function(){
  this.timeout(0);
  before((done)=>{
    let newCourse = new Course(newCourseBody);
    newCourse.save((err,doc)=>{
      if(err) throw err;
      newPostingBody.course_id = doc._id;
      courseObject = doc;
      //sign in
      client.post('http://localhost:3002/students/sign-up', student_signin_args, function(data,res){
        client.post('http://localhost:3002/students/authenticate', student_signin_args, function(data,res){
          student_token = data.user.user_token;
          student_id = data.user.id;
          client.post('http://localhost:3002/ta-coordinators/sign-up', ta_coord_signin_args, function(data,res){
            client.post('http://localhost:3002/ta-coordinators/authenticate', ta_coord_signin_args, function(data,res){
              coordinator_token = data.user.user_token;
              newAppBody.user_id =data.user.id;
              let application_args = {
                data: newAppBody,
                headers: {
                  "Content-Type": "application/json",
                  "x-access-token": coordinator_token
                }
              };
              client.post('http://localhost:3003/application', application_args, function(data,res){
                applicationObject = data.application;
                let newPosting = new Posting(newPostingBody);

                newPosting.save((err,doc)=>{
                  if(err) throw err;
                  //create a new offer
                  //console.log("applicationobject is " + JSON.stringify(applicationObject));
                  offerBody.user_id = student_id;
                  offerBody.application_id = applicationObject._id;
                  offerBody.course_id = courseObject._id;
                  offerBody.posting_id = doc._id;
                  offerBody.status = 'offer_sent';
                  offerBody.deadline = new Date("March 10, 2017");
                  //console.log(offerBody);
                  let newOffer = new Offer(offerBody);
                  newOffer.save((err,doc)=>{
                    if(err) throw err;
                    offerObject = doc;
                    done();
                  });
                });

              });
            });
          })
        })
      });
    });
  });
  after((done)=>{
    Course.remove({
      course_code: "CSC500H1S"
    }, (err)=>{
      if(err) throw err;
      Offer.remove({},(err)=>{
        if(err) throw err;
        done();
      })
    })
  });
  it('should get all offers', (done)=>{
    chai.request(app)
    .get('/offers')
    .set('x-access-token', coordinator_token)
    .end((err,res)=>{
      expect(res).to.have.status(200);
      done();
    });
  });

  it('should return 409 if offer already sent', (done)=>{
    chai.request(app)
    .post('/offers/send/offer')
    .send(offerBody)
    .set('x-access-token', coordinator_token)
    .end((err,res)=>{
      expect(res).to.have.status(409);
      done();
    });
  });
  it('should find offer by id',(done)=>{
    chai.request(app)
    .post('/offers/' + offerObject._id.toString())
    .send({
      status: "offer_accepted"
    })
    .set('x-access-token', coordinator_token)
    .end((err,res)=>{
      expect(res).to.have.status(200);
      done();
    })
  });
  it('should return 404 if no such offer', (done)=>{
    chai.request(app)
    .post('/offers/' + courseObject._id.toString())
    .send({
      status: "offer_accepted"
    })
    .set('x-access-token', coordinator_token)
    .end((err,res)=>{
      expect(res).to.have.status(404);
      done();
    })
  });
  it('should create a new offer', (done)=>{
    Offer.remove({},(err)=>{
      if(err) throw err;
      chai.request(app)
      .post('/offers/send/offer')
      .send(offerBody)
      .set('x-access-token', coordinator_token)
      .end((err,res)=>{
        expect(res).to.have.status(200);
        expect(res.body[0].course_id).to.be.equal(courseObject._id.toString());
        expect(res.body[0].posting_id).to.be.equal(offerBody.posting_id.toString());
        done();
      });
    })
  });
  it('should not create offer for non existant posting',(done)=>{
    let newOfferBody = offerBody;
    newOfferBody.posting_id = courseObject._id;
    chai.request(app)
    .post('/offers/send/offer')
    .send(newOfferBody)
    .set('x-access-token',coordinator_token)
    .end((err,res)=>{
      expect(res).to.have.status(404);
      done();
    });
  });

});
