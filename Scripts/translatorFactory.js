
var translatorFactory = (function () {
    var translatorOptions = [
        {
            name: "Tureng",
            logo: "icons/turenglogo.png",
            getWords: function (word, number, done, fail) {
                var url = 'http://tureng.com/tr/turkce-ingilizce/' + word;
                makeRequest(url,function (responseData) {
                    if(!responseData)
                        fail();
                    var my_div = $('table#englishResultsTable tbody', $(responseData));
                    var result = [];
                    if (my_div.length > 0) {
                        var myTable = my_div[0].rows;
                        if (myTable.length > number) {
                            var i = 3, lim = 6;
                            for (; i < myTable.length && i < lim; i++) {
                                if (myTable[i].cells.length > 3) {
                                    result.push(myTable[i].cells[3].firstChild.innerHTML);
                                }
                                else {
                                    lim++;
                                }
                            }
                        }
                    }
                    done(result, url);
                });
            }
        },

        {
            name: "SesliSozlük",
            logo: "icons/seslisozluk.png",
            getWords: function (word, number, done, fail) {
                var url = 'https://www.seslisozluk.net/en/what-is-the-meaning-of-' + word;
                makeRequest(url,function (responseData) {
                    if(!responseData)
                       fail();
                    var result = [];
                    $('div.panel-body.sozluk dl:first dd a', $(responseData))
                                    .each(function (d,elm) {
                                          if (d >= number) {
                                              return;
                                          }
                                          result.push(elm.innerHTML);}
                    );
                    done(result, url);
                });
            }
        }
    ];

    var sentenceProviderOptions = [
        /*OXFORD = {
            name: "Oxford", logo: "icons/oxforddictionary.jpg"
            , getSentences: function (word, number, done, fail) {
                word = word.toLowerCase();
                var url = 'https://en.oxforddictionaries.com/definition/';
                makeRequest(url,function (responseData) {
                    if(!responseData)
                       fail();
                    var eachUsage = $('.gramb ul.semb', $(responseData));
                    var result = [];
                    eachUsage.each(function (index, item) {
                        if (index >= number)
                            return;
                        var sentence = $('.exg:first .ex em',item)[0].innerHTML
                        if (sentence)
                            result.push(sentence);
                    });
                    done(result, url);
                }, word);
            }
        }*/
    ];

    return {
        getTranslatorOptions: function () {
            return translatorOptions;
        },
        getSentenceProviderOptions: function () {
            return sentenceProviderOptions;
        },

        getTranslator: function (index) {
            return translatorOptions[index];
        },

        getSentenceProvider(index){
            return sentenceProviderOptions[index];
        }
    }
})();

function makeRequest(url,callback,word){
  chrome.runtime.sendMessage({
    method: 'GET',
    action: 'xhttp',
    url: url,
    word: word
  }, function(responseText) {
      responseText = responseText.replace(/<img\b[^>]*>/ig, '');
      responseText = stripScripts(responseText);
      callback(responseText);
    /*Callback function to deal with the response*/
  });
}

function stripScripts(s) {
  var div = document.createElement('div');
  div.innerHTML = s;
  var scripts = div.getElementsByTagName('script');
  var i = scripts.length;
  while (i--) {
    scripts[i].parentNode.removeChild(scripts[i]);
  }
  return div.innerHTML;
}
