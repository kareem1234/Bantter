
function Likes(eventEmitter, Request){
	var E = eventEmitter;
	var R = Request;
	var that = this;
	var maxBuffer = 2;
	var likes = new Array();
	this.save = function(){

	}
	this.load = function(){

	}
	this.addLike = function(toId){
		var like = {
			from: R.getUser().FbId;,
			to: toId
		};
		likes.push(like);
		if(likes.length >= maxBuffer){
			that.upload();
		}
	}
	this.upload = function(){
		R.request('insertLike',likes);
		likes =  new Array();
	}
}