
var db = require("./db");
var crypto = require("crypto");
var bucket = "";
var awsKey = "";
var secret = "";

function errCallback(res){
	var func = function(err){
		if(err)
			console.log(err);
		if(res && !res.headersSent)
			res.error();
	};
	return func;
}
exports.insertUser = function(req,res){
	var user = req.body
	var cols = db.getCollections(user.Age,user.Geneder);
	var count = 0;
	var maxCallbacks;
	var callback = function(){
		count++;
		if (count == maxCallbacks)
			res.end();
	};
	if(cols.col2 != null){
		maxCallbacks = 3;
		db.insertUser(cols.col1,user,callback,errCallback(res));
		db.insertUser(cols.col2,user,callback,errCallback(res));
		db.insertIdPair(user.FbId,user.Id,callback,errCallback(res));
	}else{
		maxCallbacks = 2;
		db.insertUser(cols.col1,user,callback,errCallback(res));
		db.insertIdPair(user.FbId,user.Id,callback,errCallback(res));
	}
}
exports.insertLike = function(req,res){
	checkPermision(req.body.UserId,req.body.FbId,function(){
		db.insertLike(req.body.Like,function(){
			res.end();
		},errCallback(res));
	});
}
exports.findUsers = function(req,res){
	var cols = db.getCollections(req.query.Age,req.query.Gender);
	var callbackCount = 0;
	var count = 0;
	var returnedDocs;
	var callback = function(docs){
		count++;
		if(count === callbackCount){
			returnedDocs.concat(docs);
			for(var i=0; i<returnedDocs.length; i++)
					delete returnedDocs[i].Id;
			res.json(returnedDocs);
		}else{
			returnedDocs = docs;
		}
	}
	if(cols.col2 != null){
		callbackCount = 2;
		db.findUsers(cols.col2,req.query,req.query.Range,req.query.Time,callback,errCallback(res));
		db.findUsers(cols.col1,req.query,req.query.Range,req.query.Time,callback,errCallback(res));
	}else{
		callbackCount = 1;
		db.findUsers(cols.col1,req.query,req.query.Range,req.query.Time,callback,errCallback(res));
	}
}
exports.findWhoLikedMe= function(req, res){
	var cols = db.getCollections(req.query.Age,req.query.Gender);
	var callback = function(docs){
		res.json(docs);
	};
	checkPermision(req.query.UserId,req.query.FbId,function(permission){
		if(permission){
			if(cols.col2)
				db.findWhoLikedMe(cols.col1,cols.col2,req.query.FbId,callback,errCallback(res));
			else
				db.findWhoLikedMe(cols.col1,cols.col2,req.query.FbId,callback,errCallback(res));
		}
		else{
			var err = errCallback(res);
			err("invalid access");
		}

	});
}
exports.findWhoILike = function(req, res){
	var cols = db.getCollections(req.query.Age,req.query.Gender);
	var callback = function(docs){
		res.json(docs);
	};
	checkPermision(req.query.UserId,req.query.FbId,function(permission){
		if(permission){
			if(cols.col2)
				db.findWhoILike(cols.col1,cols.col2,req.query.FbId,callback,errCallback(res));
			else
				db.findWhoILike(cols.col1,undefined,req.query.FbId,callback,errCallback(res));
		}
		else{
			var err = errCallback(res);
			err("invalid access");
		}

	});
}

exports.getVideoRefs = function(req,res){
	db.findVidRefs(req.query.FromFbId,function(docs){
		res.json(docs);
	}.errCallback(res));
}
exports.getInbox = function(req,res){
	checkPermision(req.query.UserId,req.query.FbId,function(permission){
		if(permission){
			db.findInboxRef(req.query.FbId,function(docs){
				res.json(docs);
			},errCallback(res));
		}else{
			var err = errCallback(res);
			err("wrong permission");
		}
	})
}
function returnSignedPolicy = function(vidRef, response){
	fileName = vidRef.Url;
	expiration = new Date(new Date().getTime() + 1000 * 60 * 5).toISOString();
	  var policy =
    { "expiration": expiration,
        "conditions": [
            {"bucket": bucket},
            {"key": fileName},
            {"acl": 'public-read'},
            ["starts-with", "$Content-Type", ""],
            ["content-length-range", 0, 4000]
        ]};
    policyBase64 = new Buffer(JSON.stringify(policy), 'utf8').toString('base64');
	console.log("Policy Base64:"+ policyBase64);
 	signature = crypto.createHmac('sha1', secret).update(policyBase64).digest('base64');
    res.json({bucket: bucket, awsKey: awsKey, policy: policyBase64, signature: signature});
 
}
exports.getPolicy = function(req,res){
	returnSignedPolicy(req.body.VidRef,res);
}
function checkPermision = function(userId, fbId, callback){
	db.getIdPair(userId,function(docs){
		if(docs.length == 0)
				callback(false);
		else if(docs[0].FbId == fbId  && docs[0].UserId == userId)
				callback(true);
		else  callback(false);
	},errCallback());
}