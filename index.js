var app = require('express')();
var http = require('http').Server(app);
require('./app/routes')(app);
var io = require('socket.io')(http);
var path = require('path');
var express = require('express');
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');

var configDB = require('./config/database');
mongoose.connect(configDB.url);
var db = mongoose.connection;
db.on()

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
    res.render('index');
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
});

http.listen(process.env.PORT || 5000, function(){
    console.log('listening on *:5000');
});