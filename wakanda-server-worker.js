// Looks like it has to be done that way :/
document = {};
document.getElementById = function () {
	return null;
}
location = {
	href: ''
};
include(File('/PROJECT/backend/node_modules/mocha/mocha.js').path);
include(File('/PROJECT/backend/node_modules/chai/chai.js').path);
		
Mocha.prototype.loadFiles = function(fn){
  var self = this;
  var suite = this.suite;
  var pending = this.files.length;
  this.files.forEach(function(file){
    suite.emit('pre-require', global, file, self);
    suite.emit('require', require(file), file, self);
    suite.emit('post-require', global, file, self);
    --pending || (fn && fn());
  });
};

// The Wakanda reporter adapts itself to the context (node, ssjs, studio...):
include(File('/PROJECT/backend/modules/wakanda-test-runner/wakanda-reporter.js').path);
mocha.setup('bdd');
mocha.reporter(Wakanda);
chai.should();
global.expect = chai.expect;
global.assert = chai.assert;

onmessage = function(event) {
	try {
    	switch (event.data.type) {
    		// Add a test file to run:
    		case '__add__':
    			mocha.addFile(
		        	event.data.data
		    	);
		    	postMessage({
		            'type': '__added__',
		            'data': event.data.data
		        });
    			break;
    			
    		// Run the tests:
    		case '__run__':
    			mocha.run(function(){	    				
			    	postMessage({
			            'type': '__done__',
			            'data': _wakanda_mocha_report || null
			        });
			        close();
			   	});
    			break;
    	}
	} catch (e) {
        postMessage({
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
postMessage({
    'type': '__info__',
    'data': 'ready'
});