
angular.module('socket')
        .factory('SocketIO', function () {
            var signalServerIp = "";
            if (window.location.hostname !== "localhost"){
                signalServerIp = "https://" + window.location.hostname +  ":3000";
            }
            else{
                signalServerIp = "http://" + window.location.hostname + ":3000";
            }
            console.log("-->>SocketIO Connection established");
            var socket = io.connect(signalServerIp);

            return socket;
        });





