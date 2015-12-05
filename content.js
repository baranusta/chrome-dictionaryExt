var bubbleDOM = document.createElement('a');
bubbleDOM.setAttribute('class', 'dictionary-tooltip');
bubbleDOM.setAttribute('href', '#');
document.body.appendChild(bubbleDOM);

var myTranslator = new Translator(0,1,0);

// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  if (selection.length > 0) {
    renderBubble(e.clientX, e.clientY, selection);

    myTranslator.getMeaningForLeft(selection,3,function(wordArray){
        for (t of wordArray) {
          console.log(t);
        }
    });
    myTranslator.getMeaningForRight(selection,3,function(wordArray){
      for (t of wordArray) {
        console.log(t);
      }
    });
    myTranslator.getSentences(selection,3, function(sentenceArray){
      for (t of sentenceArray) {
        console.log(t);
      }
    });
  }
}, false);



// Close the bubble when we click on the screen.
document.addEventListener('mousedown', function (e) {
  bubbleDOM.style.visibility = 'hidden';
}, false);

// Move that bubble to the appropriate location.
function renderBubble(mouseX, mouseY, selection) {
  bubbleDOM.innerHTML = selection;
  bubbleDOM.style.top = mouseY + 'px';
  bubbleDOM.style.left = mouseX + 'px';
  bubbleDOM.style.visibility = 'visible';
}
