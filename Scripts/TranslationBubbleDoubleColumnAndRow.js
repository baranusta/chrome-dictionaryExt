class TranslationBubbleDoubleColumnAndRow extends TranslationBubble{

    constructor(){
        super();
        let wordsContainer = document.createElement('div');
        wordsContainer.className = "dictionary-words-container";
        wordsContainer.style.display = 'flex';
        wordsContainer.style.padding = '10px';

        this.leftColumn = document.createElement('div');
        this.leftColumn.className = "dictionary-leftColumn";
        this.leftColumn.style.position = 'relative';
        this.leftColumn.style.width = '50%';
        wordsContainer.appendChild(this.leftColumn);

        this.rightColumn = document.createElement('div');
        this.rightColumn.className = "dictionary-rightColumn";
        this.rightColumn.style.position = 'relative';
        this.rightColumn.style.width = '50%';
        this.rightColumn.style.paddingLeft = '5px';
        wordsContainer.appendChild(this.rightColumn);

        this.sentencesContainer = document.createElement('div');
        this.sentencesContainer.className = "dictionary-sentences-container";

        this.bubble.appendChild(wordsContainer);
        this.bubble.appendChild(this.sentencesContainer);
    }

    buildForTranslator(index,translator,results,url){
        this._createColumns(results, url, translator.logo, index)
    }
    
    buildForSentences(index,sentenceProvider,results,url){
        this._createRow(results,url);
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

    _cleanContent(){
        this._childrenRemover(this.leftColumn);
        this._childrenRemover(this.rightColumn);
        this._childrenRemover(this.sentencesContainer);
    }

}
