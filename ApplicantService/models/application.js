/**
 * Created by shrey.mahendru on 2017-03-20.
 */

let mongoose = require('mongoose');

let applicationSchema = mongoose.Schema({

    user_id: {
        type: String,
        required : true
    },

    student_number: {
        type: String,
        required: true
    },

    first_name:{
        type: String,
        required: true
    },

    last_name:{
        type: String,
        required: true
    },

    phone_number:{
        type: String,
        required: true
    },

    email:{
        type: String,
        required: true
    },

    program:{
        type: String,
        required: true
    },

    year_of_study:{
        type: String,
        required: true
    },

    department:{
        type: String,
        required: true
    },

    department_explain:{
        type: String,
        required: true
    },

    work_status:{
        type: String,
        required: true
    },

    work_status_explain:{
        type: String,
        required: true
    },

    student_status:{
        type: String,
        required: true
    },

    student_status_explain:{
        type: String,
        required: true
    },

    course_taken:{
        type:[{
            type: String,
            unique: true
        }]
    },

    previous_assignments:{
        type: [{
            type: String,
            unique: true
        }]
    },

    status:{
        type: String
    }

});

module.exports = mongoose.model('Application', applicationSchema);