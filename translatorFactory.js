var translatorFactory = (function(){
    var translatorOptions = [
      {name: "Tureng", logo: "icons/turenglogo.png"
      , getWords:function(word,number,done,fail){
      var url = 'http://tureng.com/tr/turkce-ingilizce/'+word;
        $.get('http://tureng.com/tr/turkce-ingilizce/'+word).then(function(responseData) {
              var my_div = $('table#englishResultsTable tbody', $(responseData));
              var result = [];
              if(my_div.length >0){
                  var myTable = my_div[0].rows;
                if(myTable.length>number){
                  var i=3,lim=6;
                  for(;i<myTable.length && i<lim;i++){
                    if(myTable[i].cells.length>3){
                        result.push(myTable[i].cells[3].firstChild.innerHTML);
                    }
                    else{
                      lim++;
                    }
                  }
                }
              }
              done(result,url);
            }).fail(function(){
              fail();
            });
      }},

      {name:"SesliSozlük", logo: "icons/sesliThmb.png"
      , getWords:function(word,number,done,fail){
      var url = 'https://www.seslisozluk.net/en/what-is-the-meaning-of-'+word;
        $.get('https://www.seslisozluk.net/en/what-is-the-meaning-of-'+word).then(function(responseData) {
          var my_div = $('div.panel-body.sozluk > ol li', $(responseData));
          var result = [];
          my_div.each(function(d){
            if(d>=number){
              return;
            }
            var ind = my_div[d].innerHTML.search("<");
            if( ind>=0){
              my_div[d].innerHTML = my_div[d].innerHTML.substring(0,ind);
            }
            result.push(my_div[d].innerHTML);
          });
          done(result,url);
        }).fail(function(){
          fail();
        });
      }}
    ];

    var sentenceProviderOptions = [
      OXFORD = {name:"Oxford", logo: "icons/oxfordThmb.png"
      ,getSentences: function(word,number,done,fail){
        word = word.toLowerCase();
        var url = 'http://www.oxforddictionaries.com/definition/english/'+word+'?searchDictCode=all';
        $.get(url).then(function(responseData) {
          var eachUsage = $('.se1.senseGroup > .se2', $(responseData));
          var result = [];
          eachUsage.each(function(index,item){
            if(index>=number)
              return;
            var sentences = item.getElementsByClassName('sentence_dictionary')[0];
            if(sentences && sentences.childNodes.length>0)
              result.push(sentences.firstChild.innerHTML);
          });
          done(result,url);
        }).fail(function(){
          fail();
        });
      }}
    ];

    return {
      getTranslatorOptions: function(){return translatorOptions;},
      getSentenceProviderOptions: function(){return sentenceProviderOptions;},

      getTranslator: function(index){
          return translatorOptions[index];
      },

      getSentenceProvider(index){
          return sentenceProviderOptions[index];
      }
    }
})();
