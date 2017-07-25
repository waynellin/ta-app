/**
 * Created by shrey.mahendru on 2017-03-04.
 */

let mongoose = require('mongoose');

let assignmentSchema = mongoose.Schema({

    course_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },

    ta_assignments: [{
            student_id:{
                type: String,
                required: true
            },

            status:{
                type: String,
                enum:['offer_sent', 'offer_accepted', 'can_reassign'],
                default: 'can_reassign'
            },

            posting_id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Posting',
                required: true
            },

            application_id: {
                type: String,
                required: true
            },

            notes: {
                type: String
            }
    }]
});

module.exports = mongoose.model('Assignment', assignmentSchema);