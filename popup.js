
document.addEventListener('DOMContentLoaded', function () {

    var config = {
      apiKey: "AIzaSyBLXdjn83IVKp9SDiP_g9zOQJzAlEDzUME",
      authDomain: "turta-edf3c.firebaseapp.com",
      databaseURL: "https://turta-edf3c.firebaseio.com",
      storageBucket: "turta-edf3c.appspot.com",
      messagingSenderId: "470726396129"
    };
    firebase.initializeApp(config);
});

$(".button").click(function(){
    login();
});
wow = function (){
    console.log("zzz");
}

login = function (){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
}
