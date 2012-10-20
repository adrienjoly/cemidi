var $rNm = $("input[name=rNm]");
var $addr = $("input[name=addr]");
var $lat = $("input[name=lat]");
var $long = $("input[name=long]");
var $tel = $("input[name=tel]");
var $email = $("input[name=email]");
var $img = $("input[name=img]");
var $url = $("input[name=url]");

$addr.blur(function() {
	//var url = "http://maps.googleapis.com/maps/api/geocode/jsonp?address="
	var apiKey = "b1723ccb446048d1b5db68075373505d";
	var url = "http://geocoding.cloudmade.com/"+apiKey+"/geocoding/v2/find.js?query=";
	url += encodeURIComponent($addr.val()) + "&callback=?";
	$.getJSON(url, function(r) {
		console.log("url", url.replace("js", "html"));
		console.log("r", r);
		if (r && r.features && r.features.length)
			console.log("feature", r.features[0]);
	});

});

function onSubmit() {
	if (!$rNm.val()) return alert("Veuillez entrer un nom");
	if (!$addr.val()) return alert("Veuillez entrer une adresse");
	if (!$lat.val() || !$long.val()) return alert("Veuillez corriger l'adresse");
}