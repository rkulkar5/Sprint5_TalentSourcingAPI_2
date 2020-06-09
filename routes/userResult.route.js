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
quizRoute.route('/quizDetailsByUser/:userName/:quizId').get((req, res) => {
  console.log('userName',req.params.userName)
  const userName=req.params.userName
  UserAnswer.aggregate(
      [{$match : {userName:req.params.userName,quizNumber:parseInt(req.params.quizId)}},
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
          }/*,
          {
              $out:"userQuestions"
          }*/
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
        })

     /* Results.aggregate(
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
              )*/

          })

  //Get Partner Interview Candidate list
    quizRoute.route('/getPartnerInterviewList').get((req, res) => {
      Results.aggregate([
       {$match: {$or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}],
                 $or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}],
                 $or:[{stage3_status:'Completed'},{stage3_status:'Skipped'}],
                 stage4_status:'Not Started'}},
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
       {$match: {userName:req.params.userName,
                 $or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}],
                 $or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}],
                 $or:[{stage3_status:'Completed'},{stage3_status:'Skipped'}],
                 stage4_status:'Not Started'}},
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
            stage4_status:req.body.stage4_status}},
    (error, data) => {
      if (error) {
        console.log(error);
        return next(error);
      } else {
        res.json(data);
      }
    })
  });

  //Get Operations Candidate list
  quizRoute.route('/getOperationsCandidateList').get((req, res) => {
    Results.aggregate([
     {$match: {$or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}],
               $or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}],
               $or:[{stage3_status:'Completed'},{stage3_status:'Skipped'}],
               $or:[{stage4_status:'Completed'},{stage4_status:'Skipped'}],
               stage5_status:'Not Started'}},
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

  //Read Operations Candidate Project Details
  quizRoute.route('/readOperationsProjectDetails/:userName').get((req, res) => {
    Results.aggregate([
     {$match: {userName:req.params.userName,
               $or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}],
               $or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}],
               $or:[{stage3_status:'Completed'},{stage3_status:'Skipped'}],
               $or:[{stage4_status:'Completed'},{stage4_status:'Skipped'}],
               stage5_status:'Not Started'}},
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

  // Update Operations Status
  quizRoute.route('/updateOperationsStatus/:id').post((req, res, next) => { 
    Results.findByIdAndUpdate(req.params.id,
      {$set: {stage5_status:'Completed'}},
      (error, data) => {
        if (error) {
          console.log(error);
          return next(error);
        } else {
          res.json(data);
        }
      })
    });

 //Get Technical Interview Candidate list
 quizRoute.route('/getTechnicalInterviewList').get((req, res) => {
  Results.aggregate([
   {$match: {$or: [{stage1_status:"Completed"},{stage1_status:"Skipped"}] ,
             $or: [{stage2_status:"Skipped"},{stage2_status:"Completed"}],
             stage3_status:"Not Started",
             userScore: { $gt: 80 }}},
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


quizRoute.route("/getResultByUser/:userName/:quizNumber").get((req, res,next) => {
  Results.findOne({userName: req.params.userName,quizNumber:req.params.quizNumber}, function(err,results){
    if(err){
      console.log(err);
      return res.status(500).send('');
    }
    if(!results){
      return res.status(404).send();
    }
    return res.json(results);
  })
})

quizRoute.route("/updateResults/:id").put((req, res,next) => {
  Results.findByIdAndUpdate(req.params.id, {
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

/** Read Candidate Technical Interview Details */
  quizRoute.route('/readCandidateTechSMEReviewDetails/:userName').get((req, res) => {
    Results.aggregate([
     {$match: {userName:req.params.userName,
              $or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}],
              $or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}],
              stage3_status:"Not Started",
              userScore: { $gt: 80 }}
     },
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


module.exports = quizRoute;
