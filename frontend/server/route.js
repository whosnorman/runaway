Meteor.methods({
    api_postRoute: function(lat, lon, budget, time) {
    	var fut = new Future();
        postRequest("http://127.0.0.127", 3000, '/api/route', {
            lat: lat,
            lon: lon,
            budget: budget,
            time: time
        }, function(result){
			fut['return'](result);	
        });
        return fut.wait();
    }
});