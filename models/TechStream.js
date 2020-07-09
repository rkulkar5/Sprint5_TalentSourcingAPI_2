const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
const TechStreamSchema = new Schema({
   technologyStream: {
      type: String,
   },
   createdBy: {
      type: String
   },
   createdDate: {
      type: Date
   }
},{
collection: 'techStream'}
);

const  TechStream = mongoose.model('techStream', TechStreamSchema);
module.exports = TechStream;