const express = require('express');
const app = express();
const preTechAssessmentRoute = express.Router();

//Pretechassesmentanswer model
let PreTechAssessmentAnswer = require('../models/PreTechAssessmentAnswer');
//PreTechQuestionnaire model
let PreTechQuestionnaire = require('../models/PreTechQuestionnaire');

let Results = require('../models/Results');


// Add QuestionBank
preTechAssessmentRoute.route('/saveDraftQuestions').post((req, res, next) => {
  QuestionBank.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});


  
  // Get pre technical assessment questions based on jrss for a given account
preTechAssessmentRoute.route('/getPreTechQuestionanire/:jrss/:userName/:account').get((req, res, next) => {
  PreTechQuestionnaire.aggregate([
  {$match : { jrss:req.params.jrss, account: req.params.account}},
  { $lookup: { from: "PreTechAssessmentAnswer", 
  let: { qid: "$preTechQID" }, 
  pipeline: [{ $match: { $expr: { $and: [
    { $eq: ["$$qid", "$preTechQID"] }, 
    { $eq: ["$userName", req.params.userName] }] } } }, 
    { $project: {_id:0,  answer: 1 } }], as: "PreTechAnswers" } }],(error, data) => {
      if (error) {
          return next(error)
        } else {
          res.json(data)
        }
      })
    })
  
  
  
  
 preTechAssessmentRoute.route('/saveOrSubmit').put((req, res, next) => {
 
	 req.body.forEach((answer) => {
		  PreTechAssessmentAnswer.findOneAndUpdate(
			{userName:answer.userName,preTechQID: answer.preTechQID}, 
			{ $set:{preTechQID:answer.preTechQID,userName:answer.userName,answer:answer.answer,status:answer.status, createdDate:new Date() }},
			{upsert: true, new: true, runValidators: true},
			function (err, doc) { 
				if (err) {
					// handle error
				} else {
					// handle document
				}
			}
		)
	 });
}) 


  // Get  workflow stage statuses for a given userName
preTechAssessmentRoute.route('/getStageStatus/:userName/:userResult').get((req, res, next) => {
  Results.findOne({userName: req.params.userName,userResult:{$ne:req.params.userResult}}, function(error,data){
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});


// Update the status of 2nd stage to 'Completed' 
preTechAssessmentRoute.route('/updateStage2Status/:userName/:userResult').post((req, res, next) => {
 Results.updateOne({userName: req.params.userName,userResult:{$ne:req.params.userResult} },
					{ $set: {stage2_status: "Completed"}}
      , function(error, data) {
        if (error) {
          return next(error);
        } else {
          res.json(data)
        }
      })
    });

module.exports = preTechAssessmentRoute;
