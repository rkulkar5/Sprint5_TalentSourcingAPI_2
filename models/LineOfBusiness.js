const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let LOBSchema = new Schema({
   lob: {
         type: String
   }
}, {
   collection: 'lobs'
})

module.exports = mongoose.model('lobs', LOBSchema)
