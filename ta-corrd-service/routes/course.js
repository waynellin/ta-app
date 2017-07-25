/**
 * Created by shrey.mahendru on 2017-03-04.
 */
let express = require('express');
let router = express.Router();
let Course = require('../models/course');
let checkCoordinatorToken = require('./checkCoordinatorToken');
let checkStudentToken = require('./checkStudentToken');
let checkGenericToken = require('./checkGenericToken');

/** GET all courses or search by query param.
 * query_params could be
 * course_code,
 *term,
 * year
 * */
router.get('/', checkGenericToken, (req, res, next) => {
    Course.find(req.query, (err, courses)=>{
        "use strict";
        if (err) throw err;

        if (courses.length == 0){
            res.status(404).json({
                message : 'No courses found'
            });
        }  else{
           res.status(200).json(courses);
        }
    });
});

/** POST a new Course
 * Body = {
 * course_code: ''
 * term: ['Summer', 'Winter', 'Fall'] //any one,
 * year //required
 * campus: ['St George', 'UTM', 'UTSC'] //any one
 * ta_needed: number
 * tas : [list of user ids] // not required
 * }*/
router.post('/', checkCoordinatorToken, (req, res, next) => {
    "use strict";
    //Validations
    if(!Course.schema.path('term').enumValues.includes(req.body.term)){
        res.status(400).json({
            message: 'Invalid Term.'
        });
        return;
    }

    if (req.body.tas){
        if(req.body.ta_needed < req.body.tas.length){
            res.status(400).json({
                message: 'Ta Limit Exceeded'
            });
            return;
        }
    }

    Course.findOne({
        course_code: req.body.course_code,
        term: req.body.term,
        year: req.body.year
    }, (err, existingCourse) =>{
        if (err) throw err;

        if (existingCourse){
            res.status(409).json({
                message :'Course ' + existingCourse.course_code + ' for term: ' + existingCourse.term +' already exists.'
            });
            return;
        }
        let course = new Course({
            course_code: req.body.course_code,
            term: req.body.term,
            year: req.body.year,
            campus: req.body.campus,
            ta_needed: req.body.ta_needed,
            tas: ('tas' in req.body ? req.body.tas : [] )
        });

        course.save((err) => {
            if (err) {
                res.status(400).json({
                    message: err.message
                });
                return;
            }

            res.status(200).json({
                message: 'New course Created.',
                course : course
            });
        });
    });

});

/**
 * Posting a new Ta in the course.
 * Body = {
 * course_id, //required
 * student_id //required
 * }
 */
router.post('/ta', checkCoordinatorToken, (req, res, next) =>{
    "use strict";
    Course.findOne({
        _id : req.body.course_id
    }, (err, course)=>{
        if (err) throw err;

        if (!course){
            res.status(404).json({
                message: "Course not Found."
            });
            return;
        }
        if (course.tas.length == course.ta_needed){
            res.status(409).json({
                message:"Ta limit for the course is reached."
            });
            return;
        }
        if (course.tas.includes(req.body.student_id)){
            res.status(409).json({
                message:"This student is already assigned as Ta for this course."
            });
            return;
        }
        course.tas.push(req.body.student_id);
        course.save((err) =>{
            if (err) {
                res.status(400).json({
                    message: err.message
                });
                return;
            }
            res.status(200).json({
                message: "Student: " + req.body.student_id + "Added to the course.",
                course : course
            });
        })
    })
});

/**
 * Get course by Id
 */
router.get('/:id', checkGenericToken, (req, res) =>{
    "use strict";
    Course.findOne({
        _id: req.params.id
    }, (err, course) =>{
        if (err) throw err;

        if (!course){
            res.status(404).json({
                message: "Course not Found."
            });
            return;
        }
        res.status(200).json({
            course: course
        });
    });
});

module.exports = router;
