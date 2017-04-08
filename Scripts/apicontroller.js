class ApiController {
    constructor() {
        let self = this;
        self.searchCount = 0;

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
            var searchCount = firebase.database().ref('user/' + userId + '/searchCount');
            searchCount.on('value', function (snapshot) {
                self.searchCount = snapshot.val() + 1;
                console.log(self.searchCount);
            });
        }
    }

    startAuth(interactive) {
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
                });
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

    searchedWord(word) {
        if (firebase.auth().currentUser != null) {
            let count = self.searchCount;
            refUser.update({searchCount: count});
        }
    }

    addWord(word, tag) {
        if (firebase.auth().currentUser != null) {
            let self = this;
            var user = firebase.auth().currentUser;
            let userName = user.displayName;
            var refUser = firebase.database().ref('user/' + user.uid);
            if (this.searchCount === 0) {
                refUser.set({
                    name: userName,
                    searchCount: 0
                });
            }
            var newWordRef = refUser.child('searches/' + word).set({
                tag: 'tag',
                priority: 0,
                status: 0,
                word: word
            });
        }
    }

    _debug(message){
            firebase.database().ref('debug_messages/' + Date()).set({
                message: word
            });
    }
}