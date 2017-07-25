/**
 * Created by shrey.mahendru on 2017-03-04.
 */
let express = require('express');
let router = express.Router();
let Posting = require('../models/posting');
let Course = require('../models/course');
let checkCoordinatorToken = require('./checkCoordinatorToken');
let checkStudentToken = require('./checkStudentToken');
let checkGenericToken = require('./checkGenericToken');

/** GET all postings or search by query param.
 * query_params could be
 * course_id
 * */
router.get('/', checkGenericToken, function(req, res) {
    Posting.find(req.query, (err, postings) =>{
        "use strict";
       if (err) throw err;

       if (postings.length == 0) {
           res.status(200).json({
               message: "No posting found."
           });
       } else {
           let new_post = convertMongoDoc(JSON.stringify(postings) );
           get_course(new_post, (response) => {
               res.send(response);
           });
       }
    });
});


function convertMongoDoc(postings) {
    let new_res = [];
    postings = JSON.parse(postings);
    for(let i=0; i < postings.length; i++){
        let post = {};
        let obj = postings[i];
        for (let key in Object.keys(obj)){
            post[Object.keys(obj)[key]] = obj[Object.keys(obj)[key]];
        }
        new_res.push(post);
    }
    return new_res;
}

function get_course(postings, callback) {
    let index = 0;
    for(let i = 0; i < postings.length; i ++) {
        Course.find({"_id" : postings[i].course_id}, (err, course) => {
            if (err) throw err;
            course = convertMongoDoc(JSON.stringify(course));
            if (course.length > 0){
                postings[i]['course'] = course[0];
            }
            else{
                postings[i]['course'] = {};
            }
            index += 1;
            if (index == postings.length) {
                callback(postings);
            }
        }).lean();
    }
}


router.post('/', checkCoordinatorToken, (req, res) =>{
    "use strict";

    Course.findOne({
        "_id" : req.body.course_id
    }, (err, course)  => {
        if (err) throw err;

        if (course){
            Posting.findOne({
                course_id : req.body.course_id
            }, (err, existingPosting) =>{
                if (err) throw err;

                if (existingPosting){
                    res.status(409).json({
                        message : "Posting all ready exists."
                    });
                } else {
                    let posting  = new Posting({
                        course_id: req.body.course_id,
                        requirements: req.body.requirements,
                        start_date: req.body.start_date,
                        end_date: req.body.end_date
                    });

                    posting.save((err) => {
                        if (err){
                            res.status(400).json({
                                message: err.message
                            });
                        } else {
                            let new_post = convertMongoDoc(JSON.stringify([posting]) );
                            get_course(new_post, (response) => {
                                res.status(200).json( {
                                    message:'New Posting created.',
                                    posting : response[0]
                                });
                            });
                        }
                    })
                }
            })

        } else {
            res.status(400).json({
              message : "Course Not found"
            });
        }
    });

});

router.get('/:id', checkGenericToken, (req, res) =>{
    "use strict";
    Posting.find({
        '_id' : req.params.id
    }, (err, posting) =>{
       if (err) throw err;

       if (posting.length === 0){
           res.status(404).json({
               message: "Posting not found."
           });
       } else{
           let new_post = convertMongoDoc(JSON.stringify(posting));
           get_course(new_post, (response) => {
               res.send(response);
           });
       }
    });
});

router.delete('/:id', checkCoordinatorToken, (req, res) =>{
    "use strict";
    Posting.findOne({
        '_id' : req.params.id
    }, (err, posting) =>{
        if (err){
            res.status(400).json({
                message: err.message
            })
        } else if (!posting){
            res.status(404).json({
                message: 'Posting not found'
            });
        } else {
            posting.remove();
            res.status(200).json({
                message: 'Posting successfully deleted'
            });
        }
    });
});

module.exports = router;
