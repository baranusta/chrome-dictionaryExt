myBubble = new TranslationBubbleDoubleColumnAndRow();


// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {

    var selected = getSelectedWord(e);
    if (!selected)
        return;

    var rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
    bottom = $(window).height() - rect.top + 4 - window.pageYOffset;
    left = rect.left + (rect.width / 2);
    myBubble.renderAtNewPosition(bottom, left);
    myBubble.showTranslationResults(selected);
}, false);

// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
    var element = (e.target || e.srcElement);
    if (myBubble.isVisible() && element) {
        if (element.className == "urlText") {
            var url = element.getAttribute("url");
            var win = window.open(url, '_blank');
            win.focus();
            myBubble.closeBubble();
        }
        else if (element.className == "bubbleAdd") {
            setTimeout(function () {
                myBubble.closeBubble();
            }, 200);
        }
        else
            myBubble.closeBubble();
    }
}, false);

isSelectedStringValid = function (selected) {
    for (var i = 0, count = 0, selected_length = selected.length; i < selected_length; i++) {
        if (selected[i] == ' ') {
            count++;
        }
        if (count >= 2) {
            return false;
        }
    }
    return true;
};

getSelectedWord = function (e) {
    var text;
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    //if it is an empty string or ctrl key is not pressing.
    if (!!text && shouldOpenBubble(e, text) && isSelectedStringValid(text))
        return text.trim();
    return;
}

shouldOpenBubble = function (event, selected) {
    return event.ctrlKey && selected.length > 0;
};
