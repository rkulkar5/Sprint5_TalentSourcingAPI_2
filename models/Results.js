const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
const ResultsSchema = new Schema({
   userName: {
      type: String
   },
   userScore: {
      type: Number
   },
   userResult: {
      type: String
   },
   quizNumber : {
      type: Number
   },

   smeScores: [{technologyStream: String,score: Number}],

   avgTechScore : {
      type: Number
   },
   smeResult: {
      type: String
   },
   managementResult: {
      type: String
   },
   smeFeedback: {
      type: String
   },
   managementFeedback: {
      type: String
   },
   stage1_status: {
      type: String
   },
  stage2_status: {
       type: String
   },
   stage3_status: {
      type: String
   },
   stage4_status: {
      type: String
   },
   stage5_status: {
         type: String
   },
   smeName: {
      type: String
   },
   smeAssessmentDate: {
      type: Date
   },
   managerName: {
      type: String
   },
   managementAssessmentDate: {
      type: Date
   },
   createdDate: {
      type: Date
   }
},{
collection: 'results'}
);

const  Results = mongoose.model('Results', ResultsSchema);
module.exports = Results;
