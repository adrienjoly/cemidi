/**
 * edit a restaurant's meal
 * @author adrienjoly, whyd
 */

var mongodb = require("../../models/mongodb.js");
var templateLoader = require("../../templates/templateLoader.js");

var templateFile = "./app/templates/compte.html";

var attributes = ["rNm", "addr", "tel", "email", "url", "img"];

exports.controller = function(request, reqParams, response) {
	request.logToConsole("compte.controller", reqParams);

	function renderResto(item) {
		templateLoader.loadTemplate(templateFile, function(template) {
			if (item.loc) {
				item.long = item.loc[0];
				item.lat = item.loc[1];
			}
			response.render(template.render(item), null, {'content-type': 'text/html'});
		});
	}

	if (!reqParams) // => empty form (new account)
		renderResto({});
	else if (reqParams.id) // => show form for existing account
		mongodb.collections["restaurant"].findOne({_id: mongodb.ObjectId(reqParams.id)}, function(err, item) {
			if (item)
				renderResto(item);
			else
				response.render("not found");	
		});
	else if (reqParams.rNm) { // => save account
		var criteria = reqParams._id ? { _id: mongodb.ObjectId(reqParams._id) } : { rNm: reqParams.rNm };
		var set = { loc: [reqParams.long, reqParams.lat] };
		for (var i in attributes)
			if (reqParams[attributes[i]])
				set[attributes[i]] = reqParams[attributes[i]];
		mongodb.collections["restaurant"].update(criteria, {$set:set}, {upsert:true}, function(err, item) {
			if (err || !item) {
				console.log("error", err);
				item = item || {};
				item.error = "unable to save this restaurant, try again!";
				response.render(item);
			}
			else
				mongodb.collections["restaurant"].findOne(criteria, function(err, item) {
					item = item || {};
					if (err)
						item.error = err;
					if (item._id)
						item.redirect = "/plat/" + item._id;
					response.render(item);
				});
				//response.temporaryRedirect("/plat/" + item._id);	
		});
	}
}