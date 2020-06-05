const express = require('express');
const app = express();
const quizRoute = express.Router();

// ProjectAlloc model
let ProjectAlloc = require('../models/ProjectAlloc');

  // Update operations Results into ProjectAlloc table
  quizRoute.route('/insertOperatioDetails').post((req, res, next) => {
    console.log("Inside the save results route", req.body);
    ProjectAlloc.create(req.body, (error, data) => {
        if (error) {
          return next(error)
        } else {
            console.log("Error in ProjectAlloc router");
          res.json(data)
        }
      })
    });
    
module.exports = quizRoute;