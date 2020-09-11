const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Account = new Schema({
   account: {
         type: String
   }
}, {
   collection: 'accounts'
})

module.exports = mongoose.model('Account', Account)
