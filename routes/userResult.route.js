const express = require('express');
const mongoose = require('mongoose');
const app = express();
const quizRoute = express.Router();
const ObjectId = mongoose.Types.ObjectId;

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
       {$match:{ $and: [ {$or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}]},
                         {$or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}]},
                         {$or:[{$and:[{stage3_status:'Completed'}, {$or:[{smeResult:'Recommended'},{smeResult:'Strongly Recommended'}]},{smeResult: {$exists: true }}]},{stage3_status:'Skipped'}]},
                         {stage4_status:'Not Started'}]}},
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
       {$match:{ $and: [ {userName:req.params.userName},
                         {$or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}]},
                         {$or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}]},
                         {$or:[{$and:[{stage3_status:'Completed'}, {$or:[{smeResult:'Recommended'},{smeResult:'Strongly Recommended'}]},{smeResult: {$exists: true }}]},{stage3_status:'Skipped'}]},
                         {stage4_status:'Not Started'}]}},
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
     {$match:{ $and:[{$or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}]},
                   {$or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}]},
                   {$or:[{stage3_status:'Completed'},{stage3_status:'Skipped'}]},
                   {$or:[{$and:[{stage4_status:'Completed'}, {managementResult:'Recommended'},{managementResult: {$exists: true }}]},{stage4_status:'Skipped'}]},
                   {stage5_status:'Not Started'}]}},
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
     {$match:{ $and:[   {userName:req.params.userName},
                        {$or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}]},
                        {$or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}]},
                        {$or:[{stage3_status:'Completed'},{stage3_status:'Skipped'}]},
                        {$or:[{$and:[{stage4_status:'Completed'}, {managementResult:'Recommended'},{managementResult: {$exists: true }}]},{stage4_status:'Skipped'}]},
                        {stage5_status:'Not Started'}]}},
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
   {$match: { $and:[{$or: [{stage1_status:"Completed"},{stage1_status:"Skipped"}]},
                    {$or: [{stage2_status:"Skipped"},{stage2_status:"Completed"}]},
                    {stage3_status:"Not Started"}]}},
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

quizRoute.route("/updateExceptionalApproval/:id/:quizNumber/:smeFeedback").put((req, res,next) => {
  
  Results.updateOne({userName:req.params.id,quizNumber:req.params.quizNumber}, {
    $set: {stage3_status:"Skipped",smeFeedback:req.params.smeFeedback,smeName:"",smeAssessmentDate:new Date(),smeResult:"Exceptional Approval Given"}  
    
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

quizRoute.route("/updateExceptionalApprovalStage4/:id/:quizNumber").put((req, res,next) => {
  Results.updateOne({userName:req.params.id,quizNumber:req.params.quizNumber}, {
     $set: {managementResult:req.body.finalResult,managementFeedback:req.body.partnerFeedback,
            managerName:req.body.managerName,managementAssessmentDate:req.body.managementAssessmentDate,
            stage4_status:req.body.stage4_status}
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
  quizRoute.route('/readCandidateTechSMEReviewDetails/:userName/:quizNumber').get((req, res) => {
    console.log(req.params.userName+"\t"+req.params.quizNumber)
    Results.aggregate([
     {$match: {userName:req.params.userName,quizNumber:parseInt(req.params.quizNumber),
              $or:[{stage1_status:'Completed'},{stage1_status:'Skipped'}],
              $or:[{stage2_status:'Completed'},{stage2_status:'Skipped'}],
              stage3_status:"Not Started"}
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

  //Get Dashboard list
      quizRoute.route('/getDashboardList').get((req, res) => {
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
             console.log(output);
             res.json(output)
           }
         });
      })

    //Get View Dashboard Details
    quizRoute.route('/viewDashboardDetails/:id').get((req, res) => {
      console.log(" candidate id", req.params.id);
      Results.aggregate([
        {$match: { _id: ObjectId(req.params.id)}},
        {$lookup:
            {   from: "candidate",
                  localField: "userName",
                  foreignField: "username",
                  as: "result_users"
            },
        },
        {$lookup:
       	    {   from: "projectAlloc",
                  localField: "userName",
                  foreignField: "userName",
                  as: "result_projectAlloc"
             },
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
           console.log(output);
           res.json(output)
         }
       });
    })


    quizRoute.route('/getCandidateInterviewStatus').get((req, res) => {
      Results.aggregate([
        {$match: { $and:[{stage5_status:"Not Started"}]}},
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
           console.log(output);
           res.json(output)
         }
       });
    })


module.exports = quizRoute;
