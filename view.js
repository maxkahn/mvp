//there's undoubtedly a right way to do this
//and that's so not the way I'm going for


//pure jQuery

window.position = navigator.geolocation.getCurrentPosition(function(position) {

})

$(document).ready(function() {
  $('.current-place').on('click', function() {
    //here, I get the current location
      //2 args to getCurrentPosition are cb, first is success, 2nd failure
    navigator.geolocation.getCurrentPosition(function(position) {
      //in this branch, I have a position object
        //I extract the coordinates
        var x = position.coords.longitude;
        var y = position.coords.latitude;
        //then send it to the server
          //I will have to rewrite this line when I deploy
        $.post("localhost:3000/", JSON.stringify({x: x, y: y}));
    }, function(err) {
      console.log("Unable to get current position.");
    });
    //then send an AJAX POST to the server
  })
});