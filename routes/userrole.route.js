const express = require('express');
const app = express();
const userroleRoute = express.Router();

// Userrole model
let Userrole = require('../models/Userrole');
let User = require('../models/Login');



// Get All userroles
userroleRoute.route('/').get((req, res) => {
  //console.log('userroleRoute.route invoked');
  Userrole.find((error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

      // Check if Username Exists in User table
      userroleRoute.route('/findUser/:email').get((req, res) => {
        console.log('userroleRoute.route invoked');
        User.count({'username': req.params.email }, (error, data) => {
        if (error) {
          return next(error)
        } else {
          console.log ('count for email '+req.params.email+' is '+ data);
          res.json({ count : data });
        }
      })
    })


    
// Delete candidate and user record
userroleRoute.route('/deleteUser/:username').delete((req, res, next) => {

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
})

// Get the list of users who has role: sme or partner or management
userroleRoute.route('/findAllAdminUser').get((req, res) => {
  console.log('userroleRoute.findUser invoked');
  User.aggregate([
    {$match: {
             $or:[{accessLevel:'admin'},{account:'SECTOR'}]}
    },
    
    {$sort:
      {
        'username': -1
      },

    }],
    (error,output) => {
      if (error) {
        return next(error)
      } else {
        res.json(output)
      }
    });
})

    // Get the list of users who has role: sme or partner or management
    userroleRoute.route('/findAllUser').get((req, res) => {
      console.log('userroleRoute.findUser invoked');
      User.aggregate([
        {$match: {
                 $or:[{accessLevel:'sme'},{accessLevel:'partner'},{accessLevel:'management'}]}
        },
        
        {$sort:
          {
            'username': -1
          },
   
        }],
        (error,output) => {
          if (error) {
            return next(error)
          } else {
            res.json(output)
          }
        });
  })


module.exports = userroleRoute;
