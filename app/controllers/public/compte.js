/**
 * edit a restaurant's meal
 * @author adrienjoly, whyd
 */

var mongodb = require("../../models/mongodb.js");
var templateLoader = require("../../templates/templateLoader.js");

exports.controller = function(request, reqParams, response)
{
	request.logToConsole("compte.controller", reqParams);

	if (reqParams && reqParams.id) {
		mongodb.collections["restaurant"].findOne({_id: mongodb.ObjectId(reqParams.id)}, function(err, item) {
			if (item)
				response.render("coucou " + item.name);
			else
				response.render("not found");				
		});
	}
	else
		templateLoader.loadTemplate("./app/templates/compte.html", function(template) {
			response.render(template.render(), null, {'content-type': 'text/html'});
		});
}