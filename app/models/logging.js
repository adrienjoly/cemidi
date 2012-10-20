var http = require('http');
var querystring = require('querystring');

http.IncomingMessage.prototype.logToConsole = function(suffix, params) {
	suffix = suffix ? "(" + suffix + ")" : "";
	console.log("===\n",
		(new Date()).toUTCString(),
		this.connection.remoteAddress + ": " + this.method + " " + this.url.split("?")[0],
		suffix, params || '');
	//console.log("headers", this.headers);
}

var config = require('./config.js');
var mongodb = require("./mongodb.js");
var loggingTemplate = require("../templates/logging.js");
var renderUnauthorizedPage = loggingTemplate.renderUnauthorizedPage;

// ========= USER AGENT STUFF

/***
 * Recognize mobile clients from user agent
 */
http.IncomingMessage.prototype.isMobileBrowser = function() {
	return null; // mobile adaptation is DISABLED
	
	var ua = this.headers["user-agent"];
	return ua && ua.indexOf("Mobile") != -1 && ua.indexOf("iPad") == -1 ? ua : null;
}

/**
 * Gets the http referer of a request
 */
http.IncomingMessage.prototype.getReferer = function() {
	return this.headers['referrer'] || this.headers['referer'];
}

// ========= COOKIE STUFF

/**
 * Generates a user session cookie string
 * that can be supplied to a Set-Cookie HTTP header.
 */
/*
exports.makeCookie = function(user) {
	var date = new Date((new Date()).getTime() + 1000 * 60 * 60 * 24 * 365);
	return 'whydUid="'+(user.id || '')+'"; Expires=' + date.toGMTString();
};
*/


/**
 * Transforms cookies found in the request into an object
 */
http.IncomingMessage.prototype.getCookies = function() {
  //var cookieReg = /([^=\s]+)="([^"]*)"/;
  return function() {
	//console.log("cookies raw:", this.headers.cookie);
	if (!this.headers.cookie)
      return null;
    var cookiesArray = this.headers.cookie.split(';');
	//console.log("cookies array:", cookiesArray);
    var cookies = {};
    for (var i = 0; i < cookiesArray.length; i++) {
      //var match = cookiesArray[i].trim().match(cookieReg);
      //if (match)
	  cookiesArray[i] = cookiesArray[i].trim();
	  var separ = cookiesArray[i].indexOf("=");
	  if (separ > 0)
        cookies[cookiesArray[i].substr(0, separ)] = cookiesArray[i].substring(separ+1);
    }
	//console.log("cookies object:", cookies);
    return cookies;
  }
}();

/**
* Return facebook's "fbs_" cookie object from the request
*/
http.IncomingMessage.prototype.getFacebookCookie = function() {
	var cookies = this.getCookies();
	//console.log("cookies:", cookies);
	for (var i in cookies)
		if (i.startsWith("fbs_")) {
			var cookie = {}, cookieArray = cookies[i].split("&");
			for (var j in cookieArray) {
				var cookieItem = cookieArray[j].split("=");
				cookie[cookieItem[0]] = cookieItem[1];
			}
			console.log("found facebook cookie"); //, cookie);
			return cookie;
		}
		else if (i.startsWith("fbsr_")) { // https://developers.facebook.com/docs/authentication/signed_request/
			try {
				var cookie = cookies[i].split(".")[1];
				cookie = (new Buffer(cookie /*|| ""*/, "base64")).toString("ascii");
				cookie = JSON.parse(cookie);
				console.log("found secure facebook cookie"); //, cookie);
				return cookie;
			}
			catch (e) {
				console.log("secure facebook connect error: ", e);
			}
		}
	return null;
};

// ========= USER ACCESSORS

/**
 * Returns the logged in user's facebook uid, from its cookie
 */
http.IncomingMessage.prototype.getFbUid = function() {
	var fbCookie = this.getFacebookCookie();
	if (fbCookie && fbCookie.uid)
		this.getFbUid = function() {
			return fbCookie.uid;
		}
	else if (fbCookie && fbCookie.user_id)
		this.getFbUid = function() {
			return fbCookie.user_id;
		}
	else
		return null;
	return this.getFbUid();
};

/**
 * Returns the logged in user's uid, from its whyd session cookie
 */
http.IncomingMessage.prototype.getUid = function() {
	/*
	var uid = (this.getCookies() || {})["whydUid"];
	if (uid) uid = uid.replace(/\"/g, "");
	//if (uid) console.log("found whyd session cookie", uid);
	return uid;
	*/
	return (this.session || {}).whydUid;
};

/**
 * Returns the logged in user as an object {_id, id, fbId, name, img}
 */
http.IncomingMessage.prototype.getUser = function() {
	var uid = this.getUid();
	if (uid) {
		var user = mongodb.usernames[uid];
		if (user) user.id = "" + user._id;
		return user;
	}
	else
		return null;
};

http.IncomingMessage.prototype.getUserFromFbUid = mongodb.getUserFromFbUid;

http.IncomingMessage.prototype.getUserFromId = mongodb.getUserFromId;

http.IncomingMessage.prototype.getUserNameFromId = mongodb.getUserNameFromId;

// ========= LOGIN/SESSION/PRIVILEGES STUFF

/**
 * Checks that a registered user is logged in, and return that user, or show an error page
 */
http.IncomingMessage.prototype.checkLogin = function(response) {
	var user = this.getUser();
	//console.log("checkLogin, cached record for logged in user: ", user);
	if (!user || !user.name) {
		if (response)
			response.render(renderUnauthorizedPage(), null, {'content-type': 'text/html'});
		return false;
	}
	return user;
}

http.IncomingMessage.prototype.isUserAdmin = 
exports.isUserAdmin = function(user) {
	return user.email && config.adminEmails[user.email];
};

http.IncomingMessage.prototype.isAdmin = function() {
	return this.isUserAdmin(this.getUser());
}

http.IncomingMessage.prototype.checkAdmin = function(response) {
	var user = this.getUser();
	if (!user || !user.name || !user.email) {
		response.render(renderUnauthorizedPage(), null, {'content-type': 'text/html'});
		return false;
	}
	else if (!exports.isUserAdmin(user)) {
		console.log("access restricted, user is not an admin: ", user);
		response.render("nice try! ;-)");
		return false;
	}
	return user;
}

// ========= HTTP RESPONSE SNIPPETS

http.ServerResponse.prototype.redirect = function(url) {
	return this.render(loggingTemplate.htmlRedirect(url), null, {'content-type': 'text/html'});
};

http.ServerResponse.prototype.status = function(code, head, body) {
	this.writeHead(code, head || undefined);
	body ? this.end(body) : this.end();
}

http.ServerResponse.prototype.temporaryRedirect = function(url, reqParams) {
	var url = ""+url;
	if (reqParams/*request.method.toLowerCase() == "get"*/) {
		var reqParams = querystring.stringify(reqParams);
		if (reqParams.length)
			url += "?" + reqParams;
	}
	this.status(307, {Location: url}, "redirecting to "+url);
	//this.writeHead(307, {Location: url});
	//this.end("redirecting to "+url);
}

http.ServerResponse.prototype.badRequest = function(error) {
	this.status(400, null, error ? ""+error : "BAD REQUEST");
	//this.writeHead(400);
	//this.end(error ? ""+error : "BAD REQUEST");
}

http.ServerResponse.prototype.notFound = function() {
	this.status(404);
}