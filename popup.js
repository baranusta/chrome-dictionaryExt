var bubble = new TranslationBubbleDoubleColumnAndRow();
var width;

$(document).ready(function () {
	//sets outlook
	$('#bottom').append($('.dictionary-bubble'));
	flashCard.hide();

	//sets globals
	var htmlStyles = window.getComputedStyle(document.querySelector("html"));
	width = htmlStyles.getPropertyValue("--width"); // returns "#f00"

	//sets parameters
	bubble.setAddbtnResultListener(function(){window.close();});
});

var searchText = $("#search_word");
var flashCard = $('#bottom #flashCard');
var cardWord = null;

function animatebtnNextCard(){
	$("#btnNextCard").animate({ top: '220px' });
}

$("#btnNextCard").click(function () {
	animatebtnNextCard();
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
			//burda baska ihtimaller de var onu response objesine
			//eklenen baska parametrelerle saapabiliriz
			flashCard.html("hakkin bitmis amaa :'(");
			cardWord = null;
		}
		flashCard.show();
	});
});

$("#btnSearch").click(function () {
	animatebtnNextCard();
	bubble.closeBubble();
	bubble.renderAtNewPosition(0, 0);
	bubble.setVisibilityAddSection("visible");
	bubble.showTranslationResults(searchText.val().trim());

});

$("#btnSettings").click(function () {
	var num = parseInt(width.replace( /^\D+/g, ''));
	$('.content').animate({left:-num},500,function(){console.log('done1');});
	$('#settings_menu').animate({left:0},500,function(){console.log('done');});
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

