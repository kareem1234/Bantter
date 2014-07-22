/**
Connection config variables and requires
*/
var mongo  = require('mongodb');
var Grid = require('gridfs-stream');
var mongoUri = null;
var db;
var gfs;
var host = "127.0.0.1";
var port = mongo.Connection.DEFAULT_PORT;
/*
	collection names  by gender and age group
*/
var teenMale,  teenFemale;
var youngMale, youngFemale;
var oldMale,   oldFemale;
/*
miscallaneous collections
*/
var vidRefs, likes;
/* 
config variables
*/
var dateString ='date';
var notSeenString = 'notSeen';
var seenString = 'seen';
var maxReturn = 10;

/*
		EXPORTED FUNCTIONS
*/

// attach database collection to variables
exports.initCollections = function (){
	teenMale 	= db.collection('tMale');
	teenFemale 	= db.collection('tFemale');
	youngMale   = db.collection('yMale');
	youngFemale	= db.collection('yFemale');
	oldMale     = db.collection('oMale');
	oldFemale	= db.collection('oFemale');

	vidRefs		= db.collection('vidRefs');
	likes 		= db.collection('likes');
	idPairs		= db.collection("idPairs");

}
exports.insertUser = function (collection,user,callback, errcallback){
	collection.insert(user,function(err){
		if(err) errcallback();
		else callback();
	});
}
exports.updateUser = function(collection,user,callback,errcallback){
	collection.update({FbId:user.FbId},user,function(err,result){
		if(err) errcallback();
		else callback();
	})
}
exports.insertLike = function(like,callback,errcallback){
	likes.insert(like,function(err){
		if(err) errcallback();
		else callback();
	});
}
exports.insertIdPair = function(fbId, userId,callback,errcallback){
	idPairs.insert({FbId:fbId,UserId:userId},function(err){
		if(err) errcallback(err);
		else callback();
	});
}
exports.getIdPair = function(userId, callback,errcallback){
	idPairs.find({UserId: userId}).toArray(function(err,docs){
		if(err)errcallback(err);
		else callback(docs);
	});
}
exports.findUsers = function(Collection,User,Range,Time,callback,errcallback){
	var options = {
			{$and: [{
				$and: [{Lat: {$lte: User.Lat + Range}}, {lat: {$gte: User.Lat-Range}}]
			}, {
				$and: [{Lgt: {$lte: User.Lgt + Range}}, {lgt: {$gte: User.Lgt-Range}}]
			}, {
				Timestampe: {$gte: Time}
			}]}
	};
	Collection.find(options).limit(25).toArray(function(err,docs){
		if(err) errcallback(err);
		else callback(docs);
	})
}
exports.insertVidRef = function(vRef,callback,errcallback){
	vidRefs.insert(vRef,function(err){
		if(err)errcallback();
		else callback();
	});
}
exports.findVidRefs = function(fbId,callback,errcallback){
	vidRefs.find({FbId: fbId, to:"all"}).toArray(function(err,refs){
		if(err) errcallback();
		else callback(refs);
	});
}
exports.findInboxRef = function(fbId,callback,errcallback){
	vidRefs.find({to: fbId}).toArray(function(err,docs){
		if(err) errcallback();
		else callback(docs);
	});
}
exports.findWhoILike = function(col1,col2,fbId,callback,errcallback){
	likes.find({from: fbId}).toArray(function(err,likesArray){
		if(err){
				process.nextTick(function(){
					errcallback(err);
				});
				return;
			}
	var tempArr = new Array();
	var results = new Array();
	var count = 0;
	var max = (col2 === undefined) ? 1 : 2 ; 
		for(var i =0; i< likesArray.length; i++)
			tempArr.push(likesArray[i].from);
	var retunFunc = function(err, users){
			if(err){
				process.nextTick(function(){
					errcallback(err);
				});
				}else{
					results = results.concat(users);
					count++;
					if(count === max)
						process.nextTick(function(){
							callback(results);
						});
				}
			};
			if(col1)
				db.col1.find({
					FbId: { $in : tempArr}
				},retunFunc});
			if(col2)
				db.col1.find({
					FbId: { $in : tempArr}
				},retunFunc);
	});
}
exports.findWhoLikedMe = function(col1,col2,FbId,callback,errcallback){
	likes.find({to:FbId}).toArray(function(err,likesArray){
		if(err){
				process.nextTick(function(){
					errcallback(err);
				});
				return;
			}
	var tempArr = new Array();
	var results = new Array();
	var count = 0;
	var max = (col2 === undefined) ? 1 : 2 ; 
		for(var i =0; i< likesArray.length; i++)
			tempArr.push(likesArray[i].from);
	var retunFunc = function(err, users){
			if(err){
				process.nextTick(function(){
					errcallback(err);
				});
				}else{
					results = results.concat(users);
					count++;
					if(count === max)
						process.nextTick(function(){
							callback(results);
						});
				}
			};
			if(col1)
				db.col1.find({
					FbId: { $in : tempArr}
				},retunFunc});
			if(col2)
				db.col1.find({
					FbId: { $in : tempArr}
				},retunFunc);

}
// function for initializing database connection
exports.connect = function (callback){
	if(db){
		console.log("database alrdy init");
		process.nextTick(callback);
	}
	else if(process.env.NODE_ENV === "production"){
		mongo.Db.connect(mongoUri,function(err, myDb){
			db = myDb;
			gfs = Grid(db, mongo);
			console.log("connected to the database");
			process.nextTick(callback);
		});
	}else{
		db = new mongo.Db('Bantter',new mongo.Server(host,port),{safe:true});
		db.open(function(err){
			console.log("connected to the database");
			process.nextTick(callback);
		});
	}
}
// return object representing  user collections 
// base on age parameter and gender
// some ages maybe belong to two collections
exports.getCollections = function (age, gender){
	var returnedCollections = {
		col1: null,
		col2: null,
	};
	// male teen
	if( (age<18) && (gender==="male")){
		returnedCollections.col1 = teenMale;
		return returnedCollections;
	// female teen
	}else if( (age<18) && (gender==="male") ){
		returnedCollections.col1 = teenFemale;
		return returnedCollections;
		//male teen/young
	}else if( ( age===18 || age ===19) && (gender ==='male') ){
		returnedCollections.col1 = teenMale;
		returnedCollections.col2 = youngMale;
		return returnedCollections;
	}else if( ( age===18 || age ===19) && (gender ==='female') ){
		returnedCollections.col1 = teenFemale;
		returnedCollections.col2 = youngFemale;
		return returnedCollections;
	}else if ( (age > 19 || age < 26) && (gender === 'male') ){
		returnedCollections.col1 = youngMale;
		return returnedCollections;
	}else if ( (age > 19 || age < 26) && (gender === 'female') ){
		returnedCollections.col1 = youngFemale;
		return returnedCollections;
	}else if ((age >= 26 && age < 29) && (gender ==='male')){
		returnedCollections.col1 = youngMale;
		returnedCollections.col2 = oldMale;
		return returnedCollections;
	}else if ((age >= 26 && age < 29) && (gender ==='female')){
		returnedCollections.col1 = youngFemale;
		returnedCollections.col2 = oldFemale;
		return returnedCollections;
	}else if (gender === 'male'){
		returnedCollections.col1 = oldMale;
		return returnedCollections;
	}else{
		returnedCollections.col1 = oldFemale;
		return returnedCollections;
	}
}
