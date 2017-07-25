let mongoose = require('mongoose');

let rankingSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },

  posting_id: {
    type: String,
    required: true
  },

  course_code: {
    type: String,
    required: true
  },

  rank: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Ranking', rankingSchema);
