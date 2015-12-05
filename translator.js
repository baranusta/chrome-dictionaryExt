
var Translator = function(idForLeft,idForRight,idForSentenceProvider){
  this.leftColumnTranslator = translatorFactory.getTranslator(idForLeft);
  this.rightColumnTranslator = translatorFactory.getTranslator(idForRight);
  this.sentenceProvider = translatorFactory.getSentenceProvider(idForSentenceProvider);
};

Translator.prototype.setSentenceProvider = function(sProvider){
  this.sentenceProvider = sProvider;
};

Translator.prototype.setLeftColumnTranslator = function(translatorOpt){
  this.leftColumnTranslator = translatorOpt;
};

Translator.prototype.setLeftColumnTranslator = function(translatorOpt){
  this.rightColumnTranslator = translatorOpt;
};

Translator.prototype.getMeaningForLeft = function(word,numberOfMeaning,done){
  return this.leftColumnTranslator.getWords(word,numberOfMeaning,done);
};

Translator.prototype.getMeaningForRight = function(word,numberOfMeaning,done){
  return this.rightColumnTranslator.getWords(word,numberOfMeaning,done);
};

Translator.prototype.getSentences = function(word,numberOfExample,done){
  return this.sentenceProvider.getSentences(word,numberOfExample,done);
};
