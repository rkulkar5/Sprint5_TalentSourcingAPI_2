const express = require('express');
const app = express();
const lineOfBusinessRoute = express.Router();

// Band model
let LineOfBusiness = require('../models/LineOfBusiness');

// Get All Competency Level
lineOfBusinessRoute.route('/').get((req, res) => {
  LineOfBusiness.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

module.exports = lineOfBusinessRoute;
