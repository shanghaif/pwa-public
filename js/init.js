//This would be the today page, on initial load. Below is just for testing.
window.location = '/pwa/#today';
helper.loadTemplate('page-content', 'pages', 'today');


////initialize the service worker file.
//if('serviceWorker' in navigator){
//    navigator.serviceWorker.register(
//        '/pwa/service_worker.js',
//        {scope: '/pwa/*'}
//    ).then(_SW.success(), _SW.failure());
//}


//wx-icon-code-32