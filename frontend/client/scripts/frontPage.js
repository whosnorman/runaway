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

Template.frontPage.rendered = function(){
	$('.dragBtn').draggable({ 
		axis: 'x',
		containment: 'parent'
	});    

	//for whatever
	$('.welcomeHead').draggable();

	$('.dragBtn').on('drag', function(){ 
	  updateSlider();
	});

	$('#budgetCont input').keyup(function(){
    	console.log('keyup');
    	updateSlider();
    });

}

Template.frontPage.helpers({
	gasPer: function(){
		return Session.get('gasPercentage');
	},
	miscPer: function(){
		return Session.get('miscPercentage');
	}
})


updateSlider = function(){
  var position = $('.dragBtn').position();
  var marginLeft = position.left + 15;
  var width = $('.dragLine').width();
  var curr = position.left;
  // adjust for widths
  if (curr >= 50)
  	curr += $('.dragBtn').width();

  var percentage = (curr / width);
  
  $('.line').css({ 
    'width': marginLeft + 'px'
  }); 

  //var budgetInput = parseInt($('#budget').val());
  var budgetInput = parseInt($('#budgetCont input').val());
  var currBudget;

  if(budgetInput)
  	currBudget = budgetInput;
  else
  	currBudget = 100;

  console.log('set');

  var gasPer = Math.round(currBudget * percentage);
  var miscPer = Math.round(currBudget - gasPer);

  console.log(gasPer);
  console.log(miscPer);

  Session.set('gasPercentage', gasPer);
  Session.set('miscPercentage', miscPer);
}
