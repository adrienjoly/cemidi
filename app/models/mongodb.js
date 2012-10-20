/**
 * mongodb model
 * wraps a accessor to collections of the "whyd_music" mongodb database
 * @author adrienjoly, whyd
 **/

GLOBAL.DEBUG = true;

sys = util = require('util');

//var USER_CACHE_FIELDS = {_id:1, fbId:1, name:1, img:1, email:1, digest:1, iBy:1, handle:1};

var nodepath = ""; //__dirname + "/../../../../node-v0.4.0/";

var Db = require(nodepath+'node-mongodb-native/lib/mongodb').Db,
	Connection = require(nodepath+'node-mongodb-native/lib/mongodb').Connection,
	Server = require(nodepath+'node-mongodb-native/lib/mongodb').Server,
	BSON = require(nodepath+'node-mongodb-native/lib/mongodb').BSONPure;
	// BSON = require(nodepath+'node-mongodb-native/lib/mongodb').BSONNative;

var port = null;

var host = process.env['MONGO_NODE_DRIVER_HOST'] || 'localhost';
if (!port) port = process.env['MONGO_NODE_DRIVER_PORT'] || Connection.DEFAULT_PORT;

var dbName = "cemidi";

util.log('MongoDB client module is starting...');
sys.puts("Connecting to MongoDB/"+dbName+" @ " + host + ":" + port + "...");

var db = new Db(dbName, new Server(host, port, {auto_reconnect:true}), {native_parser:false /*, strict:true*/});

db.addListener('error', function(e){
	console.log("MongoDB model async error: ", e);
});

exports.ObjectID = db.bson_serializer.ObjectID;

exports.ObjectId = exports.ObjectID.createFromHexString;

// http://www.mongodb.org/display/DOCS/Object+IDs#ObjectIDs-DocumentTimestamps
exports.dateToHexObjectId = function (t) {
	var t = Math.round(t.getTime() / 1000); // turn into seconds
	t = t.toString(16); // translate into hexadecimal representation
	t = t + "0000000000000000"; // add null values for 8 other bytes
    while (t.length < 2 * 12) // pad with leading zeroes, to reach 12 bytes
        t = '0' + t;
	return t;
};
/*
exports.usernames = {};
exports.fbusers = {};

exports.getUserFromFbUid = function(fbId) {
	return exports.fbusers[fbId];
};

exports.getUserFromId = function(uid) {
	return exports.usernames[""+uid];
};

exports.getUserNameFromId = function(uid) {
	return (exports.usernames[""+uid] || {}).name;
};

exports.cacheUser = function(user) {
	if (!user)
		return console.log("WARNING: trying to cache a null user!");
	//if (user.img) user.img = user.img.split("?")[0]; // remove url params
	user.id = "" + (user._id || user.id);
	//console.log("Caching user: ", user);
	//exports.usernames[user.id] = user; // note: may also includes email
	exports.usernames[user.id] = exports.usernames[user.id] || {};
	exports.usernames[user.id].id = user.id;
	for (var i in user)
		if (USER_CACHE_FIELDS[i])
			exports.usernames[user.id][i] = user[i] || exports.usernames[user.id][i];
	if (exports.usernames[user.id].fbId)
		exports.fbusers[user.fbId] = exports.usernames[user.id];
};

exports.cacheUsers = function(callback) {
	console.log("Caching users ...");
	//db.collection("user", function(err, userCol) {
		var userCol = exports.collections["user"];
		userCol.find({},{fields: USER_CACHE_FIELDS}, function(err, cursor) {
			cursor.toArray(function(err, results) {
				for (var i in results)
					exports.cacheUser(results[i]);
				if (callback) callback();
			});
		});
	//});
};
*/

var pendingQueries = [], readyCallback;

var getCollection = function (tableName, handler) {
	pendingQueries.push({table:tableName, handler:handler});
}

exports.model = function(tableName, handler) {
	getCollection(tableName, handler);
}

exports.init = function (callback){
	readyCallback = callback;
}

exports.collections = {};

db.open(function(err, db) {
	if (err) throw err;
	sys.puts("Successfully connected to MongoDB/"+dbName+" @ " + host + ":" + port);
	
	var finishInit = function() {
		/*
		exports.cacheUsers();
		*/
		console.log("MongoDB model is now ready for queries!");
	
		getCollection = function(tableName, handler) {
			handler(null, exports.collections[tableName]);
			/*
			db.collection(tableName, function(err, collection) {
				if (err) sys.puts("MongoDB Error : " + err);
				else handler(err, collection);
			});
			*/
		}

		if(pendingQueries)
			for (var i in pendingQueries) {
				var q = pendingQueries[i];
				console.log("Processing pending query: " + q.table);
				getCollection(q.table, q.handler);
			}

		if (readyCallback) readyCallback();
	}
	
	// diagnostics and collection caching
	db.collections(function(err, collections) {
		if (err) sys.puts("MongoDB Error : " + err);
		else {
			if (0 == collections.length)
				finishInit();
			var remaining = collections.length;
			for (var i in collections) {
				var queryHandler = function () {
					var table = collections[i].collectionName;
					return function(err, result) {
						console.log(" - found table: " + table + " : " + result + " rows");
						db.collection(table, function(err, col) {
							exports.collections[table] = col;
							if (0 == --remaining) finishInit();
						});
					};
				}();
				collections[i].count(queryHandler);
			}
		}
	});
	
	//finishInit(); // called when all collections are loaded
});

