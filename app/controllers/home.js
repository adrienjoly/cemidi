/**
 * homePage controller
 * @author adrienjoly, whyd
 */

exports.controller = function(request, reqParams, response)
{
	request.logToConsole("home.controller", reqParams);
	
	// make sure a registered user is logged, or return an error page
	//var loggedInUser = request.checkLogin(response);
	//if (!loggedInUser) return;

	console.log(request.url)
	
	//response.temporaryRedirect("/stream" + (request.url.indexOf("/welcome") == 0 ? "?welcome=1" : ""), reqParams);
	response.render("coucou")
}