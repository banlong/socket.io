
angular.module('socket')
        .factory('Message', function ($q, SocketIO) {

            function sendMsg(msg) {
                SocketIO.emit('send-message', msg);
            }

            /* 1 - This provides the callback function to the consumer of the Message Service
                   Work as if I create a new event listener in this service(which is actually
                   passed from the SocketIO service)

               2 - What to receive in the callback depend on the sending (emit) called func */
            function OnReceiveMessage (scope, callback) {
                var handler = SocketIO.on("receive-message", callback);
                scope.$on('$destroy', handler);
            }

            return {
                send: sendMsg,
                OnReceiveMessage: OnReceiveMessage
            };

        });






