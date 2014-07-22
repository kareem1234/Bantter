
function MediaCapture(eventEmitter,request){
	var E = eventEmitter;
	var R = request;
	var toId = undefined;
	var num = 0;
	var mediaFile;
	var contentType;
	var caption;
	var maxLength = 10;
	var vidRef = undefined;
	this.save = function(){
		window.localStorage.setItem("mediaCapture_num",JSON.stringify(num));
	}
	this.load = function(){
		var num = JSON.parse(window.loaclStorage.getItem("mediaCapture_num"));
	}
	var captureError = function(error){
		console.log("video captureError" + error);
		E.EMIT("mediaCapture_captureError");
	}
	this.getVideo= function(id){
		if(id)
			toId = id;
		window.plugins.videocaptureplus.captureVideo(function(mediaFiles){
			mediaFile = mediaFiles[0];
			contentType = 'video/mp4';
			E.EMIT("mediaCapture_cap");
		},captureError,{
			limit: 1,
			duration: 7,
			highquality: false,
			frontcamera: true,

		});
	}
	this.getPolicy = function(){
		var me = R.getUser();
		var time = new Date().getTime();
		var url = me.FbId +"_"+ time;
		vidRef = {
			FbId: me.FbId,
			Url: url,
			Caption: caption,
			Numer: num,
			To: toId,
			Type: contentType
		}
		R.request('getPolicy',vidRef);
	}
	this.onPolicyReturn = function(pol){
		var ft = new FileTransfer();
		var options = new FileUploadOptions();
		options.fileKey = "file";
        options.fileName = vidRef.Url;
        options.mimeType = contentType;
        options.chunkedMode = false;
        
        options.params = {
                    "key": vidRef.Url,
                    "AWSAccessKeyId": pol.awsKey,
                    "acl": "public-read",
                    "policy": pol.policy,
                    "signature": pol.signature,
                    "Content-Type": contentType
                };
         ft.upload(mediaFile.fullPath,"https://" + pol.bucket + ".s3.amazonaws.com/",function(result){
         	incUpload();
         	clear();
         	R.request("insertVidRef",vidRef);
         	E.EMIT("mediaCapture_uploadSuccess");
         },function(error){
         	E.EMIT("mediaCapture_uploadError",error);
         },options);
	}
	function incUpload(){
		num++;
	}
	function clear(){
		vidRef = undefined;
		mediaFile = undefined;
		toId = undefined;
		caption = undefined;
	}
	// capture video
	// check length and add caption
	// get policy
	// upload video
}