class ApiController {
    constructor() {
        let self = this;
        self.searchCount = 0;
        self.userConfig = null;
        self.leftRequest = -1;

        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCa1Glyaw_HJakn-u8ilL8nM3vNdEfZoPU",
            authDomain: "turta-dd7f6.firebaseapp.com",
            databaseURL: "https://turta-dd7f6.firebaseio.com",
            projectId: "turta-dd7f6",
            storageBucket: "turta-dd7f6.appspot.com",
            messagingSenderId: "978459002445"
        };
        firebase.initializeApp(config);
            console.log("yo")

        firebase.auth().onAuthStateChanged(function (user) {
            console.log("change")
            if (user) {
                console.log(user);
                self.registerForData();
                user.providerData.forEach(function (profile) {
                    console.log("Sign-in provider: " + profile.providerId);
                    console.log("  Provider-specific UID: " + profile.uid);
                    console.log("  Name: " + profile.displayName);
                    console.log("  Email: " + profile.email);
                    console.log("  Photo URL: " + profile.photoURL);
                });
            } else {
                // No user is signed in.
            }
        });

    }
    registerForData() {
        if (firebase.auth().currentUser != null) {
            let self = this;
            var userId = firebase.auth().currentUser.uid
            firebase.database().ref('user/' + userId + '/searchCount').on('value', function (snapshot) {
                self.searchCount = snapshot.val();
                console.log(self.searchCount);
            });

            //This has to be done to prevent unnecessary card requests
            //But date also has to be handled somehow. what if date has changed but left request is 0?
            firebase.database().ref('user/' + userId + '/card_request/leftRequest').on('value', function (snapshot) {
                self.leftRequest = snapshot.val() || -1;
                console.log(self.leftRequest);
            });

            firebase.database().ref('user/' + userId + '/config').on('value', function (snapshot) {
                self.userConfig = snapshot.val();
                console.log("userConfig:");
                console.log(self.userConfig);
            });
        }
    }

    getUserConfig() { return this.userConfig || null; }
    getRequestAfterLimit() { return this.makeRequestAfter; }
    getUID(addIdToken) {
        if (this.isUserLoggedIn()){
            return firebase.auth().currentUser.ld;
        }
        else
            return null;
    }

    isUserLoggedIn(){
        return !!firebase.auth().currentUser;
    }

    hasCardRequest(){
        return this.leftRequest !== 0;
    }

    startAuth(interactive, callback) {
        // Request an OAuth token from the Chrome Identity API.
        chrome.identity.getAuthToken({ interactive: !!interactive }, function (token) {
            if (chrome.runtime.lastError && !interactive) {
                console.log('It was not possible to get a token programmatically.');
                console.log(chrome.runtime.lastError);
            } else if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else if (token) {
                // Authrorize Firebase with the OAuth Access Token.
                var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
                firebase.auth().signInWithCredential(credential).catch(function (error) {
                    // The OAuth token might have been invalidated. Lets' remove it from cache.
                    if (error.code === 'auth/invalid-credential') {
                        chrome.identity.removeCachedAuthToken({ token: token }, function () {
                            startAuth(interactive);
                        });
                    }
                })
                .then(()=>{ callback();});
            } else {
                console.error('The OAuth Token was null');
            }
        });
    }

    signout() {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }, function (error) {
            // An error happened.
        })
    }

    registerUserIfNotExist(callback) {
        if (firebase.auth().currentUser != null) {
            var user = firebase.auth().currentUser;
            let userName = user.displayName;
            var refUser = firebase.database().ref('user/' + user.uid);
            refUser.once('value', function (snapshot) {
                if(!snapshot.val()){
                    refUser.set({
                    name: userName,
                    searchCount: 0,
                    config: default_config
                    });
                }
            });
        }

    }

    searchedWord(word) {
        if (firebase.auth().currentUser != null) {
            let count = this.searchCount + 1;
            firebase.database()
                .ref('user/' + firebase.auth().currentUser.uid)
                .update({ searchCount: count });
        }
    }

    addWord(word, tag) {
        if (firebase.auth().currentUser != null) {
            word = word.toLowerCase();
            var user = firebase.auth().currentUser;
            var refUser = firebase.database().ref('user/' + user.uid);
            var tagName = tag || 'default' ;
            var newWordRef = refUser.child('flash_cards/' + tagName + '/learning/' + word).set({
                timesRequested: 0,
                status: 0,
                word: word
            });
        }
    }

    saveConfig(bubbleConfig) {
        if (firebase.auth().currentUser != null) {
            var user = firebase.auth().currentUser;
            var refUser = firebase.database().ref('user/' + user.uid + '/config');
            refUser.update({ bubble_config: bubbleConfig });
        }
    }

    _debug(message) {
        firebase.database().ref('debug_messages/' + Date()).set({
            message: word
        });
    }
}