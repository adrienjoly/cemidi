/**
 * store a restaurant and update its current meal
 * @author adrienjoly, whyd
 */

var mongodb = require("../../models/mongodb.js");

exports.controller = function(request, reqParams, response)
{
	request.logToConsole("list.controller", reqParams);
	
	mongodb.collections["restaurant"].find(function(err, cur) {
		cur.toArray(function(err, items){
			console.log(items);
			response.render({meals: items});
		});
	});
}