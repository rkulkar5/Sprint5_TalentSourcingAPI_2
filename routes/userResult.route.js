const express = require('express');
const app = express();
const quizRoute = express.Router();

// Results model
let Results = require('../models/Results');
let Candidate = require('../models/Candidate');
let UserAnswer = require('../models/UserAnswer');
array:any=[];


// Save the user scored results  Results
quizRoute.route('/saveResult').post((req, res, next) => {
console.log("Inside the save results route", req.body);
  Results.create(req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
});

//Get All Candidates
quizRoute.route('/getresult').get((req, res) => {
  Results.aggregate([
   {$lookup:
     {   from: "candidate",
             localField: "userName",
             foreignField: "username",
             as: "result_users"
     }
   },
   {$sort:
     {
       'updatedDate': -1
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

/**
 *
 *
 */
quizRoute.route('/quizDetailsByUser/:userName').get((req, res) => {
  console.log('userName',req.params.userName)
  const userName=req.params.userName
  UserAnswer.aggregate(
      [{$match : {userName:req.params.userName}},
          {$lookup:
              {
                  from: "questionBank",
                  let:{ userAnswer_qid: "$questionID"
                      },
                  pipeline: [
                      { $match:
                       { $expr:
                         { $and:
                           [
                            {$eq:  ["$questionID", "$$userAnswer_qid"] }
                          ]
                         }
                       }
                    },
                    { $project: { questionID: 1, _id: 0,question:1,jrss:1,technologyStream:1,questionType:1,answerID:1,options:1 } }
                  ], as: "userAttemptedQs"
              }
          },
          {
              $out:"userQuestions"
          }
      ])

      Results.aggregate(
          [
               {$match : {userName:req.params.userName}},
              {  $lookup: {
                     from: "userQuestions",
                     localField: "quizNumber",
                     foreignField: "quizNumber",
                      as: "userAnswer",
                  }
              }
          ],(error, data) => {
                      if (error) {
                          return next(error)
                        } else {
                         // res.json(data)
                         res.status(200).json({
                          // message: "Posts fetched successfully!",
                           results: data
                         });
                        }
                      }
              )

          })

  //Get Partner Interview Candidate list
  quizRoute.route('/getPartnerInterviewList').get((req, res) => {
    Results.aggregate([
     {$match: {skip_stage2:true, skip_stage3:false}},
     {$lookup:
       {   from: "candidate",
               localField: "userName",
               foreignField: "username",
               as: "result_users"
       }
     },
     {$sort:
       {
         'updatedDate': -1
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

  //Read Partner Interview Candidate Details
  quizRoute.route('/readPartnerInterviewDetails/:userName').get((req, res) => {
    Results.aggregate([
     {$match: {userName:req.params.userName, skip_stage2:true,skip_stage3:false}},
     {$lookup:
       {   from: "candidate",
               localField: "userName",
               foreignField: "username",
               as: "result_users"
       }
     },
     {$sort:
       {
         'updatedDate': -1
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


// Update Results
quizRoute.route('/updatePartnerDetails/:id').post((req, res, next) => {
  Results.findByIdAndUpdate(req.params.id,
  {$set: {managementResult:req.body.finalResult,managementFeedback:req.body.partnerFeedback,
          managerName:req.body.managerName,managementAssessmentDate:req.body.managementAssessmentDate,
          skip_stage3:req.body.skip_stage3}},
  (error, data) => {
    if (error) {
      console.log(error);
      return next(error);
    } else {
      res.json(data);
    }
  })
})
module.exports = quizRoute;
