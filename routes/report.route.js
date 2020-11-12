const express = require('express');
const mongoose = require('mongoose');
const app = express();
const reportRoute = express.Router();

// Results model
let Candidate = require('../models/Candidate');


//Get candidate reports for statstical  view
reportRoute.route('/:account').get((req, res) => {
	if(req.params.account != 'SECTOR') {
		let accountArray = req.params.account.split(",");
		Candidate.aggregate([
			{$match : {account: {$in:accountArray}}},
			{$lookup:
			{   from: "results",
					localField: "username",
					foreignField: "userName",
					as: "results"
			}
		  },
		  {"$group" : {_id:{JRSS:"$JRSS", stage1_status: "$results.stage1_status", 
					   stage2_status: "$results.stage2_status", 
					   stage3_status: "$results.stage3_status",
					   stage4_status: "$results.stage4_status",  
					   stage5_status: "$results.stage5_status",
					   createdDate: "$createdDate",
					   account: "$account"
					}} },
					   
	   {$sort:
			 {
			   'JRSS': -1
			 }
	   }
	   ],
	  (error,output) => {
		if (error) {
		  return next(error)
		} else {
		  console.log(output);
		  res.json(output)
		}
	  });
	}
	else{
  Candidate.aggregate([
		 {$lookup:
         {   from: "results",
                 localField: "username",
                 foreignField: "userName",
                 as: "results"
         }
       },
	   {"$group" : {_id:{JRSS:"$JRSS", stage1_status: "$results.stage1_status", 
					stage2_status: "$results.stage2_status", 
					stage3_status: "$results.stage3_status",
					stage4_status: "$results.stage4_status",  
					stage5_status: "$results.stage5_status",
					createdDate: "$createdDate",
					account: "$account"
				}} },
					
	{$sort:
		  {
			'JRSS': -1
		  }
	}
    ],
   (error,output) => {
	 if (error) {
	   return next(error)
	 } else {
	   console.log(output);
	   res.json(output)
	 }
   });
}
})


module.exports = reportRoute;