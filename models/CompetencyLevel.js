const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let CompetencyLevelSchema = new Schema({
   competencyLevel: {
         type: String
   }
}, {
   collection: 'competencyLevels'
})

module.exports = mongoose.model('competencyLevels', CompetencyLevelSchema)
