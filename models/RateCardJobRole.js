const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let RateCardJobRoleSchema = new Schema({
   rateCardJobRole: {
         type: String
   }
}, {
   collection: 'rateCardJobRoles'
})

module.exports = mongoose.model('rateCardJobRoles', RateCardJobRoleSchema)
