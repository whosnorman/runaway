var myLat = 35.7748760;
var myLon = -78.9514510;

Template.mapsPage.rendered = function() {
    var map_style = [{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
            "color": "#193341"
        }]
    }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c5a71"
        }]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
            "color": "#29768a"
        }, {
            "lightness": -37
        }]
    }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
            "color": "#406d80"
        }]
    }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
            "color": "#406d80"
        }]
    }, {
        "elementType": "labels.text.stroke",
        "stylers": [{
            "visibility": "on"
        }, {
            "color": "#3e606f"
        }, {
            "weight": 2
        }, {
            "gamma": 0.84
        }]
    }, {
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#ffffff"
        }]
    }, {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{
            "weight": 0.6
        }, {
            "color": "#1a3541"
        }]
    }, {
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
            "color": "#2c5a71"
        }]
    }];
    var mapOptions = {
        center: {
            lat: 35.7748760,
            lng: -78.9514510
        },
        styles: map_style,
        zoom: 4
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    console.log("Map is loaded!");

    var frontBud = Session.get('frontBudget');
    var frontHours = parseInt(Session.get('frontDays')) * 10;
    var people = Session.get('frontPeople');

    console.log(frontBud);
    console.log(100);
    console.log(frontHours);
    console.log(5);

    Meteor.call('api_postRoute', myLat, myLon, frontBud, frontHours, function(error, result) {
        if (error)
            console.log(error)
        console.log("=========================");
        console.log(result);

        Session.set("itNumber", 1);
        Session.set("results", result);
        Session.set("hours", result.points[0].hours);
        Session.set("mins", result.points[0].mins);
        if (people > 0) {
            var total = result.points[0].cost;
            var per = Math.round(total * 100 / (people + 1)) / 100;
            console.log(per);
            var string = per.toString() + '/per person';
            console.log("!!!!!!!!!!!!!!!!1");
            console.log(string);
            Session.set("cost", string);
        } else {
            Session.set("cost", result.points[0].cost);
        }

        // To add the marker to the map, use the 'map' property
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + myLat + "," + myLon + '&sensor=false', null, function(data) {
            Session.set("mylocation", data.results[0].formatted_address);
        });
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + result.points[0].lat + "," + result.points[0].lon + '&sensor=false', null, function(data) {
            var p = data.results[0].geometry.location;
            Session.set("destLocation", data.results[0].formatted_address);
            var latlng = new google.maps.LatLng(p.lat, p.lng);
            /*new google.maps.Marker({
                position: latlng,
                map: map
            });*/

            var request = {
                origin: myLat + "," + myLon,
                destination: data.results[0].formatted_address,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                }
            });
        });
    });
};

Template.itinerary.helpers({
    mylocation: function() {
        return Session.get("mylocation");
    },
    destLocation: function() {
        return Session.get("destLocation");
    },
    loaded: function() {
        return Session.get("loaded");
    },
    hours: function() {
        return Session.get("hours");
    },
    mins: function() {
        return Session.get("mins");
    },
    cost: function() {
        return Session.get("cost");
    },
    itNumber: function() {
        return Session.get("itNumber");
    }
});

Template.itinerary.events({
    'click #anotherItinerary': function(event) {
        console.log("ANOTHER!");
        var num = Session.get("itNumber");
        num++;
        var result = Session.get("results");
        num = num % result.points.length;
        Session.set("itNumber", num);
        Session.set("hours", result.points[num].hours);
        Session.set("mins", result.points[num].mins);
        Session.set("cost", result.points[num].cost);
        // To add the marker to the map, use the 'map' property
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + myLat + "," + myLon + '&sensor=false', null, function(data) {
            Session.set("mylocation", data.results[0].formatted_address);
        });
        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + result.points[num].lat + "," + result.points[num].lon + '&sensor=false', null, function(data) {
            var p = data.results[0].geometry.location;
            Session.set("destLocation", data.results[0].formatted_address);
            var latlng = new google.maps.LatLng(p.lat, p.lng);
            /*new google.maps.Marker({
                position: latlng,
                map: map
            });*/
            var request = {
                origin: myLat + "," + myLon,
                destination: data.results[0].formatted_address,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function(result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(result);
                }
            });
        });
    },
    'click #letsGo': function(event) {
        $(".itinerary").animate({
            right: "-=1000",
        }, 500, function() {
            $(".itinerary").css("display", "none");
            $(".finishEmail").css("display", "block");
            $(".finishEmail").animate({
                right: "+=1000",
            }, 500, function() {

            });
        });
    }
});

Template.finishEmail.events({
    'click .sendButton': function(event) {
        Meteor.call('api_finishUp', $("#inputName").val(), $("#inputEmail").val(),
            myLat, myLon, Session.get("mylocation"), Session.get("destLocation"),
            Session.get("hours"), Session.get("mins"), Session.get("cost"));
    }
});

Template.mapsPage.events({
    'click #postRoute': function(event) {
        Meteor.call('api_postRoute', myLat, myLon, 100, 5, function(error, result) {
            if (error)
                console.log(error)
            Session.set("itNumber", 1);
            Session.set("results", result);
            Session.set("hours", result.points[0].hours);
            Session.set("mins", result.points[0].mins);
            Session.set("cost", result.points[0].cost);
            // To add the marker to the map, use the 'map' property
            $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + myLat + "," + myLon + '&sensor=false', null, function(data) {
                Session.set("mylocation", data.results[0].formatted_address);
            });
            $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address=' + result.points[0].lat + "," + result.points[0].lon + '&sensor=false', null, function(data) {
                var p = data.results[0].geometry.location;
                Session.set("destLocation", data.results[0].formatted_address);
                var latlng = new google.maps.LatLng(p.lat, p.lng);
                /*new google.maps.Marker({
                    position: latlng,
                    map: map
                });*/

                var request = {
                    origin: myLat + "," + myLon,
                    destination: data.results[0].formatted_address,
                    travelMode: google.maps.TravelMode.DRIVING
                };
                directionsService.route(request, function(result, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(result);
                    }
                });
            });
        });
    }
});