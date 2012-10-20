var startStopDaemon = require('start-stop-daemon');
var session = require('my/session');
var myHttp = require('my/http');
var fs = require('fs');

startStopDaemon({ crashTimeout: 3000}, function() {

	var params = {
		dev: false, // hot re-loading of node controllers, models and views
		mongoDbPort: process.env['MONGO_NODE_DRIVER_PORT'],
		urlPrefix: "http://cemidi.fr"
	}

	if (process.argv.length > 2) // ignore "node" and the filepath of this script
		for(var i=2; i<process.argv.length; ++i) {
			console.log("command line parameter #" + i + " : " + process.argv[i]);
			if (process.argv[i] == "--mongoDbPort")
				params.mongoDbPort = process.env['MONGO_NODE_DRIVER_PORT'] = process.argv[++i];
			else if (process.argv[i] == "--dev")
				params.dev = true;
			else if (process.argv[i] == "--runner") // ignore this parameter from start-stop-daemon
				void(0);
			else if (process.argv[i].indexOf("--") == 0)
				params[process.argv[i].substr(2)] = process.argv[++i];
		}

	process.appParams = params;
	console.log("Starting web server with params:", params);

	//init db first
	require('./app/models/mongodb.js').init(function(){
		var config = require('./app/models/config.js');
		var sessionParams = {
			secret: fs.readFileSync('config/session.secret', 'utf8'),
			key: 'cesoirSid',
			mongo: {port: parseInt(params.mongoDbPort), db: 'cemidi'},
			maxAge: 60 * 60 * 24 * 365
		};
		var uploadParams = {
			uploadDir: config.paths.uploadDirName, // 'upload_data'
			keepExtensions: true
		};
		console.log("uploadparams", uploadParams);
		(new myHttp.Application(__dirname, params.dev, session(sessionParams), uploadParams)).start();
	});

});
