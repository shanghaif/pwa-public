var helper={};helper.loadTemplate=function(e,t,n){var o="/templates/"+t+"/"+n+"/"+n+".html",r="undefined"!=typeof XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP");r.open("get",o,!0),r.onreadystatechange=function(){4===r.readyState&&200===r.status&&(document.getElementById(e).innerHTML=r.responseText)},r.send();var a=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript",s.src="/templates/"+t+"/"+n+"/"+n+".js",s.onreadystatechange=n+"Run",s.onload=n+"Run",a.appendChild(s)},helper.setContent=function(e){var t=function(e){document.getElementById(e[0]).innerHTML=e[1]};if("object"==typeof e)for(var n=0;n<e.length;n++)t(e[n])},helper.empty=function(e){document.getElementById(e).innerHTML=""},helper.ngRepeat=function(e,t,n,o,r){r="all"===r?n.length:r;var a="https://"+window.location.hostname+"/templates/components/"+t+"/"+t+".html",s="undefined"!=typeof XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),l="",p=0,c=0,d=0;s.open("get",a,!0),s.onreadystatechange=function(){if(4===s.readyState&&200===s.status){var t=s.responseText;for(p=0;p<r;p++)document.getElementById(e).innerHTML+=t;for(c=0;c<n.length;c++)for(l=document.getElementsByClassName(n[c][0]),d=0;d<l.length;d++)"icon"===n[c][1]?l[d].innerHTML=getWxIcon(o[n[c][1]][d]):l[d].innerHTML=o[n[c][1]][d]}},s.send()},helper.ngRepeatReverse=function(e,t,n,o,r){r="all"===r?n.length:r;var a="templates/components/"+t+"/"+t+".html",s="undefined"!=typeof XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),l="",p=0,c=0,d=0;s.open("get",a,!0),s.onreadystatechange=function(){if(4===s.readyState&&200===s.status){var t=s.responseText;for(p=0;p<r;p++)document.getElementById(e).innerHTML+=t;for(c=0;c<n.length;c++)for(l=document.getElementsByClassName(n[c][0]),d=0;d<l.length;d++)l[d].innerHTML=o[d][n[c][1]]}},s.send()},helper.isNumeric=function(e){return"number"==typeof e&&"NaN"!==e},"undefined"!=typeof module&&module.hasOwnProperty("exports")&&(module.exports=helper);