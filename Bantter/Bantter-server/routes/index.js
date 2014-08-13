
var db = require("../database/db.js");
var crypto = require("crypto");
var bucket = "bantter-uploads";
var credentials = require('../config.json');
var awsKey = credentials.accessKeyId;
var secret = credentials.secretAccessKey;

function errCallback(res){
	var func = function(err){
		if(err)
			console.log(err);
		if(res && !res.headersSent)
			res.send(404);
	};
	return func;
}
exports.insertUser = function(req,res){
	var user = req.body
	var callback = function(){
			res.end();
	};
	db.insertUser(user,callback,errCallback(res));
	db.insertIdPair(user.FbId,user.Id,callback,errCallback(res));
}
exports.insertLike = function(req,res){
	convertPropsToNum(req.body);
	checkPermision(req.body.Id,req.body.FbId,res,function(){
		db.insertLike(req.body.Like,function(){
			res.end();
		},errCallback(res));
	});
}
exports.findUsers = function(req,res){
	convertPropsToNum(req.query);
	var query = db.getUserQuery(req.query.Age,req.query.Gender);
	var callback = function(docs){
		for(var i=0; i<docs.length; i++)
				delete docs[i].Id;
		res.json(docs);
	}
	db.findUsers(query,req.query,req.query.Range,req.query.Time,callback,errCallback(res));
}
exports.findWhoLikedMe= function(req, res){
	convertPropsToNum(req.query);
	var query = db.getUserQuery(req.query.Age,req.query.Gender);
	var callback = function(docs){
		for(var i=0; i<docs.length; i++)
				delete docs[i].Id;		
		res.json(docs);
	};
	checkPermision(req.query.Id,req.query.FbId,res,function(){
		db.findWhoLikedMe(query,req.query.FbId,callback,errCallback(res));
	});
}
exports.findInboxUsers = function(req,res){
	var query = db.getUserQuery(req.query.Age,req.query.Gender);
	convertPropsToNum(req.query);
	var callback = function(docs){
		res.json(docs);
	};
	checkPermision(req.query.Id,req.query.FbId,res,function(){
		db.findInboxUsers(query,req.query.FbId,callback,errCallback(res));
	});
}
exports.findWhoILike = function(req, res){
	var query = db.getUserQuery(req.query.Age,req.query.Gender);
	convertPropsToNum(req.query);
	var callback = function(docs){
		for(var i=0; i<docs.length; i++)
				delete docs[i].Id;
		res.json(docs);
	};
	checkPermision(req.query.Id,req.query.FbId,res,function(){
		db.findWhoILike(query,req.query.FbId,callback,errCallback(res));
	});
}

exports.getVideoRefs = function(req,res){
	convertPropsToNum(req.query);
	db.findVidRefs(req.query.FromFbId,function(docs){
		console.dir(docs);
		res.json(docs);
	},errCallback(res));
}
exports.getInboxRefs = function(req,res){
	convertPropsToNum(req.query);
	var callback = function(docs){
		res.json(docs);
	};
	checkPermision(req.query.Id,req.query.FbId,function(){
		db.findInboxRef(req.query.FbId,callback,errCallback(res));
	});
}
returnSignedPolicy = function(vidRef, res){
	var fileName = vidRef.Url;
	var expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
	 var policy =
    { "expiration": expiration,
        "conditions": [
            {"bucket": bucket},
            {"key": fileName},
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 4000]
        ]};
    var policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
	console.log("Policy Base64:"+ policyBase64);
 	var signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    res.json({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});
 
}
exports.getPolicy = function(req,res){
	convertPropsToNum(req.body);
	returnSignedPolicy(req.body.VidRef,res);
}
convertPropsToNum = function(user){
	user.FbId = Number(user.FbId);
	user.Id = Number(user.Id);
	user.Lat = Number(user.Lat);
	user.Lgt = Number(user.lgt);
	user.Age = Number(user.Age);
	user.TimeStamp = Number(user.TimeStamp);
	if(user.Range)
		user.Range = Number(user.Range);
	if(user.Time)
		user.Time = Number(user.Time);
	if(user.FromFbId)
		user.FromFbId = Number(user.FromFbId);
	if(user.Like){
		console.log("printing like")
		console.dir( typeof(user.Like[0].From));
		for(var i =0; i< user.Like.length; i++){
			if(typeof(user.Like[i].From) != 'number')
				user.Like[i].From = Number(user.Like.From);
			if(typeof(user.Like[i].From) != 'number')
				user.Like[i].To = Number(user.Like.To);
		}
	}
		console.dir(user.Like);



}
checkPermision = function(userId, fbId,res, callback){
	console.log('userId:'+userId+" fbId"+fbId);
	console.log("checking if ids are numbers: " +typeof(fbId));
	console.log("checking permission");
	db.getIdPair(userId,function(docs){
		if(docs.length == 0){
				console.log(docs.length);
				console.log("no matching id found")
				var er =errCallback(res);
				er();
			}
		else if(docs[0].FbId === fbId  && docs[0].UserId === userId){
				console.log("id pair matches");
				callback(true);
			}
		else {
			console.log("ids do not match");
			var er = errCallback(res);
			er();
		}
	},errCallback(res));
}