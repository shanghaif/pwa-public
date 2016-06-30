var _User={loggedIn:!1,unitPref:"e",lang:"en-US",locations:[],activeLocation:{lat:"","long":"",prsntNm:""}},savedPco=window.localStorage.jStorage?JSON.parse(window.localStorage.jStorage):{};_User.loggedIn=!(!savedPco.profile||!savedPco.profile.userid),_User.webPush=savedPco.products&&savedPco.products.WebPushNotifications?savedPco.products.WebPushNotifications:{},_User.locations=savedPco.user&&savedPco.user.recentSearchLocations?savedPco.user.recentSearchLocations:[],_User.lang=savedPco.user&&savedPco.user.locale?savedPco.user.locale.replace("_","-"):"en-US",_User.unitPref=savedPco.user&&savedPco.user.unit?savedPco.user.unit:"e",window.localStorage._Stored_User?_User=JSON.parse(window.localStorage._Stored_User):window.localStorage._Stored_User=JSON.stringify(_User),!_User.activeLocation.prsntNm&&_User.locations.length>0&&(_User.activeLocation=_User.locations[0]);var saveUser=function(){window.localStorage._Stored_User=JSON.stringify(_User),savedPco.products=savedPco.products?savedPco.products:{},savedPco.products.WebPushNotifications=_User.webPush,window.localStorage.jStorage=JSON.stringify(savedPco),_Data.collectNew()};_User.setLanguage=function(e){_User.lang=e,saveUser()},_User.setUnitPreference=function(e){_User.unitPref=e,saveUser()},_User.addLocation=function(e){_User.locations.push(e),saveUser()},_User.newActiveLocation=function(e,s){_User.activeLocation.prsntNm&&s&&_User.locations.push(_User.activeLocation),_User.activeLocation=e,saveUser()},_User.updatePushNotifications=function(e){e?_User.webPush={PushStatus:"confirmNotification",timeStamp:(new Date).getTime()}:_User.webPush={PushStatus:"noPushNotification",timeStamp:(new Date).getTime()},saveUser()};
var _Locations={};!function(){var o=document.createEvent("Event");o.initEvent("builder-locations",!0,!0),_Locations.searchLocs=function(e){var t="https://dsx.weather.com/x/v2/web/loc/en_US/1/4/5/9/11/13/19/21/1000/1001/1003//us%5E/("+e+")?api=7bb1c920-7027-4289-9c96-ae5e263980bc";AjaxRequest.get({url:t,generateUniqueUrl:!1,onSuccess:function(e){var t=JSON.parse(e.responseText);_Locations.results=t[0].doc?t[0].doc:[],document.getElementById("event-anchor").dispatchEvent(o)}})},_Locations.getGeoCoordinates=function(o){if(o&&o.coords){var e=o.coords,t=e.latitude.toFixed(2),n=e.longitude.toFixed(2),a="https://dsx.weather.com/wxd/loc/"+t+","+n+"?format=json&apiKey=c1ea9f47f6a88b9acb43aba7faf389d4";AjaxRequest.get({url:a,generateUniqueUrl:!1,onSuccess:function(o){console.log(o),_User.newActiveLocation(JSON.parse(o.responseText))}})}},_Locations.callGeoLocation=function(){console.log("called"),navigator.geolocation&&navigator.geolocation.getCurrentPosition(_Locations.getGeoCoordinates)},setTimeout(function(){_User.activeLocation.prsntNm||_Locations.callGeoLocation()},100)}();
var helper={};helper.loadTemplate=function(e,t,n){var o="https://"+window.location.hostname+"/templates/"+t+"/"+n+"/"+n+".html",a="undefined"!=typeof XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");a.open("get",o,!0),a.onreadystatechange=function(){4===a.readyState&&200===a.status&&(document.getElementById(e).innerHTML=a.responseText)},a.send();var r=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript",s.src="https://"+window.location.hostname+"/templates/"+t+"/"+n+"/"+n+".js",s.onreadystatechange=n+"Run",s.onload=n+"Run",r.appendChild(s)},helper.setContent=function(e){var t=function(e){document.getElementById(e[0]).innerHTML=e[1]};if("object"==typeof e)for(var n=0;n<e.length;n++)t(e[n])},helper.empty=function(e){document.getElementById(e).innerHTML=""},helper.ngRepeat=function(e,t,n,o,a){a="all"===a?n.length:a;var r="https://"+window.location.hostname+"/templates/components/"+t+"/"+t+".html",s="undefined"!=typeof XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),l="",p=0,c=0,d=0;s.open("get",r,!0),s.onreadystatechange=function(){if(4===s.readyState&&200===s.status){var t=s.responseText;for(p=0;p<a;p++)document.getElementById(e).innerHTML+=t;for(c=0;c<n.length;c++)for(l=document.getElementsByClassName(n[c][0]),d=0;d<l.length;d++)"icon"===n[c][1]?l[d].innerHTML=getWxIcon(o[n[c][1]][d]):l[d].innerHTML=o[n[c][1]][d]}},s.send()},helper.ngRepeatReverse=function(e,t,n,o,a){a="all"===a?n.length:a;var r="templates/components/"+t+"/"+t+".html",s="undefined"!=typeof XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),l="",p=0,c=0,d=0;s.open("get",r,!0),s.onreadystatechange=function(){if(4===s.readyState&&200===s.status){var t=s.responseText;for(p=0;p<a;p++)document.getElementById(e).innerHTML+=t;for(c=0;c<n.length;c++)for(l=document.getElementsByClassName(n[c][0]),d=0;d<l.length;d++)l[d].innerHTML=o[d][n[c][1]]}},s.send()},helper.isNumeric=function(e){return"number"==typeof e&&"NaN"!==e},"undefined"!=typeof module&&module.hasOwnProperty("exports")&&(module.exports=helper);
var _Router={};!function(){_Router={page:""};var e,a={today:{name:"today",metricName:"today-forecast",title:"Your Current Conditions",pos:"1"},hourly:{name:"hourly",metricName:"hourly-forecast",title:"Your Hourly Forecast",pos:"2"},fiveday:{name:"fiveday",metricName:"5day-forecast",title:"Your Five Day Forecast",pos:"3"},tenday:{name:"tenday",metricName:"10day-forecast",title:"Your Ten Day Forecast",pos:"4"},weekend:{name:"weekend",metricName:"weekend-forecast",title:"Your Weekend Forecast",pos:"5"},map:{name:"map",metricName:"map",title:"Your Radar Map",pos:"6"}},t="";_Router.changePage=function(o){e=document.getElementsByClassName("page-nav-li");for(var r=0;r<e.length;r++)e[r].className=e[r].className.replace("active","");if(document.getElementsByClassName("page-nav-li "+o)[0].className+=" active",t=o,_Router.page!==t){_Router.page||(_Router.page="today"),_Metrics.pageLoad(a[_Router.page].metricName,a[t].metricName,a[o].pos),_Router.page=t,helper.loadTemplate("page-content","pages",t),document.title=a[o].title;var n=_User.activeLocation.lat?_User.activeLocation.lat+","+_User.activeLocation["long"]:"";history.pushState({changeTo:o},o,"/weather/"+t+"/l/"+n)}};var o=[],r=function(){history.state&&history.state.changeTo?_Router.changePage(history.state.changeTo):"/"===window.location.pathname?_Router.changePage("today"):(o=window.location.pathname.split("/"),a[o[2]]&&_Router.changePage(o[2]))};r(),window.onpopstate=function(){r()}}();
function showMainMenu(){var e=document.getElementById("pwa-header");e.className.match(".pwa-header-active")&&(e.className="header",showHide("main-search",0)),showHide("main-nav",1),showHide("loc-layout",1),showHide("category-layout",0),showHide("areas-layout",0)}function showMainSearch(){var e=document.getElementById("pwa-header");e.className.match(".pwa-header-active")?(e.className="header",showHide("main-search",0)):(e.className+=" pwa-header-active",showHide("main-search",1),showHide("saved-results",1),document.getElementById("search").value="",showHide("search-results",0)),helper.empty("recently-searched");var a=document.getElementById("recently-searched");for(var n in _User.locations)a.innerHTML+='<li class="results"><a onclick="javascript:searchResultsClicked(this, '+_User.locations[n].lat+", "+_User.locations[n]["long"]+', false)" class="dropdown-name">'+_User.locations[n].prsntNm+"</a></li>"}function searchResults(){var e=document.getElementById("search").value;if(""===e||e.length<=3)showHide("saved-results",1),showHide("search-results",0);else{showHide("saved-results",0),showHide("search-results",1);lookupLocations(e);if(void 0!==_Locations.results){var a="";for(i=0;i<_Locations.results.length;i++){var n=_Locations.results[i].geocode.split(",");a+='<li class="results"><a class="name" onclick="searchResultsClicked(this, '+n[0]+","+n[1]+', true)"> '+_Locations.results[i].cityNm+", "+_Locations.results[i].stCd+"  </a></li>"}document.getElementById("search-results-list").innerHTML=a}}}function searchResultsClicked(e,a,n,o){var c=document.getElementById("pwa-header");c.className.match(".pwa-header-active")&&(c.className="header",showHide("main-search",0)),document.getElementById("activeLocName").innerHTML=e.innerHTML,_User.newActiveLocation({lat:a,"long":n,prsntNm:e.innerHTML},o),hideMainSearch()}function clearSearch(){showHide("saved-results",1),document.getElementById("search").value="",showHide("search-results",0)}function hideMainMenu(){showHide("main-nav",0)}function hideMainSearch(){var e=document.getElementById("pwa-header");e.className.match(".pwa-header-active")&&(e.className="header",showHide("main-search",0))}function showTemperature(e){if(!e.className.match("active")){var a=document.getElementsByClassName("temp-red");for(i=0;i<a.length;i++)a[i].className="temp-red";e.className+=" active","°C"===e.innerHTML?(_User.setUnitPreference("m"),_Metrics.clickTrack(e,_Router.page,"menu","celsius")):(_User.setUnitPreference("e"),_Metrics.clickTrack(e,_Router.page,"menu","fahrenheit"))}}function pwaNavClicked(e){var a=window.innerWidth,n=e.clientX,o=document.getElementsByClassName("menubar")[0].clientWidth,c=.3*a,d=.7*a;n<c?document.getElementsByClassName("nav-suite")[0].scrollLeft="0":n>d&&(document.getElementsByClassName("nav-suite")[0].scrollLeft=o-a)}function changeNav(e){if(document.getElementById("main-search").style.display="none",!e.className.match("active")){var a=document.getElementsByClassName("page-nav-li");for(i=0;i<a.length;i++)a[i].className="page-nav-li";e.className+=" active"}_Router.changePage(e.textContent)}function showLocations(){showHide("loc-layout",1),showHide("category-layout",0),showHide("areas-layout",0)}function showCategories(){var e="";for(c=0;c<categories.length;c++)e+='<li ><a href="#" onclick="showAreas(this,'+c+')"><span >'+categories[c].catName+'</span> <span class="wx-iconfont-global wx-icon-arrow-right wx-icon-small"></span></a></li>';document.getElementById("lang-categories").innerHTML=e,showHide("loc-layout",0),showHide("category-layout",1),showHide("areas-layout",0)}function showAreas(e,a){var n="";for(l=0;l<categories[a].countryName.length;l++)n+='<li><a href="#"><span> '+categories[a].countryName[l].name+" </span> <span>"+categories[a].countryName[l].code+"</span> </a></li>";document.getElementById("country-languages").innerHTML=n,document.getElementById("area-value").innerHTML=e.innerHTML,showHide("loc-layout",0),showHide("category-layout",0),showHide("areas-layout",1)}function showHide(e,a){0===a?document.getElementById(e).style.display="none":document.getElementById(e).style.display="block"}function lookupLocations(e){e&&e.length&&e.length>3&&_Locations.searchLocs(e)}function getGeolocation(){navigator.geolocation&&navigator.geolocation.getCurrentPosition(showPosition)}function showRecentlySearched(){downArrayClicked===!1?(showHide("drop-down-array-list",1),downArrayClicked=!0):(showHide("drop-down-array-list",0),downArrayClicked=!1)}var downArrayClicked=!1,categories=[{catName:"Americas",countryName:[{name:"Antigua and Barbuda",code:""},{name:"Argentina",code:""},{name:"Bahamas",code:""},{name:"Barbados",code:""},{name:"Belize",code:""},{name:"Bolivia",code:""},{name:"Brazil",code:""},{name:"Canada",code:"EN"},{name:"Canada",code:"FR"},{name:"Chile",code:""},{name:"Colombia",code:""},{name:"Costa Rica",code:""},{name:"Dominica",code:""},{name:"Dominican Republic",code:""},{name:"Ecuador",code:""},{name:"El Salvador",code:""},{name:"Grenada",code:""},{name:"Guatemala",code:""},{name:"Guyana",code:""},{name:"Haiti",code:""},{name:"Honduras",code:""},{name:"Jamaica",code:""},{name:"Mexico",code:""},{name:"Nicaragua",code:""},{name:"Panama",code:""},{name:"Panama",code:""},{name:"Paraguay",code:""},{name:"Peru",code:""},{name:"St. Kitts and Nevis",code:""},{name:"St. Lucia",code:""},{name:"St. Vincent and the Grenadines",code:""},{name:"Suriname",code:""},{name:"Trinidad and Tobago",code:""},{name:"Uruguay",code:""},{name:"Venezuela",code:""}]},{catName:"Africa",countryName:[{name:"Algeria",code:""},{name:"Algeria",code:""},{name:"Benin",code:""},{name:"Burkina Faso",code:""},{name:"Burundi",code:""},{name:"Cameroon",code:""},{name:"Cameroon",code:""},{name:"Cape Verde",code:""},{name:"Central African Republic",code:""},{name:"Chad",code:""},{name:"Chad",code:""},{name:"Chile",code:""},{name:"Comoros",code:""},{name:"Comoros",code:""},{name:"Congo, Democratic Republic of the",code:""},{name:"Congo, Republic of",code:""},{name:"Costa Rica",code:""},{name:"Côte d'Ivoire",code:""},{name:"Djibouti",code:""},{name:"Djibouti",code:""},{name:"Egypt",code:""},{name:"Equatorial Guinea",code:""},{name:"Eritrea",code:""},{name:"Gabon",code:""},{name:"Gambia",code:""},{name:"Ghana",code:""},{name:"Guinea",code:""},{name:"Guinea-Bissau",code:""},{name:"Kenya",code:""},{name:"Lesotho",code:""},{name:"Liberia",code:""},{name:"Libya",code:""},{name:"Madagascar",code:""},{name:"Mali",code:""},{name:"Mauritania",code:""},{name:"Mauritius",code:""},{name:"Mauritius",code:""},{name:"Morocco",code:""},{name:"Morocco",code:""},{name:"Mozambique",code:""},{name:"Namibia",code:""},{name:"Niger",code:""},{name:"Nigeria",code:""},{name:"Rwanda",code:""},{name:"Rwanda",code:""},{name:"São Tomé and Príncipe",code:""},{name:"Senegal",code:""},{name:"Sierra Leone",code:""},{name:"Somalia",code:""},{name:"South Africa",code:""},{name:"South Sudan",code:""},{name:"Sudan",code:""},{name:"Swaziland",code:""},{name:"Tanzania",code:""},{name:"Tunisia",code:""},{name:"Uganda",code:""}]},{catName:"Asia Pacific",countryName:[{name:"Australia",code:""},{name:"Bangladesh",code:""},{name:"Brunei",code:""},{name:"China",code:""},{name:"China",code:""},{name:"East Timor",code:""},{name:"Fiji",code:""},{name:"India (English)",code:""},{name:"India (Hindi)",code:""},{name:"Indonesia",code:""},{name:"Japan",code:""},{name:"Kiribati",code:""},{name:"Korea, North",code:""},{name:"Korea",code:""},{name:"Kyrgyzstan",code:""},{name:"Laos",code:""},{name:"Malaysia",code:""},{name:"Marshall Islands",code:""},{name:"Micronesia",code:""},{name:"New Zealand",code:""},{name:"Palau",code:""},{name:"Philippines",code:""},{name:"Philippines",code:""},{name:"Samoa",code:""},{name:"Singapore",code:""},{name:"Singapore",code:""},{name:"Solomon Islands",code:""},{name:"Taiwan",code:""},{name:"Thailand",code:""},{name:"Tonga",code:""},{name:"Tuvalu",code:""},{name:"Vanuatu",code:""},{name:"Vanuatu",code:""},{name:"Vietnam",code:""}]},{catName:"Europe",countryName:[{name:"Andorra",code:""},{name:"Andorra",code:""},{name:"Angola",code:""},{name:"Austria",code:""},{name:"Belarus",code:""},{name:"Belgium",code:""},{name:"Belgium",code:""},{name:"Bosnia and Herzegovina",code:""},{name:"Croatia",code:""},{name:"Cyprus",code:""},{name:"Czech Republic",code:""},{name:"Denmark",code:""},{name:"Estonia",code:""},{name:"Finland",code:""},{name:"France",code:""},{name:"Greece",code:""},{name:"Hungary",code:""},{name:"Iceland",code:""},{name:"Iceland",code:""},{name:"Ireland",code:""},{name:"Italy",code:""},{name:"Latvia",code:""},{name:"Liechtenstein",code:""},{name:"Luxembourg",code:""},{name:"Malta",code:""},{name:"Monaco",code:""},{name:"Netherlands",code:""},{name:"Norway",code:""},{name:"Poland",code:""},{name:"Portugal",code:""},{name:"Romania",code:""},{name:"Russia",code:""},{name:"San Marino",code:""},{name:"Slovakia",code:""},{name:"Spain (Spanish)",code:""},{name:"Spain (Catalan)",code:""},{name:"Sweden",code:""},{name:"Switzerland",code:""},{name:"Turkey",code:""},{name:"Ukraine",code:""},{name:"Vatican City (Holy See)",code:""}]},{catName:"Middle East",countryName:[{name:"Bahrain",code:""},{name:"Iran",code:""},{name:"Iraq",code:""},{name:"Israel",code:""},{name:"Jordan",code:""},{name:"Kazakhstan",code:""},{name:"Kuwait",code:""},{name:"Lebanon",code:""},{name:"Oman",code:""},{name:"Pakistan",code:""},{name:"Pakistan",code:""},{name:"Qatar",code:""},{name:"Saudi Arabia",code:""},{name:"Syria",code:""},{name:"United Arab Emirates",code:""}]}],recentLocsMap=[["dropdown-name","prsntNm"]];document.getElementById("event-anchor").addEventListener("builder",function(){var e=[["activeLocTemp",_Data.obs.temperature],["activeLocName",_User.activeLocation.prsntNm]];helper.setContent(e)});

