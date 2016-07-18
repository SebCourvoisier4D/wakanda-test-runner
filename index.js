var worker, port, ready = false, callbacks = {
	ready: undefined,
	added: undefined,
	error: undefined,
	done: undefined
};

exports.postMessage = function (message) {
	if (message.name === 'applicationWillStart') {
		
	} else if (message.name === 'applicationWillStop') {
		
	} else if (message.name === 'httpServerDidStart') {
		
	} else if (message.name === 'httpServerWillStop') {
	
	}	
};

exports.onReady = function(callback) {
	if (typeof callback === 'function') {
    	callbacks.ready = callback;
    }
};

exports.onAdded = function(callback) {
	if (typeof callback === 'function') {
    	callbacks.added = callback;
    }
};

exports.onError = function(callback) {
	if (typeof callback === 'function') {
    	callbacks.error = callback;
    }
};

exports.onComplete = function(callback) {
	if (typeof callback === 'function') {
    	callbacks.done = callback;
    }
};

exports.init = function(context, callback){
	if (typeof context !== 'string') {
		throw new Error('Context must be specified (e.g. "nodejs", "wakanda-server").');
	}
	if (typeof callback === 'function') {
    	callbacks.ready = callback;
    }
    
    if (context === 'nodejs') {
    	worker = new NodeWorker(File('/PROJECT/backend/modules/wakanda-test-runner/nodejs-worker.js').path, 'mocha-worker');
    	port = worker.port;
    } else if (context === 'wakanda-server') {
    	worker = new Worker(File('/PROJECT/backend/modules/wakanda-test-runner/wakanda-server-worker.js').path);
    	port = worker;
    } else {
    	throw new Error('Unknown context "' + context + '".');
    }

	port.onmessage = function(event) {
	    if (event.data.type === '__info__' && event.data.data === 'ready') {
			ready = true;
			if (typeof callbacks.ready === 'function') {
				callbacks.ready(null, true);
			}
		} else if (event.data.type === '__done__') {
			if (typeof callbacks.done === 'function') {
				callbacks.done(null, event.data.data);
			} else if (typeof callbacks.ready === 'function') {
				callbacks.ready(null, event.data.data);
			}
			close();
		} else if (event.data.type === '__added__') {
			if (typeof callbacks.added === 'function') {
				callbacks.added(null, event.data.data);
			}
		} else if (event.data.type === '__error__') {
			if (typeof callbacks.error === 'function') {
				callbacks.error(event.data.data);
			} else if (typeof callbacks.ready === 'function') {
				callbacks.ready(event.data.data);
			}
			close();
		}
	};
	wait();
};

exports.add = function(filePath, callback){
    if (ready === true) {
    	if (typeof callback === 'function') {
    		callbacks.added = callback;
    	}
    	port.postMessage({
	        'type': '__add__',
	        'data': filePath
	    });
    }
};

exports.run = function(callback){
    if (ready === true) {
    	if (typeof callback === 'function') {
    		callbacks.done = callback;
    	}
    	port.postMessage({
	        'type': '__run__',
	        'data': null
	    });
    }
};