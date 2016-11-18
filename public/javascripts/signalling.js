var SignalServer = function(socketServer){
    this.socket = io.connect(socketServer);

    //1.ROOMS CONTROL
    //Receive signal from server that the room has been created
    this.socket.on('room_created', function (roomName, rType, roomId){
        trace('Room '+ roomName + ' created, type ' + rType + ', roomId: ' + roomId );
        this.onRoomCreated(roomName, rType, roomId);
    }.bind(this));

    //Receive "room_exist", cannot allow to create room
    this.socket.on('room_exist', function (roomName){
        trace('Room ' + roomName + ' does exist');
        this.onRoomExist(roomName);
    }.bind(this));

    //Receive "room_exist", cannot allow to create room
    this.socket.on('room_not_exist', function (roomId, roomName){
        trace('Room ' + roomName + ' does not exist');
        this.onRoomNotExist(roomId, roomName);
    }.bind(this));


    //Receive "full" signal from the signal server, cannot allow to chat
    this.socket.on('room_full', function (roomName){
      trace('Room ' + roomName + ' is full');
      this.onRoomFull(roomName);        //link the event onRoomFull
    }.bind(this));


    //Receive "room list"
    this.socket.on('take_room_list', function (roomList){
        trace('Room list has arrived');
        this.onRoomListArrive(roomList);
    }.bind(this));

    //Receive notice that a new guest joined to the room
    this.socket.on('guest_joined', function(roomId, userId, userName){
        trace('A guest has joined ');
        this.onGuestJoined(roomId, userId, userName)
    }.bind(this));

    //Receive notice that a new guest joined to the room
    this.socket.on('joined', function(roomId, videoId){
        trace(' has joined ' + roomId+' with assoc videoId '+videoId);
        this.onJoined(roomId, videoId)
    }.bind(this));


    //Receive "joined" signal from the signal server, confirm I has join
    this.socket.on('take_offer', function (offerCreatorId, offerName, roomName, sdp){
        trace('Receive offer from ' + offerCreatorId + ' to join room ' + roomName);
        trace(sdp);
        this.onReceiveOffer(offerCreatorId, offerName, roomName, sdp);
    }.bind(this));



    //When receive "answer received" signal from the signal server
    this.socket.on('take_answer', function(sender, senderName, sdp){
        trace('Received answer ');
        trace(sdp);
        this.onReceiveAnswer(sender, senderName, sdp);  //link the event onReceiveAnswer
    }.bind(this));


    //When receive "ice candidate received" signal from the signal server
    this.socket.on('take_ice', function(sender, candidate){
//        trace('Received ICE candidate ');
//        trace(candidate);
        this.onReceiveICECandidate(sender, candidate);
    }.bind(this));

    //When receive message from the signal server
    this.socket.on('take_message', function(sender, msg){
        trace('Received message ');
        trace(msg);
        this.onReceiveMessage(sender, msg);
    }.bind(this));


    //When receive "log" signal from the signal server, display the parameter
    this.socket.on('log', function (array){
      console.log.apply(console, array);
    });

    //When receive lock request from the signal server
    this.socket.on('lock_editing', function(objectId, senderId){
        this.onLockRequestArrive(objectId, senderId);
    }.bind(this));

    //When receive unlock message from the signal server
    this.socket.on('unlock_editing', function(objectId, senderId, object){
        trace('Received message ');
        this.onUnlockEditing(objectId, senderId, object);
    }.bind(this));

    //When receive unlock message from the signal server
    this.socket.on('unlock_editing_nochanges', function(objectId, senderId){
        trace('Received message ');
        this.onUnlockEditingNoChanges(objectId, senderId);
    }.bind(this));

    //When receive update message from the signal server
    this.socket.on('updateObjectChange', function(object, senderId){
        trace('Received message ');
        this.onUpdateObjectChange(object, senderId);
    }.bind(this));


    //ANNOTATION
    //Receive notice that a new guest joined to the room
    this.socket.on('leaved_reply_thread', function(threadId){
        this.onLeavedReplyThread(threadId)
    }.bind(this));

    this.socket.on("joined_reply_thread", function(threadId){
        this.onJoinedReplyThread(threadId)
    }.bind(this));

    this.socket.on("add_new_reply", function(reply){
        //console.log(reply);
        this.onAddNewReply(reply)
    }.bind(this));

    this.socket.on("reply_change", function(reply){
        //console.log(reply);
        this.onReplyChange(reply)
    }.bind(this));

    this.socket.on("reply_deleted", function(){
        //console.log(reply);
        this.onReplyDeleted()
    }.bind(this));


    //SCORE UPDATE
    this.socket.on("UpdateScore", function(data){
        this.onUpdateScore && this.onUpdateScore(data)
    }.bind(this));

    this.socket.on("left_event", function(eventId){
        this.onLeftEvent(eventId)
    }.bind(this));

    this.socket.on("joined_event", function(data, key){
        this.onJoinedEvent && this.onJoinedEvent(data, key)
    }.bind(this));
};


