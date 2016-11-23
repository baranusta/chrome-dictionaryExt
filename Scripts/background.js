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
        startAuth(true);
        return true;
    }
    else if(request.action == "isLoggedIn"){
        callBack(true);
        return true;
    }
});
chrome.runtime.onStartup.addListener(function() {
    registerForConfigRequest();
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

function registerForConfigRequest(){
    chrome.alarms.create('initialization', {periodInMinutes: 24 * 60, when: Date.now() + 15*1000});
}

//value period ForflashCardRequest
function registerForFlashcards(value){
    chrome.alarms.create('flash_cards', {periodInMinutes: value, when: Date.now() + 15*1000});
}



function initializeFirebase(){
        var config = {
          apiKey: "AIzaSyBLXdjn83IVKp9SDiP_g9zOQJzAlEDzUME",
          authDomain: "turta-edf3c.firebaseapp.com",
          databaseURL: "https://turta-edf3c.firebaseio.com",
          storageBucket: "turta-edf3c.appspot.com",
          messagingSenderId: "470726396129"
        };
        firebase.initializeApp(config);
}
chrome.alarms.onAlarm.addListener(function(alarm) {
    if(alarm.name == 'initialization'){
        initializeFirebase();
        // TODO: getinitial values from firebase
        registerForFlashcards(30);
    }
    else if(alarm.name == 'flash_cards'){
        // TODO: notification to user
    }
});
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
          user.providerData.forEach(function (profile) {
          console.log("Sign-in provider: "+profile.providerId);
          console.log("  Provider-specific UID: "+profile.uid);
          console.log("  Name: "+profile.displayName);
          console.log("  Email: "+profile.email);
          console.log("  Photo URL: "+profile.photoURL);
        });
      } else {
        // No user is signed in.
      }
    });
    startAuth(false);

    function startAuth(interactive) {
      // Request an OAuth token from the Chrome Identity API.
      chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
        if (chrome.runtime.lastError && !interactive) {
          console.log('It was not possible to get a token programmatically.');
        } else if(chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else if (token) {
          // Authrorize Firebase with the OAuth Access Token.
          var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
          firebase.auth().signInWithCredential(credential).catch(function(error) {
            // The OAuth token might have been invalidated. Lets' remove it from cache.
            if (error.code === 'auth/invalid-credential') {
              chrome.identity.removeCachedAuthToken({token: token}, function() {
                startAuth(interactive);
              });
            }
          });
        } else {
          console.error('The OAuth Token was null');
        }
      });
    }
    /*$.get('https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=' + token).then(function(responseData){
    alert(responseData);
    });*/

    function signout(){
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
        }, function(error) {
          // An error happened.
        });
    }

function changeViewByLoginState(isLoggedIn){

    var views = chrome.extension.getViews({
        type: "popup"
    });
    for (var i = 0; i < views.length; i++) {
        views[i].$('.LoginButton').style.visibility = isLoggedIn ? "hidden": "visible";
    }
};
