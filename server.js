var express = require('express');
var session = require('express-session');
var cors = require('cors');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
//what do I need to set up my db?
var MongoClient = require('mongodb');
var mongoose = require('mongoose');
var Admin = mongoose.mongo.Admin;

//this is code we'll have to change when we deploy
//not sure I need to do this
//if db does not exist; we'll start creating collections, right?
//and that will make it exist
//do I get any security features at all?
//also, not totally clear on createConnection vs connect
var connection = mongoose.createConnection('mongodb://localhost:27017/app');

// connection.on('open', function() {
//   new Admin(connection.db).listDatabases(function (err, result) {
//     console.log('listDatabases succeeded');
//     var allDatabases = result.databases;
//   });
// });

var app = express();

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.json());
//NB: we need this next line to get the data to the server
  //whenever we have this setup
app.use(bodyParser.urlencoded({extended: true}));

//I'm not sure whether this is a test
//or code I really need
// app.use(function (req, res, next) {
//   //console.log(req.body);
//   next();
// });

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.post('/', function(req, res) {
  //in here, I need to extract the data,
  console.log("posting");
  //no way is this the best way to parse the data from the client
    //but it does seem to work
  var location = JSON.parse(Object.keys(req.body)[0]);
  console.log(typeof location, location);
  //then put it in the database
  //it has x and y coords
    //assume I have a user stored sw else
  res.send("Location posted to server");
});

//remember that I'll need to change this when I deploy
var port = 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});