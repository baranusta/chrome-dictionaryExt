var bubble, tempBubble;
var bubbleValue;
var width;
var bubbleConfig;

$(document).ready(function () {

	//sets globals
	var htmlStyles = window.getComputedStyle(document.querySelector("html"));
	width = htmlStyles.getPropertyValue("--width"); // returns "#f00"
	$("#search_word").focus();

	chrome.runtime.sendMessage({ action: "get_bubble_config" }, function (response) {

		chrome.runtime.sendMessage({ action: "is_logged_in" }, function (userAuthStatus) {


			bubble = TranslationBubbleFactory.getBubble(response.bubbleType);
			bubbleValue = response.bubbleType;
			tempBubble = bubble;
			//sets parameters
			bubble.setAddbtnResultListener(function () { window.close(); });
			
			prepareView(userAuthStatus, bubbleValue);
		});
	});

});

var searchText = $("#search_word");
var flashCard = $('#bottom #flashCard');
var cardWord = null;


/* HELPER FUNCTIONS */
function animatebtnNextCard() {
	$("#btnNextCard").animate({ top: '220px' });
}

function addBubbleOptions(bubbles, checkedBubbleValue) {
	let containerDiv = $('.bubbleType div');
	for (var index in bubbles) {
		var bubble = bubbles[index];
		if (bubble.hasOwnProperty('value')) {
			var div = $('<div></div>');
			if (checkedBubbleValue === bubble.value)
				$('<input type="radio" name="bubble_type" value="' + bubble.value + '" checked />').appendTo(div);
			else
				$('<input type="radio" name="bubble_type" value="' + bubble.value + '" />').appendTo(div);
			$('<p>resim olcak</p>').appendTo(div);
			//$('<img src="' + bubble.image + '">').appendTo(div);
			div.appendTo(containerDiv);
		}
	}
}


function fill_FromOptions(translatorOptions) {
	for (var index = 0; index < translatorOptions.length; index++) {
		var element = translatorOptions[index];
		$('#ddFrom').append($('<option value="' + index + '">' + element.name + '</option>'));
	}
	if (translatorOptions.length === 1) {
		$('#ddFrom').prop('disabled', true);
		fill_ToOptions(translatorOptions[0]['to']);
	}
}

function fill_ToOptions(translatorOptionTo) {
	$('.translator-option-to').show();
	for (var index = 0; index < translatorOptionTo.length; index++) {
		var element = translatorOptionTo[index];
		console.log(element);
		$('#ddTo').append($('<option value="' + index + '">' + element.name + '</option>'));
	}
	if (translatorOptionTo.length === 1) {
		$('#ddTo').prop('disabled', true);
		addDictionaryOptions(bubble.getRequiredWordTranslatorCount(),
			bubble.getRequiredSentenceTranslatorCount(),
			translatorOptionTo[0].translators);
	}
}

