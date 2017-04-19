var TranslationBubbleFactory = (function () {
    var registeredBubbles = [
        {
            value: 'twoC_oneR',
            image: './icons/back.png',
            bubble: new TranslationBubbleDoubleColumnAndRow()
        }
    ];

    return {
        getBubble: function (value) {
            for (var index = 0; index < registeredBubbles.length; index++) {
                var element = registeredBubbles[index];
                if(element.hasOwnProperty('value') && element['value'] === value)
                    return element['bubble'];
            }
        },
        bubbles: function(){
            return registeredBubbles;
        } 
    };
})();