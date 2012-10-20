// command-line overridable config

exports.urlPrefix = process.appParams.urlPrefix;
exports.landingPage = process.appParams.landingPage;
exports.emailModule = process.appParams.emailModule;

exports.paths = {
	whydPath: "../whydJS",
	uploadDirName: "upload_data",
	uAvatarImgDirName: "uAvatarImg"
}

// static part of config

exports.version = 9; // new player and new onboarding

exports.nbPostsPerNewsfeedPage = 10;
exports.nbTracksPerPlaylistEmbed = 25;

exports.autoSubscribe = {
//	whydTeam: true,
	featuredUsers: true,
//	likedUsers: true, // DONE ONCE FOR ALL EXISTING USERS IN A SCRIPT
//	repostedUsers: true // DONE ONCE FOR ALL EXISTING USERS IN A SCRIPT
};

exports.whydTeam = [
	{id:"4d7fc1969aa9db130e000003", name:"Gilles", email:"g.poupardin@gmail.com"},
	{id:"4dd4060ddb28e240e8508c28", name:"Loick", email:"loick.muller@gmail.com"},
	{id:"4d94501d1f78ac091dbc9b4d", name:"Adrien", email:"adrien.joly@gmail.com"},
	{id:"4fb118c368b1a410ecdc0058", name:"Tony", email:"anthonyhymes@gmail.com"},
	{id:"4d809ddf944e0e251400000f", name:"Jie", email:"jie.meng.gerard@gmail.com"}
];

exports.featuredUsers = [
	{id:"5051c2a67e91c862b2a80bc4", name:"Relish Recordings"},
	{id:"4fb641ae68b1a410ecdc00e2", name:"Lazynaj"},
	{id:"4e2e94ea981d90d694c12d24", name:"Albin"},
	{id:"5017a1f97e91c862b2a7c451", name:"Émilie Butel"}, // from because music
	{id:"501962417e91c862b2a7c474", name:"Because Music"}, // because music
	{id:"500836f17e91c862b2a7c396", name:"Jean-Sebastien Nicolet"}, // Jiess, curator @ point FMR
	// then ...
	{id:"4fe0f8b57e91c862b2a7c274", name:"Masscut"},
	{id:"500d4a2b7e91c862b2a7c3a7", name:"La Cave aux Poètes"},
	{id:"4ffd7ca07e91c862b2a7c2ff", name:"Alice"}, // "lylacoco"
	{id:"4fd45bea68b1a410ecdc011b", name:"Digital Hunter"},
	{id:"4ff5c14d7e91c862b2a7c2ba", name:"Sweet Electronic Music Lovers"},
	{id:"4fede55a7e91c862b2a7c29f", name:"Le coup du lapin"},
	{id:"500d769e7e91c862b2a7c3b6", name:"cannet"},
	{id:"4fff17437e91c862b2a7c350", name:"Glazart"},
	{id:"501a8d6c7e91c862b2a7c482", name:"Matthieu Gazier"}, // Homme orchestre @ Ekler'o'shock records.
	{id:"500ebe547e91c862b2a7c3cd", name:"Paul Lucas"},
	{id:"501ff0057e91c862b2a7c4c8", name:"Laurène Sturm"}
]/*.concat(exports.whydTeam)*/;

exports.autoSubscribeUsers = [
	{id:"4fb641ae68b1a410ecdc00e2", name:"Lazynaj"},
	{id:"4e2e94ea981d90d694c12d24", name:"Albin"},
	{id:"5017a1f97e91c862b2a7c451", name:"Émilie Butel"}, // from because music
	{id:"4ffd7ca07e91c862b2a7c2ff", name:"Alice"}, // "lylacoco" // ECIMOR ???
	{id:"500836f17e91c862b2a7c396", name:"Jean-Sebastien Nicolet"}, // Jiess, curator @ point FMR
	//{id:"501ff0057e91c862b2a7c4c8", name:"Laurène Sturm"},
	{id:"4dd4060ddb28e240e8508c28", name:"Loick"},
	{id:"4fb118c368b1a410ecdc0058", name:"Tony"},
	{id:"4d94501d1f78ac091dbc9b4d", name:"Adrien"},
	{id:"4d7fc1969aa9db130e000003", name:"Gilles"},
	{id:"4ff5a91c7e91c862b2a7c2b8", name:"Whyd"}
];

exports.adminEmails = {};
for (var i in exports.whydTeam)
	exports.adminEmails[exports.whydTeam[i].email] = true;

/*
// dynamic part of config

var mongodb = require('../models/mongodb.js');
var configCol = mongodb.collections["config"];

exports.fetchDoc = function(doc, callback) {
	configCol.findOne({_id:doc}, function (err, record) {
		callback(record);
	});
};

exports.fetchVal = function(doc, key, callback) {
	exports.fetchDoc(doc, function(vals){
		callback(vals ? vals[key] : null);
	});
};

exports.update = function(doc, vals) {
	configCol.update({_id:doc}, {$set:vals}, { upsert: true });
}
*/
