const express = require('express');
const app = express();
const candidateRoute = express.Router();

// Candidate model
let Candidate = require('../models/Candidate');
let Login = require('../models/Login');
//User Model
let User = require('../models/Login');
//Questionbank Model
let QuestionBank = require('../models/QuestionBank');

// Add Candidate details
candidateRoute.route('/create').post((req, res, next) => {
  Candidate.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// get candidates jrss
candidateRoute.route('/candidatejrss/:email').get((req, res, next) => {
  Candidate.findOne({'email': req.params.email}, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// get candidates jrss
candidateRoute.route('/nameFromUsername/:username').get((req, res, next) => {
  Login.findOne({'username': req.params.username}, (error, data) => {
    console.log('req.params.username----'+req.params.username);

    console.log('req.params.username----'+data);
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});


  // Get candidate by username
candidateRoute.route('/readCandidate/:username').get((req, res) => {
     Candidate.aggregate([
      {$match : { username:req.params.username }},
      {$lookup:
    		{   from: "users",
                localField: "username",
                foreignField: "username",
                as: "candidate_users"
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

candidateRoute.route('/createquestion').post((req, res, next) => {
  QuestionBank.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

//Get max question ID
candidateRoute.route('/getMaxQuestionID').get((req, res, next) => {
  QuestionBank.findOne( (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  }).sort({'questionID':-1}).limit(1)
});
// Add User details
candidateRoute.route('/createUser').post((req, res, next) => {
  User.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

// Get All Candidates
candidateRoute.route('/').get((req, res) => {
   Candidate.aggregate([
    {$lookup:
  		{   from: "users",
              localField: "username",
              foreignField: "username",
              as: "candidate_users"
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
    });
})



// Get All Candidates for specific accounts
candidateRoute.route('/readCandidates/:account').get((req, res) => {
  let accountArray = req.params.account.split(",");
  console.log('*****req.params.account******', req.params.account);
  Candidate.aggregate([
    {$match : { 'account': {$in:accountArray} }},
    {$lookup:
      {   from: "users",
              localField: "username",
              foreignField: "username",
              as: "candidate_users"
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

})


// Get single candidate
candidateRoute.route('/read/:id').get((req, res) => {
  Candidate.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Get single User Detail by ID
candidateRoute.route('/readUser/:id').get((req, res) => {
  User.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// Check if Username Exists
candidateRoute.route('/findUser/:email').get((req, res) => {
  Candidate.count({'username': req.params.email }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log ('count for email '+req.params.email+' is '+ data);
      res.json({ count : data });
    }
  })
})


// Update candidate
candidateRoute.route('/update/:id').put((req, res, next) => {
  Candidate.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Update candidate Resume from Pre-Tech Form
candidateRoute.route('/updateCandidateResume/:username').put((req, res, next) => {
  Candidate.updateOne({username: req.params.username}, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Update User Details
candidateRoute.route('/updateUser/:id').put((req, res, next) => {
  User.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.json(data)
      console.log('Data updated successfully')
    }
  })
})

// Delete candidate and user record
candidateRoute.route('/delete/:candidateId/:username').delete((req, res, next) => {
  Candidate.findOneAndRemove({_id : req.params.candidateId}, (error, data) => {
    if (error) {
      return next(error);
    } else {
      User.findOneAndRemove({username: req.params.username}, function(err,user){
            if(err){
              console.log(err);
              return res.status(500).send('');
            }
            if(!user){
              return res.status(404).send();
            }
      })
      res.status(200).json({
        msg: data
      })
    }
  })
})

module.exports = candidateRoute;
