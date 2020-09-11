const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let PositionLocationSchema = new Schema({
   positionLocation: {
         type: String
   }
}, {
   collection: 'positionLocations'
})

module.exports = mongoose.model('positionLocations', PositionLocationSchema)
