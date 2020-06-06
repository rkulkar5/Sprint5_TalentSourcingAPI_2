const express = require('express');
const app = express();
const quizRoute = express.Router();

// ProjectAlloc model
let ProjectAlloc = require('../models/ProjectAlloc');

  // Update operations Results into ProjectAlloc table
  quizRoute.route('/insertOperatioDetails').post((req, res, next) => {    
    ProjectAlloc.create(req.body, (error, data) => {
        if (error) {
          return next(error)
        } else {            
          res.json(data)
        }
      })
    });
    
module.exports = quizRoute;