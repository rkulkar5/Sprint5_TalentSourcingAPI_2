const express = require('express');
const app = express();
const competencyLevelRoute = express.Router();

// Band model
let CompetencyLevel = require('../models/CompetencyLevel');

// Get All Competency Level
competencyLevelRoute.route('/').get((req, res) => {
  CompetencyLevel.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

module.exports = competencyLevelRoute;
