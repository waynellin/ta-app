let Client = require('node-rest-client').Client;
let client = new Client();
let Config = require('../config');
let forEach = require('async-foreach').forEach;

let args = {
  headers:{
    'Authorization': Config.COBALT_API_KEY
  },
  parameters: {
    q: "code:'csc' AND campus: 'UTSG'",
    limit: '100'
  }
}
let cobaltCoursesUrl = 'https://cobalt.qas.im/api/1.0/courses/filter';
let coordinator_token;
let requirements = "Understand the course content and be able to follow a student's thinking to interpret answers that might not be complete; be consistent so your grading is fair and reliable; know your department's grading procedures and policies and work with your course supervisor to develop grading criteria; become familiar with your department's and the University's policies on academic integrity; develop strategies for dealing with angry or aggressive students.";
client.get(cobaltCoursesUrl, args, function(data, response){
  //sign up for a TA coordinator account
  let ta_coord_signin_args = {
    headers: {
      'x-coordinator-account-key': "PROJAWOLCOORDINATORACCOUNTKEY",
      "Content-Type": "application/json"
    },
    data: {
      email: 'test@gmail.com',
      id: 'test',
      password: 'test',
      user_type: 'ta-coordinator'
    },
  };
  client.post('http://localhost:3002/ta-coordinators/sign-up', ta_coord_signin_args, function(data1,res){
    client.post('http://localhost:3002/ta-coordinators/authenticate', ta_coord_signin_args, function(data2,res){
      coordinator_token = data2.user.user_token;
      forEach(data, function(item,index,arr){

        let args2 = {
          data:{
            course_code: item.code,
            ta_needed: 5,
            term: item.term.slice(5, item.term.length),
            year: Number(item.term.slice(0,4))
          },
          headers: {
            "Content-Type": "application/json",
            "x-access-token": coordinator_token
          }
        }
        client.post(Config.BASE_URL + 'course', args2, function(data,response){
          if (response.statusCode == 200) {
            console.log("Added " +  item.code + ' to database');
          } else {
            console.log("error " + data.message);
          }
          //make posting for course
          let posting_args = {
            data: {
              course_id: data.course._id,
              requirements,
              start_date: new Date("January 1, 2017"),
              end_date: new Date("April 30, 2017")
            },
            headers: {
              "Content-Type": "application/json",
              "x-access-token": coordinator_token
            }
          };
          client.post(Config.BASE_URL + 'posting', posting_args, function(data,response){
            console.log('Creating posting for ' + item.code);
          });
        });
        let done = this.async();
        setTimeout(done, 100);
      });
    });
  });
});
