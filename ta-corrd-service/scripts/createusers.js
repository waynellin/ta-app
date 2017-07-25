let Client = require('node-rest-client').Client;
let client = new Client();
let Config = require('../config');
let forEach = require('async-foreach').forEach;

//create 200 student accounts, make applications and rankings
let user_accounts = [];
for(var i=0;i<200;i++){
  user_accounts.push('testing' + i.toString() + '@gmail.com');
};

let first_names = [
  'Sophia',
  'Jackson',
  'Emma',
  'Aiden',
  'Olivia',
  'Lucas',
  'Ava',
  'Liam',
  'Mia',
  'Noah',
  'Isabella',
  'Ethan',
  'Riley',
  'Mason',
  'Aria',
  'Caden',
  'Zoe',
  'Oliver',
  'Charlotte',
  'Elijah',
  'Lily',
  'Grayson',
  'Layla',
  'Jacob',
  'Amelia',
  'Michael',
  'Emily',
  'Benjamin',
  'Madelyn',
  'Carter',
  'Aubrey',
  'James',
  'Adalyn',
  'Jayden',
  'Madison',
  'Logan',
  'Chloe',
  'Alexander',
  'Harper',
  'Caleb',
  'Abigail',
  'Ryan',
  'Aaliyah',
  'Luke',
  'Avery',
  'Daniel',
  'Evelyn',
  'Jack',
  'Kaylee',
  'William',
  'Ella',
  'Owen',
  'Ellie',
  'Gabriel',
  'Scarlett',
  'Matthew',
  'Arianna',
  'Connor',
  'Hailey',
  'Jayce',
  'Nora',
  'Isaac',
  'Addison',
  'Sebastian',
  'Brooklyn',
  'Henry',
  'Hannah',
  'Muhammad',
  'Mila',
  'Cameron',
  'Leah',
  'Wyatt',
  'Elizabeth',
  'Dylan',
  'Sarah',
  'Nathan',
  'Eliana',
  'Nicholas',
  'Mackenzie',
  'Julian',
  'Peyton',
  'Eli',
  'Maria',
  'Levi',
  'Grace',
  'Isaiah',
  'Adeline',
  'Landon',
  'Elena',
  'David',
  'Anna',
  'Christian',
  'Victoria',
  'Andrew',
  'Camilla',
  'Brayden',
  'Lillian',
  'John',
  'Natalie',
  'Lincoln' ];

let last_names = [
  'Smith',
  'Johnson',
  'Williams',
  'Jones',
  'Brown',
  'Davis',
  'Miller',
  'Wilson',
  'Moore',
  'Taylor',
  'Anderson',
  'Thomas',
  'Jackson',
  'White',
  'Harris',
  'Martin',
  'Thompson',
  'Garcia',
  'Martinez',
  'Robinson',
  'Clark',
  'Rodriguez',
  'Lewis',
  'Lee',
  'Walker',
  'Hall',
  'Allen',
  'Young',
  'Hernandez',
  'King',
  'Wright',
  'Lopez',
  'Hill',
  'Scott',
  'Green',
  'Adams',
  'Baker',
  'Gonzalez',
  'Nelson',
  'Carter',
  'Mitchell',
  'Perez',
  'Roberts',
  'Turner',
  'Phillips',
  'Campbell',
  'Parker',
  'Evans',
  'Edwards',
  'Collins',
  'Stewart',
  'Sanchez',
  'Morris',
  'Rogers',
  'Reed',
  'Cook',
  'Morgan',
  'Bell',
  'Murphy',
  'Bailey',
  'Rivera',
  'Cooper',
  'Richardson',
  'Cox',
  'Howard',
  'Ward',
  'Torres',
  'Peterson',
  'Gray',
  'Ramirez',
  'James',
  'Watson',
  'Brooks',
  'Kelly',
  'Sanders',
  'Price',
  'Bennett',
  'Wood',
  'Barnes',
  'Ross',
  'Henderson',
  'Coleman',
  'Jenkins',
  'Perry',
  'Powell',
  'Long',
  'Patterson',
  'Hughes',
  'Flores',
  'Washington',
  'Butler',
  'Simmons',
  'Foster',
  'Gonzales',
  'Bryant',
  'Alexander',
  'Russell',
  'Griffin',
  'Diaz',
  'Hayes',
  'Myers',
  'Ford',
  'Hamilton',
  'Graham',
  'Sullivan',
  'Wallace',
  'Woods',
  'Cole',
  'West',
  'Jordan',
  'Owens',
  'Reynolds',
  'Fisher',
  'Ellis',
  'Harrison',
  'Gibson',
  'Mcdonald',
  'Cruz',
  'Marshall',
  'Ortiz',
  'Gomez',
  'Murray',
  'Freeman',
  'Wells',
  'Webb',
  'Simpson',
  'Stevens',
  'Tucker',
  'Porter',
  'Hunter',
  'Hicks',
  'Crawford',
  'Henry',
  'Boyd',
  'Mason',
  'Morales',
  'Kennedy',
  'Warren' ];

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
let programs = ["UG", "MSC", "MSAC", "PHD"];

client.post('http://localhost:3002/ta-coordinators/authenticate', ta_coord_signin_args,function(data,res){
  let coordinator_token = data.user.user_token;
  let posting_args = {
    headers: {
      'x-access-token': coordinator_token,
      "Content-Type": "application/json"
    }
  };
  client.get('http://localhost:3001/posting', posting_args, function(data, res){
      //list of postings
      let postings = data;
      forEach(user_accounts, function(item, index, arr){
        let sign_up_args = {
          data:{
            email: item,
            password: 'test'
          },
          headers: {
            "Content-Type": "application/json"
          }
        };
        client.post('http://localhost:3002/students/sign-up', sign_up_args, function(data,res){
          let token = data.user.user_token;
          let user_id = data.user.id;
          //console.log(data);
          //make an application
          first_name = first_names[Math.floor(Math.random() * first_names.length)];
          last_name = last_names[Math.floor(Math.random() * last_names.length)];

          let applicationBody = {
            user_id,
            student_number: Math.floor(Math.random() * 10000000000),
            first_name,
            last_name,
            phone_number: "555-555-5555",
            program: programs[Math.floor(Math.random() * ((4-0)+0) + 0)],
            email: first_name + last_name + "@mail.utoronto.ca",
            year_of_study: Math.floor(Math.random() * ((4-1)+1) + 1),
            department: "Computer Science",
            department_explain: "I want to be in computer science",
            student_status: "",
            course_taken: ["CSC148", "CSC165"],
            previous_assignments: ["CSC108", "CSC148", "CSC104"]
          };
          let applicant_args = {
            data: applicationBody,
            headers: {
              "Content-Type": "application/json",
              "x-access-token": token
            }
          };
          client.post('http://localhost:3003/application', applicant_args, function(data,res){
            //get all the postings
            //make a ranking for this student
            let randomIndex = Math.floor(Math.random() * postings.length);
            let ranking_args = {
              data: {
                user_id,
                rankings: [{
                  user_id,
                  posting_id: postings[randomIndex]._id,
                  course_code: postings[randomIndex].course.course_code,
                  rank: 1
                }]
              },
              headers: {
                "Content-Type": "application/json",
                "x-access-token": token
              }
            };
            client.post('http://localhost:3003/rankings', ranking_args, function(data,res){
              console.log("Creating User: " + applicationBody.first_name + " " + applicationBody.last_name + " and ranking random courses");
            });
          });
        });
        let done = this.async();
        setTimeout(done, 300);
      });
  });
});
