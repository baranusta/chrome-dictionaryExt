mApiController = new ApiController()
debug = true
requestAfterDuration = 15;
var bubbleConfig;



//register for configurations
chrome.runtime.onStartup.addListener(function () {
    mApiController.startAuth(false);
    //send data for debug purpose
    //registerForFlashcards();
    if (debug) {
        //send a message with time
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
    if (request.action == "xhttp") {
        var method = request.method ? request.method.toUpperCase() : 'GET';

        if (method === 'GET') {
            if (!!request.word) {
                $.get(request.url, request.word).then(function (responseData) { callback(responseData); }).fail(callback);
            }
            else {
                console.log('send');
                if(request.isUserRequired){
                    var uid = mApiController.getUID();
                    if(!!uid){
                        if(!mApiController.hasCardRequest()){
                            callback('hakkin bitmiis kips');
                        }
                        else{
                            $.ajax({
                                url: request.url,
                                type: "GET",
                                beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + uid); }
                            })
                            .done(function (responseData, statusText, xhr) { 
                                console.log(responseData);
                                if(xhr && xhr.status) 
                                    responseData.status = xhr.status; 
                                callback(responseData); 
                                console.log("OK");
                            })
                            .fail(function (xhr, statusText) { console.log("NOPE");callback(xhr); });
                        }
                    }
                    else
                        throw "Authentication is required";
                }
                else{
                    $.ajax({
                            url: request.url,
                            type: "GET"
                        })
                        .done(function (responseData, statusText, xhr) { 
                            if(xhr && xhr.status) 
                            responseData.status = xhr.status; 
                            callback(responseData); 
                            console.log("OK");
                        })
                        .fail(function (xhr, statusText) { console.log("OK");callback(xhr); });
                }
            }
        }
        else if (method === 'POST') {
        }
        return true; // prevents the callback from being called too early on return
    }
    else if (request.action == "login") {
        mApiController.startAuth(true, function(){
            mApiController.registerUserIfNotExist(callback);
            callback();
        });
        return true;
    }
    else if (request.action == "is_logged_in") {
        callback(mApiController.isUserLoggedIn());
        return true;
    }
    else if (request.action == "word_searched") {
        mApiController.searchedWord(request.word);
        return true;
    }
    else if (request.action == "add_word") {
        mApiController.addWord(request.word);
        return true;
    }
    else if (request.action == "get_bubble_config") {
        bubbleConfig = mApiController.getUserConfig() ?
            mApiController.getUserConfig().bubble_config :
            default_config.bubble_config;
        callback(bubbleConfig);
        return true;
    }
    else if (request.action == "save_bubble_config") {
        bubbleConfig = request.bubble_config;
        mApiController.saveConfig(request.bubble_config);
        return true;
    }
    else if (request.action == "bubble_config") {
        //This request is done before every word search by content.js
        if (!bubbleConfig)
            bubbleConfig = mApiController.getUserConfig() ?
                mApiController.getUserConfig().bubble_config :
                default_config.bubble_config;
        callback(bubbleConfig);
        return true;
    }
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == 'flash_cards') {
        console.log(requestAfterDuration)
        //setUnread(2);
        //if the duration has changed, update the alarm.
        //if (requestAfterDuration != alarm.periodInMinutes)
        //registerForFlashcards();
    }
});

chrome.runtime.onInstalled.addListener(function (details) {
    console.log(details.reason)
    if (details.reason == "install") {
        mApiController.startAuth(false, () => { mApiController.registerUser(); });
        // chrome.storage.sync.set({ 'value': theValue }, function () {
        //     // Notify that we saved.
        //     message('Settings saved');
        // });
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        //registerForFlashcards();
    }
});

//value period ForflashCardRequest
function registerForFlashcards() {
    // chrome.alarms.create('flash_cards',
    //     {
    //         delayInMinutes: 0.1,
    //         periodInMinutes: 0.2//requestAfterDuration
    //     });
}


function setAllRead() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 128] });
    chrome.browserAction.setBadgeText({ text: ' ' });   // <-- set text to '' to remove the badge
}

function setUnread(unreadItemCount) {
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 128] });
    chrome.browserAction.setBadgeText({ text: '' + unreadItemCount });
}
