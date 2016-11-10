container = {LEFTCOLUMN: 0, RIGHTCOLUMN: 1, BOTTOMROW: 2};


var bubbleController = (function () {
    var bottom = 0,
        left = 0,
        bubbleDom,
        sentencesContainer,
        leftColumn,
        rightColumn,
        statusOfContainers = {left: 0, right: 0, bottom: 0},

        addChildrenFromArray = function (elmntAdder, childrens, truncateLim, url, logo) {
            var holderForImg = document.createElement('div');
            holderForImg.className = "logoDiv";
            var img = document.createElement('img'); // width, height values are optional params
            img.setAttribute("align", "middle");
            img.src = chrome.extension.getURL(logo);
            img.className = "logo";
            holderForImg.appendChild(img);
            elmntAdder(holderForImg);
            if (childrens.length > 0) {
                for (child of childrens) {
                    var childElm = document.createElement('li');

                    if (child.length > truncateLim) {
                        childElm.innerHTML = child.substring(0, truncateLim) + "...";
                    }
                    else {
                        childElm.innerHTML = child;
                    }
                    elmntAdder(childElm);
                }
                var urlElmnt = document.createElement('p');

                urlElmnt.className = "urlText";
                urlElmnt.setAttribute("url", url);
                urlElmnt.innerHTML = "more...";
                elmntAdder(urlElmnt);
            }
            else {
                var notFound = document.createElement('p');
                notFound.innerHTML = "bir sonuç bulunamadı :(";
                elmntAdder(notFound);
            }
        };
    return {
        createBubble: function () {
            bubble.createForDom();
        },
        isSelectedStringValid: function (selected) {
            for (var i = 0, count = 0, selected_length = selected.length; i < selected_length; i++) {
                if (selected[i] == ' ') {
                    count++;
                }
                if (count >= 2) {
                    return false;
                }
            }
            return true;
        },
        shouldOpenBubble: function(event, selected){
          return event.ctrlKey && selected.length > 0;
        },
        openBubble: function () {
            bubble.makeVisible();
            bubble.determineNewPostion();
            bubble.renderPosition();
        },
        closeBubble: function () {
            bubble.makeInvisible();
            bubble.removeContentOfNodes();
            statusOfContainers.right = 0;
            statusOfContainers.left = 0;
            statusOfContainers.bottom = 0;
        },
        populateContent: function (type, array, logo, url) {
            switch (type) {
                case container.LEFTCOLUMN:
                    if (statusOfContainers.left == 0) {
                        statusOfContainers.left++;
                        addChildrenFromArray(bubble.addToLeftColumn, array, 15, url, logo);
                    }
                    break;
                case container.RIGHTCOLUMN:
                    if (statusOfContainers.right == 0) {
                        statusOfContainers.right++;
                        addChildrenFromArray(bubble.addToRightColumn, array, 15, url, logo);
                    }
                    break;
                case container.BOTTOMROW:
                    if (statusOfContainers.bottom == 0) {
                        statusOfContainers.bottom++;
                        addChildrenFromArray(bubble.addToSentenceRow, array, 50, url, logo);
                    }
                    break;
                default:

            }
            bubble.renderPosition();
        }
    };
}());

var myTranslator = new Translator(0, 1, 0);
bubbleController.createBubble();


// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
    var selection = window.getSelection().toString();
    //if it is an empty string or ctrl key is not pressing.
    if(!selection || !bubbleController.shouldOpenBubble(e,selection))
      return;
    selection = selection.trim();
    bubbleController.openBubble();
    try {
      myTranslator.getMeaningForLeft(selection, 3,
        function (wordArray, url) {
            bubbleController.populateContent(container.LEFTCOLUMN, wordArray, myTranslator.getLogoOfLeft(), url);
        },
        function () {
            bubbleController.populateContent(container.LEFTCOLUMN, [], myTranslator.getLogoOfLeft());
      });
      myTranslator.getMeaningForRight(selection, 3,
        function (wordArray, url) {
              bubbleController.populateContent(container.RIGHTCOLUMN, wordArray, myTranslator.getLogoOfRight(), url);
          },
        function () {
              bubbleController.populateContent(container.RIGHTCOLUMN, [], myTranslator.getLogoOfRight());
      });
      myTranslator.getSentences(selection, 2,
        function (sentenceArray, url) {
              bubbleController.populateContent(container.BOTTOMROW, sentenceArray, myTranslator.getLogoOfSentenceContainer(), url);
        },
        function () {
              bubbleController.populateContent(container.BOTTOMROW, [], myTranslator.getLogoOfSentenceContainer());
          });
    }
    catch (err) {
        console.log(err);
    }
}, false);
  $.get("https://en.oxforddictionaries.com/definition/","book").then(function(responseData){console.log(responseData);});
    $.get("https://www.seslisozluk.net/en/what-is-the-meaning-of-","book").then(function(responseData){console.log(responseData);});
      $.get("http://tureng.com/tr/turkce-ingilizce/","book").then(function(responseData){console.log(responseData);});
// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
    var element = (e.target || e.srcElement);
    if (element) {
        if (element.className == "urlText") {
            var url = element.getAttribute("url");
            var win = window.open(url, '_blank');
            win.focus();
        }
        else if (element) {

        }
    }
    bubbleController.closeBubble();
}, false);
