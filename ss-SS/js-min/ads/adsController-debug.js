/**
 * Created by aparekh on 6/20/16.
 */


window.googletag = window.googletag || {}; // Google DFP
googletag.cmd = googletag.cmd || [];


// SETUP AD CONTROLLER

(function($$) {

    // Always load mobile for now.
    var isMobile = window.innerWidth < 768;
    var isTablet = window.innerWidth > 769 && window.innerWidth < 1025;
    var isDesktop = window.innerWidth > 1024;
    var adstest = $$.utils.getCookie('adstest');
    var network, adUnit, adZone, NCTAU, NCAU, adMapping, metrics_suite;

    setupFV();
    getWXData();
    loadOpenX();
    getAdUnitAndMetricsSuite();

    /************** Private Functions **************/
    function loadNewAds() {
        addCust_Params();
        googletag.cmd.push(function () {
            googletag.destroySlots();
            window.ls_dfp_slots = []; // Index-Exchange header bidder
            getAdZone();
            setUpAds();
            Promise.all([$$.Promises.wfxtgPromise.promise,
                $$.Promises.amznSlotsPromise.promise,
                $$.Promises.criteoPromise.promise,
                $$.Promises.weatherDataPromise.promise,
                $$.Promises.jsonReady.promise]).then(function () {
               // console.log("all promises done: ", new Date().getTime() - window.renderStartTime);
                displayAds(true);
            });
        });
    }

    document.addEventListener('load-ads', function(obj) {
        loadNewAds()
    });

    function setUpAds() {
        var selector = isMobile ? '[id^="MW_"]' : '[id^="WX_"]';
        var adDivs = document.querySelectorAll(selector);
        adDivs.forEach(function (el) {
            setAd(el);
        });
    }

    function setAd(el) {
        var adpositions = $$.adsMetricsMaps.adpositions;
        var id = el.getAttribute('id');
        var screen = isMobile && 'mobile' || 'desktop';
        googletag.cmd.push(function () {
            var slot = googletag.defineSlot(NCTAU, adpositions[screen][id].sizes, id)
              .addService(googletag.pubads())
              .setTargeting("pos", adpositions[screen][id].pos);
            window.ls_dfp_slots.push(slot);
        });
    }

    function displayAds(enable) {
        var selector = isMobile ? '[id^="MW_"]' : '[id^="WX_"]';
        var adDivs = document.querySelectorAll(selector);
        for (var p in $$.custParams) {
            if ($$.custParams.hasOwnProperty(p)) {
                googletag.pubads().setTargeting(p, $$.custParams[p]);
            }
        }
        if (enable) {
            googletag.pubads().enableSingleRequest();
            googletag.enableServices();
        }

        if (typeof index_headertag_lightspeed !== 'undefined') {
            var cb = (function (adDivs, ls_dfp_slots) {
                return function () {
                    index_headertag_lightspeed.set_slot_targeting(ls_dfp_slots)
                    for (f = 0; f < adDivs.length; f++) {
                        if (document.getElementById(adDivs[f].getAttribute('id'))) {
                            googletag.display(adDivs[f].getAttribute('id'));
                        }
                    }
                    document.getElementById("windowshade_info").innerHTML = "Pubads Call Time : " + (new Date().getTime() - window.renderStartTime) / 1000 + " secs";
                    console.dir("Pubads Call Time : " + (new Date().getTime() - window.renderStartTime) / 1000 + "secs");
                };
            })(adDivs, window.ls_dfp_slots);
            index_headertag_lightspeed.add_session_end_hook(cb, true);
            index_headertag_lightspeed.refresh();

        } else {
            adDivs.forEach(function (el) {
                displayAd(el);
            });
            document.getElementById("windowshade_info").innerHTML = "Pubads Call Time : " + (new Date().getTime() - window.renderStartTime) / 1000 + " secs";
            console.dir("Pubads Call Time : " + (new Date().getTime() - window.renderStartTime) / 1000 + "secs");
        }
    }

    function displayAd(el) {
        var id = el.getAttribute('id');
        googletag.display(id);
    }

    function loadOpenX(){
        var nc = isMobile && '7646-weatherMW' || '7646-weatherBW';
        var src = "//ox-d.weatherus.servedbyopenx.com/w/1.0/jstag?nc=" + nc;
        var openx = document.createElement('script');
        var node = document.getElementsByTagName('script') && document.getElementsByTagName('script')[0];
        openx.src = src;
        openx.async = true;
        node.parentNode.insertBefore(openx, node);
    }

    function getAdUnitAndMetricsSuite() {
        $$.Promises.jsonReady.promise.then(function() {
            var adsMetricsMaps = $$.adsMetricsMaps;
            var savedPco = window.localStorage.jStorage ? JSON.parse(window.localStorage.jStorage) : {};
            var locale = location.href.match(/[a-z]{2}-[A-Z]{2}/);
            locale = locale && locale[0] || 'en-US';


            /** ad unit */
            adUnit = isDesktop && adsMetricsMaps.localeToAdUnitMap[locale].desktop ||
              isTablet && adsMetricsMaps.localeToAdUnitMap[locale].tablet ||
              adsMetricsMaps.localeToAdUnitMap[locale].mobile;
            adUnit = adstest ? 'test_' + adUnit : adUnit;

            /** ad zone */
            getAdZone();

            /** metrics suite **/
            metrics_suite = adsMetricsMaps.localeToAdUnitMap[locale].metrics ? adsMetricsMaps.localeToAdUnitMap[locale].metrics : 'twcigls';
        });
    }

    function getAdZone() {
        var savedPco = window.localStorage.jStorage ? JSON.parse(window.localStorage.jStorage) : {};
        var locale = savedPco.user && savedPco.user.locale ? savedPco.user.locale.replace('_', '-') : "en-US";
        var urlZone = location.pathname.match(/\/(weather\/.*?)\//);
        var network = "/" + $$.adsMetricsMaps.localeToAdUnitMap[locale].network + "/";
        urlZone = urlZone && urlZone.length > 1 && urlZone[1];
        adZone = $$.adsMetricsMaps.urlToAdZone[urlZone] && $$.adsMetricsMaps.urlToAdZone[urlZone].adZone || '/local_forecasts/today';
        NCTAU = network + adUnit + adZone;
        NCAU = network + adUnit;
    }

    function addCust_Params() {
        $$.custParams = $$.custParams || {};
        $$.Promises.jsonReady.promise.then(function() {
            var urlZone = location.pathname.match(/\/(weather\/.*?)\//);
            urlZone = urlZone && urlZone.length > 1 && urlZone[1];
            var brwsrWidth = window.innerWidth;
            $$.custParams.ad_unit = encodeURIComponent(NCAU);
            $$.custParams.browser = getBrowser();
            $$.custParams.cat = "fcst";
            $$.custParams.ch = "fcst";
            $$.custParams.fam = "fcst";
            $$.custParams.par = $$.utils.getParameterByName("par");
            $$.custParams.vw = $$.utils.getCookie('fv');
            $$.custParams.tf = $$.adsMetricsMaps.urlToAdZone[urlZone] && $$.adsMetricsMaps.urlToAdZone[urlZone].timeframe;

            $$.custParams.plat = brwsrWidth < 768 && 'wx_mw' ||
              brwsrWidth >= 768 && brwsrWidth < 1025 && 'wx_tab' ||
              brwsrWidth > 1024 && 'wx';


        });

        if (adstest) {
            $$.custParams['adstest'] = adstest;
        }
    }

    document.getElementById('event-anchor').addEventListener('builder', function respond() {
        var loc = _User.activeLocation;
        $$.custParams = $$.custParams || {};
        $$.custParams.cc = loc.cntryCd;
        $$.custParams.cnty = loc.cntyNm;
        $$.custParams.ct = loc.cityNm;
        $$.custParams.dma = '' + loc.dmaCd;
        $$.custParams.env = "" + Math.floor(Math.random()*(10-0)+1);

        if (loc.locType === 4) {
            $$.custParams.ent =  'zip';
        } else if (loc.locType === 1) {
            $$.custParams.ent = 'city';
        }

        $$.custParams.intl = loc._gprId;
        $$.custParams.lang = _User.lang && _User.lang.split('-')[0];
        $$.custParams.lat = '' + loc.lat;

        // targeting by locid requires locId$locType for all locTypes except 4
        $$.custParams.loc = (loc.locType !== 4) ? loc.locId + '$' + loc.locType : loc.locId;
        $$.custParams.locale = _User.lang;
        $$.custParams.lon = '' + loc.long;
        $$.custParams.st = loc.stCd;
        $$.custParams.zip = loc.zipCd;

    });
    document.getElementById('event-anchor').addEventListener('builder-alert', function(){
        $$.custParams = $$.custParams || {};
        var pollen = window._Alert && _Alert.priority && _Alert.priority.type === "pollen" &&
          _Alert.priority.severity;
        var bulletins = window._Alert && _Alert.bulletins, i,
            l, bulletinStrArry = [], bulletinsStr, finalSev=[];
        $$.custParams.plln = (!pollen && "nl") ||
          (pollen && pollen < 2 && "lo") ||
          (pollen && pollen >= 4 && "hi") || "me";
        if (bulletins) {
            for( i = 0, l = bulletins.length; i < l; i++) {
                if (bulletins[i].fromStr.match(/fld/i)){
                   finalSev.push('fld');
                } else if (bulletins[i].fromStr.match(/trop/i)){
                    finalSev.push('trop');
                } else if (bulletins[i].fromStr.match(/oth/i)){
                    finalSev.push('oth');
                } else if (bulletins[i].fromStr.match(/thdr/i)){
                    finalSev.push('thdr');
                } else if (bulletins[i].fromStr.match(/tor/i)){
                    finalSev.push('tor');
                } else if (bulletins[i].fromStr.match(/wint/i)){
                    finalSev.push('wint');
                }
            }
            if ($$.custParams.sev && finalSev.length > 0) {
                $$.custParams.sev = $$.custParams.sev + "," + finalSev.join(',');
            } else if (!$$.custParams.sev){
                $$.custParams.sev = finalSev.join(',');
            }
        }

    });

    document.getElementById('event-anchor').addEventListener('builder-content', function(){
        $$.custParams = $$.custParams || {};
        var mode = window._Content && _Content.mode && _Content.mode.mode &&
          ((_Content.mode.mode === 'normal' && 'n') || _Content.mode.mode === 'severe2' && 'y');
        if ($$.custParams.sev) {
            $$.custParams.sev = mode + ',' + $$.custParams.sev;
        } else {
            $$.custParams.sev = mode;
        }
    });



    function getBrowser() {
        var userAgent = navigator && navigator.userAgent,
            browser = userAgent && userAgent.match(/chrome|firefox|safari|trident/i),
            brwsr='unknown';
        if (browser && typeof browser === 'object' && browser.length && browser.length > 0) {
            switch (browser[0].toLowerCase()) {

                case 'chrome':
                    brwsr = 'twcchrome';
                    break;
                case 'firefox':
                    brwsr = 'twcff';
                    break;
                case 'safari':
                    brwsr = 'twcsafari';
                    break;
                case 'trident':
                    brwsr = 'twcie';
                    break;
                default:
                    brwsr = 'twcnative';
            }
        }
        return brwsr;
    }

    function extend(){
        for(var i=1; i<arguments.length; i++) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    function setupFV() {
        var fv = $$.utils.getCookie('fv'),
          expires = new Date(new Date().getTime() + (30 * 60 * 1000)), // 30 minutes
          domain = document.domain;
        if (fv) {
            fv = ( fv == 1 || fv == 2) ? ++fv : -1;
        }
        else {
            fv = 1;
        }
        expires = expires.toUTCString();
        document.cookie = 'fv=' + fv + '; expires=' + expires + ';path=/';
    }


    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

   // GET WEATHER DATA FOR CUST PARAMS
    function getWXData(){

        function convertTemp(temp, unit) {
            return (unit === 'e') ? Math.round((temp - 32) * 5 / 9) /*F to C*/: Math.round((temp * 9 / 5) + 32) /*C to F*/;
        }

        function getCond(val){
            if([31,33].indexOf(val) != -1)                          { return "clr";   }
            else if([26,27,28,29,30].indexOf(val) != -1)            { return "cld";   }
            else if([1,2,5,6,9,11,12,39,40,45].indexOf(val) != -1)  { return "rain";  }
            else if([13,14,15,16,41,42,43,46].indexOf(val) != -1)   { return "snow";  }
            else if([7,8,10,18].indexOf(val) != -1)                 { return "ice";   }
            else if([32,34,36].indexOf(val) != -1)                  { return "sun";   }
            else if([0,3,4,17,35,37,38,47].indexOf(val) != -1)      { return "thdr";  }
        }

        function getTempInc(val, scale) {
            if (typeof scale === 'undefined') {
                return 'fnnl';
            }

            if (scale === 'f') {
                if(typeof val === "undefined") { return "fnnl";}
                if (val<20){                     return "fnnl";}
                else if (val>=20 && val<=24){   return "20l"; }
                else if (val>=25 && val<=29){   return "20h"; }
                else if (val>=30 && val<=34){   return "30l"; }
                else if (val>=35 && val<=39){   return "30h"; }
                else if (val>=40 && val<=44){   return "40l"; }
                else if (val>=45 && val<=49){   return "40h"; }
                else if (val>=50 && val<=54){   return "50l"; }
                else if (val>=55 && val<=59){   return "50h"; }
                else if (val>=60 && val<=64){   return "60l"; }
                else if (val>=65 && val<=69){   return "60h"; }
                else if (val>=70 && val<=74){   return "70l"; }
                else if (val>=75 && val<=79){   return "70h"; }
                else if (val>=80 && val<=84){   return "80l"; }
                else if (val>=85 && val<=89){   return "80h"; }
                else if (val>=90 && val<=94){   return "90l"; }
                else if (val>=95 && val<=100){  return "90h"; }
                else if (val>100){               return "fpnl";}
                return "fnnl";
            } else if (scale === 'c') {
                if (typeof val === 'undefined') {
                    return 'cnnl';
                }
                var tempCVal = "cpnl";
                if(val > 60){ tempCVal = "cpnl"; }
                else if(val %2 == 0 && val >=0){ tempCVal = (val + 1) + "ci"; }
                else if(val %2 != 0 && val >=0){ tempCVal = val + "ci"; }
                else if(val %2 == 0 && val <0 && val > -9){ tempCVal = (val * -1) + "nci"; }
                else{ tempCVal = "cnnl"; }
                return tempCVal;
            }


        }

        function temp(val) {
            if(typeof val === 'object' && val.length === 2) {
                var tmpF = val[0], tmpC = val[1];
                // set temperature increments
                var tempFVal = getTempInc(tmpF, 'f');

                // set fahrenheit unit
                var fUnit = (tmpF >= 0) ? (tmpF + "f") : ((tmpF * -1) + "nf");

                // set celsius unit
                var cUnit = (tmpC >= 0) ? (tmpC + "c") : ((tmpC * -1) + "nc");

                // set celsius increments
                var tempCVal = "cpnl";
                if(tmpC > 60){ tempCVal = "cpnl"; }
                else if(tmpC %2 == 0 && tmpC >=0){ tempCVal = (tmpC + 1) + "ci"; }
                else if(tmpC %2 != 0 && tmpC >=0){ tempCVal = tmpC + "ci"; }
                else if(tmpC %2 == 0 && tmpC <0 && tmpC > -9){ tempCVal = (tmpC * -1) + "nci"; }
                else{ tempCVal = "cnnl"; }

                return (tempFVal + "," + fUnit + "," + cUnit + "," + tempCVal);
            }
            return val;
        }

        function tempR(obj) {
            var scale = obj.scale;
            var val = obj.val;

            if (scale === 'c') {
                val = val * 9 / 5 + 32;
            }

            if(typeof val === "undefined"){ return "nl"; }
            if (val<=31){ return "icy"; }
            else if (val >= 32 && val <= 40){   return "cold";  }
            else if (val >= 41 && val <= 55){   return "thaw";  }
            else if (val >= 56 && val <= 69){   return "cool";  }
            else if (val >= 70 && val <= 79){   return "mod";   }
            else if (val >= 80 && val <= 89){   return "warm";  }
            else if (val >= 90 && val <= 100){  return "hot";   }
            else if (val>=101){                 return "xhot";  }
        }

        function tempRC(obj) {
            var val = obj.val;

            if(typeof val === "undefined"){ return "nl"; }
            if (val<=0){ return "icy"; }
            else if (val >= 1 && val <= 4){   return "cold";  }
            else if (val >= 5 && val <= 12){   return "thaw";  }
            else if (val >= 13 && val <= 20){   return "cool";  }
            else if (val >= 21 && val <= 25){   return "mod";   }
            else if (val >= 26 && val <= 31){   return "warm";  }
            else if (val >= 32 && val <= 38){  return "hot";   }
            else if (val>=39){                 return "xhot";  }
        }

        function snw(val) {
            if (val >= 1 && val < 3){ return "1"; }
            else if (val >=3){ return "3"; }
        }
        function snowR(val) {
            if(typeof val === "undefined"){   return "nl";  }
            if (val >= 1 && val < 3){ return "1";   }
            else if (val >=3){        return "3";   }
            return "nl";
        }

        function hum(val) {
            return ((val >= 61) ? "hi" : "lo");
        }
        function wind(val) {
            if (val >= 6 && val <= 29) {
                return "lo";
            }
            else if(val >= 30) {
                return "hi";
            }
        }
        function uv(val) { if(val >= 5){ return "hi";} else {return "nl"}}

        function getSevere(alerts, $) {
            if(alerts && $.isArray(alerts) && alerts.length > 0) {
                var alertsInfo = [];
                for(var idx= 0, len=alerts.length; idx < len; idx++) {
                    var alert = alerts[idx];
                    if(alert && 'BEHdr' in alert && 'bEvent' in alert.BEHdr) {
                        var alertEventMetaData = alert.BEHdr.bEvent;
                        if('eSgnfcnc' in alertEventMetaData && 'ePhenom' in alertEventMetaData) {
                            var phenomena = alertEventMetaData.ePhenom;
                            var significance = alertEventMetaData.eSgnfcnc;
                            var alertMap = [
                                {
                                    regex : /(^|\s)(CF|LS|FA|FL|EL|FF|HY|TS|RP|TCL|TCO|TGR|TLM|TRA|TCW)(\s|$)/,
                                    key   : "fld"
                                },
                                {
                                    regex : /(^|\s)(HU|HI|TI|TR|TTP|TY)(\s|$)/,
                                    key   : "trop"
                                },
                                {
                                    regex : /(^|\s)(WC|SU|EW|FG|MF|AF|MH|BW|DS|DU|EC|EH|EW|FG|MF|FR|FW|FZ|GL|HF|HT|HW|HZ|LO|LW|MA|SE|MS|SM|UP|WI|ZF|TAD|TCA|TTW|TCD|TCE|TEQ|TEV|TLC|TLA|RB|SC|SI|SW|TNM|TST|TNS|TNU|TOF|TRE|TRF|TRH|TSS|TSG|TSL|TSP|TSF|TNO|TVO|TZO|TOZ|TAQ|TAP|TWA|THT|TFF|TWX)(\s|$)/,
                                    key   : "oth"
                                },
                                {
                                    regex : /(^|\s)(SV|SW|SR|TLM|TSA|TRA|TTS)(\s|$)/,
                                    key   : "thdr"
                                },
                                {
                                    regex : /(^|\s)(TO)(\s|$)/,
                                    key   : "tor"
                                },
                                {
                                    regex : /(^|\s)(BZ|HS|IS|LB|LE|WS|ZR|TAV|WW|TSI|TFA|TLT|TAA)(\s|$)/,
                                    key   : "wint"
                                }
                            ];
                            for(var aidx=0, alen=alertMap.length; aidx < alen; aidx++) {
                                if(phenomena.match(alertMap[aidx].regex)) {
                                    var key = alertMap[aidx].key;
                                    alertsInfo.push(key);
                                    alertsInfo.push(key + phenomena + significance);
                                    break;
                                }
                            }
                        }
                    }
                }
                return alertsInfo;
            }
            return "nl";
        }
        function baro(val) {
            if(val == 0) { return "stdy"; }
            else if(val == 1) { return "rsng";  }
            else if(val == 2) { return "fllng"; }
        }
        function getPollen(pollen) {
            var p = pollen;
            var highVal = [].concat( ((p.tree || [])[0] || []), ((p.weed || [])[0] || []), ((p.grass || [])[0] || []) );
            if (highVal.length > 0) {
                highVal = Math.max.apply(null,highVal);
            } else {
                highVal = "nl";
            }
            if( isNaN(highVal) ) {return 'nl';}
            else if (highVal >= 4 ) {return 'hi';}
            else if (highVal < 2 ) {return 'lo';}
            else { return 'me';}
        }



        // Wait for Data call to resolve
        document.addEventListener('builder', function() {
         //   console.log("Data", _Data);
            if(_Data && _Data.obs){
                var obs = _Data.obs;
                var units, tempF, tempC, feelsLikeF, feelsLikeC, secondsToCache = 0;
                units = _User && _User.unitPref || "m";
                tempF = (units === 'e') ? obs.temperature : convertTemp(obs.temperature, units);
                tempC = (units === 'm') ? obs.temperature : convertTemp(obs.temperature, units);
                feelsLikeF = (units === 'e') ? obs.feelsLike : convertTemp(obs.feelsLike, units);
                feelsLikeC = (units === 'm') ? obs.feelsLike : convertTemp(obs.feelsLike, units);

                $$.custParams = $$.custParams || {};
                $$.custParams["hmid"] = hum(obs.humidity);
                $$.custParams["wind"] = wind(obs.windSpeed);
                $$.custParams["uv"] = uv(obs.uvIndex);
                $$.custParams["tmp"] = temp([tempF,tempC]);
                $$.custParams["tempc"] = tempC + '';
                $$.custParams["tempr"] = tempR({
                    val: tempF + ''
                });
                $$.custParams["temprc"] = tempRC({
                    val: tempC + ''
                });
                $$.custParams['fltmpf'] = feelsLikeF+ '';
                $$.custParams['fltmpc'] = feelsLikeC+ '';
                if (obs.iconExt) {
                    $$.custParams["wxExtIcon"] = obs.iconExt+ ''; /*not in turbo data. not needed per Pavan.*/
                }
                $$.custParams["cnd"] = getCond(obs.icon);
                $$.custParams["baro"] = baro(obs.barometerCode);
                $$.custParams["snw"] = snw(obs.snowDepth);


            }

            if(_Data && _Data.dailyForecast){
                var fcst={},prcp = {},cond={},highTemp, lowTemp, highTempC, lowTempC, highSnow,
                  day, night, prcp3Day, prcp3Night, cond3Day, cond3Night, dIdx, nIdx, nCurrent, dCond, nCond;

                prcp.prcpStr = "";
                var dailyForecast = _Data.dailyForecast;
                day = dailyForecast.day;
                night = dailyForecast.night;
                /* extract precip params */
                prcp3Day = day.precipPct.slice(0,3);
                prcp3Night = night.precipPct.slice(0,3);
                prcp = prcp3Day.reduce(function(previous, current, idx) {
                    dIdx = ((idx * 2) + 1); // day param index
                    nIdx = dIdx + 1; // night param index
                    nCurrent = prcp3Night[idx]; // Night chance of precipitation
                    previous[dIdx + ""] = (current) ? current : 'nl';
                    previous[nIdx + ""] = (nCurrent) ? nCurrent : 'nl';
                    previous.prcpStr += (((current < 50) ? dIdx + "_0," : dIdx + "_50,") +
                    ((nCurrent < 50) ? nIdx + "_0," : nIdx + "_50,"));
                    return previous;
                }, prcp);



                /* extract condition params */
                cond3Day = day.icon.slice(0,3);
                cond3Night = night.icon.slice(0,3);
                cond = cond3Day.reduce(function(previous, current, idx) {
                    dCond = getCond(current);
                    nCond = getCond(cond3Night[idx]);
                    previous[ ( "fc" + ((idx * 2) + 1) ) ] =  (dCond ? dCond : "nl");
                    previous[ ( "fc" + ((idx * 2) + 2) ) ] =  (nCond ? nCond : "nl");
                    return previous
                }, cond);

                /* only 'e' or 'm' data in turbo call, not both */
                /* extract high temp 'e' */
                if( day.temperature && day.temperature.length ) {
                    highTemp = Math.max.apply(null, ((units === 'e') ? day.temperature.slice(0,3) : day.temperature.slice(0,3).map(function(value) { return convertTemp(value, units);}))) || undefined;
                }
                /* extract low temp 'e' */
                if( night.temperature && night.temperature.length ) {
                    lowTemp = Math.min.apply(null, ((units === 'e') ? night.temperature.slice(0,3) : night.temperature.slice(0,3).map(function(value) { return convertTemp(value, units);}))) || undefined;
                }
                /* extract high temp 'm' */
                if( day.temperature && day.temperature.length ) {
                    highTempC = Math.max.apply(null, ((units === 'm') ? day.temperature.slice(0,3) : day.temperature.slice(0,3).map(function(value) { return convertTemp(value, units);}))) || undefined;
                }
                /* extract low temp 'm' */
                if( night.temperature && night.temperature.length ) {
                    lowTempC = Math.max.apply(null, ((units === 'm') ? night.temperature.slice(0,3) : night.temperature.slice(0,3).map(function(value) { return convertTemp(value, units);}))) || undefined;
                }
                /* extract high snow */ /* data field not available in turbo dailyforecast data */
                if( day.snwQfp && day.snwQfp.length && night.snwQfp && night.snwQfp.length ) {
                    highSnow = Math.min.apply(null, [].concat(day.snwQfp, night.snwQfp)) || undefined;
                }

                prcp.prcpStr = prcp.prcpStr.substr(0,prcp.prcpStr.length - 1);
                fcst["prcp"]    = prcp;
                fcst["cond"]    = cond;
                fcst["tempH"]   = getTempInc(highTemp, 'f');
                fcst["tempL"]   = getTempInc(lowTemp, 'f');
                fcst["tempHR"]  = tempR({
                    val: highTemp
                });
                fcst["tempLR"]  = tempR({
                    val: lowTemp
                });

                fcst['tempCH']  = highTempC;
                fcst['tempCL']  = lowTempC;
                fcst['tempCHR'] = tempR({
                    val: highTempC,
                    scale: 'c'
                });
                fcst['tempCLR'] = tempR({
                    val: lowTempC,
                    scale: 'c'
                });

                fcst["fsnw"]    = snowR(highSnow);
                //}

                /* equivalent field 'wrlsWx12' not in Turbo data */
                fcst["fiveDay"] = day.phrase.slice(0,5).reduce(function(previous, current, idx) {
                    previous["d" + (idx + 1)] = current ? current : 'nl';
                    return previous;
                }, {});


                $$.custParams['fhi'] = fcst["tempH"] + '' || "";
                $$.custParams['fhr'] = fcst["tempHR"] + '' || "";
                $$.custParams['fli'] = fcst["tempL"] + '' || "";
                $$.custParams['flr'] = fcst["tempLR"] + '' || "";
                $$.custParams['fhic'] = fcst["tempCH"] + '' || "";
                $$.custParams['floc'] = fcst["tempCL"] + '' || "";

                $$.custParams['fsnw'] = fcst["fsnw"] + '' || "";
                $$.custParams['prcp'] = fcst["prcp"]  && fcst["prcp"].prcpStr + '' || "";
                $$.custParams['fc1'] = fcst["cond"] && fcst["cond"].fc1 + '' || "";
                $$.custParams['fc2'] = fcst["cond"] && fcst["cond"].fc2 + '' || "";
                $$.custParams['fc3'] = fcst["cond"] && fcst["cond"].fc3 + '' || "";
                $$.custParams['d1'] = fcst["fiveDay"] && fcst["fiveDay"].d1 + '' || "";
                $$.custParams['d2'] = fcst["fiveDay"] && fcst["fiveDay"].d2 + '' || "";
                $$.custParams['d3'] = fcst["fiveDay"] && fcst["fiveDay"].d3 + '' || "";
                $$.custParams['d4'] = fcst["fiveDay"] && fcst["fiveDay"].d4 + '' || "";
                $$.custParams['d5'] = fcst["fiveDay"] && fcst["fiveDay"].d5 + '' || "";

            }

            if (_Data && _Data.vt1alerts) {
                $$.custParams["alerts"] = "";
            }
            if (_Data && _Data.pollenforecast) {
                $$.custParams["pollen"] = getPollen(_Data.pollenforecast);
            }

            $$.Promises.weatherDataPromise.resolve();


        });
    }


})(AdsMetricsCtrl);


