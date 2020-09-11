const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let RateCardsSchema = new Schema({
   rateCardCode: {
         type: String
   },
   rateCardValue: {
         type: Number
   }
}, {
   collection: 'rateCards'
})

module.exports = mongoose.model('rateCards', RateCardsSchema)
