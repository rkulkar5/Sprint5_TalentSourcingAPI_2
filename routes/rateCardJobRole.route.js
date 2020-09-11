
const express = require('express');
const app = express();
const rateCardJobRoleRoute = express.Router();

let RateCardJobRole = require('../models/RateCardJobRole');

// Get All RateCardJobRole
rateCardJobRoleRoute.route('/').get((req, res) => {
  RateCardJobRole.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

module.exports = rateCardJobRoleRoute;
