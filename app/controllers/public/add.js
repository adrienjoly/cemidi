/**
 * add a restaurant
 * @author adrienjoly, whyd
 */

var mongodb = require("../../models/mongodb.js");

exports.controller = function(request, reqParams, response)
{
	request.logToConsole("add.controller", reqParams);
	/*
	mongodb.collections["restaurant"].find(function(err, cur) {
		cur.toArray(function(err, items){
			console.log(items)
			response.render(items)
		});
	});
	*/

	var id = 0;

	response.temporaryRedirect("/resto?id=" + id/*, reqParams*/);
}