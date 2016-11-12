class TranslationBubbleDoubleColumnAndRow extends TranslationBubble{

    constructor(){
        super();
        let wordsContainer = document.createElement('div');
        wordsContainer.setAttribute('class', 'dictionary-words-container');

        this.leftColumn = document.createElement('div');
        this.leftColumn.setAttribute('class', 'dictionary-leftColumn');
        wordsContainer.appendChild(this.leftColumn);

        this.rightColumn = document.createElement('div');
        this.rightColumn.setAttribute('class', 'dictionary-rightColumn');
        wordsContainer.appendChild(this.rightColumn);

        this.sentencesContainer = document.createElement('div');
        this.sentencesContainer.setAttribute('class', 'dictionary-sentences-container');

        this.bubble.appendChild(wordsContainer);
        this.bubble.appendChild(this.sentencesContainer);
    }



    showTranslationResults(selected){
        this.changeVisibility();
        let self = this;
        this.translators.forEach(function(value,i){
            let translator = TranslatorFactory.getTranslator(value);
            translator.getWords(selected,
                                self.wordLimit,
                                function(results,url) {
                                    self._createColumns(results, url, translator.logo, i);
                                });
        });
        if(this.sentenceProviders.length >= 1)
            TranslatorFactory.getSentenceProvider(value).getWords(selected,
                                                                    self.sentenceLimit,
                                                                    function(results,url) {
                                                                         self._createRow(results,url);
                                                                    });
    }

    _createColumns(results, url, logo, columnIndex){
        let element = this._createElement(results, 50, url, logo);
        if(columnIndex==0)
            this.leftColumn.appendChild(element);
        else
            this.rightColumn.appendChild(element);
    }

    _createRow(){
        let element = this._createElement(results, 50, url, logo);
        this.sentencesContainer.appendChild(element);
    }

    cleanBubble(){
        this.changeVisibility();
        this._childrenRemover(this.leftColumn);
        this._childrenRemover(this.rightColumn);
        this._childrenRemover(this.sentencesContainer);
    }
}
