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
   skip_stage1: {
      type: Boolean
   },
   skip_stage2: {
       type: Boolean
   },
   skip_stage3: {
      type: Boolean
   },
   skip_stage4: {
      type: Boolean
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
