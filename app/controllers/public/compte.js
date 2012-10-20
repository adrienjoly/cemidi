/**
 * edit a restaurant's meal
 * @author adrienjoly, whyd
 */

var mongodb = require("../../models/mongodb.js");
var templateLoader = require("../../templates/templateLoader.js");

var templateFile = "./app/templates/compte.html";

var attributes = ["rNm", "addr", "tel", "url", "img"];

exports.controller = function(request, reqParams, response)
{
	request.logToConsole("compte.controller", reqParams);

	if (!reqParams)
		templateLoader.loadTemplate(templateFile, function(template) {
			response.render(template.render(), null, {'content-type': 'text/html'});
		});
	else if (reqParams.id)
		mongodb.collections["restaurant"].findOne({_id: mongodb.ObjectId(reqParams.id)}, function(err, item) {
			if (item)
				templateLoader.loadTemplate(templateFile, function(template) {
					for (var i in params)
						item[i] = params[i];
					item.long = item.loc[0];
					item.lat = item.loc[1];
					response.render(template.render(item), null, {'content-type': 'text/html'});
				});
			else
				response.render("not found");	
		});
	else if (reqParams._id) {
		var set = {
			loc: [reqParams.long, reqParams.lat]
		};
		for (var i in attributes)
			set[i] = attributes[i];
		mongodb.collections["restaurant"].update({_id: mongodb.ObjectId(reqParams._id)}, {$set:set}, function(err, item) {
			if (item)
				templateLoader.loadTemplate(templateFile, function(template) {
					item.long = item.loc[0];
					item.lat = item.loc[1];
					response.render(template.render(item), null, {'content-type': 'text/html'});
				});
			else
				response.render("not found");	
		});
	}
	else
		response.badRequest();

}