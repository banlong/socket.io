/**
 * Created by nghiepnds on 12/2/2016.
 */
//Declare Module
angular.module('socket', []);

angular.module('socket')
    .controller("Chat", function ($scope, Message) {
        $scope.email = "";
        $scope.sendMessage = function(){
            Message.send({email: $scope.email})
        };

        Message.OnReceiveMessage($scope, function(data){
            console.log("Receive: ");
            console.log(data);
        });
    });



