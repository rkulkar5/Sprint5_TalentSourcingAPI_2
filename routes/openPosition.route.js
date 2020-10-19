const express = require('express');
const app = express();
const openPositionRoute = express.Router();

let OpenPosition = require('../models/OpenPosition');
let RateCard = require('../models/RateCard');
let CostCard = require('../models/CostCard');

// Add Open Position
openPositionRoute.route('/createOpenPosition').post((req, res, next) => {
  OpenPosition.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Open Positions
openPositionRoute.route('/').get((req, res) => {
  OpenPosition.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get the latest positionID - Get the count of records and then later increment one.
openPositionRoute.route('/readLatestPositionID').get((req, res) => {
  OpenPosition.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
	  
    }
  }).sort({"positionID":-1}).limit(1);
})

// Get the latest sequenceID - Get the count of records and then later increment one.
openPositionRoute.route('/readLatestSequenceID').get((req, res) => {
  OpenPosition.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
	  
    }
  }).sort({"sequenceID":-1}).limit(1);
})

// List All Open Positions by Job Role
openPositionRoute.route('/listAllOpenPositionsByJRSS/:account/:status/:JRSS').get((req, res) => {
OpenPosition.find({'account': req.params.account, 'status': req.params.status,'JRSS': req.params.JRSS},(error, data) => {
if (error) {
  return next(error)
} else {
  res.json(data)
}
})
})

// Get single open position
openPositionRoute.route('/readOpenPosition/:id').get((req, res) => {
  OpenPosition.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single open position
openPositionRoute.route('/readOpenPositionByPositionID/:positionID').get((req, res) => {
  OpenPosition.findOne({'positionID': req.params.positionID}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// get open position by position name
openPositionRoute.route('/readOpenPositionByPositionName/:name').get((req, res, next) => {
  OpenPosition.findOne({'positionName': req.params.name}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Update Open Position
openPositionRoute.route('/updateOpenPosition/:id').put((req, res, next) => {
  OpenPosition.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete Open Position
openPositionRoute.route('/deleteOpenPosition/:id').delete((req, res, next) => {
  OpenPosition.findOneAndRemove(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
})

// Read rate card by rate card code
openPositionRoute.route('/readRateCardsByRateCardCode/:name').get((req, res) => {
   RateCard.findOne({'rateCardCode': req.params.name}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
})

// Read cost card by cost card code
openPositionRoute.route('/readCostCardsByCostCardCode/:name').get((req, res) => {
   CostCard.findOne({'costCardCode': req.params.name}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      res.json(data)
    }
  })
})



// List All Open Positions
openPositionRoute.route('/listOpenPositions/:account/:status').get((req, res) => {
    let accountArray = req.params.account.split(",");
	if(req.params.account.toLowerCase().indexOf("sector") === -1) {
		  OpenPosition.find({'account': {$in:accountArray}, 'status': req.params.status},(error, data) => {
			if (error) {
			  return next(error)
			} else {
			 console.log('*****data******', data);
			  res.json(data)
			}
		  })
	} else {
			OpenPosition.find({'status': req.params.status},(error, data) => {
			if (error) {
			  return next(error)
			} else {
			  console.log('*****data******', data);
			  res.json(data)
			}
			})
	}

})




// Method to close the position by ID
openPositionRoute.route('/closePosition/:positionID/:status').put((req, res, next) => {
  OpenPosition.updateOne({_id:req.params.positionID},  {$set:{status:req.params.status}}
  , (error, data) => {
    if (error) {
      return next(error);
      console.log(error)
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

module.exports = openPositionRoute;