helper.loadTemplate("page-toast-div","modules","page-toast"),"serviceWorker"in navigator&&navigator.serviceWorker.register("/service_worker.js",{scope:"/"}).then(console.log("it registered."));