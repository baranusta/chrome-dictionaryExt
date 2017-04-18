var bubble;
var width;
var bubbleConfig;

$(document).ready(function () {

	//sets globals
	var htmlStyles = window.getComputedStyle(document.querySelector("html"));
	width = htmlStyles.getPropertyValue("--width"); // returns "#f00"

	chrome.runtime.sendMessage({ action: "config" }, function (response) {
		bubble = new TranslationBubbleDoubleColumnAndRow();
		//sets parameters
		bubble.setAddbtnResultListener(function () { window.close(); });


		//sets outlook
		$('#bottom').append($('.dictionary-bubble'));
		flashCard.hide();
		addBubbleOptions(registeredBubbles);


	});
});

var searchText = $("#search_word");
var flashCard = $('#bottom #flashCard');
var cardWord = null;


/* HELPER FUNCTIONS */
function animatebtnNextCard() {
	$("#btnNextCard").animate({ top: '220px' });
}

function addBubbleOptions(bubbles) {
	let containerDiv = $('.bubbleType div');
	console.log(bubbles)
	for (var index in bubbles) {
		var bubble = bubbles[index];
		if (bubble.hasOwnProperty('value')) {
			var div = $('<div></div>');
			$('<input type="radio" name="bubble_type" value="' + bubble.value + '" />').appendTo(div);
			$('<img src="' + bubble.image + '">').appendTo(div);
			div.appendTo(containerDiv);
		}
	}
}

//isback null or false, next content comes in
function slideWithDiv(div, isBack) {
	var num = parseInt(width.replace(/^\D+/g, ''));
	if (isBack) {
		$('.content').animate({ left: 0 }, 500);
		$('#settings_menu').animate({ left: num }, 500);
	}
	else {
		$('.content').animate({ left: -num }, 500);
		div.animate({ left: 0 }, 500);
	}

}

/* CLICK LISTENERS */
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
	if (searchText.val().trim().length !== 0) {
		animatebtnNextCard();
		bubble.closeBubble();
		bubble.renderAtNewPosition(0, 0);
		bubble.setVisibilityAddSection("visible");
		bubble.showTranslationResults(searchText.val().trim());
	}
});

$("#btnSettings").click(function () {
	slideWithDiv($('#settings_menu'));
});

$("#btnBack").click(function () {
	slideWithDiv($('#settings_menu'), true);
});

$("#btnSave").click(function () {
	slideWithDiv($('#settings_menu'), true);
	//save settings.

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

$("input[type='radio']").click(function () {
	var radioValue = $("input[name='bubble_type']:checked").val();
	if (radioValue) {

	}
});

