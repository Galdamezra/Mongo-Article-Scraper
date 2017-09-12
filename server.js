//dependencies

var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//require note and article models
var Note = require("./models/Note.js");
var Article =  require("./models/Article.js");
//our scraping tools
var request = require("request");
var cheerio = require("cheerio");
//set mongoose to leveragebuild in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Initialize Express
var app = express();

//use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

//make a public static direct
app.use(express.static("public"));

//Database configuration with mongoose
mongoose.connect("mongodb://localhost/aecarticles");
var db = mongoose.connection;

//show any mongoose error
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

//Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

//Routes

//GET request to scrape the ENR website
app.get("/scrape", function(req, res) {
  //Grab body of html with request
  request("http://www.enr.com/", function(error, response, html) {
    // load into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    //grab every h1
    $("h1.home-featured-content__headline").each(function(i, element) {

      //save an empty result object
      var result = {};

      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      //using our article model, create a new entry
      //pass the result object to entry adn the title and link
      var entry = new Article(result);

      //save the entry to the db
      entry.save(function(err, doc) {
        //log any errors
        if (err) {
          console.log(err);
        }
        //or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  //tell browser that scraping finished
  res.send("Scrape Complete");
});

//get articles scraped from the mongoDB
app.get("/articles", function(req, res) {
  //grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    //log errors
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

//grab articles by ObjectId
app.get("/articles/:id", function(req, res) {
  //using the id passed in the id parameter
  Article.findOne({ "_id": req.params.id })
  ////populate all of the notes associated with it
  .populate("note")
  //now execute our query
  .exec(function(error, doc) {
    //log errors
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

//create a new notes or replace existing
app.post("/articles/:id", function(req, res) {
  //create anew note and pass the req.body to entry
  var newNote = new Note(req.body);

  //save new note to db
  newNote.save(function(error, doc) {
    //log errors
    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id})
      //execute above entry
      .exec(function(err, doc) {
        //log errors
        if (err) {
          console.log(err);
        }
        else {
          res.send(doc);
        }
      });
    }
  });
});

//Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
