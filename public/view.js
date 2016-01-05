//there's undoubtedly a right way to do this
//and that's so not the way I'm going for


//pure jQuery
$(document).ready(function() {
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
      $('.suggestion').text(data);
      var marker = $('<span class="flashy"></span>');
      $('.display').prepend(marker);
      console.log(data);
    });
  });
});