
   
// document.addEventListener('deviceready', this.onDeviceReady, false);

function Controller(){
    var that = this;
    var waitingFor = undefined;
    var currentUser = undefined;
    this.load = function(){
        that.view.setLoadingView();
        that.likes.load();
        that.mediaLoader.load();
        that.mediaCapture.load();
        var userStatus = that.user.load();
        onUserLoad(userStatus);

     }
    function onUserLoad(userStatus){
        console.log("has user logged in before:" +userStatus);
        if(!userStatus)
            that.view.setLoginView(that.user.login);
        else{
            if(that.mediaLoader.readyStatus)
                that.view.setStreamView(that.mediaLoader.getNext());
            else
                that.view.setLoadingView();
        }
    }
    // call all setup methods
    this.setup = function(){
        console.log("setting up device");
        //FB.init({ appId:1409430495955338, nativeInterface: CDV.FB, useCachedDialogs: false });
        console.log(" fb init");
        that.initCallbacks();
        that.load();
        that.view.init();
        that.setSaveInterval();

        ///
    }
    this.initCallbacks = function(){
        initModelCallbacks();
        initQueryCallbacks();
        initFailCallbacks();
        initViewCallbacks();
    }
    this.setSaveInterval = function(){
        setTimeout(function(){
            that.likes.save();
            that.user.save();
            that.mediaLoader.save();
            that.mediaCapture.save();
        },1000*10);
    }
    function initModelCallbacks(){
        that.event.LISTEN("signedUp",function(){
            console.log("user has signed up");
            that.view.setLoadingView();
            that.user.getFbData();
            that.view.displayInfo('Fetching facebook data');
        });
        that.event.LISTEN("deniedSignUp",function(){
            console.log("user denied sign up");
            that.view.displayInfo("We do not share your data with third parties");
        });
        that.event.LISTEN("loadedFbData",function(){
            var usr = that.user.returnUser();
            that.request.setUser(usr);
            that.mediaLoader.start();
            that.view.displayInfo("finding people in your area");
        });
        that.event.LISTEN("media_ready",function(){
            if(that.view.currentView ==="loadingView"){
                that.mediaLoader.setMode("findWhoILike");
                currentUser = that.mediaLoader.getNext();
                that.view.setStreamView(currentUser);
            }
            else if(that.view.currentView ==='streamView')
              streamViewRemoveLoading();
        });
        that.event.LISTEN("media_notReady",function(){
            if(that.view.currentView==="streamView")
                that.view.streamViewDisplayLoading();
        });
        that.event.LISTEN("userStream_notReady",function(){
            console.log("userStream not ready");
        });
        that.event.LISTEN("userStream_ready",function(){
            that.mediaLoader.onStreamReady();
        });
        that.event.LISTEN("mediaCapture_captureError",function(){
            that.view.displayInfo("something whent wrong recording video");
        });
        that.event.LISTEN("mediaCapture_cap",function(){
            that.mediaCapture.getPolicy();
        });
        that.event.LISTEN("mediaCapture_uploadSuccess",function(){
            that.view.displayInfo("video uploaded!");
        });
        that.event.LISTEN("mediaCapture_uploadError",function(){
            that.view.displayInfo("something whent wrong, video upload failed");
        });
    }
    function initQueryCallbacks(){
        that.event.LISTEN("complete/insertLike",function(){
            console.log('likes inserted');
        });
        that.event.LISTEN("complete/insertVidRef",function(){
            that.mediaCapture.onPolicyReturn(data);
        });
        that.event.LISTEN("complete/insertUser",function(data){
            console.log("user data saved on server");
        });
        that.event.LISTEN("complete/findWhoLikedMe",function(data){
            that.mediaLoader.onUserLoad(data,"findWhoILikedMe");
        });
        that.event.LISTEN("complete/findWhoILike",function(){
            that.mediaLoader.onUserLoad(data,"findWhoILikedMe");
        });
        that.event.LISTEN("complete/getVideoRefs",function(data){
            that.mediaLoader.onRefLoad(data);
        });
        that.event.LISTEN("complete/findUsers",function(data){
            that.mediaLoader.onUserLoad(data,"findUsers");
        });
        that.event.LISTEN("complete/getInbox",function(data){
            that.mediaLoader.onInboxLoad(data);
        });
    }
   function initFailCallbacks(){
        var failureCallback = function(err){
            console.log(err);
        }
        that.event.LISTEN("failed/insertLike",failureCallback);
        that.event.LISTEN("failed/insertVidRef",failureCallback);
        that.event.LISTEN("failed/insertUser",failureCallback);
        that.event.LISTEN("failed/findWhoLikedMe",failureCallback);
        that.event.LISTEN("failed/findWhoILike",failureCallback);
        that.event.LISTEN("failed/getVideoRefs",failureCallback);
        that.event.LISTEN("failed/findUsers",failureCallback);
        that.event.LISTEN("failed/getInbox",failureCallback);
        that.event.LISTEN("failed/findInboxUsers",failureCallback);
    }
    function initViewCallbacks(){
        that.event.LISTEN("myLikesView_view",function(index){
            that.view.setUserViewPopUp(that.mediaLoader.myLikes[index]);
        });
        that.event.LISTEN("myLikesView_message",function(index){
            that.mediaCapture.getVideo(that.mediaLoader.myLikes[index].Id);
        });
        that.event.LISTEN("likersView_view",function(index){
            that.view.setUserViewPopUp(that.mediaLoader.likers[index]);
        });
        that.event.LISTEN("likersView_message",function(index){
            that.mediaCapture.getVideo(that.mediaLoader.likers[index].Id);
        });
        that.event.LISTEN("inboxView_view",function(index){
            that.view.setUserViewPopUp(that.mediaLoader.inboxUsers[index]);
        });
        that.event.LISTEN("inboxView_reply",function(index){
             that.mediaCapture.getVideo(that.mediaLoader.inboxUsers[index].Id);           
        });
        that.event.LISTEN("viewMenu_likes_taped",function(){
            that.waitingFor = undefined;
            if(that.view.currentView ==="myLikesView" || that.view.currentView === "likersView")
                    return;
            else{
                if(that.mediaLoader.myLikes)
                    that.view.setMyLikesView();
                else{
                    that.waitingFor = "myLikes"
                    that.view.displayPeopleLoading();
                }
            }
        });
        that.event.LISTEN("viewMenu_selfies_taped",function(){
            that.waitingFor = undefined;
            that.mediaLoader.setMode("findUsers");
            if(that.view.currentView ==="streamView")
                return;
            else{
                that.view.setStreamView(currentUser);
                if(!that.mediaLoader.readyStatus)
                    that.view.streamViewDisplayLoading();
            }
        });
        that.event.LISTEN("viewMenu_inbox_taped",function(){
            that.waitingFor = undefined;
            if(that.view.currentView ==="inboxView")
                return;
            else{
                if(that.mediaLoader.inboxUsers)
                    that.view.setInboxView(that.mediaLoader.inboxUsers);
                else{
                    that.view.displayPeopleLoading();
                    that.waitingFor = 'inboxUsers';
                }
            }
        });
        that.event.LISTEN("view_likesControll_taped",function(){
            that.waitingFor = undefined;
            if(that.view.currentView ==="myLikesView"){
                if(that.mediaLoader.myLikes)
                    that.view.setMyLikesView();
                else{
                    that.waitingFor="myLikes";
                    that.view.displayPeopleLoading();
                }

            }else if(that.view.currentView ==="likersView"){
                if(that.mediaLoader.likers)
                    that.view.setLikersView();
                else{
                    that.waitingFor="likers";
                    that.view.displayPeopleLoading();
                }
            }
        });
        that.event.LISTEN("viewMenu_vidIcon_taped",function(){
            that.mediaCapture.getVideo();
        });
        that.event.LISTEN("streamView_thumbsUp_taped",function(){
            var nextUser = that.mediaLoader.getNext();
            that.mediaLoader.streamViewDisplayNext(nextUser);
            that.likes.addLike(currentUser.FbId);
            currentUser = nextUser;
        });
        that.event.LISTEN("streamView_thumbsDown_taped",function(){
            currentUser = that.mediaLoader.getNext();
            that.mediaLoader.streamViewDisplayNext(currentUser);
        });
        that.event.LISTEN("likesView_scrolled",function(){
            that.mediaLoader.callBuffer();
        });
        that.event.LISTEN("media_myLikes_loaded",function(){
            if(that.waitingFor === "myLikes"){
                that.waitingFor = undefined;
                that.view.setMyLikesView();
            }
        });
        that.event.LISTEN("media_likers_loaded",function(){
            if(that.waitingFor === "likers"){
                that.waitingFor = undefined;
                that.view.setLikersView();
            }
        });
    }
    //that.setup();

// end of declaration
}
// Controller Prototype declaration
// this gives all inheriters of controller acces to its static variables

Controller.prototype.event = new EventEmitter();
Controller.prototype.request = new Request(Controller.prototype.event);
Controller.prototype.likes = new Likes(Controller.prototype.event,Controller.prototype.request);
Controller.prototype.mediaLoader = new MediaLoader(Controller.prototype.event,Controller.prototype.request);
Controller.prototype.mediaCapture = new MediaCapture(Controller.prototype.event,Controller.prototype.request);
Controller.prototype.user  = new User(Controller.prototype.event,Controller.prototype.request);
Controller.prototype.view = new View(Controller.prototype.event);

View.prototype.mediaLoader = Controller.prototype.mediaLoader;
var c = new Controller();
window.localStorage.clear();
document.addEventListener("deviceready",c.setup,false);

