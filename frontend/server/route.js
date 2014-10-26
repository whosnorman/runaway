Meteor.methods({
    api_postRoute: function(lat, lon, budget, hours) {
        console.log("hi");
    	var fut = new Future();
        postRequest("http://127.0.0.127", 3000, '/api/route', {
            lat: lat,
            lon: lon,
            budget: budget,
            hours: hours
        }, function(error, result){
            console.log('future');
            console.log(result);
            if(result){
                fut['return'](result.data); 
            }
            else{
                fut['return']([]);    
            }
        });
        return fut.wait();
    }
});