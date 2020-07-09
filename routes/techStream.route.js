const express = require('express');
const app = express();
const techStreamRoute = express.Router();

// TechStream model
let TechStream = require('../models/TechStream');

// Get All techStream
techStreamRoute.route('/').get((req, res) => {
  TechStream.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Add techStream
techStreamRoute.route('/createTechStream').post((req, res, next) => {
  TechStream.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})
    
module.exports = techStreamRoute;