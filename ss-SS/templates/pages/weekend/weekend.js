(function(){
    helper.loadTemplate('weekend', 'modules', 'weekend');
    helper.loadTemplate('today-almanac', 'modules', 'almanac');
    if(window['_Lang'] && window['_User'].activeLocation.prsntNm.length){
        helper.setContent([['weekend-title', _Lang['weekend forecast for {0}'].replace('{0}', _User.activeLocation.prsntNm)]]);
    }
    document.getElementById('event-anchor').addEventListener('lang-builder', function(){
        helper.setContent([['weekend-title', _Lang['weekend forecast for {0}'].replace('{0}', _User.activeLocation.prsntNm)]]);
    });

})();