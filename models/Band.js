const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Band = new Schema({
   lob: {
        type: String
   },
   band: {
         type: String
   }
}, {
   collection: 'bands'
})

module.exports = mongoose.model('Band', Band)
