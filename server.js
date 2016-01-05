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
// connection.once('open', function() {
//   var userSchema = mongoose.Schema({
//     name: String,
//     password: String
//   });
//   var User = mongoose.model('User', userSchema);
//   //default user for testing purposes
//   var johndoe = new User({name: "John Doe", password: "password"});
// });

connection.once('open', function() {
  var placeSchema = mongoose.Schema({
    longi: Number,
    lat: Number,
    username: String 
  });
});


//ideally, refactor to take the whole db section out of this file
  //i'm hoping there's no synchronicity issue
    //if there is, that would be bad
  var userSchema = mongoose.Schema({
    name: String,
    password: String
  });
  var User = connection.model('User', userSchema);
  //default user for testing purposes
  var johndoe = new User({name: "John Doe", password: "password"});

  //time permitting, add some kind of id or password
    //users may have the same name
  var placeSchema = mongoose.Schema({
    longi: Number,
    lat: Number,
    username: String 
  });
  var Place = connection.model('Place', placeSchema);

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

app.get('/refresh', function(req, res) {
  console.log('AJAX get received at server');
  //query the db
  Place.find({username: "John Doe"}, function(err, docs) {
    if (err) {
      throw err;
    }
    else {
      console.log('db queried for data: ', JSON.stringify(docs));
      res.send(JSON.stringify(docs));
    }
  });
  //send the results of that query to the client
  //res.sendfile('index.html');
});



app.post('/', function(req, res) {
  //in here, I need to extract the data,
  console.log("posting");
  //no way is this the best way to parse the data from the client
    //but it does seem to work
  var location = JSON.parse(Object.keys(req.body)[0]);
  console.log(typeof location, location);
  var newPlace = new Place({longi: location["x"], lat: location["y"], username: "John Doe"});
  //then put it in the database
  newPlace.save(function(err) {
    if (err) {
      throw  err;
    }
  });
  console.log(newPlace);
  //it has x and y coords
    //assume I have a user stored sw else
  res.send("argle");
});

//remember that I'll need to change this when I deploy
var port = 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});