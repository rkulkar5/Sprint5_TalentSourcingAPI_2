const express = require('express');
const app = express();
const quizRoute = express.Router();

// QuestionBank model
let QuestionBank = require('../models/QuestionBank');
//Pretechassesmentanswer model
let PreTechAssessmentAnswer = require('../models/PreTechAssessmentAnswer');
//PreTechQuestionnaire model
let PreTechQuestionnaire = require('../models/PreTechQuestionnaire');
const { isValidObjectId } = require('mongoose');

// Add QuestionBank
quizRoute.route('/createQuiz').post((req, res, next) => {
  QuestionBank.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Qyestions
quizRoute.route('/').get((req, res) => {
  QuestionBank.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single QuestionBank
quizRoute.route('/read/:rowNum').get((req, res, next) => {
  QuestionBank.findById(req.params.rowNum,(error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })  
})

// Get different set of questions based on the username supplied
 quizRoute.route('/:noOfQuestions/:userName/:technologyStream/:complexityLevel/:account').get((req, res) => {
  var techStreamArray = req.params.technologyStream.split(',');
  var complexityLevel = req.params.complexityLevel;
  var account = req.params.account; 
  QuestionBank.aggregate( 
 [
  {$match : {technologyStream: {$in:techStreamArray}}},
  {$match : {complexityLevel: complexityLevel}}, 
  {$match : {status: 'Active'}},
  {$match : { $or: [
                    {account: account},
                    {account: {$regex: "," + account + "$"}},
                    {account: {$regex: "^" + account + ","}},
                    {account: {$regex: "," + account + ","}}, 
                    {account: {$regex: "sector", $options: 'i'}}
                   ] 
            } 
  },  
  {$lookup: 
    {   from: "userAnswer",
     let: {  qb_qid: "$questionID"},
       pipeline: [
         { $match:
          { $expr:
            { $and:
              [
               {$eq:  [ "$$qb_qid", "$questionID"] },
               {$eq:  [ "$userName", req.params.userName] }
             ]
            }
          }
       },
       { $project: { questionID: 1, _id: 0 , userName:1} }
     ], as: "userAttemptedQs"
   }
   }, 
   {
         $match: {
             userAttemptedQs: []             
         }
     },     { $sample: { size: parseInt(req.params.noOfQuestions) } } 
   ]
   ,(error, data) => {
  if (error) {
      return next(error)
    } else {
      res.json(data)
      
    }
  })
})

//Get question complexity
quizRoute.route('/:technologyStream').get((req,res) => {
  QuestionBank.aggregate([{ $lookup: { from: "Candidate", 
  let: { qb_ts: "$technologyStream" }, 
  pipeline: [{ $match: { $expr: { $and: [
    { $eq: ["$$qb_ts", "$technologyStream"] }]}}}, 
    { $project: { complexityLevel: 1} }], as: "complexity" } }],(error, data) => {
      if (error) {
          return next(error)
        } else {
          res.json(data)
        }
      })
  })


// Get pretechnical questions based on jrss
quizRoute.route('/getPreTechQuestionanire/:jrss/:userName').get((req, res) => {
  PreTechQuestionnaire.aggregate([{ $lookup: { from: "PreTechAssessmentAnswer", 
  let: { qid: "$preTechQID" }, 
  pipeline: [{ $match: { $expr: { $and: [
    { $eq: ["$$qid", "$preTechQID"] }, 
    { $eq: ["$userName", req.params.userName] }] } } }, 
    { $project: { preTechQID: 1, answer: 1 } }], as: "questions" } }],(error, data) => {
      if (error) {
          return next(error)
        } else {
          res.json(data)
        }
      })
    })

//Check for questions per technology stream and account
quizRoute.route('/Count/Questions/:technologyStream/:account').get((req, res) => {
  var account = req.params.account;
  QuestionBank.count({'technologyStream': req.params.technologyStream,'account': new RegExp(account), 'status':'Active' }, (error, data) => {
  if (error) {   
    return next(error)
  } else {
    console.log ('Count for techStream '+req.params.technologyStream+' and account ' + account + ' is '+ data);
    res.json({ count : data });
  }
})
})




/**
// Update QuestionBank
quizRoute.route('/update/:id').put((req, res, next) => {
  QuestionBank.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})
**/

// Update QuestionBank
quizRoute.route('/updatequestion/:id').put((req, res, next) => {  
  QuestionBank.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// View QuestionBank 
quizRoute.route('/readQuestion/:questionID').get((req, res) => {
 // var id = req.params.questionID;
  console.log("req id:" +req.params.id);
  QuestionBank.find({questionID: req.params.questionID}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Data fetched successfully')
    }
  })
})


// Delete QuestionBank - Soft Delete Updating Status='Inactive'
quizRoute.route('/updateQuestionStatus/:id').put((req, res, next) => {
  QuestionBank.findByIdAndUpdate(req.params.id, {$set: {status :'Inactive'}}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Edit QuestionBank - Updating Status='Active' on cancel of edit question
quizRoute.route('/updateEditQuestionStatus/:id').put((req, res, next) => {
  console.log("Inside edit question");
 // console.log("req.params.id value:" +req.params.id);
  QuestionBank.findByIdAndUpdate(req.params.id, {$set: {status :'Active'}}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Get All Questions matching status='Active'
quizRoute.route('/getAllActiveQuestions/:status').get((req, res) => {
  QuestionBank.find({'status': req.params.status} ,(error,output) => {
      if (error) {
        console.log('error',error);
        return next(error);
      } else {
        res.json(output);
        console.log('Data returned successfully');
      }
    })
})

module.exports = quizRoute;