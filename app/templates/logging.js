/**
 * user logging templates
 * (used by logging model)
 * @author adrienjoly, whyd
 */

exports.renderUnauthorizedPage = function (form) {
	return "unauthorized";
};

exports.htmlRedirect = function(url) {
	return ['<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">',
			'<html>',
			'<head>',
			'<title>whyd is redirecting...</title>',
			'<meta http-equiv="REFRESH" content="3;url='+url+'"></HEAD>',
			'<BODY>',
			'You are being redirected to: <a href="' + url + '">' + url + '</a>...',
			'<script>window.location.href="'+url+'";</script>',
			'</BODY>',
			'</HTML>'
	].join('\n');
};