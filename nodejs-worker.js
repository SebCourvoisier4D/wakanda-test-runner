onconnect = function(event) {
	var port = event.ports[0];
	
	// Looks like it has to be done that way :/
	global.Mocha = requireNode('mocha');

    var chai = requireNode('chai'),
		mocha = new Mocha({
  			ui: 'bdd'
		});

	// The Wakanda reporter adapts itself to the context (node, ssjs, studio...):
	include(File('/PROJECT/backend/modules/wakanda-test-runner/wakanda-reporter.js').path);
	mocha.reporter(Wakanda);
	chai.should();
	global.expect = chai.expect;
	global.assert = chai.assert;

    port.onmessage = function(event) {
    	try {
	    	switch (event.data.type) {
	    		// Add a test file to run:
	    		case '__add__':
	    			mocha.addFile(
			        	event.data.data
			    	);
			    	port.postMessage({
			            'type': '__added__',
			            'data': event.data.data
			        });
	    			break;
	    			
	    		// Run the tests:
	    		case '__run__':
	    			mocha.run(function(){	    				
				    	port.postMessage({
				            'type': '__done__',
				            'data': _wakanda_mocha_report || null
				        });
				        close();
				   	});
	    			break;
	    	}
    	} catch (e) {
	        port.postMessage({
	            'type': '__error__',
	            'data': {
	            	action: event.data.type,
	            	data: event.data.data,
	            	error: e
	 	       }
	        });
	        close();
	    }
    };

    // Worker is ready:
    port.postMessage({
        'type': '__info__',
        'data': 'ready'
    });
};