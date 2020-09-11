const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Candidate = new Schema({
   employeeName: {
      type: String
   },
   employeeType: {
      type: String
   },
   email: {
      type: String
   },
   band: {
         type: String
   },
   JRSS: {
      type: String
   },
   technologyStream: {
      type: String
   },
   phoneNumber: {
      type: Number
   },
   dateOfJoining: {
      type: Date
   },
   createdBy: {
         type: String
   },
   createdDate: {
         type: Date
   },
   updatedBy: {
         type: String
   },
   updatedDate: {
          type: Date
   },
   username: {
      type: String
   },
   resumeName: {
      type: String
   },
   resumeData: {
      type: String
   },
   account: {
      type: String
   },
   userLOB: {
      type: String
   },
   grossProfit: {
     type: String
   },
   userPositionLocation: {
         type: String
   },
   openPositionName: {
        type: String
   },
   positionID: {
      type: String
 }
}, {
   collection: 'candidate'
})

module.exports = mongoose.model('Candidate', Candidate)
