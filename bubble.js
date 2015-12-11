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
       },
       addToLeftColumn: function(elm){
         leftColumn.appendChild(elm);
       },
       addToRightColumn: function(elm){
         rightColumn.appendChild(elm);
       },
       addToSentenceRow: function(elm){
         sentencesContainer.appendChild(elm);
       },
       removeContentOfNodes: function(){
         childrenRemover(leftColumn);
         childrenRemover(rightColumn);
         childrenRemover(sentencesContainer);
       }
      };
}());

var childrenRemover = function(domElmnt){
  while (domElmnt.firstChild) {
    domElmnt.removeChild(domElmnt.firstChild);
  }
}
