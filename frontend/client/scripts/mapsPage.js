Template.mapsPage.rendered = function() {
    var mapOptions = {
        center: {
            lat: -34.397,
            lng: 150.644
        },
        zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
};

Template.mapsPage.events({
	'click #postRoute': function(event){
		Meteor.call('api_postRoute', 35.7748760, -78.9514510, 300, 10, function(error, result) {
        	console.log(result);
    	});
	}
});

