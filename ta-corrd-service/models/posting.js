/**
 * Created by shrey.mahendru on 2017-03-04.
 */

let mongoose = require('mongoose');

let postingSchema = mongoose.Schema({

    course_id :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Course',
        required : true
    },

    requirements :{
        type : String,
        required : true
    },

    start_date: {
        type: Date,
        required: true
    },

    end_date: {
        type: Date,
        required: true
    },

    tas_needed: {
        type: Number,
        required: true,
        default: 1
    }
});


module.exports = mongoose.model('Posting', postingSchema);