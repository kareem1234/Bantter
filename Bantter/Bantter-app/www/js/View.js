function View(EventEmitter){
	var E = EventEmitter;
	var that = this;
	var menuSet = false;
	var likesSet = false;
	var prevSelected = undefined;
	var vidUrl = 'https://s3.amazonaws.com/bantter-downloads/';
	this.currentView ="";
	this.init = function(){
		$('#infoPopUp').modal();
		$('#videoPopUpModal').modal();
		initVidControll();
		$(".close").bind("tap",function(){
			$(".modal").modal("hide");
		});
	}
	function initVidControll(){
		$("#videopPopUp").bind("tap",function(){
			if($(this).get(0).paused)
				$(this).get(0).play();
			else
				$(this).get(0).pause();
		});
		$("#mainPage_selfies_selfieVid").bind("tap",function(){
			if($(this).get(0).paused)
				$(this).get(0).play();
			else
				$(this).get(0).pause();
		});
	}
	this.setLoadingView = function(){
		$("#loginPage").addClass("notActive");
		$("#mainPage").addClass("notActive");
		$("loadingPage").removeClass("notActive");
	}
	this.streamViewDisplayNext = function(user){
		$("#mainPage_selfies_name").text(user.Name+" "+user.Age);
		$("#mainPage_selfies_city").text(user.City);
		var vid = $("#mainPage_selfies_vid");
		vid.get(0).src= vidUrl+user.Refs[0].Url;
		vid.get(0).play();
	}
	this.displayInfo = function(text){
		$("#modal-title2").text(text);
		$("#infoPopUp").modal('show');
		setTimeout(function(){
			$("#infoPopUp").modal("hide");
		},1000);

	}
	this.streamViewDisplayLoading = function(){

	}
	this.setUserViewPopUp = function(user){
		$("#modal-title2").text(user.Name);
		var vid = $("#videoPopUp");
		vid.get(0).src= vidUrl+user.Refs[0].Url;
		vid.get(0).play();
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
		vid.attr('src',user.Refs[0].Url);
		vid.get(0).play();
		$("#mainPage_selfies_thumbsUp").bind("tap",function(){
			E.EMIT("streamView_thumbsUp_taped");
		});
		$("#mainPage_selfies_thumbsDown").bind("tap",function(){
			E.EMIT("streamView_thumbsDown_taped");
		});
	}
	this.updateInboxView = function(){

	}
	this.updateMyLikesView = function(){

	}
	this.updateLikersView = function(){

	}
	this.setInboxView = function(inboxUsers){
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage").removeClass("notActive");
		$("#mainPage_likes").removeClass("notActive");
		$("#mainPage_likes_controlCont").addClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_likes_menuTitle").text("My Inbox");
		for(var i = 0; i<inboxUsers.length;i++){
			var likesRowDiv = document.createElement("div");
			likesRowDiv.className = "likesRow row row-xs-height";
			var picDiv = document.createElement("div");
			picDiv.className = "col-xs-3 col-xs-height col-top";
			var picDivImg = document.createElement("img");
			picDivImg.className ="mainPage_likes_profilePic";
			picDivImg.src="http://graph.facebook.com/" + inboxUsers[i].FbId+"/picture?type=square";
			var nameDiv = document.createElement("div");
			nameDiv.className = "col-xs-9 col-xs-height col-top";
			nameDiv.innerHTML = inboxUsers[i].Name;
			picDiv.appendChild(picDivImg);
			likesRowDiv.appendChild(picDiv);
			likesRowDiv.appendChild(nameDiv);
			document.getElementById("mainPage_likes_people").appendChild(likesRowDiv);
		}
		$(".likesRow").bind("tap",function(){
			if(prevSelected)
				prevSelected.removeClass("selectedLikesRow");
			prevSelected = $(this);
			prevSelected.addClass("selectedLikesRow");
			var index = prevSelected.index();
			if(that.mediaLoader.checkViewable(inboxUsers[index].InboxRef.Url)){
				var actionBut1 = $("#mainPage_likes_menuAction1");
				actionBut1.text("View");
				actionBut1.unbind("tap").bind("tap",function(){
					E.EMIT("inboxView_view",inboxUsers[index]);
				});
			}
			var actionBut = $("#mainPage_likes_menuAction2");
			actionBut.unbind("tap").bind("tap",function(){
				E.EMIT("inboxView_reply",prevSelected.index());
			});
			actionBut.text("Reply");
		
		});

	}
	this.setMyLikesView = function(){
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage").removeClass("notActive");
		$("#mainPage_likes").removeClass("notActive");
		$("#mainPage_likes_controlCont").removeClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_likes_menuTitle").text("People I like");
		$("#mainPage_likes_people").empty().bind(scroll,checkScroll);
		for(var i = 0; i < that.mediaLoader.myLikes.length; i++){
			var likesRowDiv = document.createElement("div");
			likesRowDiv.className = "likesRow row row-xs-height";
			if(that.mediaLoader.myLikes[i].refs === undefined)
					likesRowDiv.addClass("disabled");
			var picDiv = document.createElement("div");
			picDiv.className = "col-xs-3 col-xs-height col-top";
			var picDivImg = document.createElement("img");
			picDivImg.className ="mainPage_likes_profilePic";
			picDivImg.src="http://graph.facebook.com/" + that.mediaLoader.myLikes[i].FbId+"/picture?type=square";
			var nameDiv = document.createElement("div");
			nameDiv.className = "col-xs-9 col-xs-height col-top";
			nameDiv.innerHTML = that.mediaLoader.myLikes[i].Name;
			picDiv.appendChild(picDivImg);
			likesRowDiv.appendChild(picDiv);
			likesRowDiv.appendChild(nameDiv);
			document.getElementById("mainPage_likes_people").appendChild(likesRowDiv);
		}
		$(".likesRow").bind("tap",function(){
			if(prevSelected)
				prevSelected.removeClass("selectedLikesRow");
			prevSelected = $(this);
			if(prevSelected.hasClass("disabled"))
					return;
			prevSelected.addClass("selectedLikesRow");
			var index = prevSelected.index();
			var actionBut1 = $("#mainPage_likes_menuAction1");
			actionBut1.text("View");
			actionBut1.unbind("tap").bind("tap",function(){
					E.EMIT("myLikesView_view",that.mediaLoader.myLikes[index]);
			});
			var actionBut = $("#mainPage_likes_menuAction2");
			actionBut.unbind("tap").bind("tap",function(){
				E.EMIT("myLikesView_message",prevSelected.index());
			});
			actionBut.text("Message");		
		});

	}
	this.enableRow = function(index){
		$(".likesRow:eq("+index+")").removeClass("disabled");
	}
	this.setLikesView = function(){
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage").removeClass("notActive");
		$("#mainPage_likes").removeClass("notActive");
		$("#mainPage_likes_controlCont").removeClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_likes_menuTitle").text("People who like me");
		$("#mainPage_likes_people").empty().bind(scroll,checkScroll);
		for(var i = 0; i < that.mediaLoader.likers.length; i++){
			var likesRowDiv = document.createElement("div");
			likesRowDiv.className = "likesRow row row-xs-height";
			if(that.mediaLoader.likers[i].refs === undefined)
				likesRowDiv.addClass("disabled");
			var picDiv = document.createElement("div");
			picDiv.className = "col-xs-3 col-xs-height col-top";
			var picDivImg = document.createElement("img");
			picDivImg.className ="mainPage_likes_profilePic";
			picDivImg.src="http://graph.facebook.com/" + that.mediaLoader.likers[i].FbId+"/picture?type=square";
			var nameDiv = document.createElement("div");
			nameDiv.className = "col-xs-9 col-xs-height col-top";
			nameDiv.innerHTML = that.mediaLoader.myLikes[i].Name;
			picDiv.appendChild(picDivImg);
			likesRowDiv.appendChild(picDiv);
			likesRowDiv.appendChild(nameDiv);
			document.getElementById("mainPage_likes_people").appendChild(likesRowDiv);
		}
		$(".likesRow").bind("tap",function(){
			if(prevSelected)
				prevSelected.removeClass("selectedLikesRow");
			prevSelected = $(this);
			if(prevSelected.hasClass("disabled"))
					return;
			prevSelected.addClass("selectedLikesRow");
			var index = prevSelected.index();
			var actionBut1 = $("#mainPage_likes_menuAction1");
			actionBut1.text("View");
			actionBut1.unbind("tap").bind("tap",function(){
					E.EMIT("likersView_view",that.mediaLoader.myLikes[index]);
			});
			var actionBut = $("#mainPage_likes_menuAction2");
			actionBut.unbind("tap").bind("tap",function(){
				E.EMIT("likersView_message",prevSelected.index());
			});
			actionBut.text("Message");		
		});
	}
	function checkScroll(e){
		var elem = $(e.currentTarget);
    	if (elem[0].scrollHeight - elem.scrollTop() >= elem.outerHeight()*0.15)
        	E.EMIT("likesView_scrolled");
	}

}

View.prototype.mediaLoader = Controller.prototype.mediaLoader;