function addDictionaryOptions(wordTranslatorcount, sentenceTranslatorCount, dictionaries) {
	$('.translator-options').show();
	var elementBase = '<select id="dictionary_0">';
	for (var i = 0; i < wordTranslatorcount; i++) {
		var element = elementBase.replace('0', i + '');
		for (var index = 0; index < dictionaries.length; index++) {
			var translator = dictionaries[index];
			element = element + '<option value="' + index + '">' + translator.name + '</option>';
		}
		$('.translator-options').append($('<label>Word Translator ' + (i + 1) + ': </label><br>'));
		$('.translator-options').append($(element + '</select><br>'));
	}
	//Sentence not supported yet
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

function prepareView(isLoggedIn, bubbleValue) {
	console.log(isLoggedIn);
	if (!isLoggedIn) {
		$('.content').hide();
		$('.login').show();
	}
	else {
		$('.content').show();
		$('.login').hide();
	}
	if(bubbleValue)
		addBubbleOptions(TranslationBubbleFactory.bubbles(), bubbleValue);
	
	$('#bottom').append($('.dictionary-bubble'));
	flashCard.hide();
	$('#config_save_error').hide();
	$('.translator-option-to').hide();
	$('.translator-options').hide();


	fill_FromOptions(TranslatorFactory.getTranslatorOptions());
}

function addPreferences(languageFrom, languageTo, preference) {
	$('.translator-options select').each(function (index, element) {
		var pref = { from: languageFrom, to: languageTo, index: element.selectedIndex };
		preference.push(pref);
	});
}


function prepareBubble() {
	$('#btnNextCardBackGround').height(100);
	bubble.renderAtNewPosition(0, 0);
	bubble.setVisibilityAddSection('hidden');
	bubble.bubble.style.maxHeight = '200px';
	bubble.showTranslationResults(cardWord);

}

/* CLICK LISTENERS */
$("#btnNextCard").click(function () {
	animatebtnNextCard();
	bubble.closeBubble();
	//show something like loader

	chrome.runtime.sendMessage({
		method: 'GET',
		action: 'xhttp',
		isUserRequired: true,
		url: "https://us-central1-turta-edf3c.cloudfunctions.net/flashCard"
	}, function (responseText) {
		//hide loader - show the content
		if (responseText) {
			if (responseText.status) {
				if (responseText.status == 404) {
					flashCard.html("flash card yok ama :/");
					cardWord = null;
				}
				else if (responseText.word) {
					//show word 
					flashCard.html(responseText.word);
					cardWord = responseText.word;
					prepareBubble();

				}
				else {
					flashCard.html("hakkin bitmis amaa :'(");
					cardWord = null;

				}
			}
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

$("#btnLogin").click(function () {
	chrome.runtime.sendMessage({ action: "login" }, function (response) {
		prepareView(true);
	});
});

$("#btnSearch").click(function () {
	if (searchText.val().trim().length !== 0) {
		animatebtnNextCard();
		$('#btnNextCardBackGround').height(0);
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
	if ($('.translator-option-from').css('display') !== 'block' ||
		$('.translator-option-to').css('display') !== 'block' ||
		$('.translator-options').css('display') !== 'block') {

		$('#config_save_error').show();
		setTimeout(function () {
			$('#config_save_error').fadeOut(1000, function () {
				$('#config_save_error').hide();
			});
		}, 1000);
		return;
	}
	slideWithDiv($('#settings_menu'), true);

	var bubbleConfig = {
		bubbleType: bubbleValue,
		preferences: []
	};

	addPreferences(parseInt($("#ddFrom").val()), parseInt($("#ddTo").val()), bubbleConfig.preferences);
	console.log(bubbleConfig);
	chrome.runtime.sendMessage({
		action: "save_bubble_config",
		bubble_config: bubbleConfig
	}, function (response) { });

	bubble = tempBubble;
	bubble.setPreferences(bubbleConfig.preferences);
});

flashCard.click(function () {
	if (cardWord) {
		flashCard.hide();
		$('#btnNextCardBackGround').height(0);
	}
});

$("input[type='radio']").click(function () {
	var radioValue = $("input[name='bubble_type']:checked").val();
	if (radioValue) {
		bubbleValue = radioValue;
		tempBubble = TranslationBubbleFactory.getBubble(radioValue);
	}
});

$('input[type=text]').on('keydown', function (e) {
	if (e.which == 13) {
		$('#btnSearch').click();
	}
});

$("#ddFrom").change(function () {
	var index = parseInt($(this).val());
	$('.translator-option-to').hide();
	$('.translator-options').hide();
	fill_ToOptions(TranslatorFactory.getTranslatorOptions()[index]['to']);
});

$("#ddTo").change(function (index) {
	var from_index = parseInt($("#ddFrom").val());
	var to_index = parseInt($(this).val());
	addDictionaryOptions(bubble.getRequiredWordTranslatorCount(),
		bubble.getRequiredSentenceTranslatorCount(),
		TranslatorFactory.getDictionaryOptions({ from: from_index, to: to_index }));
});


