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
		console.log("geocoding -> ", r, url.replace("js", "html"));
		if (r && r.features && r.features.length && r.features[0].centroid && r.features[0].centroid.coordinates) {
			console.log("coordinates", r.features[0].centroid.coordinates);
			$lat.val(r.features[0].centroid.coordinates[0]);
			$long.val(r.features[0].centroid.coordinates[1]);
		}
	});

});

function error(msg) {
	setTimeout(function(){alert(msg)}, 1);
	return false;
}

function onSubmit() {
	if (!$rNm.val()) return error("Veuillez entrer un nom");
	if (!$addr.val()) return error("Veuillez entrer une adresse");
	if (!$lat.val() || !$long.val()) return error("Veuillez corriger l'adresse");
	$.ajax("/compte?" + $("form").serialize(), function(r){
		r = (r || {}).responseText;
		r = (r && typeof r == "string" ? JSON.parse(r) : r) || {};
		console.log(r);
		if (r.error)
			alert(r.error);
		if (r.redirect)
			window.location.href = r.redirect;
	})
}