function UserStreamLoader(eventEmitter,Request){
	var E = eventEmitter;
	var R = Request;
	var idHash = {};
	var userStream = new Array();
	var userBackup  = new Array();
	var ranges = new Array();
	var currentRange = 0;
	var rangeIncrement = 2;
	var maxBuffer = 20;
	var maxRange = 10;
	var onUserAddedCount = 0;
	var userRange = {};
	this.save = function(){
		window.localStorage.setItem("userStreamLoader_userStream",JSON.stringify(userStream));
		window.localStorage.setItem("userStreamLoader_userBackup",JSON.stringify(userBackup));
		window.localStorage.setItem("userStreamLoader_ranges",JSON.stringify(ranges));
	}
	this.load = function(){
		setRange();
		userStream = userStream.concat(JSON.parse(window.localStorage.getItem("userStreamLoader_userStream")));
		userBackup = userBackup.concat(JSON.parse(window.localStorage.getItem("userStreamLoader_userBackup")));
		ranges = ranges.concat(JSON.parse(window.localStorage.getItem("userStreamLoader_ranges")));
	}
	// when request come in call this function an addUsers
	// to appropiate users
	this.addUsers = function(users){
		onUserAddedCount+= rangeIncrement;
		updateTimeRange[users[0]];
		for(var i=0; i<users.length; i++){
			if(checkHash(users[i].FbId) && checkRange(user[i])){
				userStream.push(users[i]);
			}else{
				userBackup.push(users[i]);
			}
		}
		if((onUserAddedCount === maxRange) && (userStream.length < maxBuffer)){
				while((userStream.legnth < maxBuffer) && (userBackup.length > 0))
						userStream.push(userBackup.pop());
			onUserAddedCount = 0;
			currentRange = 0;
		}
		if(userStream.length > 0)
			E.EMIT("userStream_ready");
		else
			E.EMIT("userStream_notReady");
		
	}
	// make the request to get users
	//  increment currentRange and make subsequent request
	//  after make one request to get any particular user
	this.getUsers = function(){
		while(currentRange != maxRange){
				currentRange+= rangeIncrement;
				R.request('findUsers',getTimeRange());
		}
		var timeRange = getTimeRange();
		timeRange = modifyTime(timeRange);
		timeRange = modifyRange(timeRange);
		R.request("findUsers",timeRange);
	}
	// return the userStream array to the userLoader
	this.returnStream = function(){
		var returnArray = userStream;
		userStream= [];
		E.EMIT("userStream_notReady");
		return returnArray;
	}
	// updateTimeRange object to reflect latest timestamp.
	// This is used to keep track of videos that have been seen
	function updateTimeRange(user){
		var range = Math.abs(user.Lat-userRange.lat);
		if(range > maxRange)
			 return;
		for(var i = 0; i< ranges.length; i++){
			if(ranges[i].range- range < 1 )
				ranges[i].time = user.TimeStamp;
		}
	}
	// check to see if given user is within maxRange
	function checkRange(user){
		if( Math.abs(user.Lat-userRange.lat) > maxRange)
			return false;
		if( Math.abs(user.Lgt-userRange.lgt) > maxRange)
			return false;
		return true;
	}
	// setRange variables depending on user
	function setRange(){
		var me = Request.getUser();
		userRange.lat = me.lat;
		userRange.Lgt = me.lgt;
	}
	// TimeRange object used to keep track
	// of the latest upload time associated with a gps range
	function TimeRange(){
		this.time = 0;
		this.range = currentRange;
	}
	// check if this user has already beeen added to the stream
	// or the users most recent upload has been seen before
	function checkHash(user){
		if( idHash.[user.FbId] === undefined){
			idHash.[user.FbId] = user.TimeStamp ;
			return true;
		}
		if(idHash.[user.FbId] < user.TimeStamp){
			idHash.[user.FbId] = user.TimeStamp ;
			return true;
		}
		return false;
	}
	// get the timeRange object associated with the currentRange
	// variable, if no timeRange object create a new one
	function getTimeRange(){
		for(var i =0; i<ranges.length; i++){
			if(ranges[i].range = currentRange)
				return ranges[i];
		}
		var r = new TimeRange();
		ranges.push(r);
		return r;
	}
	// modify a Time Range object to have a 0 timestamp
	function modifyTime(timeRange){
		timeRange.time = 0;
		return timeRange;
	}
	// modify a TimeRange object to have maxRange
	function modifyRange(timeRange){
		timeRange.range = 100;
		return timeRange;
	}
}