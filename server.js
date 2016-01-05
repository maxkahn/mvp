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
    username: String,
    sector: Number 
  });
  var Place = connection.model('Place', placeSchema);

// connection.on('open', function() {
//   new Admin(connection.db).listDatabases(function (err, result) {
//     console.log('listDatabases succeeded');
//     var allDatabases = result.databases;
//   });
// });

//middleware to handle authentication
  //problem: the session server-side module is not designed for production environments
    //not sure what the worst that could happen would be
var restrict = function(req, res, next) {
  if (req.session.user) {
    //the next call is what makes this middleware
    next();
  }
  else {
    res.redirect('login');
  }
};

var app = express();

app.use(cors());
app.use(session({secret: 'ready for primetime'}));
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

app.get('/login', function(req, res) {
  //basically, here I need a new html page entirely
  //and I'll just serve that
  res.sendfile('./public/login.html');
});

app.post('/login', function(req, res) {
  //worry about a signup page later
  //for now, if the username/password combo aren't in the db
    //we'll just create that entry
});


//the AJAX calls below here are behind the authentication barrier
app.get('/refresh', restrict, function(req, res) {
  console.log('AJAX get received at server');
  //query the db
  Place.find({username: "John Doe"}, function(err, docs) {
    if (err) {
      throw err;
    }
    else {
      console.log('db queried for data');
      res.send(JSON.stringify(docs));
    }
  });
  //send the results of that query to the client
  //res.sendfile('index.html');
});

app.get('/new', restrict, function(req, res) {
  //do some calculations to find the next place
    //here's how: each place gets assigned to a sector
      //I *really* should modularize some of this code
    //one of those sectors predominates
    //send to opposite sector
      //a random point within the sector, but let's work on this for now

  //we find how many locations appear in any one sector
  //also, as soon as we have more users, this should be by current user,
  //not literally all places
  Place.find({username: "John Doe"}, function(err, docs) {
    var sectors = {};
    for (var i = 0; i < docs.length; i++) {
      if (sectors.hasOwnProperty(docs[i].sector)) {
        sectors[docs[i]["sector"]]++;
      }
      else {
        sectors[docs[i]["sector"]] = 1;
      }
    }

    //now given an object with a bunch of numbers, we find the max
    var temp;
    var tempMax;
    for (key in sectors) {
      if (!temp || sectors[key] > tempMax) {
        temp = key;
        tempMax = sectors[key];
      }
    }
    res.send(JSON.stringify(newSector(temp, 3)));
  });

  //then send a sector
});



app.post('/', restrict, function(req, res) {
  //in here, I need to extract the data,
  console.log("posting");
  //no way is this the best way to parse the data from the client
    //but it does seem to work
  var location = JSON.parse(Object.keys(req.body)[0]);
  console.log(typeof location, location);
  var longi = location["x"];
  var lat = location["y"];
  //start with 9 sectors
  var sector = getSector(lat, longi, 3);
  var newPlace = new Place({longi: location["x"], lat: location["y"], 
    username: "John Doe", sector: sector});
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

//takes latitude and longitude,
//returns a single number representing the sector
//out of sidelength ^ 2 sectors
var getSector = function(lat, longi, sidelength) {
  var westBound = -122.55;
  var eastBound = -122.32;
  var northBound = 37.82;
  var southBound = 37.70;
  //to get the column, take the mod
  //to get the row, take the quot
  var col = Math.ceil((longi-westBound) * sidelength / (eastBound - westBound));
  var row = Math.ceil((lat - southBound) * sidelength / (northBound - southBound));

  return (row - 1) * sidelength + col;
};

//given the number of a sector and the total number of sectors
//returns a *different* sector, hopefully far away
var newSector = function(sect, sidelength) {
  var col = (sect % sidelength) + 1;
  var row = Math.ceil(sect / sidelength);
  var newCol = 1 + sidelength - col;
  var newRow = 1 + sidelength - row;
  var candidate = (newRow - 1) * sidelength + newCol;
  if (candidate !== sect) {
    return candidate;
  }
  else {
    return 1;
  }
};

//I should totally normalize these somehow