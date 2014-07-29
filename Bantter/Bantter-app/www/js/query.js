
function Request(EventEmitter){
	var domain;
	var me;
	var E = EventEmitter;

	this.setUser = function(user){
		me = user;
	}
	this.getUser = function(){
		return me;
	}

	function makeRequest(Type,URL,Data){
		$.ajax({
			url: domain+URL,
			type: Type,
			data: Data
		}).done(function(response){
			E.EMIT("complete"+url,response);
		}).fail(function(error){
			E.EMIT("failed"+url,error);
		});
	}
	this.request = function(string,data){
		console.log("attempting to request: "+string);
		switch(string){
			case:"insertLike"
				me.Like = data;
				makeRequest("POST","/"+string,me)
				break;
			case: "getPolicy"
					me.VidRef = data;
					makeRequest("POST","/"+string,me);
					break;
			case: "insertVidRef"
					me.VidRef = data;
					makeRequest("POST","/"+string,me);
					break;
			case: "insertUser"
					makeRequest("POST","/"+string,me);
					break;
			case: "findWhoLikedMe"
					makeRequest("GET","/"+string,me);
					break;
			case: 'findWhoILike'
					makeRequest("GET","/"+string,me);
					break;
			case: 'getVideoRefs'
				   me.FromFbId = data;
				   makeRequest("GET","/"+string,me);
				   break;
			case: "findUsers"
					me.Range = data.range;
					me.Time	 = data.time;
					makeRequest('GET',"/"+string,me);
			case: 'getInbox'
				   makeRequest("GET","/"+string,me);
				   break;
			case: "findInboxUsers"
					makeRequest("GET","/"+string,me);
					break;
		}
	}

}

