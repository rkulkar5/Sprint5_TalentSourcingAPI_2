const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
const ProjectAllocSchema = new Schema({
    location: {
      type: String
   },
   projectName : {
      type: String
   },
   position: {
      type: String
   }
},{
collection: 'projectAlloc'}
);

const  ProjectAlloc = mongoose.model('ProjectAlloc', ProjectAllocSchema);
module.exports = ProjectAlloc;