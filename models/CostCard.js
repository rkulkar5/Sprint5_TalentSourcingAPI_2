const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let CostCardsSchema = new Schema({
   costCardCode: {
         type: String
   },
   costCardValue: {
         type: Number
   }
}, {
   collection: 'costCards'
})

module.exports = mongoose.model('costCards', CostCardsSchema)
