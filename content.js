var bubble = (function(){
  var bottom = 0,
      left = 0,
      bubbleDom,
      sentencesContainer,
      leftColumn,
      rightColumn;
      return {
        createForDom: function(){
         bubbleDom = document.createElement('div');
         bubbleDom.setAttribute('class', 'dictionary-bubble');

         wordsContainer = document.createElement('div');
         wordsContainer.setAttribute('class', 'dictionary-words-container');


         leftColumn = document.createElement('div');
         leftColumn.setAttribute('class', 'dictionary-leftColumn');
         wordsContainer.appendChild(leftColumn);

         rightColumn = document.createElement('div');
         rightColumn.setAttribute('class', 'dictionary-rightColumn');
         wordsContainer.appendChild(rightColumn);


         sentencesContainer = document.createElement('div');
         sentencesContainer.setAttribute('class', 'dictionary-sentences-container');

         bubbleDom.appendChild(wordsContainer);
         bubbleDom.appendChild(sentencesContainer);
         document.body.appendChild(bubbleDom);
       },
       determineNewPostion: function(){
         var rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
         bottom = $(window).height() - rect.top + 4 - window.pageYOffset;
         left = rect.left + (rect.width/2) - (bubbleDom.offsetWidth/2);
         if(left<0){
           left = 0;
         }
      },
       renderPosition: function(){
         bubbleDom.style.bottom = bottom + 'px';
         bubbleDom.style.left = left  + 'px';
       },
       makeVisible: function(){
         bubbleDom.style.visibility = 'visible';
       },
       makeInvisible: function(){
         bubbleDom.style.visibility = 'hidden';
         childrenRemover(leftColumn);
         childrenRemover(rightColumn);
         childrenRemover(sentencesContainer);
       },
       addToLeftColumn: function(elm){
         leftColumn.appendChild(elm);
       },
       addToRightColumn: function(elm){
         rightColumn.appendChild(elm);
       },
       addToSentenceRow: function(elm){
         sentencesContainer.appendChild(elm);
       }
      };
}());

var childrenRemover = function(domElmnt){
  while (domElmnt.firstChild) {
    domElmnt.removeChild(domElmnt.firstChild);
  }
}

var addChildrenFromArray = function(elmntAdder,childrens,truncateLim){
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
}

var isValidString = function(selected){
  for (var i = 0,count = 0, selected_length = selected.length; i < selected_length; i++) {
    if(selected[i] == ' '){
      count++;
    }
    if(count>=2){
      return false;
    }
  }
  return true;
}

var myTranslator = new Translator(0,1,0);
bubble.createForDom();

// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  if(selection.length > 0){
    selection = selection.trim();
    if (isValidString(selection)) {

      bubble.makeVisible();
      bubble.determineNewPostion();
      bubble.renderPosition();

      myTranslator.getMeaningForLeft(selection,3,function(wordArray){
        addChildrenFromArray(bubble.addToLeftColumn,wordArray,15);
        bubble.renderPosition();
      });
      myTranslator.getMeaningForRight(selection,3,function(wordArray){
        addChildrenFromArray(bubble.addToRightColumn,wordArray,15);
        bubble.renderPosition();
      });
      myTranslator.getSentences(selection,2, function(sentenceArray){
        addChildrenFromArray(bubble.addToSentenceRow,sentenceArray,50);
        bubble.renderPosition();
      });
    }
  }
}, false);

// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
  bubble.makeInvisible();
}, false);
