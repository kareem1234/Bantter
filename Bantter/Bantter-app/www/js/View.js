–function View(EventEmitter){
	var E = EventEmitter;
	var that = this;
	var menuSet = false;
	var likesSet = false;
	var prevSelectedInbox = undefined;
	this.currentView ="";
	this.setLoadingView = function(){
		$("#loginPage").addClass("notActive");
		$("#mainPage").addClass("notActive");
		$("loadingPage").removeClass("notActive");
	}
	function getName(id){

	}
	function setUserView(){

	}
	this.streamViewDisplayNext = function(user){

	}
	this.displayInfo = function(text){

	}
	this.streamViewDisplayLoading = function(){

	}
	this.setLoadingText = function(text){

	}
	this.setLoginView = function(loginFunc){
		$("#mainPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#loginPage").removeClass("notActive");
		$("#loginPage_fbLogin").bind("tap",loginFunc);
	}
	this.setMenu = function(){
		if(!menuSet){
			menuSet = true;
			$("#mainPage_menu_likes").bind("tap",function(){
				E.EMIT("viewMenu_likes_taped");
			});
			$("#mainPage_menu_selfies").bind("tap",function(){
				E.EMIT("viewMenu_selfies_taped");
			});
			$("#mainPage_menu_inbox").bind("tap",function(){
				E.EMIT("viewMenu_inbox_taped");
			});
			$("#mainPage_menu_vidIcon").bind("tap",function(){
				E.EMIT("viewMenu_vidIcon_taped");
			});
		}
	}
	this.setStreamView = function(user){
		that.setMenu();
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage").removeClass("notActive");
		$("#mainPage_likes").addClass("notActive");
		$("#mainPage_selfies").removeClass("notActive");
		$("#mainPage_selfies_name").text(user.Name);
		$("#mainPage_selfies_city").text(user.City);
		var vid = $("#mainPage_selfies_selfieVid");
		vid.attr('src',user.refs[0].Url);
		vid.get(0).play();
		$("#mainPage_selfies_thumbsUp").bind("tap",function(){
			E.EMIT("streamView_thumbsUp_taped");
		});
		$("#mainPage_selfies_thumbsDown").bind("tap",function(){
			E.EMIT("streamView_thumbsDown_taped");
		});
	}
	this.setInboxView = function(){
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage").removeClass("notActive");
		$("#mainPage_likes").removeClass("notActive");
		$("#mainPage_likes_controlCont").addClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_likes_menuTitle").text("My Inbox");
		$(".likesRow").bind("tap",function(){
			if(prevSelectedInbox)
				prevSelectedInbox.removeClass("selectedLikesRow");
			prevSelectedInbox = $(this);
			prevSelectedInbox.addClass("selectedLikesRow");
			//if viewable set text to view else
			// set disable icon
			var actionBut = $("#mainPage_likes_menuAction2");
			actionBut.unbind("tap").bind("tap",function(){
				E.EMIT("inboxView_reply",prevSelectedInbox.index());
			});
		
		});

	}
	this.setMyLikesView = function(){

	}
	this.setLikesView = function(likes){

	}

}

