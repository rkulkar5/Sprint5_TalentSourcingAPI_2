const express = require('express');
const app = express();
const preTechAssessmentForm = express.Router();

//Pretechassesmentanswer model
let PreTechAssessmentAnswer = require('../models/PreTechAssessmentAnswer');
//PreTechQuestionnaire model
let PreTechQuestionnaire = require('../models/PreTechQuestionnaire');

// Add QuestionBank
preTechAssessmentForm.route('/saveDraftQuestions').post((req, res, next) => {
  QuestionBank.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});


  
// Get pretechnical questions based on jrss
preTechAssessmentForm.route('/getPreTechQuestionanire/:jrss').get((req, res) => {
console.log('req.params.jrss  **** ', req.params.jrss);
  PreTechQuestionnaire.find({jrss: req.params.jrss}, function(err,PreTechQuestions){
  console.log('PreTechQuestions **** ', PreTechQuestions);
      if(err){
        console.log(err);
        return res.status(500).send('');
      }
      if(!PreTechQuestions){
        return res.status(404).send();
      }
      return res.json(PreTechQuestions);
    })
  });
  
module.exports = preTechAssessmentForm;
