var http = require('http'),
    express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    favicon = require('serve-favicon'),
    errorhandler = require('errorhandler'),
    cookieParser = require('cookie-parser'),
        cors = require("cors"),
    bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var upload = require('./routes/upload');
var app = express();



// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/icons', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/upload', upload);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(errorhandler());

//Allow cross origin request
app.use(cors());


 //Socket.IO
var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  socket.on('messageChange', function (data) {
    console.log(data);
    //socket.emit('receive', data.message.split('').reverse().join('') );
    socket.emit('receive', data.message );
  });

  socket.on('send-message', function (data) {
    console.log(data.email);
    //socket.emit('receive', data.message.split('').reverse().join('') );
    socket.emit('receive-message', data.email );
  });

});
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;






