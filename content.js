
  var bubbleDOM = document.createElement('div');
  bubbleDOM.setAttribute('class', 'selection_bubble');
  document.body.appendChild(bubbleDOM);
document.addEventListener('DOMContentLoaded', function () {
});
// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
  var selection = window.getSelection().toString();
  if (selection.length > 0) {
    renderBubble(e.clientX, e.clientY, selection);

    $.get('http://tureng.com/tr/turkce-ingilizce/'+selection).then(function(responseData) {
          var my_div = $('table#englishResultsTable tbody', $(responseData));
          if(my_div.length >0){
              var myTable = my_div[0].rows;
            if(myTable.length>3){
              var i=3,lim=6;
              for(;i<myTable.length && i<lim;i++){
                if(myTable[i].cells.length>3){
           			    console.log(myTable[i].cells[3].firstChild.innerHTML);
                }
                else{
                  lim++;
                  console. log();
                }
              }
            }
          }
        });

        $.get('https://www.seslisozluk.net/en/what-is-the-meaning-of-'+selection).then(function(responseData) {
          var my_div = $('div.panel-body.sozluk > ol li', $(responseData));
          my_div.each(function(d){
            if(d>2){
              return;
            }
            var ind = my_div[d].innerHTML.search("<");
            if( ind>=0){
              my_div[d].innerHTML = my_div[d].innerHTML.substring(0,ind);
            }
            console.log(my_div[d].innerHTML);
          });
        });

        $.get('http://www.oxforddictionaries.com/definition/english/'+selection+'?searchDictCode=all').then(function(responseData) {
          var my_div = $('div.entryPageContent > div', $(responseData));
          var my_div2 = my_div[0].firstChild;
          var meaningArr = $(my_div2).children('section');
          meaningArr.each(function(d){
            var t = $(meaningArr[d]).children('.se2');
            var sentence = $(t[0]).children('.msDict.sense');
            var wow = $($(sentence[0].firstChild).children('.moreInformation')[0]).children('.sentence_dictionary')[0].firstChild.innerHTML;
            console.log(wow);
          });
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
