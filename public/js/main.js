(function(){

	var getCurrentLoc = function(cb) {
		console.log("get current loc...");
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var coords = position.coords || position.coordinate || position;
				/*
				var latLng = new google.maps.LatLng(coords.latitude, coords.longitude);
				(new google.maps.Geocoder()).geocode({latLng: latLng}, function(resp) {
					if (resp[0]) {
						var place = null;
						var I = resp[0].address_components.length;
						for (var i = 0; i < I && !place; ++i) {
							var component = resp[0].address_components[i];
							if (contains(component.types, 'political'))
								place = component.long_name;
						}
						updateElements('loc', 'innerHTML', place || resp[0].formatted_address);
					}
				});
				*/
				coords.loc = [coords.longitude, coords.latitude];
				cb(coords);
			});
		} else {
			//positionError(-1);
			cb();
		}
	};

	function distance(loc1, loc2) {
		// source: http://www.geodatasource.com/developers/javascript
	 	var radlat1 = Math.PI * loc1[1]/180;
	    var radlat2 = Math.PI * loc2[1]/180;
	    var radlon1 = Math.PI * loc1[0]/180;
	    var radlon2 = Math.PI * loc2[0]/180;
	    var radtheta = Math.PI * (loc1[0]-loc2[0])/180;
	    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	    return Math.acos(dist) * 180/Math.PI * 60 * 1.1515 * 0.8684;
	}

	function sortByDistance (meals, currentLoc) {
		var meals = meals.slice();
		for (var i in meals)
			meals[i].distance = distance(meals[i].loc, /*p.loc*/currentLoc.loc);
		meals.sort(function(a,b) {
			return a.distance - b.distance;
		});
		for (var i in meals)
			meals[i].distance =  meals[i].distance < 1 ? Math.floor(meals[i].distance*1000) + " m" : Math.floor(meals[i].distance) + " km";
		return meals;
	}

	// DATA -----------------------------------
	/*
	function LocalDataSource() {
		this.meals = [
			{ name:"côtes d'agneau purée", price:9, rNm: "chez tony", rId:"001", rLoc:[1,2] },
			{ name:"langue de boeuf petits pois", price:13, rNm: "l'imprévu", rId:"002", rLoc:[1,2] },
			{ name:"tartare de saumon", price:10, rNm: "chez tony", rId:"003", rLoc:[1,2] },
			{ name:"saucisse lentilles", price:3.50, rNm:"R.U.", rId:"004", rLoc:[48.76278, 2.28781] },
		];
	}

	LocalDataSource.prototype.fetch = function(p, cb) {
		console.log("fetch...", currentLoc);
		if (/ *p && p.loc* / currentLoc)
			cb({ meals: this.sortByDistance(currentLoc) });
		else
			cb({ meals: this.meals });
	}
	*/

	function Database() {
		this.dbUrl = ""; // "http://localhost:8080";
	}

	Database.prototype.fetch = function (p, cb) {
		console.log("fetch...", currentLoc);
		$.ajax({
			url: this.dbUrl + "/list",
			complete: function(r) {
				var response = JSON.parse(r.responseText);
				console.log("response", response);
				if (/*p && p.loc*/ currentLoc && currentLoc.loc)
					cb({ meals: sortByDistance(response.meals, currentLoc) });
				else
					cb(p);
			}
		});
	}

	// TEMPLATE LOADER -----------------------------------

	function TemplateLoader() {
		this.templates = {}
		var that = this;
		function render(template, params) {
			return Mustache.render(template, params);
		}
		return function(fileName, params, cb) {
			if (that.templates[fileName])
				cb(render(that.templates[fileName], params));
			else {
				console.log("loading", fileName, "...");
				$.ajax({
					url: "templates/"+fileName+".html",
					complete: function(r) {
						//console.log("ajax", r.responseText);
						that.templates[fileName] = r.responseText;
						cb(render(that.templates[fileName], params));
					}
				});
			}
		};
	}

	// MAIN UI/LOGIC -----------------------------------

	var render = new TemplateLoader();
	var currentLoc = null; //{loc:[48.76562, 2.28850]}; // ecole centrale

	function refreshMeals(res) {
		//console.log("res", res);
		render("meals", res, function(html) {
			document.getElementById("meals").innerHTML = html; //Mustache.render(template, res);
			$("li").each(function(){
				$(this).css("transform", "rotate("+((Math.random()-0.5)*6*Math.random())+"deg)");
			});
		});
	}

	window.onLoad = function() {
		console.log("-= cemidi.fr =-");
		var dataSource = new Database(); //new LocalDataSource();
		
		getCurrentLoc(function(loc){
			console.log("loc", loc)
			currentLoc = loc;
			dataSource.fetch({loc:currentLoc}, refreshMeals); // refresh the list (closest restaurants first)
		});
		
		dataSource.fetch({loc:currentLoc}, refreshMeals);
	}
})();