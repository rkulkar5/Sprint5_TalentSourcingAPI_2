const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
const ProjectAllocSchema = new Schema({
   userName: {
      type: String
   },
   location: {
      type: String
   },
   clientProject: {
      type: String
   },
   projectName : {
      type: String
   },
   position: {
      type: String
   },
   comments: {
      type: String
   },
   createdBy: {
      type: String
   },
   createdDate: {
      type: Date
   }
},{
collection: 'projectAlloc'}
);

const  ProjectAlloc = mongoose.model('ProjectAlloc', ProjectAllocSchema);
module.exports = ProjectAlloc;