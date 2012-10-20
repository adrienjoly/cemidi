/**
 * templateLoader
 * load and render templates using mustache
 * @author adrienjoly, whyd
 */

var fs = require("fs");
var Mustache = require("../../public/js/mustache.js");

// e.g. filename : 'public/register.html'

exports.loadTemplate = function(fileName, callback) {
	console.log("templates.templateLoader loading "+fileName+"...");
	
	var instance = {};
	
	fs.readFile(fileName, "utf-8", function (err, data) {
		if (err) console.log("template.templateLoader ERROR ", err);
		instance.template = data;
		instance.render = function(params) {
			try {
				return Mustache.to_html(this.template, params);
			}
			catch (e) {
				console.log("template.templateLoader ERROR ", err);
				return null;
			}
		}
		if (callback)
			callback(instance, err);
	});
	
	return instance;
}
