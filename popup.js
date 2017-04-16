var bubble = new TranslationBubbleDoubleColumnAndRow();

$(document).ready(function () {
	$('#bottom').append($('.dictionary-bubble'));
	flashCard.hide();
});

var searchText = $("#search_word");
var flashCard = $('#bottom #flashCard');
var cardWord = null;

function animateBtnNextCard() {
	//var btn = document.getElementById("btnNextCard");
	console.log($("#btnNextCard").css('top'));
	var btn = $("#btnNextCard").animate({ top: '220px' });
}

$("#btnNextCard").click(function () {
	animateBtnNextCard();
	bubble.closeBubble();
	//show something like loader

	chrome.runtime.sendMessage({
		method: 'GET',
		action: 'xhttp',
		url: "https://us-central1-turta-edf3c.cloudfunctions.net/flashCard"
	}, function (responseText) {
		//hide loader - show the content
		if (responseText && responseText.word) {
			//show word 
			flashCard.html(responseText.word);
			cardWord = responseText.word;
		}
		else {
			flashCard.html("hakkin bitmis amaa :'(");
			cardWord = null;
		}
		flashCard.show();
	});
});

$("#btnSearch").click(function () {
	bubble.closeBubble();
	bubble.renderAtNewPosition(0, 0);
	bubble.setVisibilityAddSection("visible");
	bubble.showTranslationResults(searchText.val().trim());

});

flashCard.click(function () {
	if (cardWord) {
		flashCard.hide();
		bubble.renderAtNewPosition(0, 0);
		bubble.setVisibilityAddSection('hidden');
		bubble.bubble.style.maxHeight = '200px';
		bubble.showTranslationResults(cardWord);
	}
});

