class ApiController {
    // updateRequestAfterDuration ıs a callback function
    constructor() {
        let self = this;
        self.searchCount = 0;
        self.userConfig = null;

        var config = {
            apiKey: "AIzaSyBLXdjn83IVKp9SDiP_g9zOQJzAlEDzUME",
            authDomain: "turta-edf3c.firebaseapp.com",
            databaseURL: "https://turta-edf3c.firebaseio.com",
            storageBucket: "turta-edf3c.appspot.com",
            messagingSenderId: "470726396129"
        };
        firebase.initializeApp(config);

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
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

            firebase.database().ref('user/' + userId + '/config').on('value', function (snapshot) {
                self.userConfig = snapshot.val();
                console.log("userConfig:");
                console.log(self.userConfig);
            });

            firebase.database().ref('config/flashCardReqMin').on('value', function (snapshot) {
                if (!!self.updateRequestAfterDuration)
                    self.updateRequestAfterDuration(snapshot.val());
            });
        }
    }

    getUserConfig() { return this.userConfig || null; }
    getRequestAfterLimit() { return this.makeRequestAfter; }
    getUID(addIdToken) {
        if (!!firebase.auth().currentUser)
            firebase.auth().currentUser.getToken(/* forceRefresh */ true).then(function (idToken) {
                addIdToken(idToken);
            }).catch(function (error) {
            });
    }

    startAuth(interactive, callback) {
        // Request an OAuth token from the Chrome Identity API.
        chrome.identity.getAuthToken({ interactive: !!interactive }, function (token) {
            if (chrome.runtime.lastError && !interactive) {
                console.log('It was not possible to get a token programmatically.');
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

    registerUser() {
        if (firebase.auth().currentUser != null) {
            var user = firebase.auth().currentUser;
            let userName = user.displayName;
            var refUser = firebase.database().ref('user/' + user.uid);
            refUser.set({
                name: userName,
                searchCount: 0,
                config: default_config
            });
        }

    }

    searchedWord(word) {
        if (firebase.auth().currentUser != null) {
            let count = this.searchCount + 1;
            console.log(firebase.auth().currentUser.uid);
            console.log(count);
            firebase.database()
                .ref('user/' + firebase.auth().currentUser.uid)
                .update({ searchCount: count });
        }
    }

    addWord(word, tag) {
        if (firebase.auth().currentUser != null) {
            var user = firebase.auth().currentUser;
            var refUser = firebase.database().ref('user/' + user.uid);
            var newWordRef = refUser.child('flash_cards/' + word).set({
                tag: 'general',
                priority: 0,
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