var request = require("request");
var options = {
		url:"http://localhost:3000/findUsers",
		json:true,
		body:{
			Name: makeid(),
			FbId: Math.floor(Math.random() * 1000000000),
			Id: Math.floor(Math.random() * 1000000000),
			Age: 22,
			City: "Ottawa",
			Lat: 37,
			Lgt: 75,
			Gender: "Male",
			TimeStamp: 0,
			Time: 0,
			Range: 10
		}
};
request.get(options,callback);
var callback = function(err,res,body){
	if(err)
		console.log(err);
	else
		console.log("completed request");
	console.dir(res.body);
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function makeid(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}
