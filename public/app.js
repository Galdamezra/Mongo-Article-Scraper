//grab article as a json
$.getJSON("/articles", function(data) {
  console.log(data);
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});

//Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  //empty the notes from the note section'
  $("#notes").empty();
  //save the id from the p tag
  var thisId = $(this).attr("data-id");

  //now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
  //with that done, add the note informationto the page
    .done(function(data) {
      console.log(data);
      //the title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      //input to enter new title
      $("#notes").append("<input id='titleinput' name='title' >");
      //text area to add note
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      //button to submit new note with article id
      $("#notes").append("<button data-id'" + data._id + "' id='savenote'>Save Note</button>");

      //if there's a note in the article
      if (data.note) {
        //place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        //place the body of hte note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

//on click save note button
$(document).on("click", "#savenote", function() {
  //grab id associatedwith article from the submit button
  var thisId = $(this).attr("data-id");

  //run a POST request to change note
  $.ajax({
    method: "POST",
    url: "/article/" + thisId,
    data: {
      //vale taken from title input
      title: $("#titleinput").val(),
      //value taken from the note textarea
      body: $("#bodyinput").val()
    }
  })
    //with that done
    .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});
