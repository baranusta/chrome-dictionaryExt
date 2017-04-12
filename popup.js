
document.addEventListener('DOMContentLoaded', function () {

});

$(".LoginButton").click(function(){
                console.log('senddd');
    chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: "https://us-central1-turta-edf3c.cloudfunctions.net/flashCard"
  }, function(responseText) {
      
      console.log(responseText);
  });
});
