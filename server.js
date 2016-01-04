var express = require('express');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
//what do I need to set up my db?
var db = require('mongodb');

var app = express();

app.get('/', function(req, res) {
  res.sendfile('index.html');
})

//remember that I'll need to change this
//when I deploy
var port = 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
};