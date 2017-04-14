var bubble = new TranslationBubbleDoubleColumnAndRow();

document.addEventListener('DOMContentLoaded', function () {

});

$(".LoginButton").click(function () {
	console.log('request_sent');
	//show something like loader

	chrome.runtime.sendMessage({
		method: 'GET',
		action: 'xhttp',
		url: "https://us-central1-turta-edf3c.cloudfunctions.net/flashCard"
	}, function (responseText) {
		//hide loader - show the content
		if (responseText && responseText.word) {
			//show word content
			bubble.renderAtNewPosition(0, 0);
			bubble.setVisibilityAddSection('hidden');
			bubble.showTranslationResults(responseText.word);
			console.log(responseText.word);
		}
		else {
			//run out of daily usage count soory beyb
		}
	});
});
