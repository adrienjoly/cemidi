db = connect("localhost:27017/cemidi");

print("creating collections...");
db.createCollection("restaurant");
// db.activity.ensureIndex({"like.pId": 1}, {sparse:true});

print("upserting sample data ...");

db.restaurant.update({ "name" : "Cassoulet Centralien"}, { "$set" : {
	"mNm" : "Cassoulet Centralien",
	"rNm" : "Restaurant Universitaire",
	"addr": "Grande Voie des Vignes, 92295 Châtenay-Malabry, France",
	"tel" : "01 41 13 10 00",
	"url" : "http://www.ecp.fr/",
	"price" : 3.5,
	"img": "/img/restos/cassoulet.jpg",
	"loc" : [2.28781, 48.76278] /* long, lat */
} }, { upsert: true });

db.restaurant.update({ "rNm" : "Chez Gladines"}, { "$set" : {
	"mNm" : "Salade de gésiers",
	"rNm" : "Chez Gladines",
	"addr": "30, rue des Cinq Diamants, 75013 Paris",
	"tel" : "01 45 80 70 10",
	"url" : "http://www.restoaparis.com/restaurant-paris-par-voie/rue-des-cinq-diamants#p1iV0K8JW7XfKJTh.99",
	"price" : 8,
	"img": "/img/restos/gladines.jpg",
	"loc" : [2.35062, 48.82881] /* long, lat */
} }, { upsert: true });

db.restaurant.update({ "rNm" : "Le Bistrot du Four"}, { "$set" : {
	"mNm" : "Tartare de boeuf",
	"rNm" : "Le Bistrot du Four",
	"addr": "4 Place du Général de Gaulle, 92330 Sceaux, France",
	"tel" : "01 43 50 84 51",
	"url" : "http://www.qype.fr/place/269508-Le-Bistrot-du-Four-Sceaux",
	"price" : 9,
	"img": "/img/restos/four.jpg",
	"url": "http://www.yelp.com/biz/le-bistrot-du-four-sceaux",
	"loc" : [2.29083, 48.77886] /* long, lat */
} }, { upsert: true });

db.restaurant.update({ "rNm" : "Bistrot La Grille"}, { "$set" : {
	"mNm" : "Blanquette de veau",
	"rNm" : "Bistrot La Grille",
	"addr": "13 Rue Michel Charaire, Sceaux",
	"tel" : "01 43 50 83 00",
	"url" : "http://www.bistrotlagrille.fr/",
	"price" : 7,
	"img": "/img/restos/grille.jpeg",
	"loc" : [2.29432, 48.77810] /* long, lat */
} }, { upsert: true });

print("done! :-)");