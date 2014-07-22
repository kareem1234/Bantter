
/**
 * Module dependencies.
 */
 var cluster = require('cluster');
 var numCPUs = require('os').cpus().length;
 if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({defer:true}));
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// get urls
app.get('/findWhoLikedMe',routes.findWhoLikedMe);
app.get('/findWhoeILike',routes.findWhoeILike);
app.get('/getVideoRefs',routes.getVideoRefs);
app.get("/getInbox",routes.getInbox);
app.get("/findUsers",routes.findUsers);

// post urls
app.post('/insertUser',routes.insertUser);
app.post('/insertLike',routes.insertLike);
app.post('/getPolicy',routes.getPolicy);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
