# wakanda-test-runner
*(Experimental stuff...)*

## Setup
1. Copy/clone the `wakanda-test-runner` module into your `PROJECT/backend/modules` folder
2. Inside your `PROJECT/backend` folder, run `npm install mocha chai`

## Usage

To run the sample test in the context of a `NodeWorker`:

`````
var runner = require('wakanda-test-runner');

runner.init('nodejs', function (err, ready) {
	if (ready === true) {
		runner.add(File('/PROJECT/backend/modules/wakanda-test-runner/sample-test.js').path, function (err, path) {
			if (!err) {
				runner.run(function (err, report) {
					console.log(report.passes);
					console.log(report.failures);
					console.log(report.duration);
				});
			}
		});
	}
});
`````

To run the sample test in the context of a Wakanda `Worker`:

`````
var runner = require('wakanda-test-runner');

runner.init('wakanda-server', function (err, ready) {
	if (ready === true) {
		runner.add(File('/PROJECT/backend/modules/wakanda-test-runner/sample-test.js').path, function (err, path) {
			if (!err) {
				runner.run(function (err, report) {
					console.log(report.passes);
					console.log(report.failures);
					console.log(report.duration);
				});
			}
		});
	}
});
`````
