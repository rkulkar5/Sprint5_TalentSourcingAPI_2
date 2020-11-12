const express = require('express');
const app = express();
const jrssRoute = express.Router();

// Jrss model
let JRSS = require('../models/jrss');


// Get All Jrss
jrssRoute.route('/').get((req, res) => {
  JRSS.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Get All Jrss
jrssRoute.route('/getJrssPreTech/:jrssName').get((req, res) => {  
  JRSS.aggregate([
    {$match : { 'jrss':req.params.jrssName }},
    {$lookup:
      {   from: "preTechQuestionnaire",
              localField: "jrss",
              foreignField: "jrss",
              as: "jrss_preTech"
      }
    },
    {$sort:
      {
        'updatedDate': -1
      }
    }],(error,output) => {
      if (error) {
        return next(error)
      } else {
        res.json(output)
      }
    })
 });
 


// Read Workflow details by jrssname
jrssRoute.route('/readJrss/:jrssName').get((req, res) => {
  console.log("req.params.jrssName="+req.params.jrssName);
  JRSS.findOne({'jrss': req.params.jrssName}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Add jrss
jrssRoute.route('/createJrss').post((req, res, next) => {
  JRSS.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Delete jrss
jrssRoute.route('/deleteJrss/:id').delete((req, res, next) => {
  //console.log('req.params.id=== '+req.params.id);
  JRSS.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})


// Update Technology Stream for a Jrss
jrssRoute.route('/updateTechStream/:id').put((req, res, next) => {
  JRSS.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.json(data)
      //console.log('Data updated successfully, data = '+data)
      console.log('Data updated successfully')
    }
  })
})

// Update Workflow details for a Jrss
jrssRoute.route('/updateWorkflow/:id').put((req, res, next) => {
  JRSS.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.json(data);
      console.log('Data updated successfully11');
    }
  })
})

// Get single candidate
jrssRoute.route('/readJrssById/:id').get((req, res) => {
  JRSS.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Read Jrss by account
jrssRoute.route('/getJrsssByAccount/:account').get((req, res) => {
  JRSS.find({'account': req.params.account}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})


// Read Jrss by account and JRSS name
jrssRoute.route('/readJrssbyAccountAndJrssName/:jrssName/:account').get((req, res) => {
  JRSS.findOne({'jrss': req.params.jrssName, 'account': req.params.account}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})



// Get All Jrss
jrssRoute.route('/getJRSSPreTechByAccountAndJrssName/:jrssName/:account').get((req, res) => {
  JRSS.aggregate([
    {$match : { jrss:req.params.jrssName,account:req.params.account }},
    {$lookup:
      // {   from: "preTechQuestionnaire",
      //         localField: "jrss",
      //         foreignField: "jrss",
      //         as: "jrss_preTech"
      // }
      { from: "preTechQuestionnaire",
                let: { result_userName: "$jrss" },
                pipeline: [
                {$match: { $expr:
                { $and: [{ $eq: ["$$result_userName", "$jrss"] },
                { $eq: ["$account", req.params.account] }] } } },
                ], as: "jrss_preTech" }
    },
    {$sort:
      {
        'updatedDate': -1
      }
    }],(error,output) => {
      if (error) {
        return next(error)
      } else {
        res.json(output)
      }
    })
 });

module.exports = jrssRoute;
