/**
 * Created by ecook on 6/6/16.
 */
(function(){
    var ngRepeatMap = [
        ['js-dayPartName',        'dayPartName'],
        ['js-date',        'date'], // 'MMM d'
        ['js-wxicon',      'icon'],
        ['js-iconExended',      'iconExtended'],
        ['js-tempHi',        'tempHi'],
        ['js-tempLo',        'tempLo'],
        ['js-phrase',           'phrase'],
        ['js-precipPct',      'precipPct'],
        ['js-humidityPct',    'humidityPct'],
        ['js-uvIndex',    'uvIndex'],
        ['js-sunrise',    'sunrise'],
        ['js-sunset',    'sunset'],
        ['js-moonrise',    'moonrise'],
        ['js-moonset',    'moonset']
    ];
    /*
        What div,
        what's the template's name?,
        match data to div in the component,
        data
        do it how many times?
     */
    if(_Data.dailyForecast){
        helper.ngRepeat('ls-row-wrap-24', 'ls-24-hour-data', ngRepeatMap, _Data.dailyForecast.day, 5);
    }

    document.getElementById('event-anchor').addEventListener('builder', function() {
        console.log('STUFF...', '_User.activeLocation.prsntNm');
        helper.ngRepeat('ls-row-wrap-24', 'ls-24-hour-data', ngRepeatMap, _Data.dailyForecast.day, 5);
    });
})();