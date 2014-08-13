function View(EventEmitter){
	var E = EventEmitter;
	var that = this;
	var menuSet = false;
	var inboxSet = false;
	var myLikesSet = false;
	var likersSet = false;
	var prevSelected = undefined;
	var vidUrl = 'https://s3.amazonaws.com/bantter-downloads/';
	this.currentView ="";
	this.init = function(){
		initVidControll();
		$(".close").bind("tap",function(){
			$(".modal").modal("hide");
		});
		$("#mainPage_likes_controlCont").bind("tap",function(){
			E.EMIT("view_likesControll_taped");
		})
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
		console.log("setting loadingView");
		$("body").css({
			"-webkit-transform": "rotate(360deg)",
			"-moz-transform": "rotate(360deg)"
		});
		that.currentView='loadingView';
		$("#loginPage").addClass("notActive");
		$("#mainPage").addClass("notActive");
		$("#loadingPage").removeClass("notActive");
		console.log("loading view set");
	}
	this.streamViewDisplayNext = function(user){
		$("#mainPage_selfies_name").text(user.Name+" "+user.Age);
		$("#mainPage_selfies_city").text(user.City);
		var vid = $("#mainPage_selfies_vid");
		vid.get(0).src= vidUrl+user.Refs[0].Url;
		vid.get(0).play();
	}
	this.displayInfo = function(text){
		$("#modal-title2").html(text);
		$("#infoPopUp").modal('show');
		setTimeout(function(){
			$("#infoPopUp").modal("hide");
		},3000);

	}
	this.streamViewRemoveLoading = function(){
		$(".spinner").addClass("notActive");
		$("#mainPage_selfies_thumbsUp").removeClass("disabled");
		$("#mainPage_selfies_thumbsDown").removeClass("disabled");
	}
	this.streamViewDisplayLoading = function(){
		$(".spinner").removeClass("notActive");
		$("#mainPage_selfies_thumbsUp").addClass("disabled");
		$("#mainPage_selfies_thumbsDown").addClass("disabled");
	}
	this.setUserViewPopUp = function(user){
		$("#modal-title2").text(user.Name);
		var vid = $("#videoPopUp");
		vid.get(0).src= vidUrl+user.Refs[0].Url;
		vid.get(0).play();
	}
	this.setLoginView = function(loginFunc){
		that.currentView='loginView';
		$("#mainPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#loginPage").removeClass("notActive");
		$("#loginPage_fbLogin").bind("click",loginFunc);
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
		that.currentView='streamView';
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage").removeClass("notActive");
		$("#mainPage_people").addClass("notActive");
		$("#mainPage_selfies").removeClass("notActive");
		$("#mainPage_selfies_thumbsUp").unbind('tap').bind("tap",function(){
			if( ! $(this).hasClass('disabled'))
				E.EMIT("streamView_thumbsUp_taped");
		});
		$("#mainPage_selfies_thumbsDown").unbind('tap').bind("tap",function(){
			if( ! $(this).hasClass('disabled'))
				E.EMIT("streamView_thumbsDown_taped");
		});
		$("#mainPage_selfies_name").text(user.Name);
		$("#mainPage_selfies_city").text(user.City);
		var vid = $("#mainPage_selfies_selfieVid");
		vid.attr('src',user.Refs[0].Url);
		vid.get(0).play();
	}
	this.displayPeopleLoading = function(){
		that.currentView='peopleLoading';
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage_likes_controlCont").addClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_people_myLikes").addClass("notActive");
		$("#mainPage_people_likers").addClass("notActive");
		$("#mainPage_people_menu").addClass("notActive");
		$("#mainPage_people_inbox").addClass("notActive");
		//$(".spinner3").addClass("notActive");

				// adding to view
		$("#mainPage").removeClass("notActive");
		$("#mainPage_people").removeClass("notActive");
		$(".spinner3").removeClass("notActive");
	}
	this.updateInboxView = function(){
		that.currentView='inboxView';

		// removing from view
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage_likes_controlCont").addClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_people_myLikes").addClass("notActive");
		$("#mainPage_people_likers").addClass("notActive");
		$(".spinner3").addClass("notActive");

				// adding to view
		$("#mainPage").removeClass("notActive");
		$("#mainPage_people_menu").removeClass("notActive");
		$("#mainPage_people").removeClass("notActive");
		$("#mainPage_people_inbox").removeClass("notActive");

		//
		$("#mainPage_likes_menuTitle").text("My Inbox");
	}
	this.updateMyLikesView = function(){
		that.currentView ='myLikesView';


		// removing from view
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage_likes_controlCont").addClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_people_inbox").addClass("notActive");
		$("#mainPage_people_likers").addClass("notActive");
		$(".spinner3").addClass("notActive");

				// adding to view
		$("#mainPage").removeClass("notActive");
		$("#mainPage_people_menu").removeClass("notActive");
		$("#mainPage_people").removeClass("notActive");
		$("#mainPage_people_myLikes").removeClass("notActive");

		//
		$("#mainPage_likes_menuTitle").text("My Likes");
	}
	this.updateLikersView = function(){
		that.currentView='likersView';

		// removing from view
		$("#loginPage").addClass("notActive");
		$("#loadingPage").addClass("notActive");
		$("#mainPage_likes_controlCont").addClass("notActive");
		$("#mainPage_selfies").addClass("notActive");
		$("#mainPage_people_myLikes").addClass("notActive");
		$("#mainPage_people_inbox").addClass("notActive");
		$(".spinner3").addClass("notActive");

				// adding to view
		$("#mainPage").removeClass("notActive");
		$("#mainPage_people_menu").removeClass("notActive");
		$("#mainPage_people").removeClass("notActive");
		$("#mainPage_people_likers").removeClass("notActive");

		//
		$("#mainPage_likes_menuTitle").text("People who like me");
	}
	this.setInboxView = function(inboxUsers){
		if(!inboxSet){
			inboxSet = true;
			updateInboxView();
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
				document.getElementById("mainPage_likes_inbox").appendChild(likesRowDiv);
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
		else
			updateInboxView();
	}
	this.setMyLikesView = function(){
		if(!myLikesSet){
			myLikesSet = true;
			updateMyLikesView();
			$("#mainPage_likes_people").empty().on('scroll',checkScroll);
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
				document.getElementById("mainPage_likes_myLikes").appendChild(likesRowDiv);
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
		else
			updateMyLikesView();
	}
	this.enableRow = function(index){
		$(".likesRow:eq("+index+")").removeClass("disabled");
	}
	this.setLikersView = function(){
		if(!likersSet){
			likersSet = true;
			updateLikersView();
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
				document.getElementById("mainPage_likes_likers").appendChild(likesRowDiv);
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
		else
			updateLikersView();
	}
	function checkScroll(e){
		var elem = $(e.currentTarget);
    	if (elem[0].scrollHeight - elem.scrollTop() >= elem.outerHeight()*0.15)
        	E.EMIT("likesView_scrolled");
	}

}



