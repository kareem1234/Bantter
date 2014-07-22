
function Likes(eventEmitter, Request){
	var E = eventEmitter;
	var R = Request;
	var that = this;
	var maxBuffer = 5;
	var likes = new Array();
	this.save = function(){

	}
	this.load = function(){

	}
	this.addLike = function(fromId, toId){
		var like = {
			from: fromId,
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