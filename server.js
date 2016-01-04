var express = require('express');
var session = require('express-session');
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

app.get('/', function(req, res) {
  res.sendfile('index.html');
})

//remember that I'll need to change this when I deploy
var port = 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});