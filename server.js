let express = require('express'),
   path = require('path'),
   mongoose = require('mongoose'),
   cors = require('cors'),
   bodyParser = require('body-parser'),
   dbConfig = require('./database/db');
   
// Connecting with mongo db
mongoose.Promise = global.Promise;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.connect(dbConfig.db, dbConfig.options).then(() => {
      console.log('Database sucessfully connected')
   },
   error => {
      console.log('Database could not connected: ' + error)
   }
)

// Setting up port with express js
const candidateRoute = require('./routes/candidate.route');
const bandRoute = require('./routes/band.route');
const jrssRoute = require('./routes/jrss.route');
const testConfigRoute = require('./routes/testConfig.route');
const quizQuestionsRoute = require('./routes/questionBank.route');
const userAnswerRoute = require('./routes/userAnswer.route');
const loginRoute = require('./routes/login.route');
const resultRoute = require('./routes/userResult.route');
const projectAllocRoute = require('./routes/projectAlloc.route');
const preTechFormRoute = require('./routes/preTechForm.route');
const userroleRoute = require('./routes/userrole.route');
const reportRoute = require('./routes/report.route');
const techStreamRoute = require('./routes/techStream.route');
const sendEmailRoute = require('./routes/sendEmail.route');
const openPositionRoute = require('./routes/openPosition.route');
const competencyLevelRoute = require('./routes/competencyLevel.route');
const lobRoute = require('./routes/lob.route');
const positionLocationRoute = require('./routes/positionLocation.route');
const rateCardJobRoleRoute = require('./routes/rateCardJobRole.route');
const accountRoute = require('./routes/account.route');
const meetingEventsRoute = require('./routes/meetingEvents.route');

const app = express();


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//    extended: false
// }));
// setting the limit to 1mb cosidering the CV size.
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));

var whitelist = ['https://tatclientapp.mybluemix.net']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Untrusted source of access!!!'))
    }
  }
}

app.use(function(req,res, next){
   if(req.method == "OPTIONS"){
      res.header('Access-Control-Allow-Headers', "*");
      res.header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, PUT, PATCH, DELETE");
      res.header('Access-Control-Allow-Origin', "*");
      res.header('Access-Control-Allow-Credentials', true)
      return res.sendStatus(200);
    }
    else
     return next();
});

app.use(cors());

app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/api', candidateRoute)
app.use('/api/band', bandRoute);
app.use('/api/testConfig', testConfigRoute);
app.use('/api/jrss', jrssRoute);
app.use('/api/quiz', quizQuestionsRoute)
app.use('/api/userAnswer', userAnswerRoute)
app.use('/api/login', loginRoute)
app.use('/result', resultRoute)
app.use('/projectAlloc', projectAllocRoute)

app.use('/api/preTechForm', preTechFormRoute)
app.use('/api/userrole', userroleRoute)
app.use('/getReport', reportRoute)
app.use('/techStream', techStreamRoute)
app.use('/sendEmail', sendEmailRoute)
app.use('/openPosition', openPositionRoute)
app.use('/competencyLevel', competencyLevelRoute)
app.use('/lob', lobRoute)
app.use('/positionLocation', positionLocationRoute)
app.use('/rateCardJobRole', rateCardJobRoleRoute)
app.use('/api/account', accountRoute);

app.use('/scheduleMeeting', meetingEventsRoute)

// Create port
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Find 404 and hand over to error handler
app.use((req, res, next) => {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.error(err.message); // Log error message in our server's console
  if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
  res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});
