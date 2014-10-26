Meteor.methods({
    api_postRoute: function(lat, lon, budget, hours) {
    	var fut = new Future();
        postRequest("http://127.0.0.1", 3000, '/api/route', {
            lat: lat,
            lon: lon,
            budget: budget,
            hours: hours
        }, function(error, result){
            console.log('future');
            console.log(result);
			fut['return'](result);	
        });
        return fut.wait();
    }
});