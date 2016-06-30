/**
 * Created by cgardner on 6/24/16.
 */
(function(){
    var ngRepeatMap = [
        ['js-daypartname',      'dayPartName'],
        ['phrase-td',           'phrase'],
        ['temphi-td',           'temperature'],
        ['templo-td',           'temperature'],
        ['precip-td',           'precip'],
        ['wind-td',             'windDirCompass'],
        ['humidity-td',         'rh'],
        ['uvindex-td',          'uvIndex' + ' of 10'],
        ['sunrise-td',          'sunrise'],
        ['sunset-td',           'sunset'],
        ['moonrise-td',         'moonrise'],
        ['moonset-td',          'moonset']
    ];
    /*
     What div,
     what's the template's name?,
     match data to div in the component,
     data
     do it how many times?
     */

    //(divId, componentName, dataMap, data, multiplier)

    if(_Data.dailyForecast){
        helper.ngRepeat('ls-row-wrap-10day', 'ls-10day-data', ngRepeatMap, _Data.tenDay, 10);
    }

    //document.getElementById('event-anchor').addEventListener('builder', function() {
    //    //console.log('STUFF...', '_User.activeLocation.prsntNm');
    //    console.log('STUFF...', _Data.dailyForecast);
    //    helper.ngRepeat('ls-row-wrap-10day', 'ls-10day-data', ngRepeatMap, _Data.dailyForecast, 10);
    //});
})();