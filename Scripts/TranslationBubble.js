class TranslationBubble {

    constructor() {
        this.translators = [{ from: 0, to: 0, index: 0 }, { from: 0, to: 0, index: 1 }];
        this.sentenceProviders = [];
        this.wordLimit = 3;
        this.sentenceLimit = 2;
        this.selectedWord = "";
        this.tags = [];
        this.id = 0;
        this._createBubble();
    }

    //translator format should be in [{from: 0, to: 0, index: 0}, {from: 0, to: 0, index: 1}] form
    setPreferences(translators, sentenceProviders, numberOfWords, numberOfSentences) {
        this.translators = translators || this.translators;
        this.sentenceProviders = sentenceProviders || this.sentenceProviders;
        this.wordLimit = numberOfWords || this.wordLimit;
        this.sentenceLimit = numberOfSentences || this.sentenceLimit;
    }

    showTranslationResults(selected) {
        this.selectedWord = selected;
        this._changeVisibility();
        chrome.runtime.sendMessage({ action: "word_searched", word: this.selectedWord }, function (responseText) { });
        var i = 0;
        let self = this;
        for (var value of this.translators) {
            let index = i;
            i = i + 1;
            TranslatorFactory.getTranslator(this.translators[index])
                .getWords(self.id, selected,
                this.wordLimit,
                function (responseId, results, url) {
                    if (self.id == responseId)
                        self.buildForTranslator(index, TranslatorFactory.getTranslator(self.translators[index]), results, url);
                });
        }
        i = 0;
        for (var value of this.sentenceProviders) {
            let index = i;
            i = i + 1;
            TranslatorFactory.getSentenceProvider(value)
                .getWords(self.id, selected,
                this.sentenceLimit,
                function (responseId, results, url) {
                    self.buildForSentences(index, TranslatorFactory.getSentenceProvider(value), results, url);
                });
        }
    }

    buildForTranslator(index, translator, results, url) { }

    buildForSentences(index, sentenceProvider, results, url) { }

    renderAtNewPosition(bottom, left) {
        left -= (this.bubble.offsetWidth / 2);
        if (left < 0) {
            left = 0;
        }
        this.bubble.style.bottom = bottom + 'px';
        this.bubble.style.left = left + 'px';
    }
    
    setVisibilityAddSection(visibility){
        //TO-DO
        //this should not be only button, also tag should be changed
        this.bubble.btn.style.visibility = visibility;
    }
    
    closeBubble() {
        if (this.isVisible()) {
            this._changeVisibility();
            this._cleanContent();
            this.id += 1;
        }
    }

    isVisible() { return this.bubble.style.visibility != 'hidden'; }

    _changeVisibility() {
        this.bubble.style.visibility = !this.isVisible() ? 'visible' : 'hidden';
    }

    //has to be implemeted by the inheriting classes
    //It cleans the content
    _cleanContent() {

    }

    _createAddButton() {
        var button = document.createElement("button");
        button.innerHTML = "Add";
        button.className = "bubbleAdd";
        var self = this;
        button.addEventListener("click", function () {
            chrome.runtime.sendMessage(
                {
                    action: "add_word",
                    word: self.selectedWord
                    //Tag eklencek
                }, function (responseText) { });
        });
        return button;
    }

    _createTagSwitcher() {

    }

    _createBubble() {
        var maxZ = Math.max.apply(null,
            $.map($('body *'), function (e, n) {
                if ($(e).css('position') != 'static')
                    return parseInt($(e).css('z-index')) || 1;
            }));

        this.bubble = document.createElement('div');
        this.bubble.className = 'dictionary-bubble';
        this.bubble.style.zIndex = maxZ + 1;
        this.bubble.style.visibility = 'hidden';
        this.bubble.style.overflow = 'hidden';

        this.bubble.btn = this._createAddButton();
        this.bubble.appendChild(this.bubble.btn);
        //TODO Tag
        //this.bubble.appendChild(_createTagSwitcher());
        document.body.appendChild(this.bubble);

    }


    _createElement(elemnts, truncateLim, url, logo) {
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
                childElm.innerHTML = '<span>' + childElm.innerHTML + '<span>';
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
