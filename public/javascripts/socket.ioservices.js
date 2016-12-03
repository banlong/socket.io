
angular.module('socket')
        .factory('SocketIO', function () {
            var signalServerIp = "";
            if (window.location.hostname !== "localhost"){
                console.log("-->>SOCKETIO - running on Production");
                signalServerIp = "https://" + window.location.hostname +  ":3000";
            }
            else{
                console.log("-->>SOCKETIO - running on localhost");
                signalServerIp = "http://" + window.location.hostname + ":3000";
            }

            var socket = io.connect(signalServerIp);

            return socket;
        });





