//require mongoose
var mongoose = require("mongoose");
//create a schedma class
var Schema = mongoose.Schema;

//create a the note schema
var NoteSchema = new Schema({
  //just a string
  title: {
    type: String
  },
  //just a string
  body: {
    type: String
  }
});

//Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

//export the note model
module.exports = Note;
