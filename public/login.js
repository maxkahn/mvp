var path = process.env.path;

$(document).ready(function() {

  $('button').on('click', function() {
    //here I need to extract the data from the textfields
    var username = $('.name').val();
    var password = $('.password').val();
    var creds = {name: username, word: password};
    $.post(path + "/login", creds, function(data) {
      console.log('json sent to server from login');
      console.log(data);
      //i doubt this will work, but it is the right thing to try
      window.location = data;
    });
  });
});