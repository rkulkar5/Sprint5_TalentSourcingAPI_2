const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
const QuestionBankSchema = new Schema({
   questionID: {
      type: Number
   },
   question: {
      type: String
   },
   technologyStream: {
      type: String
   },
   complexityLevel: {
         type: String
   },
   questionType: {
      type: String
   },
   answerID: {
      type: String
   },
   account: {
      type: String
   },
   status: {
      type: String
   },
   options: [{
      optionID:Number,option:String},
      {optionID:Number,option:String},
      {optionID:Number,option:String},
      {optionID:Number,option:String},
   ]

	
},{
collection: 'questionBank'});



const  QuestionBank = mongoose.model('questionBank', QuestionBankSchema);
module.exports = QuestionBank;
