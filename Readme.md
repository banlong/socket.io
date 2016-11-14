# Socket.IO in Nodejs

Socket.IO (http://socket.io) is a library that provides the capability 
to establish two-way communication between a client and the server 
in real time. 

Socket.IO is not the only library that you can use to implement WebSocket. 
However, the advantage of using Socket.IO is that it has broad, 
cross-platform and cross-browser support; falls back to polling when
WebSocket is unavailable; and uses events as its main implementation pattern.

Socket.IO, in some sense, might be considered another server. We can 
refactor auto-generated Express.js code by passing the Express.js app 
object to the createServer() method and then calling the Socket.IO 
listen() method on the server object
```
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
```