/**
 * Created by nghiepnds on 12/2/2016.
 */

/**
 * Created by nghiepnds on 12/2/2016.
 */
angular.module('socket')
    .factory('AnnotationIO', function ($q, SocketIO) {

        return {
            JoinGroup: joinGroup,
            ExitGroup : exitGroup
        };
        /*---------------------------------------------------------------
         SECTION 2: ANNOTATION
         Usage: Push changes in annotation to all views
         ---------------------------------------------------------------*/

        /*---------------------------------------------------------------
         Usage: Join the group of all viewers of an Annotation
         Arguments:
         userName: user Id of the viewer
         groupId: the id of the group which this user wants to join
         ---------------------------------------------------------------*/
        function joinGroup(userName, groupId){
            //need to add room type (last parameter) from the GUI, hardcoding here
            SocketIO.emit('join_group', {
                userName: userName,
                groupId: groupId
            });

            var timeoutPromise = $timeout(function() {
                deferred.reject("Timed out");
            }, 250);

            var deferred = $q.defer();

            SocketIO.on("join_group_success", function(groupId){
                $timeout.cancel(timeoutPromise);
                deferred.resolve({groupId: groupId});
            });

            SocketIO.on("join_group_failed", function(groupId){
                $timeout.cancel(timeoutPromise);
                deferred.reject(groupId);
            });

            return deferred.promise;
        };


        /*---------------------------------------------------------------
         Usage: Exit the group of all viewers of an Annotation
         Arguments:
         userName: user Id of the viewer
         groupId: the id of the group which this user wants to join
         --------------------------------------------------------------*/
        function exitGroup(userName, groupId){
            SocketIO.emit('exit_group', {
                userName: userName,
                groupId: groupId
            });

            var deferred = $q.defer();

            SocketIO.on("exit_group_success", function(groupId){
                deferred.resolve({groupId: groupId});
            });

            SocketIO.on("exit_group_failed", function(groupId){
                deferred.reject(groupId);
            });

            return deferred.promise;

        };
    });