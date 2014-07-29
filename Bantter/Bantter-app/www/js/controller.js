
   
// document.addEventListener('deviceready', this.onDeviceReady, false);

function Controller(){
    var firstTime;
    var that = this;
    var mediaStatus = false;
    var vidOptions ={
        id: undefined,
        caption: undefined
    };
    this.view = new View();
    this.load = function(){
        that.view.setLoadingView();
        FB.init({ appId: "1409430495955338", nativeInterface: CDV.FB, useCachedDialogs: false });
        that.likes.load();
        that.mediaLoader.load();
        that.mediaCapture.load();
        firstTime = that.user.load();
        if(firstTime){
            that.view.setLoginView(function(){
                that.user.login();
            });
        }else{
            that.view.setLoadingView();
        }
     }
    
    // call all setup methods
    this.setup = function(){
        that.initCallbacks();
        that.load();
        that.setSaveInterval();

        ///
    }
    this.initCallbacks = function(){

    }
    this.setSaveInterval = function(){

    }
    function initModelCallbacks(){
        that.event.LISTEN("signedUp",function(){
            that.user.getFbData();
            that.view.setLoadingView();
            that.view.setLoadingText("retrieving your facebook data");
        });
        that.event.LISTEN("deniedSignUp",function(){
            that.view.setLoginText("We do not share your data with any third parties");
        });
        that.event.LISTEN("loadedFbData",function(){
            var _user = user.returnUser();
            that.request.setUser(_user);
            that.mediaLoader.start();
            that.view.setLoadingText("finding people in your area");
        });
        that.event.LISTEN("media_ready",function(){
            if(that.view.currentView ==="loadingView")
                that.view.setStreamView(that.mediaLoader.getNext());
            else if(that.view.currentView ==='streamView')
                that.view.streamViewDisplayNext();
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
            that.view.displayInfo();
        });
        that.event.LISTEN("mediaCapture_cap",function(){
            that.mediaCapture.getPolicy();
        });
        that.event.LISTEN("mediaCapture_uploadSuccess",function(){
            that.view.displayInfo("video uploaded");
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
    function initFailCallback(){
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
        that.event.LISTEN("myLikesView_view",function(){

        });
        that.event.LISTEN("myLikesView_message",function(){

        });
        that.event.LISTEN("likersView_view",function(){

        });
        that.event.LISTEN("likersView_message",function(){

        });
    }
    document.addEventListener("deviceready",that.setup,false);


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
