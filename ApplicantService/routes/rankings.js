let express = require('express');
let router = express.Router();
let Ranking = require('../models/ranking');
let checkCoordinatorTokenOrStudentById = require('./checkCoordinatorTokenOrStudentById');
let checkGenericToken = require('./checkGenericToken');

router.post('/', checkCoordinatorTokenOrStudentById, (req, res) => {
  req.body.rankings = req.body.rankings || [];
  req.body.rankings.forEach(ranking => {
    Ranking.findOneAndUpdate({
      user_id: req.body.user_id,
      posting_id: ranking.posting_id
    }, ranking, {upsert: true}, (err, ranking) => {
      if (err) throw err;
    });
  });
  res.status(201).json({
    user_id: req.body.user_id,
    rankings: req.body.rankings
  });
});

router.get('/:id', checkCoordinatorTokenOrStudentById, (req, res) => {
  Ranking.find({
    user_id: req.params.id
  }, (err, rankings) => {
    if (err) throw err;

    if (!rankings) {
      res.status(404).json({
        message: 'No rankings found.'
      });
    }

    res.status(200).json({
      user_id: req.params.id,
      rankings: rankings.map(ranking => ({
        user_id: ranking.user_id,
        posting_id: ranking.posting_id,
        rank: ranking.rank,
        course_code: ranking.course_code
      }))  
    })
  });
});

router.delete('/:id', checkCoordinatorTokenOrStudentById, (req, res) => {
  Ranking.findOneAndRemove({
    user_id: req.params.id,
    posting_id: req.query.posting_id
  }, (err, deletedRanking) => {
    if (err) throw err;

    if (!deletedRanking) {
      res.status(404).json({
        message: 'Ranking Not Found'
      });
    } else {
      res.status(200).json({
        user_id: deletedRanking.user_id,
        posting_id: deletedRanking.posting_id,
        rank: deletedRanking.rank,
        course_code: deletedRanking.course_code
      });
    }
  });
});

router.get('/', checkGenericToken, function(req, res) {
    Ranking.find(req.query, (err, rankings) =>{
        "use strict";
        if (err) throw err;

        if (rankings.length == 0){
            res.status(404).json({
                message :"No Rankings found."
            });
        } else {
            rankings = JSON.parse(JSON.stringify(rankings));
            let response = {};
            for (let i =0; i < rankings.length; i++){
                if(response[rankings[i].user_id] === undefined){
                  response[rankings[i].user_id] = []
                }
                response[rankings[i].user_id].push(rankings[i]);
            }

            res.status(200).json(response);

        }
    });
});


module.exports = router;
