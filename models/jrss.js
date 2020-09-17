const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let JRSS = new Schema({
   jrss: {
         type: String
   },
account: {
         type: String
   },
   technologyStream: [
      {key:String,value:String},
   ],
   stage1_OnlineTechAssessment: {
        type:Boolean
   },
   stage2_PreTechAssessment: {
        type:Boolean
   },
   stage3_TechAssessment: {
        type:Boolean
   },
   stage4_ManagementInterview: {
        type:Boolean
   },
   stage5_ProjectAllocation: {
           type:Boolean
   }
}, {
   collection: 'jrss'
})

module.exports = mongoose.model('jrss', JRSS)