/*nothing*/
var _Data={};!function(){var a="https://api.weather.com/v2/turbo/vt1fifteenminute;vt1hourlyForecast;vt1precipitation;vt1currentdatetime;vt1pollenforecast;vt1dailyForecast;vt1observation;vt1alerts?units="+_User.unitPref+"&language="+_User.lang+"&geocode="+_User.activeLocation.lat+","+_User.activeLocation["long"]+"&format=json&apiKey=c1ea9f47f6a88b9acb43aba7faf389d4",t=document.createEvent("Event"),e=document.createEvent("Event");e.initEvent("astro-builder",!0,!0),t.initEvent("builder",!0,!0),_Data.collectNew=function(){AjaxRequest.get({url:a,generateUniqueUrl:!1,onSuccess:function(a){var e=JSON.parse(a.responseText);_Data.obs=e.vt1observation,_Data.datetime=e.vt1currentdatetime,_Data.dailyForecast=e.vt1dailyForecast,_Data.pollenforecast=e.vt1pollenforecast,_Data.precipitation=e.vt1precipitation,_Data.fifteen=e.vt1fifteenminute,_Data.hourly=e.vt1hourlyForecast,n(),document.getElementById("event-anchor").dispatchEvent(t)}})},_User.activeLocation.prsntNm&&_Data.collectNew();var r=function(a){var t=new Date(a),e=t.getHours(),r=t.getMinutes();0===r&&(r="00");var i="AM";return 12===e&&(i="PM"),e>12&&(e-=12,i="PM"),0===e&&(e=12),e+":"+r+" "+i},i=function(a){var t=["Sun","Mon","Tue","Wed","Thur","Fri","Sat"],e=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],r=new Date(a);return t[r.getDay()]+", "+e[r.getMonth()]+" "+r.getDate()},n=function(){_Data.hourly.time=[],_Data.hourly.date=[],_Data.lookingAhead=o();for(var a in _Data.hourly.processTime)_Data.hourly.time[a]=r(_Data.hourly.processTime[a]),_Data.hourly.date[a]=i(_Data.hourly.processTime[a])},o=function(){var a=_Data.dailyForecast,t=[];return t=null===a.day.dayPartName[0]?[{daypartName:a.night.dayPartName[0],highLow:"Low",phrase:a.night.phrase[0],wxicon:getWxIcon(a.night.icon[0]),temperature:a.night.temperature[0],narrative:a.night.narrative[0],precip:a.night.precipPct[0]},{daypartName:a.day.dayPartName[1],highLow:"High",phrase:a.day.phrase[1],wxicon:getWxIcon(a.day.icon[1]),temperature:a.day.temperature[1],narrative:a.day.narrative[1],precip:a.day.precipPct[1]},{daypartName:a.night.dayPartName[1],highLow:"Low",phrase:a.night.phrase[1],wxicon:getWxIcon(a.night.icon[1]),temperature:a.night.temperature[1],narrative:a.night.narrative[1],precip:a.night.precipPct[1]}]:[{daypartName:a.day.dayPartName[0],highLow:"High",phrase:a.day.phrase[0],wxicon:getWxIcon(a.day.icon[0]),temperature:a.day.temperature[0],narrative:a.day.narrative[0],precip:a.day.precipPct[0]},{daypartName:a.night.dayPartName[0],highLow:"Low",phrase:a.night.phrase[0],wxicon:getWxIcon(a.night.icon[0]),temperature:a.night.temperature[0],narrative:a.night.narrative[0],precip:a.night.precipPct[0]},{daypartName:a.day.dayPartName[1],highLow:"High",phrase:a.day.phrase[1],wxicon:getWxIcon(a.day.icon[1]),temperature:a.day.temperature[1],narrative:a.day.narrative[1],precip:a.day.precipPct[1]}]}}();
var _WXICON={"00":"tornado","01":"tropical-storm","02":"tropical-storm","03":"thunderstorm","04":"thunderstorm","05":"rain-snow","06":"precip-wintry-mix","07":"precip-wintry-mix","08":"freezing-drizzle","09":"light-rain",10:"freezing-drizzle",11:"rain",12:"rain",13:"flurries",14:"snow",15:"blowing-snow",16:"snow",17:"hail",18:"precip-wintry-mix",19:"fog",20:"fog",21:"fog",22:"fog",23:"wind",24:"wind",25:"sunny",26:"cloudy",27:"mostly-cloudy",28:"mostly-cloudy",29:"partly-cloudy",30:"partly-cloudy",31:"sunny",32:"sunny",33:"sunny",34:"sunny",35:"rain-hail",36:"sunny",37:"thunderstorm",38:"thunderstorm",39:"rain",40:"rain",41:"snow",42:"snow",43:"blowing-snow",44:"na",45:"rain",46:"snow",47:"thunderstorm"};