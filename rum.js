(function(){
	// Check for browser support
	if ("performance" in window) {

		const ANALYTICS_URL ="/user-matrix";
		var performanceObj = {},
		sendData = (data) => {
	  			if(!(navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(analyticsData)))){
	  				// datalayer ? dataLayer.push() || xhr
	  			}
	  		},
	  	navEntry = (entry) => {
				performanceObj["Time to complete DOM content loaded event"] = entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart;
				performanceObj["DNS Lookup duration"] = entry.domainLookupEnd - entry.domainLookupStart
				performanceObj["Total Connection Time"] = entry.connectEnd - entry.connectStart
				performanceObj["Fetch Time"] = entry.responseEnd - entry.fetchStart
				performanceObj["Time to first byte"] = entry.responseStart - entry.requestStart
				performanceObj["Is the page getting redirected"] = (entry.redirectEnd - entry.redirectStart) > 0 ? "Redirected" : "No Redirect"
				performanceObj["Document body size"] = entry.encodedBodySize
		},
		resourceEntry = (entry) => {
			performanceObj[`Resource: ${entry.name}`] = `Initiator Type: ${entry.initiatorType}Response time: ${entry.responseEnd - entry.responseStart}`;
		};

	  	if ("PerformanceObserver" in window) {	    
		    // Instantiate the performance observer
			var perfObserver = new PerformanceObserver((list, obj) => {
			// Get all n the resource entries collected so far
			var navEntries = list.getEntriesByType("navigation"),
			  	resEntries = list.getEntriesByType("resource");

			  	for(let i = 0; i < navEntries.length; i++){
			  		navEntry(navEntries[i]);
			  	}
			  	for(let i = 0; i < resEntries.length; i++){
			  		navEntry(resEntries[i]);
			  	}
			});

			// Run the observer
			perfObserver.observe({
			  // Polls for Navigation and Resource Timing entries
			  entryTypes: ["navigation", "resource", "mark", "measure"]
			});
	  	}

	  	addEventListener('load', () => {
	 		performanceObj["Total load time"] = performance.timing.navigationStart - performance.timing.loadEventEnd;
	 	})
	 	addEventListener('beforeunload', () => {
	 		debugger;
	 		sendData(performanceObj);
	 	})
	  	
	}
})()
