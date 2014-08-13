cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.console/www/console-via-logger.js",
        "id": "org.apache.cordova.console.console",
        "clobbers": [
            "console"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.console/www/logger.js",
        "id": "org.apache.cordova.console.logger",
        "clobbers": [
            "cordova.logger"
        ]
    },
    {
        "file": "plugins/com.phonegap.plugins.facebookconnect/www/phonegap/plugin/facebookConnectPlugin/facebookConnectPlugin.js",
        "id": "com.phonegap.plugins.facebookconnect.FacebookConnectPlugin",
        "clobbers": [
            "window.facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.videocaptureplus/www/VideoCapturePlus.js",
        "id": "nl.x-services.plugins.videocaptureplus.VideoCapturePlus",
        "clobbers": [
            "window.plugins.videocaptureplus"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.console": "0.2.9",
    "com.phonegap.plugins.facebookconnect": "0.7.0",
    "nl.x-services.plugins.videocaptureplus": "1.2"
}
// BOTTOM OF METADATA
});