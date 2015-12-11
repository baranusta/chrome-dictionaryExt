container = {LEFTCOLUMN : 0, RIGHTCOLUMN : 1, BOTTOMROW : 2};

var bubbleController = (function(){
  var bottom = 0,
      left = 0,
      bubbleDom,
      sentencesContainer,
      leftColumn,
      rightColumn,
      addChildrenFromArray = function(elmntAdder,childrens,truncateLim,url,logo){
        var holderForImg = document.createElement('div');
        holderForImg.className = "logoDiv";
        var img = document.createElement('img'); // width, height values are optional params
        img.setAttribute("align","middle");
        img.src = chrome.extension.getURL(logo);
        img.className = "logo";
        holderForImg.appendChild(img);
        elmntAdder(holderForImg);
        if(childrens.length>0)
        {
          for (child of childrens) {
            var childElm = document.createElement('li');
            if(child.length > truncateLim){
              childElm.innerHTML = child.substring(0,truncateLim) + "...";
            }
            else {
              childElm.innerHTML = child;
            }
            elmntAdder(childElm);
          }
          elmntAdder(document.createElement('p'))
          var urlElmnt = document.createElement('a');

          urlElmnt.className = "urlText";
          urlElmnt.setAttribute("url",url);
          urlElmnt.innerHTML = "more...";
          elmntAdder(urlElmnt);
        }
      };
      return {
        createBubble: function(){
          bubble.createForDom();
        },
        isSelectedStringValid: function(selected){
          for (var i = 0,count = 0, selected_length = selected.length; i < selected_length; i++) {
            if(selected[i] == ' '){
              count++;
            }
            if(count>=2){
              return false;
            }
          }
          return true;
        },
        openBubble: function(){
            bubble.makeVisible();
            bubble.determineNewPostion();
            bubble.renderPosition();
        },
        closeBubble: function(){
            bubble.makeInvisible();
            bubble.removeContentOfNodes();
        },
        populateContent: function(type,array,url,logo){
            switch (type) {
              case container.LEFTCOLUMN:
                addChildrenFromArray(bubble.addToLeftColumn,array,15,url,logo);
                break;
              case container.RIGHTCOLUMN:
                addChildrenFromArray(bubble.addToRightColumn,array,15,url,logo);
                break;
              case container.BOTTOMROW:
                addChildrenFromArray(bubble.addToSentenceRow,array,50,url,logo);
                break;
              default:

            }
            bubble.renderPosition();
        }
      };
}());

var myTranslator = new Translator(0,1,0);
bubbleController.createBubble();



// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  selection = selection.trim();
  if(selection.length > 0){
    if (bubbleController.isSelectedStringValid(selection)) {
      bubbleController.openBubble();
      try{
        myTranslator.getMeaningForLeft(selection,3,function(wordArray,url){
          bubbleController.populateContent(container.LEFTCOLUMN,wordArray,url,myTranslator.getLogoOfLeft());
        });
        myTranslator.getMeaningForRight(selection,3,function(wordArray,url){
          bubbleController.populateContent(container.RIGHTCOLUMN,wordArray,url,myTranslator.getLogoOfRight());
        });
        myTranslator.getSentences(selection,2, function(sentenceArray,url){
          bubbleController.populateContent(container.BOTTOMROW,sentenceArray,url,myTranslator.getLogoOfSentenceContainer());
        });
      }
      catch(err){
        console.log(err);
      }

    }
  }
}, false);

// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
  var element = (e.target || e.srcElement);
  if(element && element.className == "urlText")
  {
    var url = element.getAttribute("url");
    var win = window.open(url, '_blank');
    win.focus();
  }
  bubbleController.closeBubble();
}, false);
