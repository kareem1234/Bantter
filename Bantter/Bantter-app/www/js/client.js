function User(eventEmitter,request){
	// User properties
	var Age, Gender,City,Id,FbId,Lat,Lgt,Timestamp, Name;
	var R = request;
	var E = eventEmitter;
	var that = this;

	this.returnUser = function(){
		var me; me.Age = Age; me.Gender = Gender; me.City = City; me.Name = Name; 
		me.Id = Id; me.FbId = FbId; me.Lat = Lat; me.Lgt = Lgt; me.Timestamp = Timestamp;
		return me;
	}
	this.save = function(){
		window.localStorage.setItem("me", JSON.stringify(returnUser()));
	}
	this.load = function(){
		var me = window.localStorage.getItem("me");
		if(me === null)
			return false;
		else{
			me = JSON .parse(me);
			Age = me.Age; Gender = me.Gender; City = me.City; Name = me.Name;
			Id = me.Id; FbId = me.FbId; Lat = me.Lat; Lgt = me.Lgt; Timestamp = me.Timestamp;
			return true;
		}
	}
	this.login = function(){
		var callback = function(response){
			if(response.authResponse){
				E.EMIT("signedUp");
			}else{
				E.EMIT("deniedSignUp");
			}
		};
		FB.login(callback,{
			scope:"user_birthday,user_location,user_videos";
		});
	}
	this.getFbData = function(){
		FB.api('/me',{fields:"id,birthday,gender,first_name,location"},function(response){
			if(response.error){
				E.EMIT('error',response.error);
			}else{
				formatFbData(response.data);
			}
		});
	}

	function generateId(){
 		function s4() {
    		return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  		}
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4();
  		};
	}
	function getCordinates(cityId){
		FB.api("/"+cityId,null,function(response){
			if(response.error){
				E.EMIT('error',response.error);
			}else{
				that.Lat  = data.location.latitude;
				that.Lgt  = data.location.longitude;
				insertUser();
				E.EMIT('loadedFbData');
			}
		});
	}
	function insertUser(){
		var _user = returnUser();
		R.request("insertUser",_user);
	}
	function parseAge(birthdate){
		var i = birthdate.length - 4;
		var year = birthdate.substring(i);
		year = parseInt(year);
		year = 2014-year;
		console.log(year);
		return year;
	}
	function parseCity(city){
		var i = city.indexOf(",");
		city = city.substring(0,i);
		console.log(city);
		return city;
	}
	function formatFbData(data){
		that.FbId = data.id;
		that.Gender = data.gender;
		that.Name = data.first_name;
		that.City = parseCity(data.hometown.name);
		that.Age = parseAge(data.birthday);
		that.Id = generateId();
		getCordinates(data.hometown.id);
	}
};


//










