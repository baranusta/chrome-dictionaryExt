mApiController = new ApiController()
debug = true



//register for configurations
chrome.runtime.onStartup.addListener(function() {
    mApiController.startAuth(false);
    //send data for debug purpose
    if(debug){
        //send a message with time
    }
});

chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var method = request.method ? request.method.toUpperCase() : 'GET';

        if(method === 'GET'){
          if(!!request.word)
          {
            $.get(request.url, request.word).then(function(responseData){callback(responseData);}).fail(callback);
          }
          else
            $.get(request.url).then(function(responseData){callback(responseData);}).fail(callback);
        }
        else if(method === 'POST'){
        }
        return true; // prevents the callback from being called too early on return
    }
    else if(request.action == "login"){
        mApiController.startAuth(true);
        return true;
    }
    else if(request.action == "isLoggedIn"){
        callBack(true);
        return true;
    }
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if(alarm.name == 'initialization'){
        // TODO: getinitial values from firebase
        //registerForFlashcards(30);
    }
    else if(alarm.name == 'flash_cards'){
        // TODO: notification to user
    }
});

chrome.runtime.onInstalled.addListener(function(details){
    if(details.reason == "install"){
        chrome.storage.sync.set({'value': theValue}, function() {
              // Notify that we saved.
              message('Settings saved');
            });
    }else if(details.reason == "update"){
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

//value period ForflashCardRequest
function registerForFlashcards(value){
    chrome.alarms.create('flash_cards', {periodInMinutes: value, when: Date.now() + 15*1000});
}

function changeViewByLoginState(isLoggedIn){

    var views = chrome.extension.getViews({
        type: "popup"
    });
    for (var i = 0; i < views.length; i++) {
        views[i].$('.LoginButton').style.visibility = isLoggedIn ? "hidden": "visible";
    }
};
