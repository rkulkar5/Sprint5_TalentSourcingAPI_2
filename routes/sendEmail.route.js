const express = require('express'),
nodemailer = require('nodemailer');
const sendEmailRoute = express.Router();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

//Send an email
sendEmailRoute.route('/sendEmail').post((req, res, next) => {    
    let response;
    let mailTransporter = nodemailer.createTransport({ 
      host: "ap.relay.ibm.com",
      port: 25,
      secure: false,
      }); 

      let mailDetails = { 
        from: "DWP Talent Sourcing<" + req.body.from + ">", 
        to: req.body.to, 
        subject: req.body.subject,
        html: req.body.message
      }; 

      mailTransporter.sendMail(mailDetails, function(err, data) {   
        if(err) { 
          console.log('Error occurred while sending the email - ' + err.response); 
          response = {err};          
        } else { 
          console.log('Email sent successfully = ' + data.response); 
          response = {data};            
        } 
      });        
      res.json(response)
})
    
module.exports = sendEmailRoute;