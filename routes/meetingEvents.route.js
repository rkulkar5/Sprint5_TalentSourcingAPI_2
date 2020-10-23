const express = require('express');
const app = express();
const appointmentRoute = express.Router();

// MeetingEvents model
let MeetingEvents = require('../models/MeetingEvents');


// Add MeetingEvents
appointmentRoute.route('/insertMeetingEvents').post((req, res, next) => {
  MeetingEvents.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});



// update MeetingEvents

appointmentRoute.route('/updateMeetingEventsByEventID/:eventID/:candidateEmail').post((req, res, next) => {
	
	MeetingEvents.updateOne({'eventID': req.params.eventID, 'candidateEmail': req.params.candidateEmail}, {$set: req.body}, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})




// get MeetingEvents by loggedInUser email 
appointmentRoute.route('/getMeetingEventsByLoggedInUser/:loggedInUser').get((req, res, next) => {
  MeetingEvents.find({'user': req.params.loggedInUser}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});


// get MeetingEvents by candidate email 
appointmentRoute.route('/getMeetingEventsByCandidate/:candidate').get((req, res, next) => {
  MeetingEvents.find({'candidateEmail': req.params.candidate}, (error, data) => {
    if (error) {
      return next(error)
    } else {


module.exports = appointmentRoute;
