/**
 * Created by shrey.mahendru on 2017-04-06.
 */

let express = require('express');
let router = express.Router();
let Posting  = require('../models/posting');
let Course = require('../models/course');
let Offer = require('../models/offers');
let checkGenericToken = require('./checkGenericToken');
let Client = require('node-rest-client').Client;
let client = new Client();


router.get('/', checkGenericToken, function (req, res) {
    Offer.find(req.query, (err, offers) =>{
        "use strict";
       if (err) throw err;

       if (offers.length == 0){
           res.status(404).json({
               message: "No offers found."
           });
       } else{
           let new_offer = convertMongoDoc(JSON.stringify(offers) );
           get_subobjects(new_offer, (response) => {
               res.status(200).json(response);
           }, req.headers);
       }
    });
});

function convertMongoDoc(offers) {
    let new_res = [];
    offers = JSON.parse(offers);
    for(let i=0; i < offers.length; i++){
        let post = {};
        let obj = offers[i];
        for (let key in Object.keys(obj)){
            post[Object.keys(obj)[key]] = obj[Object.keys(obj)[key]];
        }
        new_res.push(post);
    }
    return new_res;
}

function get_subobjects(offers, callback, headers) {
    let index = 0;
    for(let i = 0; i < offers.length; i ++) {
        Course.find({"_id" : offers[i].course_id}, (err, course) => {
            if (err) throw err;
            course = convertMongoDoc(JSON.stringify(course));
            if (course.length > 0){
                offers[i]['course'] = course[0];
            }
            else{
                offers[i]['course'] = {};
            }
            let url = 'http://localhost:3003/application/' + offers[i].application_id;
            client.get(url, {headers: headers}, (data)=>{
                "use strict";
                offers[i]['application'] = data.application;
                index += 1;
                if (index == offers.length) {
                    callback(offers);
                }
            });
        }).lean();
    }
}


router.post('/send/offer', checkGenericToken, (req, res) =>{
    "use strict";
    console.log({
        user_id : req.body.user_id,
        application_id:  req.body.application_id,
        posting_id : req.body.posting_id,
        course_id : req.body.course_id,
    });
    Offer.find({
        user_id : req.body.user_id,
        application_id:  req.body.application_id,
        posting_id : req.body.posting_id,
        course_id : req.body.course_id,
    },(err , existing_offer) =>{
        if (err) throw err;

        console.log(existing_offer);

        if(existing_offer.length != 0){
            res.status(409).json({
                message: "Offer already sent."
            });
            return;
        } else {
            Posting.findOne({
                _id : req.body.posting_id
            }, (err, posting) =>{
                if (err) throw err;

                if (!posting){
                    res.status(404).json({
                        message: 'Posting not found'
                    });
                    return;
                }

                Offer.find({
                    $and: [
                        {posting_id : posting._id},
                        {$or : [{status: 'offer_sent'}, {status: 'offer_accepted'}]}
                    ]
                }, (err, offers) =>{
                    if (err) throw  err;

                    if (offers.length == posting.tas_needed){
                        res.status(409).json({
                            message: "Ta limit for this course already met."
                        });
                    } else {
                        let new_offer = new Offer({
                            user_id : req.body.user_id,
                            posting_id : req.body.posting_id,
                            application_id:  req.body.application_id,
                            course_id : req.body.course_id,
                            deadline: req.body.deadline,
                            notes: req.body.notes
                        });

                        console.log(new_offer);

                        new_offer.save((err) => {
                            if (err) throw err;

                            let res_offer = convertMongoDoc(JSON.stringify([new_offer]) );
                            get_subobjects(res_offer, (response) => {
                                res.status(200).json(response);
                            }, req.headers);
                        })
                    }

                })


            });
        }
    });


});

router.post('/:id',checkGenericToken, (req, res) =>{
    "use strict";
    Offer.findOne({
        '_id' : req.params.id
    },(err, offer) =>{
            if (err) throw err;

            if (!offer){
                res.status(404).json({
                    message : "Offer not found"
                });
            } else {
                offer.status = req.body.status;
                offer.save((err) =>{
                    if (err) throw err;

                    let new_offer = convertMongoDoc(JSON.stringify([offer]) );
                    get_subobjects(new_offer, (response) => {
                        res.status(200).json(response);
                    }, req.headers);

                 })
            }
    });
});


module.exports = router;