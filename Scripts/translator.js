
var Translator = function (idForLeft, idForRight, idForSentenceProvider) {
    this.leftColumnTranslator = translatorFactory.getTranslator(idForLeft);
    this.rightColumnTranslator = translatorFactory.getTranslator(idForRight);
    this.sentenceProvider = translatorFactory.getSentenceProvider(idForSentenceProvider);
};

Translator.prototype.setSentenceProvider = function (sProvider) {
    this.sentenceProvider = sProvider;
};

Translator.prototype.setLeftColumnTranslator = function (translatorOpt) {
    this.leftColumnTranslator = translatorOpt;
};

Translator.prototype.setLeftColumnTranslator = function (translatorOpt) {
    this.rightColumnTranslator = translatorOpt;
};

Translator.prototype.getMeaningForLeft = function (word, numberOfMeaning, done, fail) {
    return this.leftColumnTranslator.getWords(word, numberOfMeaning, done, fail);
};

Translator.prototype.getMeaningForRight = function (word, numberOfMeaning, done, fail) {
    return this.rightColumnTranslator.getWords(word, numberOfMeaning, done, fail);
};

Translator.prototype.getSentences = function (word, numberOfExample, done, fail) {
    return this.sentenceProvider.getSentences(word, numberOfExample, done, fail);
};

Translator.prototype.getLogoOfLeft = function () {
    return this.leftColumnTranslator.logo
};

Translator.prototype.getLogoOfRight = function () {
    return this.rightColumnTranslator.logo
};

Translator.prototype.getLogoOfSentenceContainer = function () {
    return this.sentenceProvider.logo;
};