//Add methods
SignalServer.prototype = {

    sendMessage: function(message){
        console.log('sending %s to server', message);
        socket.emit('messageChange',{message: message});
    },

    //ACTIVITIES
    //join room
    join_room: function(userName, roomName, roomId){
        if (this.room !== '') {
            trace('Join room ' + roomId);
            //need to add room type (last parameter) from the GUI, hardcoding here
            this.socket.emit('join_request', {
                userName: userName,
                roomName: roomName,
                roomId: roomId
            });
        }
    },

    //create room
    create_broadcast_room: function(username, room, videoId){ 
        if (this.room !== '') {
            trace('Create broadcast room ' + room);
            //need to add room type (last parameter) from the GUI, hardcoding here
            this.socket.emit('create_broadcast_room', username, room, videoId);
        }
    },

    //create room
    create_chat_room: function(userName, roomName, videoId){
        if (this.room !== '') {
            trace('Create chat room ' + roomName);
            //need to add room type (last parameter) from the GUI, hardcoding here
            this.socket.emit('create_chat_room', userName, roomName, videoId);
        }
    },

    //create room
    create_conference_room: function(userName, roomName, videoId){
        if (this.room !== '') {
            trace('Create conference room ' + roomName);
            //need to add room type (last parameter) from the GUI, hardcoding here
            this.socket.emit('create_conference_room', userName, roomName, videoId);
        }
    },

    //create room
    create_class_room: function(userName, roomName, videoId){
        if (this.room !== '') {
            trace('Create class room ' + roomName);
            //need to add room type (last parameter) from the GUI, hardcoding here
            this.socket.emit('create_class_room', userName, roomName);
        }
    },

    //get room list
    get_rooms: function(username){
        trace('Get room list ');
        //need to add room type (last parameter) from the GUI, hardcoding here
        this.socket.emit('get_room_list', username);
    },

    //send a message to a user
    send_message: function(msg, receiver){
        trace('Send message to ' + receiver);
        this.socket.emit('send_message', msg, username);
    },

    //broadcast a message to a room
    broadcast_message: function(msg, roomId){
        trace('Broadcast message to ' + roomId);
        this.socket.emit('broadcast_message', msg, roomId);
    },

    //close socket
    close: function(){
        trace('Disconnecting');
        this.socket.disconnect();
    },

    //upload sdp
    sendOffer: function(guestId, roomId, sdp){
        //trace('Sending SDP');
        this.socket.emit('sdp_offer', {
            guestId: guestId,
            roomId: roomId,
            sdp: sdp
        });
    },

    //upload sdp
    sendAnswer: function(guestId, roomName, sdp){
        //trace('Sending SDP');
        this.socket.emit('accept_offer', guestId, roomName, sdp);
    },

    //upload ICE candidate
    sendICECandidate: function(room, receiver, candidate){
//        trace('sending ice candidate');
//        trace(candidate);
        this.socket.emit('ice_upload', room, receiver, candidate);
    },

    //FOR DATA SLICE DATA SYNC SIGNAL
    //send test message to the signal server
    sendTestMessage: function(msg){
        this.socket.emit("testmsg", msg)
    },

    //send test message to the signal server
    joinEditingRoom: function(roomId,username){
        this.socket.emit("joinEditingRoom", roomId, username)
    },

    startEditingObject: function(roomId,username){
        this.socket.emit("startEditingObject", roomId)
    },

    stopEditingAndSaveObject: function(objectId, object){
        this.socket.emit("stopEditingAndSaveObject", objectId, object)
    },

    stopEditingWithoutChanges: function(objectId){
        this.socket.emit("stopEditingWithoutChanges", objectId)
    },

    updateObjectChange: function(objectId, object){
        this.socket.emit("updateObjectChange", objectId, object)
    },

    //ANNOTATION

    joinReplyThread: function(userName, threadId){
        trace('<< Joined reply thread ' + threadId);
        //need to add room type (last parameter) from the GUI, hardcoding here
        this.socket.emit('join_reply_thread', {
            userName: userName,
            threadId: threadId
        });

    },

    exitReplyThread: function(userName, threadId){
            trace('<< Exit reply thread ' + threadId);
            //need to add room type (last parameter) from the GUI, hardcoding here
            this.socket.emit('exit_reply_request', {
                userName: userName,
                threadId: threadId
            });

    },

    //Add reply done, please ask other users to add this reply into their reply list
    addReply: function(reply){
        trace('<< Add reply ');
        this.socket.emit('add_reply', reply);
    },

    editReply: function(reply){
        trace('<< Edit reply ');
        this.socket.emit('edit_reply', reply);
    },

    deleteReply: function(commentId, replyId){
        trace('<< Delete reply ' + replyId);
        this.socket.emit('delete_reply', commentId, replyId);
    },

    joinEvent: function(userName, eventId){
        trace('<< Joinning Event' + eventId);
        //need to add room type (last parameter) from the GUI, hardcoding here
        this.socket.emit('join_event', {
            userName: userName,
            eventId: eventId
        });

    },

    updateRoom: function(data){
       // trace('<< Joinning Event' + eventId);
        //need to add room type (last parameter) from the GUI, hardcoding here
        this.socket.emit('update_event', {
            ModelID: data.ModelID,
            DataSetID: data.DataSetID,
            BenchmarkID: data.BenchmarkID,
            OrgID: data.OrgID,
            DomainID: data.DomainID,
            DynamicID: data.DynamicID,
        });
    },

    leaveEvent: function(userName, eventId){
        trace('<< Exit event ' + eventId);
        //need to add room type (last parameter) from the GUI, hardcoding here
        this.socket.emit('leave_event', {
            userName: userName,
            eventId: eventId
        });

    },


    //EVENTS
    //event receive sdp
    onReceiveAnswer: function(sender, senderName, sdp){
        trace('Placeholder function: Received SDP')
    },

    //I has joined to room
    onReceiveOffer: function(offerCreatorId, offererName, roomName, sdp){
        trace('Placeholder function: I joined room')
    },

    //new user join
    onGuestJoined: function(roomId, userId, userName){
        trace('Placeholder function: Guest joined room')
    },


    //join a room
    onJoined: function(roomId, videoId){
        trace('Placeholder function: videoId ' + videoId +' joined room ' + roomId)
    },

    //received ice candidate
    onReceiveICECandidate: function(sender, candidate){
        trace('Placeholder function: Received ICE candidate')
    },

    //received message
    onReceiveMessage: function(sender, msg){
        trace('Placeholder function: Received message')
    },

    //room full
    onRoomFull: function(room){
        trace('Placeholder function: Room is full!');
    },

    //room exist
    onRoomExist: function(room){
        trace('Placeholder function: Room exist!');
    },

    onRoomNotExist: function(roomId, roomName){
        trace('Placeholder function: Room does not exist!');
    },

    //room created
    onRoomCreated: function(roomName, rType, roomId){
        trace('Placeholder function: Room is created!');
    },

    //room list arrive
    onRoomListArrive: function(roomlist){
        trace('Placeholder function: Room List is provided!');
    },

    //lock editing
    onLockRequestArrive: function(objectId, senderId){
        trace('Placeholder function: onLockRequestArrive!');
    },

    onUnlockEditing: function(objectId, senderId, object){
        trace('Placeholder function: onUnlockEditing!');
    },

    onUnlockEditingNoChanges: function(objectId, senderId){
        trace('Placeholder function: onUnlockEditingNoChanges!');
    },

    onUpdateObjectChange: function(object, senderId){
        console.log("Update object ", object);
        trace('Placeholder function: onUpdateObjectChange!');
    },


    //ANNOTATION
    onLeavedReplyThread: function(threadId){
        trace('>> on Left thread ' + threadId);
    },

    onJoinedReplyThread: function(threadId){
        trace('>> on Joined thread ' + threadId);
    },

    //Receive notice, update reply list
    onAddNewReply: function(reply){
        trace('>> on Added new reply ');
        InsertReplyToList(reply);
    },

    //Receive notice, update reply list
    onReplyChange : function(reply){
        trace('>> on Changed reply ');
        UpdateReply(reply);
    },

    onReplyDeleted: function(){
        trace('>> on Deleted reply');
        RefreshList();
    },


    // //ANALYTIC REPORT UPDATE
    // onUpdateReport:function(data){
    //     trace('>> on UpdateReport');
    //     //TODO: Call to refresh report data, Thuan provides here

    // },

    onLeftEvent: function(eventId){
        trace('>> on onLeftEvent' + eventId);
    },

    // onJoinedEvent : function(eventId, key){
    //     trace('>> on onJoinedEvent' + eventId);
    //     console.log(key);
    // }
};

function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function trace(text){
    console.info(text);
}