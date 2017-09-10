//require mongoose
var mongoose = require("mongoose");
//create schema class
var Schema = mongoose.Schema;

//create article schema
var ArticleSchema = new Schema({
  //title is a required string
  title: {
    type: String,
    required: true
  },
  //link  is required string
  link: {
    type: String,
    required: true
  },
  //note ObjectId
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

//Cretae the article model with ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

//export the model'
module.exports = Article;
