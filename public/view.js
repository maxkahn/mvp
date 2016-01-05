//there's undoubtedly a right way to do this
//and that's so not the way I'm going for


//pure jQuery
$(document).ready(function() {
  $('.testing').on('click', function() {
    //somewhere in the body of this get, I have to just render the page they send back…
    $.get("http://localhost:3000/login", function(data) {
      console.log(data);
      if (data[0] && data[0] === '.') {
        window.location = data;
      }
    });
  });


  $('.current-place').on('click', function() {
    //here, I get the current location
      //2 args to getCurrentPosition are cb, first is success, 2nd failure
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('Successfully retrieved current position.');
      //in this branch, I have a position object
        //I extract the coordinates
        var x = position.coords.longitude;
        var y = position.coords.latitude;
        console.log(JSON.stringify({x: x, y: y}));
        //then send it to the server
          //I will have to rewrite this line when I deploy
//           $.ajax({
//   type: "POST",
//   url: "http://localhost:3000/",
//   data: JSON.stringify({x: x, y: y}),
//   success: function() {console.log("message has left the client");},
//   dataType: "application/json"
// });
        $.post("http://localhost:3000/", JSON.stringify({x: x, y: y}),
          function(data) {
            console.log(data);
          }, "content-type:application/json");
    }, function(err) {
      console.log("Unable to get current position.");
    });
    //then send an AJAX POST to the server
  });


  $('.places-so-far').on('click', function() {
    console.log("AJAX get triggered");
    $.getJSON("http://localhost:3000/refresh", function(data) {
      console.log("data received from AJAX get");
      console.log(data);
      //oh, we should *display* this data somewhere
      for (var i = 0; i < data.length; i++) {
        var elem = $('<li></li>').addClass('location');
          //format the lat and longi for legibility with .toFixed
        elem.text(data[i].lat.toFixed(2) + " , " + data[i].longi.toFixed(2));
        $('.old-places').append(elem);
      }
    });
    // .always(function(data) {
    //   console.log(data);
    // });
  });

  //think for 10 seconds! this is a GET, not a POST
  $('.new-place').on('click', function() {
    $.getJSON("http://localhost:3000/new", function(data) {
      //data is an array of entries in the database
      //I want to create a red dot
      //and put that dot on the img
      // $('.suggestion').text(data);
      //to position the circle: there are 9 possibilities
      //I'm given a number, and an implicit number of sectors
      //so at the 1/6, 3/6, and 5/6 marks
        //ie the odd ticks from 0 to 2n-1, where n is the sidelength
      //so I need to extract a row and column
        //row is Math.ceil(data / sidelength)
        var row = Math.ceil(data / 3) || 1;
        //column is data % sidelength + 1
        var col = ((data - 1) % 3) + 1 || 1;
      //then, I use the column to give me the x, and the row to give me the y
      var cx = (col * 10) + 20;
      var cy = (row * 16);
      //a lot of the discussion above is full of magic numbers
        //I will fix that eventually, if I can get this working
      //given those three choices, multiplying by a fixed value that depends only on the sidelength
        //and adding a fixed value that depends only on the viewbox


      //before I try generating a circle dynamically,
      //let me see if I can add one statically
      // var $marker = $('<circle cx="60" cy="60" r="2" fill="red" stroke="red" stroke-width="1"/>');
      //really, I should be toggling class or sth here
        //otherwise, I get too many elements on top of each other
      //in here, I have to get the data and process into an x and y
        //relative to my svg display
        $('.arehere').attr({cx: cx.toString(), cy: cy.toString()});
      // $('.display').append($marker);
      console.log(data);
    });
  });
});