var _Language = {}; _Lang = {}, _Locales = {};


    var eventData = document.createEvent('Event');
    eventData.initEvent('lang-builder', true, true);


    _Locales.getLocales = function(){
        return new Promise(function(resolve, reject){
            helper.getJSON('/locales.json').then(function(result){
                resolve(result);
            }, function(error){
                reject(error);
            });
        });
    };
    _Language.updateTranslations = function(){
        return new Promise(function(resolve, reject){
            var path;
            if(_User.lang == 'en-US'){
                path = '/js-src/translations/app.json';
            } else {
                path = '/js-src/translated/' + _User.lang + '/app.json';
            }
            helper.getJSON(path).then(function(result){
                _Lang = result;
                document.getElementById('event-anchor').dispatchEvent(eventData);
                resolve();
            }, function(error){
                reject(error);
            });
        });
    };

