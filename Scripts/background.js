chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var method = request.method ? request.method.toUpperCase() : 'GET';

        if(method === 'GET'){
          $.get(request.url).then(function(responseData){callback(responseData);}).fail(callback);
        }
        else if(method === 'POST'){
        }
        return true; // prevents the callback from being called too early on return
    }
});
