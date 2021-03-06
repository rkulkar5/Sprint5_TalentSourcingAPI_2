const express = require('express');
const app = express();
const accountRoute = express.Router();

// Account model
let Account = require('../models/Account');



// Get All accounts
accountRoute.route('/').get((req, res) => {
  Account.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Add account
accountRoute.route('/createAccount').post((req, res, next) => {
  Account.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})




module.exports = accountRoute;
