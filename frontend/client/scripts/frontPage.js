Template.frontPage.events({
    'click #submitBtn': function(event) {
    	var days = parseInt($('#days option:selected').text());
		var budget = parseInt($('#budget').val());
		var vehicle = $('#vehicle option:selected').text();
		var people = parseInt($('#people option:selected').text());

		console.log(days);
		console.log(budget);
		console.log(people);
		console.log(100);
		console.log(days * 10);
		console.log(loc);
		console.log(vehicle);

		Session.set('frontDays', days);
		Session.set('frontBudget', budget);
		Session.set('frontVehicle', vehicle);
		Session.set('frontPeople', people);
		Session.set('location', loc);

		Router.go('/maps');
    },
});
