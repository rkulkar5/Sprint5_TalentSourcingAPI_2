const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Userrole = new Schema({
   userrole: {
         type: String
   }
}, {
   collection: 'userroles'
})

module.exports = mongoose.model('Userrole', Userrole)
