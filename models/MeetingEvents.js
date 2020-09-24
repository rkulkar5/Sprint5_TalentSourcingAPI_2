const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let MeetingEvents = new Schema({

 eventID: {
      type: String,
   },
   eventTitle: {
      type: String,
   },
   startDate: {
      type: String
   },
   startTime: {
      type: String
   },
   endTime: {
      type: String
   },
   candidateEmail: {
      type: String
   },
   user: {
      type: String
   }
}, {
   collection: 'meetingEvents'
})

module.exports = mongoose.model('MeetingEvents', MeetingEvents)
