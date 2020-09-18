const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let OpenPositionSchema = new Schema({
   positionName: {
      type: String
   },
   positionID: {
      type: String
   },
   sequenceID: {
      type: String
   },
   JRSS: {
      type: String
   },
   rateCardJobRole: {
      type: String
   },
   lineOfBusiness: {
      type: String
   },
   positionLocation: {
      type: String
   },
   competencyLevel: {
         type: String
   },
   account: {
         type: String
   },
   status: {
         type: String
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

}, {
   collection: 'openPosition'
})

module.exports = mongoose.model('OpenPosition', OpenPositionSchema)
