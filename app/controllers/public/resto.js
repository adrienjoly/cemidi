/**
 * edit a restaurant's meal
 * @author adrienjoly, whyd
 */

var mongodb = require("../../models/mongodb.js");
var templateLoader = require("../../templates/templateLoader.js");

exports.controller = function(request, reqParams, response)
{
	request.logToConsole("resto.controller", reqParams);

	if (reqParams && reqParams.id) {
		mongodb.collections["restaurant"].findOne({_id: mongodb.ObjectId(reqParams.id)}, function(err, item) {
			if (item)
				templateLoader.loadTemplate("./app/templates/resto.html", function(template) {
					item.apiKey = "b1723ccb446048d1b5db68075373505d";
					item.token = "36e0f815609a43929e0e5f7c1294804e"; // <- curl -XPOST http://auth.cloudmade.com/token/b1723ccb446048d1b5db68075373505d?userid=0&deviceid=0
					item.mapSize = "640x300";
					item.long = item.loc[0];
					item.lat = item.loc[1];
					response.render(template.render(item), null, {'content-type': 'text/html'});
				});
			else
				response.render("not found");	
		});
	}
	else
		response.render("not found");
}