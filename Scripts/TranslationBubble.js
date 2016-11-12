class TranslationBubble {

    constructor(){
        this.translators = [0,1];
        this.sentenceProviders = [];
        this.wordLimit = 3;
        this.sentenceLimit = 2;
        this._createBubble();
    }

    setPreferences(translators, sentenceProviders, numberOfWords, numberOfSentences){
        this.translators = translators || this.translators;
        this.sentenceProviders = sentenceProviders || this.sentenceProviders;
        this.wordLimit = numberOfWords|| this.wordLimit;
        this.sentenceLimit = numberOfSentences || this.sentenceLimit;
    }

    showTranslationResults(selected, callBack){
        for (var value of this.translators) {
            TranslatorFactory.getTranslator(value).getWords(selected, this.wordLimit, function(results,url) {  });
        }
        for (var value of this.sentenceProviders) {
            TranslatorFactory.getSentenceProvider(value).getWords(selected, this.sentenceLimit, callBack);
        }
    }

    renderAtNewPosition(bottom, left){
        left -= (this.bubble.offsetWidth / 2);
        if (left < 0) {
            left = 0;
        }
        this.bubble.style.bottom = bottom + 'px';
        this.bubble.style.left = left + 'px';
    }

    changeVisibility(){
        this.bubble.style.visibility = this.bubble.style.visibility == 'hidden' ? 'visible' : 'hidden';
    }

    _createBubble(){
        var maxZ = Math.max.apply(null,
            $.map($('body *'), function(e,n) {
                if ($(e).css('position') != 'static')
                    return parseInt($(e).css('z-index')) || 1;
            }));

        this.bubble = document.createElement('div');
        this.bubble.setAttribute('class', 'dictionary-bubble');
        this.bubble.style.zIndex = maxZ + 1;
        this.bubble.style.visibility = 'hidden';
        document.body.appendChild(this.bubble);
    }

    _createElement(elemnts, truncateLim, url, logo){
        var container = document.createElement('div');
        var holderForImg = document.createElement('div');
        holderForImg.className = "logoDiv";
        var img = document.createElement('img'); // width, height values are optional params
        img.setAttribute("align", "middle");
        img.src = chrome.extension.getURL(logo);
        img.className = "logo";
        holderForImg.appendChild(img);
        container.appendChild(holderForImg);
        if (elemnts.length > 0) {
            for (let child of elemnts) {
                var childElm = document.createElement('li');

                if (child.length > truncateLim) {
                    childElm.innerHTML = child.substring(0, truncateLim) + "...";
                }
                else {
                    childElm.innerHTML = child;
                }
                container.appendChild(childElm);
            }
            var urlElmnt = document.createElement('p');

            urlElmnt.className = "urlText";
            urlElmnt.setAttribute("url", url);
            urlElmnt.innerHTML = "more...";
            container.appendChild(urlElmnt);
        }
        else {
            var notFound = document.createElement('p');
            notFound.innerHTML = "bir sonuç bulunamadı :(";
            container.appendChild(notFound);
        }
        return container;
    }

    _childrenRemover(domElmnt) {
        while (domElmnt.firstChild) {
            domElmnt.removeChild(domElmnt.firstChild);
        }
    }
}
