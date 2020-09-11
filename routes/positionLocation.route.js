const express = require('express');
const app = express();
const positionLocationRoute = express.Router();

// PositionLocation model
let PositionLocation = require('../models/PositionLocation');

// Get All PositionLocation
positionLocationRoute.route('/').get((req, res) => {
  PositionLocation.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

module.exports = positionLocationRoute;
