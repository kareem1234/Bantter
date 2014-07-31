	function MediaLoader(eventEmitter,request){
	var E = eventEmitter;
	var R = request;
	var usLoader = new UserStreamLoader(E,R);
	var that = this;
	var userStream = new Array();
	this.myLikes = undefined;
	this.likers = undefined;
	this.inboxUsers = undefined;
	var mode ='findUsers';
	var maxBuff = 10;
	var likesBuff = 0;
	var inboxRefs;
	var inboxRefHash = {};
	var inboxViewedHash = {};
	var minBuff = 2;
	that.readyStatus = false;

	// loads all user arrays
	// and any other cached data
	this.load = function(){
		that.usLoader.load();
		userStream = userStream.concat(JSON.parse(window.localStorage.getItem("media_userStream")));
		that.likers = JSON.parse(window.localStorage.getItem('media_likers'));
		that.myLikes = JSON.parse(window.localStorage.getItem('media_myLikes'));
	}
	// saves all user arrays 
	// and any other cached data
	this.save = function(){
		window.localStorage.setItem("media_userStream",JSON.stringify(userStream));
		window.localStorage.setItem("media_myLikes",JSON.stringify(that.myLikes));
		window.localStorage.setItem("media_likers",JSON.stringify(that.likers));
	}
	//should be called on startup to load cached data
	// and begin fetching user references
	this.start = function(){
		checkStatus();
		that.getAllUsers();
	}
	this.getMode = function(){
		return mode;
	}
	this.markedViewed = function(vidRef){
		inboxViewedHash[vidRef.Url] = true;
	}
	this.checkViewable = function(url){
		return inboxViewedHash[url];
	}
	// get mylikes likers and finduser stream
	this.getAllUsers = function(){
		usLoader.getUsers();
		R.request('findWhoILike');
		R.request('findWhoLikedMe');
		R.request('getInbox');

	}
	// only get the finduser stream
	this.getUsers = function(){
		usLoader.getUsers();
	}
	// return the next user in que
	// depending on the mode
	this.getNext = function(){
		checkStatus();
		return userStream.shift();
	}
	this.callBuffer = function(){
		buffer();
	}
	function hashInboxRef(ref){
		inboxRefHash[ref.FbId] = ref;
	}
	// when the findUserStream is ready to be process
	// this function takes users out the stream
	// then proceeds to call buffer()
	this.onStreamReady = function(){
		userStream = userStream.concat(usLoader.returnStream());
		buffer();
	}
	// set the viewing mode to 
	// findUsers/ findWhoIlike, findWhoLikedMe
	this.setMode = function(modeType){
		mode = modeType;
		checkStatus();
		buffer();
		likesBuff = 0;
	}
	// attach videoReference array to  the matching user object
	// then call checkStatus() 
	this.onRefLoad = function(refs,type){
		if(type === "findUsers"){
			for(var i = 0; i< userStream.length; i++){
				if(userStream[i].FbId === refs[0].FbId){
					userStream[i].refs = refs;
				}
			}
		}else if(type === "findWhoIlike"){
			for(var i = 0; i< that.myLikes.length; i++){
				if(that.myLikes[i].FbId === refs[0].FbId){
					that.myLikes[i].refs = refs;
					E.EMIT("media_myLikes_refLoaded",i);
				}
			}	
		}else if(type === "findWhoLikedMe"){
			for(var i = 0; i< that.likers.length; i++){
				if(that.likers[i].FbId === refs[0].FbId){
					that.likers[i].refs = refs;
					E.EMIT("media_likers_refLoaded",i);
				}
			}			
		}
		checkStatus();
	}
	this.onInboxLoad = function(refs){
		for(var i =0; i < refs; i++){
			hashInboxRef(refs[i]);
			if(inboxViewedHash[refs[i].url])
				refs[i].viewable = false;
			else
				refs[i].viewable = true;
		}
		inboxRefs = refs;
		if(that.likers && that.myLikes && inboxRefs && (!inboxUsers))
			that.getInboxUsers();
	}
	this.getInboxUsers = function(){
		that.inboxUsers = new Array();
		for(var i =0; i < that.mylikes.length; i++){
			if(inboxRefHash[that.myLikes[i].FbId] != undefined){
				that.myLikes[i].InboxRef = inboxRefHash[that.mylikes[i].FbId]; 
				that.inboxUsers.push(that.mylikes[i]);
			}
		}
		for(var i =0; i < that.likers.length; i++){
			if(inboxRefHash[that.likers[i].FbId] != undefined){
				that.myLikes[i].InboxRef = inboxRefHash[that.mylikes[i].FbId]; 
				that.inboxUsers.push(that.mylikes[i]);
			}
		}
		E.EMIT("media_inbox_loaded");
	}
	// when a user array response comes from the server
	// call the appropiate action and call buffer if needed
	this.onUserLoad = function(users,type){
		if(type === "findUsers"){
			usLoader.addUsers(users);
		}else if(type === "findWhoIlike"){
			that.myLikes = users;
			buffer();
			E.EMIT("media_myLikes_loaded");
		}else if(type === "findWhoLikedMe"){
			that.likers = users;		
			buffer();
			E.EMIT("media_likers_loaded");
		}
		if(that.likers && that.myLikes $$ inboxRefs && (!inboxUsers))
			that.getInboxUsers();
	}
	// check if getNext can be called
	//  and set that.readyStatus variable accordingly
	function checkStatus(){
		var status = that.that.readyStatus;
		if(mode === "findUsers"){
			if(userStream[0].refs != undefined)
				that.readyStatus = true;
			else
				that.readyStatus = false;
		}else if(mode === "findWhoIlike"){
			if(that.myLikes[0].refs !=  undefined)
				that.readyStatus = true;
			else
				that.readyStatus = false;
		}else if(mode === "findWhoLikedMe"){
			if(that.likers[0].refs != undefined)
				that.readyStatus = true;
			else
				that.readyStatus = false;
		}
		if(! (status && that.readyStatus)){
			if(that.readyStatus)
				E.EMIT("media_ready");
			else
				E.EMIT("media_notReady");
		}
	}
	// call individual buffer functions
	function buffer(){
		bufferStream();
		bufferLikers();
		bufferMyLikes();
	}
	// buffer the findUserStream
	// by retrieving associated video refs
	function bufferStream(){
		var max;
		if(mode === 'findUsers')
				max = maxBuff;
		else 
			max= minBuff;
		for(var i = 0; i< userStream.length; i++){
			if(i > max )
				return;
			if(userStream[i].refs === undefined)
				R.request('getVideoRefs',user.FbId);
		}

	}
	// buffer the MyLikes
	// by retrieving associated video refs  
	function bufferMyLikes(){
		likesBuff = likesBuff+10;
		for(var i = 0; i< that.myLikes.length; i++){
			if(i > likesBuff )
				return;
			if(that.myLikes[i].refs === undefined)
				R.request('getVideoRefs',user.FbId);
		}
	}
	// buffer the likers
	// by retrieving associated video refs
	function bufferLikers(){
		likesBuff = likesBuff+10;
		for(var i = 0; i< that.likers.length; i++){
			if(i > likesBuff )
				return;
			if(that.likers[i].refs === undefined)
				R.request('getVideoRefs',user.FbId);
		}
	}	
}