/**
 * Created by nghiepnds on 12/2/2016.
 */
angular.module('socket')
    .factory('VideoUploadIO', function ($q, SocketIO) {

        return {
            GetVideoID: getVideoID,
            OnUploadStatusChange: onUploadStatusChange,
        };
        //SECTION 1: UPLOAD VIDEO SIGNAL
        /*---------------------------------------------------------------
         Usage: Get video ID for the upload job, Return a promise when get id
         Arguments: args = {Size: , Duration: }, video file size & duration
         ---------------------------------------------------------------*/
        function getVideoID(args) {
            SocketIO.emit('get_video_id', JSON.stringify(args));
            var deferred = $q.defer();

            var timeoutPromise = $timeout(function() {
                deferred.reject("Timed out");
            }, 250);

            SocketIO.on("get_id_success", function(id, file){
                $timeout.cancel(timeoutPromise);
                deferred.resolve({id: id, file: file});
            });

            SocketIO.on("get_id_failed", function(msg){
                $timeout.cancel(timeoutPromise);
                deferred.reject(msg);
            });

            return deferred.promise;
        }

        //When the new status arrive
        function onUploadStatusChange(scope, callback) {
            var handler = SocketIO.on("upload-status-change", callback);
            scope.$on('$destroy', handler);
        }
    });