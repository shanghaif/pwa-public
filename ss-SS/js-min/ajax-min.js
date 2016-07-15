function AjaxRequest(){var e=new Object;return e.timeout=null,e.generateUniqueUrl=!0,e.url=window.location.href,e.method="GET",e.async=!0,e.username=null,e.password=null,e.parameters=new Object,e.requestIndex=AjaxRequest.numAjaxRequests++,e.responseReceived=!1,e.groupName=null,e.queryString="",e.responseText=null,e.responseXML=null,e.status=null,e.statusText=null,e.aborted=!1,e.xmlHttpRequest=null,e.onTimeout=null,e.onLoading=null,e.onLoaded=null,e.onInteractive=null,e.onComplete=null,e.onSuccess=null,e.onError=null,e.onGroupBegin=null,e.onGroupEnd=null,e.xmlHttpRequest=AjaxRequest.getXmlHttpRequest(),null==e.xmlHttpRequest?null:(e.xmlHttpRequest.onreadystatechange=function(){null!=e&&null!=e.xmlHttpRequest&&(1==e.xmlHttpRequest.readyState&&e.onLoadingInternal(e),2==e.xmlHttpRequest.readyState&&e.onLoadedInternal(e),3==e.xmlHttpRequest.readyState&&e.onInteractiveInternal(e),4==e.xmlHttpRequest.readyState&&e.onCompleteInternal(e))},e.onLoadingInternalHandled=!1,e.onLoadedInternalHandled=!1,e.onInteractiveInternalHandled=!1,e.onCompleteInternalHandled=!1,e.onLoadingInternal=function(){e.onLoadingInternalHandled||(AjaxRequest.numActiveAjaxRequests++,1==AjaxRequest.numActiveAjaxRequests&&"function"==typeof window.AjaxRequestBegin&&AjaxRequestBegin(),null!=e.groupName&&("undefined"==typeof AjaxRequest.numActiveAjaxGroupRequests[e.groupName]&&(AjaxRequest.numActiveAjaxGroupRequests[e.groupName]=0),AjaxRequest.numActiveAjaxGroupRequests[e.groupName]++,1==AjaxRequest.numActiveAjaxGroupRequests[e.groupName]&&"function"==typeof e.onGroupBegin&&e.onGroupBegin(e.groupName)),"function"==typeof e.onLoading&&e.onLoading(e),e.onLoadingInternalHandled=!0)},e.onLoadedInternal=function(){e.onLoadedInternalHandled||("function"==typeof e.onLoaded&&e.onLoaded(e),e.onLoadedInternalHandled=!0)},e.onInteractiveInternal=function(){e.onInteractiveInternalHandled||("function"==typeof e.onInteractive&&e.onInteractive(e),e.onInteractiveInternalHandled=!0)},e.onCompleteInternal=function(){e.onCompleteInternalHandled||e.aborted||(e.onCompleteInternalHandled=!0,AjaxRequest.numActiveAjaxRequests--,0==AjaxRequest.numActiveAjaxRequests&&"function"==typeof window.AjaxRequestEnd&&AjaxRequestEnd(e.groupName),null!=e.groupName&&(AjaxRequest.numActiveAjaxGroupRequests[e.groupName]--,0==AjaxRequest.numActiveAjaxGroupRequests[e.groupName]&&"function"==typeof e.onGroupEnd&&e.onGroupEnd(e.groupName)),e.responseReceived=!0,e.status=e.xmlHttpRequest.status,e.statusText=e.xmlHttpRequest.statusText,e.responseText=e.xmlHttpRequest.responseText,e.responseXML=e.xmlHttpRequest.responseXML,"function"==typeof e.onComplete&&e.onComplete(e),200==e.xmlHttpRequest.status&&"function"==typeof e.onSuccess?e.onSuccess(e):"function"==typeof e.onError&&e.onError(e),delete e.xmlHttpRequest.onreadystatechange,e.xmlHttpRequest=null)},e.onTimeoutInternal=function(){null==e||null==e.xmlHttpRequest||e.onCompleteInternalHandled||(e.aborted=!0,e.xmlHttpRequest.abort(),AjaxRequest.numActiveAjaxRequests--,0==AjaxRequest.numActiveAjaxRequests&&"function"==typeof window.AjaxRequestEnd&&AjaxRequestEnd(e.groupName),null!=e.groupName&&(AjaxRequest.numActiveAjaxGroupRequests[e.groupName]--,0==AjaxRequest.numActiveAjaxGroupRequests[e.groupName]&&"function"==typeof e.onGroupEnd&&e.onGroupEnd(e.groupName)),"function"==typeof e.onTimeout&&e.onTimeout(e),delete e.xmlHttpRequest.onreadystatechange,e.xmlHttpRequest=null)},e.process=function(){if(null!=e.xmlHttpRequest){e.generateUniqueUrl&&"GET"==e.method&&(e.parameters.AjaxRequestUniqueId=(new Date).getTime()+""+e.requestIndex);var t=null;for(var n in e.parameters)e.queryString.length>0&&(e.queryString+="&"),e.queryString+=encodeURIComponent(n)+"="+encodeURIComponent(e.parameters[n]);"GET"==e.method&&e.queryString.length>0&&(e.url+=(e.url.indexOf("?")>-1?"&":"?")+e.queryString),e.xmlHttpRequest.open(e.method,e.url,e.async,e.username,e.password),"POST"==e.method&&("undefined"!=typeof e.xmlHttpRequest.setRequestHeader&&e.xmlHttpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t=e.queryString),e.timeout>0&&setTimeout(e.onTimeoutInternal,e.timeout),e.xmlHttpRequest.send(t)}},e.handleArguments=function(t){for(var n in t)"undefined"==typeof e[n]?e.parameters[n]=t[n]:e[n]=t[n]},e.getAllResponseHeaders=function(){if(null!=e.xmlHttpRequest){if(e.responseReceived)return e.xmlHttpRequest.getAllResponseHeaders();alert("Cannot getAllResponseHeaders because a response has not yet been received")}},e.getResponseHeader=function(t){if(null!=e.xmlHttpRequest){if(e.responseReceived)return e.xmlHttpRequest.getResponseHeader(t);alert("Cannot getResponseHeader because a response has not yet been received")}},e)}AjaxRequest.getXmlHttpRequest=function(){return window.XMLHttpRequest?new XMLHttpRequest:window.ActiveXObject?void 0:null},AjaxRequest.isActive=function(){return AjaxRequest.numActiveAjaxRequests>0},AjaxRequest.get=function(e){AjaxRequest.doRequest("GET",e)},AjaxRequest.post=function(e){AjaxRequest.doRequest("POST",e)},AjaxRequest.doRequest=function(e,t){if("undefined"!=typeof t&&null!=t){var n=new AjaxRequest;n.method=e,n.handleArguments(t),n.process()}},AjaxRequest.submit=function(e,t){var n=new AjaxRequest;if(null==n)return!1;var u=AjaxRequest.serializeForm(e);return n.method=e.method.toUpperCase(),n.url=e.action,n.handleArguments(t),n.queryString=u,n.process(),!0},AjaxRequest.serializeForm=function(e){var t=e.elements,n=t.length,u="";this.addField=function(e,t){u.length>0&&(u+="&"),u+=encodeURIComponent(e)+"="+encodeURIComponent(t)};for(var o=0;o<n;o++){var a=t[o];if(!a.disabled)switch(a.type){case"text":case"password":case"hidden":case"textarea":this.addField(a.name,a.value);break;case"select-one":a.selectedIndex>=0&&this.addField(a.name,a.options[a.selectedIndex].value);break;case"select-multiple":for(var s=0;s<a.options.length;s++)a.options[s].selected&&this.addField(a.name,a.options[s].value);break;case"checkbox":case"radio":a.checked&&this.addField(a.name,a.value)}}return u},AjaxRequest.numActiveAjaxRequests=0,AjaxRequest.numActiveAjaxGroupRequests=new Object,AjaxRequest.numAjaxRequests=0;