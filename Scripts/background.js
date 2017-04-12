mApiController = new ApiController()
mApiController.updateRequestAfterDuration = updateRequestAfterDuration;
debug = true
requestAfterDuration = 15;



//register for configurations
chrome.runtime.onStartup.addListener(function () {
    mApiController.startAuth(false);
    //send data for debug purpose
    registerForFlashcards();
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
                mApiController.getUID(uid => {
                    $.ajax({
                        url: request.url,
                        type: "GET",
                        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + uid); },
                        success: function (responseData) { callback(responseData); },
                        fail: callback
                    });
                })
                console.log('sent');
            }
        }
        else if (method === 'POST') {
        }
        return true; // prevents the callback from being called too early on return
    }
    else if (request.action == "login") {
        mApiController.startAuth(true);
        return true;
    }
    else if (request.action == "isLoggedIn") {
        callBack(true);
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
});

chrome.alarms.onAlarm.addListener(function (alarm) {
    if (alarm.name == 'flash_cards') {
        console.log(requestAfterDuration)
        setUnread(2);
        //if the duration has changed, update the alarm.
        if (requestAfterDuration != alarm.periodInMinutes)
            registerForFlashcards();
    }
});

chrome.runtime.onInstalled.addListener(function (details) {
    console.log(details.reason)
    if (details.reason == "install") {
        chrome.storage.sync.set({ 'value': theValue }, function () {
            // Notify that we saved.
            message('Settings saved');
        });
    } else if (details.reason == "update") {
        var thisVersion = chrome.runtime.getManifest().version;
        console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
        registerForFlashcards();
    }
});

//value period ForflashCardRequest
function registerForFlashcards() {
    chrome.alarms.create('flash_cards',
        {
            delayInMinutes: 0.1,
            periodInMinutes: 0.2//requestAfterDuration
        });
}

function changeViewByLoginState(isLoggedIn) {

    var views = chrome.extension.getViews({
        type: "popup"
    });
    for (var i = 0; i < views.length; i++) {
        views[i].$('.LoginButton').style.visibility = isLoggedIn ? "hidden" : "visible";
    }
};

function updateRequestAfterDuration(value) {
    requestAfterDuration = value;
    console.log(value);
}

function setAllRead() {
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 255, 0, 128] });
    chrome.browserAction.setBadgeText({ text: ' ' });   // <-- set text to '' to remove the badge
}

function setUnread(unreadItemCount) {
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 128] });
    chrome.browserAction.setBadgeText({ text: '' + unreadItemCount });
}
