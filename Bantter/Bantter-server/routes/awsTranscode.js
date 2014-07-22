// on get list of all pipes
// on request create a job using randomly selected pipe / or alternate pipes
// get event hanlder for on job complete and insertVidref when job is complete
var AWS = require("aws-sdk");
var db = require("./db");
AWS.config.loadFromPath("./config.json");
var elastictranscoder = new AWS.ElasticTranscoder();
var pipes = new Array();
var preset;


function getPipes(callback){
	var params = {
 		Ascending: 'true',
  		PageToken: ''
	};
	elastictranscoder.listPipelines(params, function(err, data) {
 		 if (err) console.log(err); // an error occurred
  		 else{
  		 		for(var i =0;i<data.Pipelines.length; i++){
  		 			pipes.push(data.Pipelines[i].Id);
  		 		}
  		 		callback();
  		 }       
	});
}
function getPresets(callback){
  var params = {
    Ascending: 'true',
    PageToken: ''
  };
  elastictranscoder.listPresets(params, function(err,data){
      if(err)
          console.log(err);
      else{
          for(var i = 0; i<data.Presets.length;i++){
              if(data.Presets[i].Type ==="Custom"){
                  preset = data.Presets[i].Id;
                  callback();
                }
          }
      }
  });
}


function transcode(fileName,callback,errCallback){
var newfileName = fileName +".mp4";
var pipeId = pipes[Math.floor(Math.random *pipes.length)]
var params = {
  Input: { // required
      AspectRatio: 'auto',
      Container: 'auto',
      FrameRate: 'auto',
      Interlaced: 'auto',
      Key: fileName,
      Resolution: 'auto'
    },
  PipelineId:'pipeId',
  Output:{
        Key: newfileName,
        PresetId: preset
    }
  };
  elastictranscoder.createJob(params,function(err,data){
      if(err) errCallback();
      else
          callback();
      
  });
}
exports.init = function(callback){
  var count = 0;
  var func  = function(){
    count++;
    if(count == 2)
        callback();
  }
  getPresets(func);
  getPipes(func); 
}
exports.insertVidref = function(req,res){
  var ref = req.body.VidRef;
  var user = req.body;
  var collections = db.getCollections(user.Age,user.Gender);
  delete user.VidRef;
  var err = function(){
      if(!res.headersSent)
        res.error();
  };
  var suc = function(){
    if(!res.headersSent)
      res.end();
  };
  var callback = function(){
     db.insertVidref(ref,function(){
        if(collections.col2){
            db.updateUser(collections.col1,user,suc,err);
            db.updateUser(collections.col2,user,succ,err);
        }
        else
          db.updateUser(collections.col1,user,suc,err);
     },err);
  };
  transcode(ref.url,callback);
}

/*
exports.insertVidRef = function(req,res){
  db.insertVidRef(req.body.VidRef,function(){
    res.end();
  },errCallback(res));
}
*/